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
import { sunoRoutes } from './routes/suno.routes'; // NEW: Suno Routes

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
import { tokenPool } from './services/token-pool-manager'; // NEW: Token Pool

// ... rest of imports

// Initialize services... (existing code)

// Register API routes
async function registerRoutes() {
  // Public routes (no auth required)
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(stripeRoutes, { prefix: '/api/stripe' });
  await fastify.register(extensionRoutes(userExtensionService), { prefix: '/api/extension' });

  // NEW: Register Suno Routes (The "Reverse Engineering" implementation)
  // Direct integration for stability
  await fastify.register(sunoRoutes, { prefix: '/api' });

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
      '/health',
      // Allow access to new stable endpoints without auth momentarily to test
      '/api/generate',
      '/api/custom_generate',
      '/api/get',
      '/api/get_limit'
    ];

    const isPublicPath = publicPaths.some(path => request.url.startsWith(path));

    if (!isPublicPath) {
      // Apply auth middleware for protected routes
      return authMiddleware(request, reply);
    }
  });

  // ... rest of routes registration
  await fastify.register(generationRoutes(musicGenerationService, analyticsService), {
    prefix: '/api/generation'
  });

  // ...
}

// Start server
async function start() {
  try {
    // Initialize database connection
    await prisma.$connect();
    fastify.log.info('Database connected successfully');

    // Initialize OLD token pool (DB based)
    await tokenPoolService.initialize();
    fastify.log.info('Legacy Token pool initialized');

    // NEW: Initialize ROBUST Token Pool (Env based)
    // Run this in background to not block startup if cookies are invalid
    tokenPool.initializePool().catch(err => {
      fastify.log.error(`Failed to initialize Robust Token Pool: ${err.message}`);
    });
    fastify.log.info('Robust Token Pool initializing...');

    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // ... rest of startup
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
