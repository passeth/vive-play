import express from 'express';
import { z } from 'zod';
import { pool } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createLogger } from '../utils/logger';

const router = express.Router();
const logger = createLogger('projects');

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  productType: z.string().min(1).max(50),
  targetCustomer: z.string().min(1).max(50),
  keywords: z.array(z.string()).optional(),
  concept: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  concept: z.string().optional(),
  status: z.enum(['draft', 'concept_ready', 'ai_generated', 'completed']).optional(),
  progress: z.number().min(0).max(100).optional(),
});

// Get all projects for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
              COUNT(pt.trend_id) as trend_count,
              ai.product_name as ai_product_name
       FROM projects p
       LEFT JOIN project_trends pt ON p.id = pt.project_id
       LEFT JOIN ai_suggestions ai ON p.id = ai.project_id AND ai.is_accepted = true
       WHERE p.user_id = $1
       GROUP BY p.id, ai.product_name
       ORDER BY p.updated_at DESC`,
      [req.user!.id]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user!.id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Get associated trends
    const trendsResult = await pool.query(
      `SELECT t.*, tc.name as category_name
       FROM trends t
       JOIN project_trends pt ON t.id = pt.trend_id
       JOIN trend_categories tc ON t.category_id = tc.id
       WHERE pt.project_id = $1`,
      [req.params.id]
    );

    // Get AI suggestions
    const aiResult = await pool.query(
      'SELECT * FROM ai_suggestions WHERE project_id = $1 ORDER BY version DESC',
      [req.params.id]
    );

    res.json({
      project,
      trends: trendsResult.rows,
      aiSuggestions: aiResult.rows,
    });
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, description, productType, targetCustomer, keywords, concept } = 
      createProjectSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO projects (user_id, name, description, product_type, target_customer, keywords, concept, progress)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user!.id, name, description || null, productType, targetCustomer, keywords || [], concept || null, 10]
    );

    const project = result.rows[0];
    logger.info(`Project created: ${name} by user ${req.user!.email}`);

    res.status(201).json({ project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    logger.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const updates = updateProjectSchema.parse(req.body);
    
    // Build dynamic query
    const setClause = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (setClause.length === 0) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }

    values.push(req.params.id, req.user!.id);
    
    const query = `
      UPDATE projects 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    logger.info(`Project updated: ${req.params.id} by user ${req.user!.email}`);
    res.json({ project: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    logger.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    logger.info(`Project deleted: ${req.params.id} by user ${req.user!.email}`);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Add trend to project
router.post('/:id/trends', async (req: AuthRequest, res) => {
  try {
    const { trendId } = req.body;

    if (!trendId) {
      return res.status(400).json({ error: 'Trend ID is required' });
    }

    // Verify project ownership
    const projectCheck = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user!.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Add trend to project (will ignore if already exists due to UNIQUE constraint)
    await pool.query(
      'INSERT INTO project_trends (project_id, trend_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.params.id, trendId]
    );

    res.json({ message: 'Trend added to project' });
  } catch (error) {
    logger.error('Add trend to project error:', error);
    res.status(500).json({ error: 'Failed to add trend to project' });
  }
});

// Remove trend from project
router.delete('/:id/trends/:trendId', async (req: AuthRequest, res) => {
  try {
    // Verify project ownership
    const projectCheck = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user!.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await pool.query(
      'DELETE FROM project_trends WHERE project_id = $1 AND trend_id = $2',
      [req.params.id, req.params.trendId]
    );

    res.json({ message: 'Trend removed from project' });
  } catch (error) {
    logger.error('Remove trend from project error:', error);
    res.status(500).json({ error: 'Failed to remove trend from project' });
  }
});

export default router;