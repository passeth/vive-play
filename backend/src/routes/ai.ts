import express from 'express';
import { z } from 'zod';
import { pool, withTransaction } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateCosmetics } from '../services/ai';
import { createLogger } from '../utils/logger';

const router = express.Router();
const logger = createLogger('ai-routes');

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schema
const generateSchema = z.object({
  projectId: z.string().uuid(),
  regenerate: z.boolean().optional(),
});

// Generate AI suggestion for project
router.post('/generate', async (req: AuthRequest, res) => {
  try {
    const { projectId, regenerate } = generateSchema.parse(req.body);

    // Get project details
    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user!.id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Get associated trends for context
    const trendsResult = await pool.query(
      `SELECT t.title, t.description, t.tags
       FROM trends t
       JOIN project_trends pt ON t.id = pt.trend_id
       WHERE pt.project_id = $1`,
      [projectId]
    );

    // Check if suggestion already exists (unless regenerating)
    if (!regenerate) {
      const existingSuggestion = await pool.query(
        'SELECT * FROM ai_suggestions WHERE project_id = $1 ORDER BY version DESC LIMIT 1',
        [projectId]
      );

      if (existingSuggestion.rows.length > 0) {
        return res.json({ 
          suggestion: existingSuggestion.rows[0],
          message: 'Using existing suggestion'
        });
      }
    }

    // Prepare input for AI
    const aiInput = {
      productType: project.product_type,
      targetCustomer: project.target_customer,
      keywords: project.keywords || [],
      concept: project.concept || '',
      trends: trendsResult.rows,
    };

    logger.info(`Generating AI suggestion for project ${projectId}`);

    // Generate AI suggestion
    const aiSuggestion = await generateCosmetics(aiInput);

    // Save to database
    const result = await withTransaction(async (client) => {
      // Get current version
      const versionResult = await client.query(
        'SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM ai_suggestions WHERE project_id = $1',
        [projectId]
      );
      const nextVersion = versionResult.rows[0].next_version;

      // Insert new suggestion
      const insertResult = await client.query(
        `INSERT INTO ai_suggestions (
          project_id, product_name, concept, ingredients, design, 
          target_price, features, version
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          projectId,
          aiSuggestion.productName,
          aiSuggestion.concept,
          JSON.stringify(aiSuggestion.ingredients),
          JSON.stringify(aiSuggestion.design),
          aiSuggestion.targetPrice,
          aiSuggestion.features,
          nextVersion,
        ]
      );

      // Update project status and progress
      await client.query(
        'UPDATE projects SET status = $1, progress = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        ['ai_generated', Math.max(project.progress, 70), projectId]
      );

      return insertResult.rows[0];
    });

    logger.info(`AI suggestion saved for project ${projectId}, version ${result.version}`);

    res.json({ 
      suggestion: result,
      message: 'AI suggestion generated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    logger.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate AI suggestion' });
  }
});

// Accept AI suggestion
router.post('/accept/:suggestionId', async (req: AuthRequest, res) => {
  try {
    const { suggestionId } = req.params;

    // Verify ownership through project
    const result = await pool.query(
      `SELECT ai.*, p.user_id 
       FROM ai_suggestions ai
       JOIN projects p ON ai.project_id = p.id
       WHERE ai.id = $1`,
      [suggestionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'AI suggestion not found' });
    }

    const suggestion = result.rows[0];

    if (suggestion.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update suggestion and project
    await withTransaction(async (client) => {
      // Mark suggestion as accepted
      await client.query(
        'UPDATE ai_suggestions SET is_accepted = true WHERE id = $1',
        [suggestionId]
      );

      // Unmark other suggestions for the same project
      await client.query(
        'UPDATE ai_suggestions SET is_accepted = false WHERE project_id = $1 AND id != $2',
        [suggestion.project_id, suggestionId]
      );

      // Update project status
      await client.query(
        'UPDATE projects SET status = $1, progress = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        ['concept_ready', 100, suggestion.project_id]
      );
    });

    logger.info(`AI suggestion accepted: ${suggestionId} by user ${req.user!.email}`);

    res.json({ message: 'AI suggestion accepted successfully' });

  } catch (error) {
    logger.error('Accept suggestion error:', error);
    res.status(500).json({ error: 'Failed to accept suggestion' });
  }
});

// Get AI suggestions for project
router.get('/suggestions/:projectId', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    const projectCheck = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user!.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get all suggestions for project
    const result = await pool.query(
      'SELECT * FROM ai_suggestions WHERE project_id = $1 ORDER BY version DESC',
      [projectId]
    );

    res.json({ suggestions: result.rows });

  } catch (error) {
    logger.error('Get suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Delete AI suggestion
router.delete('/suggestions/:suggestionId', async (req: AuthRequest, res) => {
  try {
    const { suggestionId } = req.params;

    // Verify ownership through project
    const result = await pool.query(
      `DELETE FROM ai_suggestions 
       WHERE id = $1 AND project_id IN (
         SELECT id FROM projects WHERE user_id = $2
       ) RETURNING id`,
      [suggestionId, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'AI suggestion not found' });
    }

    logger.info(`AI suggestion deleted: ${suggestionId} by user ${req.user!.email}`);

    res.json({ message: 'AI suggestion deleted successfully' });

  } catch (error) {
    logger.error('Delete suggestion error:', error);
    res.status(500).json({ error: 'Failed to delete suggestion' });
  }
});

export default router;