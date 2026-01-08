import { Router, Request, Response } from 'express';
import { APIResponse } from '@intelligenai/shared';
import { sessionService } from '../services/sessionService';

const router = Router();

/**
 * GET /api/monitoring/health
 * Enhanced health check with system status
 */
router.get('/health', (req: Request, res: Response) => {
  try {
    const sessionStats = sessionService.getSessionStats();
    const memoryUsage = process.memoryUsage();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      sessions: sessionStats,
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024) // MB
      },
      cpu: {
        loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0],
        platform: process.platform,
        arch: process.arch
      }
    };

    const response: APIResponse = {
      success: true,
      data: healthData,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: 'Health check failed',
      timestamp: new Date()
    };
    res.status(500).json(response);
  }
});

/**
 * GET /api/monitoring/metrics
 * System metrics and statistics
 */
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const sessionStats = sessionService.getSessionStats();
    
    // Clean up expired sessions
    const cleanedSessions = sessionService.cleanupExpiredSessions();
    
    const metrics = {
      sessions: {
        ...sessionStats,
        cleanedUp: cleanedSessions
      },
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        platform: {
          type: process.platform,
          arch: process.arch,
          version: process.version,
          nodeVersion: process.versions.node
        }
      },
      timestamp: new Date().toISOString()
    };

    const response: APIResponse = {
      success: true,
      data: metrics,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: 'Failed to get metrics',
      timestamp: new Date()
    };
    res.status(500).json(response);
  }
});

/**
 * GET /api/monitoring/sessions/stats
 * Detailed session statistics
 */
router.get('/sessions/stats', (req: Request, res: Response) => {
  try {
    const sessionStats = sessionService.getSessionStats();
    
    const response: APIResponse = {
      success: true,
      data: sessionStats,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: 'Failed to get session statistics',
      timestamp: new Date()
    };
    res.status(500).json(response);
  }
});

/**
 * POST /api/monitoring/cleanup
 * Manual cleanup of expired sessions
 */
router.post('/cleanup', (req: Request, res: Response) => {
  try {
    const cleanedSessions = sessionService.cleanupExpiredSessions();
    
    const response: APIResponse = {
      success: true,
      data: {
        message: `Cleaned up ${cleanedSessions} expired sessions`,
        cleanedCount: cleanedSessions
      },
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: 'Failed to cleanup sessions',
      timestamp: new Date()
    };
    res.status(500).json(response);
  }
});

/**
 * GET /api/monitoring/ready
 * Readiness probe for container orchestration
 */
router.get('/ready', (req: Request, res: Response) => {
  try {
    // Check if essential services are ready
    const isReady = true; // For now, always ready. Can add more checks later.
    
    if (isReady) {
      const response: APIResponse = {
        success: true,
        data: {
          status: 'ready',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date()
      };
      res.json(response);
    } else {
      const response: APIResponse = {
        success: false,
        error: 'Service not ready',
        timestamp: new Date()
      };
      res.status(503).json(response);
    }
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: 'Readiness check failed',
      timestamp: new Date()
    };
    res.status(503).json(response);
  }
});

export default router;
