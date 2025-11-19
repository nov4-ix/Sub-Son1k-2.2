/**
 * Super-Son1k-2.2 Backend Server
 * Advanced API with Suno integration, token management, and real-time features
 * Hybrid architecture combining the best of son1kvers3 and ALFASSV
 */

import Fastify from 'fastify';
import WebSocket from '@fastify/websocket';
import SocketIO from 'socket.io';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import { IncomingMessage, Server, ServerResponse } from 'http';

// Import routes and services
import { authRoutes } from './routes/auth';
import { stripeRoutes } from './routes/stripe';
import { generationRoutes } from './routes/generation';
import { collaborationRoutes } from './routes/collaboration';
import { userRoutes } from './routes/user';
import { nftRoutes } from './routes/nft';
import { analyticsRoutes } from './routes/analytics';
import { tokenRoutes } from './routes/tokens';
import { extensionRoutes } from './routes/extension';
import { adminRoutes } from './routes/admin';

// Import middleware
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { securityMiddleware } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
// import { tokenValidationMiddleware } from './middleware/tokenValidation';

// Import services
import { TokenManager } from './services/tokenManager';
import { MusicGenerationService } from './services/musicGenerationService';
import { CollaborationService } from './services/collaborationService';
import { AnalyticsService } from './services/analyticsService';
import { UserExtensionService } from './services/userExtensionService';
import { TokenPoolService } from './services/tokenPoolService';
import { cacheService } from './services/cacheService';
import { getAlertService } from './services/alertService';

// Import WebSocket handlers
import { setupWebSocket } from './services/websocketService';

// Import Queue system
import { createGenerationWorker } from './queue/generation.worker';

// Import utilities
import { ENVIRONMENTS, API } from '@super-son1k/shared-utils';

// Import config validation (validates env vars on startup - CRITICAL)
// Nota: Validación flexible - no falla si faltan variables opcionales
import { env } from './lib/config';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  },
  trustProxy: true,
  bodyLimit: 10485760 // 10MB
});

// Initialize Prisma with connection pooling
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Initialize services with all integrations
const tokenManager = new TokenManager(prisma);
const musicGenerationService = new MusicGenerationService(tokenManager);
const collaborationService = new CollaborationService(prisma, tokenManager);
const analyticsService = new AnalyticsService(prisma);
const userExtensionService = new UserExtensionService(prisma, tokenManager);
const tokenPoolService = new TokenPoolService(prisma, tokenManager);
const alertService = getAlertService();

// Connect alert service to token manager events
tokenManager.on('tokenPoolLow', async (data: any) => {
  await alertService.monitorTokenPool(data.healthyCount, data.totalCount);
});

tokenManager.on('tokenPoolEmpty', async () => {
  await alertService.monitorTokenPool(0, 0);
});

// Add services to FastifyInstance
fastify.decorate('prisma', prisma);
fastify.decorate('analyticsService', analyticsService);
fastify.decorate('tokenManager', tokenManager);
fastify.decorate('collaborationService', collaborationService);
fastify.decorate('userExtensionService', userExtensionService);
fastify.decorate('tokenPoolService', tokenPoolService);
fastify.decorate('musicGenerationService', musicGenerationService);
fastify.decorate('cacheService', cacheService);

// Setup Socket.IO for real-time features
const io = new SocketIO.Server(fastify.server as any, {
  cors: {
    origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Register plugins
async function registerPlugins() {
  // WebSocket support
  await fastify.register(WebSocket);

  // CORS with comprehensive configuration
  await fastify.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-ID',
      'X-API-Key',
      'X-Token-Hash',
      'User-Agent'
    ],
    exposedHeaders: ['X-Request-ID', 'X-Rate-Limit-Remaining'],
    maxAge: 86400
  });

  // Advanced security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'", 'https://cdn.socket.io'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'wss:', 'ws:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", 'blob:', 'data:'],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  });

  // Advanced rate limiting with user-based limits
  await fastify.register(rateLimit, {
    max: (req: any) => {
      // Dynamic rate limiting based on user tier
      if (req.user?.tier === 'ENTERPRISE') return 1000;
      if (req.user?.tier === 'PREMIUM') return 100;
      return 10;
    },
    timeWindow: '1 minute',
    cache: 10000,
    allowList: ['127.0.0.1', '::1'],
    keyGenerator: (req: any) => {
      // Use user ID if authenticated, otherwise IP
      return req.user?.id || req.ip || 'anonymous';
    }
  });
}

// Global error handler
fastify.setErrorHandler(errorHandler);

// Request ID middleware
fastify.addHook('onRequest', async (request, reply) => {
  request.headers['x-request-id'] = request.headers['x-request-id'] || crypto.randomUUID();
  reply.header('X-Request-ID', request.headers['x-request-id']);
  (request as any).startTime = Date.now();
});

// Request logging middleware
fastify.addHook('onResponse', async (request, reply) => {
  const duration = Date.now() - (request as any).startTime;
  fastify.log.info({
    reqId: request.headers['x-request-id'],
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    duration,
    userAgent: request.headers['user-agent'],
    ip: request.ip,
    userId: (request as any).user?.id
  });

  // Track analytics
  if (duration > 1000) {
    analyticsService.trackRequest({
      userId: (request as any).user?.id,
      endpoint: request.url,
      method: request.method,
      statusCode: reply.statusCode,
      duration,
      timestamp: new Date()
    });
  }
});

