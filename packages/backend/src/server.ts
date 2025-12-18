import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';
import { LLMService } from './services/llmService';
import { profileKnowledgeService } from './services/profileKnowledgeService';

// Load environment variables
dotenv.config();

// Initialize LLM Service
const llmService = new LLMService({
  llm: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'mistral:7b',
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '2048'),
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
    timeout: parseInt(process.env.LLM_TIMEOUT || '30000')
  },
  context: {
    maxMessages: parseInt(process.env.CONTEXT_MAX_MESSAGES || '50'),
    maxTokens: parseInt(process.env.CONTEXT_MAX_TOKENS || '4000'),
    compressionThreshold: parseInt(process.env.CONTEXT_COMPRESSION_THRESHOLD || '30'),
    retentionHours: parseInt(process.env.CONTEXT_RETENTION_HOURS || '24')
  }
});

// Make LLM service available to routes
declare global {
  namespace Express {
    interface Request {
      llmService: LLMService;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Logger setup
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'llm-chatbot-backend' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Import routes
import chatRoutes from './routes/chat';
import monitoringRoutes from './routes/monitoring';
import conversationFlowRoutes from './routes/conversationFlow';

// Import middleware
import { conversationFlowMiddleware, conversationErrorRecoveryMiddleware } from './middleware/conversationFlowMiddleware';

// Middleware to inject LLM service into requests
app.use('/api', (req, res, next) => {
  req.llmService = llmService;
  logger.info(`API request: ${req.method} ${req.path}`);
  next();
});

// Apply conversation flow middleware to chat routes
app.use('/api/chat', conversationFlowMiddleware);

// Mount route handlers
app.use('/api/chat', chatRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/conversation-flow', conversationFlowRoutes);

// Conversation error recovery middleware
app.use(conversationErrorRecoveryMiddleware);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Initialize LLM service and start server
async function startServer() {
  try {
    // Only initialize LLM service if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      await llmService.initialize();
      logger.info('LLM Service initialized successfully');

      // Seed profile knowledge
      profileKnowledgeService.seedProfileKnowledge(llmService.getKnowledgeBaseService());

      // Start cleanup interval for expired contexts
      setInterval(() => {
        const cleaned = llmService.cleanupExpiredContexts();
        if (cleaned > 0) {
          logger.info(`Cleaned up ${cleaned} expired contexts`);
        }
      }, 60 * 60 * 1000); // Run every hour

      app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
}

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;