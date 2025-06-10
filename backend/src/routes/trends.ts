import express from 'express';
import { z } from 'zod';
import { pool } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createLogger } from '../utils/logger';

const router = express.Router();
const logger = createLogger('trends');

// Validation schemas
const searchSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const pinSchema = z.object({
  trendId: z.string().uuid(),
  notes: z.string().optional(),
});

// Get all trends with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { category, search, page, limit } = searchSchema.parse(req.query);
    const offset = (page - 1) * limit;

    // Build query dynamically
    let whereClause = '';
    const queryParams: any[] = [];
    let paramCount = 0;

    if (category && category !== '전체') {
      paramCount++;
      whereClause += `WHERE tc.name = $${paramCount}`;
      queryParams.push(category);
    }

    if (search) {
      paramCount++;
      const searchCondition = `(t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount} OR $${paramCount} = ANY(t.tags))`;
      whereClause += whereClause ? ` AND ${searchCondition}` : `WHERE ${searchCondition}`;
      queryParams.push(`%${search}%`);
    }

    // Get trends with category info
    const trendsQuery = `
      SELECT t.*, tc.name as category_name, tc.color as category_color,
             COUNT(*) OVER() as total_count
      FROM trends t
      JOIN trend_categories tc ON t.category_id = tc.id
      ${whereClause}
      ORDER BY t.popularity_score DESC, t.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const result = await pool.query(trendsQuery, queryParams);

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      trends: result.rows.map(row => {
        const { total_count, ...trend } = row;
        return trend;
      }),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    logger.error('Get trends error:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Get trend categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM trend_categories ORDER BY name'
    );

    res.json({ categories: result.rows });

  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single trend
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, tc.name as category_name, tc.color as category_color
       FROM trends t
       JOIN trend_categories tc ON t.category_id = tc.id
       WHERE t.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trend not found' });
    }

    res.json({ trend: result.rows[0] });

  } catch (error) {
    logger.error('Get trend error:', error);
    res.status(500).json({ error: 'Failed to fetch trend' });
  }
});

// Protected routes (require authentication)
router.use(authenticateToken);

// Get user's pinned trends
router.get('/user/pins', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = ((page as number) - 1) * (limit as number);

    const result = await pool.query(
      `SELECT t.*, tc.name as category_name, tc.color as category_color,
              up.notes, up.created_at as pinned_at,
              COUNT(*) OVER() as total_count
       FROM user_pins up
       JOIN trends t ON up.trend_id = t.id
       JOIN trend_categories tc ON t.category_id = tc.id
       WHERE up.user_id = $1
       ORDER BY up.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user!.id, limit, offset]
    );

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / (limit as number));

    res.json({
      pins: result.rows.map(row => {
        const { total_count, ...pin } = row;
        return pin;
      }),
      pagination: {
        currentPage: page as number,
        totalPages,
        totalCount,
      },
    });

  } catch (error) {
    logger.error('Get user pins error:', error);
    res.status(500).json({ error: 'Failed to fetch user pins' });
  }
});

// Pin a trend
router.post('/pin', async (req: AuthRequest, res) => {
  try {
    const { trendId, notes } = pinSchema.parse(req.body);

    // Check if trend exists
    const trendCheck = await pool.query(
      'SELECT id FROM trends WHERE id = $1',
      [trendId]
    );

    if (trendCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Trend not found' });
    }

    // Insert pin (will fail if already pinned due to UNIQUE constraint)
    try {
      await pool.query(
        'INSERT INTO user_pins (user_id, trend_id, notes) VALUES ($1, $2, $3)',
        [req.user!.id, trendId, notes || null]
      );

      logger.info(`Trend pinned: ${trendId} by user ${req.user!.email}`);
      res.status(201).json({ message: 'Trend pinned successfully' });

    } catch (dbError: any) {
      if (dbError.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Trend already pinned' });
      }
      throw dbError;
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    logger.error('Pin trend error:', error);
    res.status(500).json({ error: 'Failed to pin trend' });
  }
});

// Unpin a trend
router.delete('/pin/:trendId', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM user_pins WHERE user_id = $1 AND trend_id = $2 RETURNING id',
      [req.user!.id, req.params.trendId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pin not found' });
    }

    logger.info(`Trend unpinned: ${req.params.trendId} by user ${req.user!.email}`);
    res.json({ message: 'Trend unpinned successfully' });

  } catch (error) {
    logger.error('Unpin trend error:', error);
    res.status(500).json({ error: 'Failed to unpin trend' });
  }
});

// Check if trend is pinned by user
router.get('/:id/pinned', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT id FROM user_pins WHERE user_id = $1 AND trend_id = $2',
      [req.user!.id, req.params.id]
    );

    res.json({ isPinned: result.rows.length > 0 });

  } catch (error) {
    logger.error('Check pin status error:', error);
    res.status(500).json({ error: 'Failed to check pin status' });
  }
});

// Update pin notes
router.put('/pin/:trendId', async (req: AuthRequest, res) => {
  try {
    const { notes } = req.body;

    const result = await pool.query(
      'UPDATE user_pins SET notes = $1 WHERE user_id = $2 AND trend_id = $3 RETURNING id',
      [notes || null, req.user!.id, req.params.trendId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pin not found' });
    }

    res.json({ message: 'Pin notes updated successfully' });

  } catch (error) {
    logger.error('Update pin notes error:', error);
    res.status(500).json({ error: 'Failed to update pin notes' });
  }
});

export default router;