// Health check endpoint with comprehensive service status
fastify.get('/health', async (request, reply) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check all services
    const [tokenHealth, sunoHealth, collaborationHealth, analyticsHealth] = await Promise.all([
      tokenManager.healthCheck(),
      musicGenerationService.healthCheck(),
      collaborationService.healthCheck(),
      analyticsService.healthCheck()
    ]);

    const services = {
      database: 'healthy',
      tokenManager: tokenHealth ? 'healthy' : 'degraded',
      musicGenerationService: sunoHealth ? 'healthy' : 'degraded',
      collaborationService: collaborationHealth ? 'healthy' : 'degraded',
      analyticsService: analyticsHealth ? 'healthy' : 'degraded'
    };

    const overallHealth = Object.values(services).every(status => status === 'healthy');

    return {
      status: overallHealth ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: API.VERSION,
      environment: process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT,
      uptime: process.uptime(),
      services,
      activeUsers: await analyticsService.getActiveUserCount(),
      tokenPoolSize: await tokenPoolService.getPoolSize()
    };
  } catch (error) {
    fastify.log.error('Health check failed: %s', error);
    return reply.code(503).send({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    });
  }
});

// API routes registration
async function registerRoutes() {
  // Public routes (no auth required)
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(stripeRoutes, { prefix: '/api/stripe' });
  await fastify.register(extensionRoutes(userExtensionService), { prefix: '/api/extension' });

  // Token routes (PUBLIC /add-public endpoint, protected routes use authMiddleware)
  await fastify.register(tokenRoutes(tokenManager, tokenPoolService), {
    prefix: '/api/tokens'
  });

  // Protected routes (auth required) - Add hook AFTER public routes
  fastify.addHook('onRequest', async (request, reply) => {
    // Skip auth for public endpoints
    const publicPaths = [
      '/api/auth',
      '/api/tokens/add-public',
      '/api/tokens/pool/status',
      '/api/extension/config',
      '/api/extension/validate-token',
      '/health'
    ];

    const isPublicPath = publicPaths.some(path => request.url.startsWith(path));

    if (!isPublicPath) {
      // Apply auth middleware for protected routes
      return authMiddleware(request, reply);
    }
  });

  // Generation routes with AI generation integration
  await fastify.register(generationRoutes(musicGenerationService, analyticsService), {
    prefix: '/api/generation'
  });

  // Collaboration routes with WebSocket support
  await fastify.register(collaborationRoutes(collaborationService), {
    prefix: '/api/collaboration'
  });

  // User management routes
  await fastify.register(userRoutes(prisma, tokenManager, userExtensionService), {
    prefix: '/api/user'
  });

  // NFT marketplace routes
  await fastify.register(nftRoutes(fastify, prisma, tokenManager), {
    prefix: '/api/nft'
  });

  // Analytics routes
  await fastify.register(analyticsRoutes, {
    prefix: '/api/analytics'
  });

  // Admin routes (protected by adminMiddleware)
  await fastify.register(adminRoutes(tokenManager, tokenPoolService, analyticsService), {
    prefix: '/api/admin'
  });
}

// Store worker reference for graceful shutdown
let generationWorker: Awaited<ReturnType<typeof createGenerationWorker>> | null = null;

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);

  // Close WebSocket connections
  io.close();

  // Close generation worker
  if (generationWorker) {
    await generationWorker.close();
    fastify.log.info('Generation worker closed');
  }

  // Close database connections
  await prisma.$disconnect();

  // Close all services
  await Promise.all([
    tokenManager.close(),
    musicGenerationService.close(),
    collaborationService.close(),
    analyticsService.close(),
    tokenPoolService.close()
  ]);

  // Close server
  await fastify.close();

  fastify.log.info('Shutdown complete');
  process.exit(0);
}

// Start server
async function start() {
  try {
    // Initialize database connection
    await prisma.$connect();
    fastify.log.info('Database connected successfully');

    // Initialize token pool
    await tokenPoolService.initialize();
    fastify.log.info('Token pool initialized');

    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // Setup WebSocket
    setupWebSocket(io as any, collaborationService, analyticsService);

    // Initialize BullMQ worker for generation queue
    generationWorker = createGenerationWorker(prisma, musicGenerationService, io as any);
    fastify.log.info('Generation worker initialized');

    // Start HTTP server
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });

    fastify.log.info(`🚀 Super-Son1k-2.2 Backend running on ${host}:${port}`);
    fastify.log.info(`📊 Environment: ${process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT}`);
    fastify.log.info(`🔗 WebSocket server ready`);
    fastify.log.info(`⚙️ BullMQ queue system active`);
    fastify.log.info(`🎵 Suno integration active`);
    fastify.log.info(`🔐 Advanced token management system active`);
    fastify.log.info(`👥 User extension system active`);
    fastify.log.info(`📈 Analytics and monitoring active`);

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      fastify.log.error('Uncaught Exception: %s', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      fastify.log.error('Unhandled Rejection at: %s, reason: %s', promise, reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    fastify.log.error('Failed to start server: %s', error);
    process.exit(1);
  }
}

// Start the server
start();
