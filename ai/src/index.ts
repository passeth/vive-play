import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createLogger } from './utils/logger';

dotenv.config();

const app = express();
const logger = createLogger('ai-service');
const PORT = process.env.AI_SERVICE_PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'vibe-play-ai'
  });
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = {
      message: `AI Response: ${message}`,
      timestamp: new Date().toISOString(),
      model: 'placeholder'
    };

    res.json(response);
  } catch (error) {
    logger.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const analysis = {
      result: 'Analysis completed',
      confidence: 0.95,
      data: data,
      timestamp: new Date().toISOString()
    };

    res.json(analysis);
  } catch (error) {
    logger.error('Analysis endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`AI service running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});