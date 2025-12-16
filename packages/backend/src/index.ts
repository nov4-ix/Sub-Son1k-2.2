import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';
import { TokenManager } from './services/tokenManager';
import { MusicGenerationService } from './services/musicGenerationService';

const fastify = Fastify({
  logger: true,
});

// Global service instances
let tokenManager: TokenManager;
let musicGenerationService: MusicGenerationService;

// Register plugins (CORS, Helmet, Rate limiting)
async function registerPlugins() {
  await fastify.register(cors, {
    origin: [
      /^https:\/\/.*\.vercel\.app$/,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
}

// Health check endpoint
fastify.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      musicGeneration: !!musicGenerationService,
      tokenManager: !!tokenManager,
    },
  };
});

// Public generation endpoint (no auth required)
fastify.post('/api/generation/create-public', async (request, reply) => {
  const body: any = request.body;

  if (!musicGenerationService) {
    return reply.status(503).send({
      success: false,
      error: 'Music generation service not initialized',
    });
  }

  try {
    fastify.log.info({ prompt: body.prompt }, 'Generation request received');
    const result = await musicGenerationService.generateMusic({
      prompt: body.prompt || 'Una canción instrumental',
      style: body.style || 'pop',
      duration: body.duration || 60,
      quality: body.quality || 'standard',
      userId: 'public-user',
    });

    if (result.status === 'failed') {
      fastify.log.error({ error: result.error }, 'Generation failed');
      return reply.status(500).send({
        success: false,
        error: result.error || 'Generation failed',
      });
    }

    fastify.log.info({ taskId: result.generationTaskId }, 'Generation started');
    return reply.send({
      success: true,
      taskId: result.generationTaskId,
      status: result.status,
      estimatedTime: result.estimatedTime ?? 120,
      message: 'Generación iniciada exitosamente',
    });
  } catch (err: any) {
    fastify.log.error({ error: err.message }, 'Generation error');
    return reply.status(500).send({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
});

// Alternative generate endpoint (expects userId)
fastify.post('/api/generate', async (request, reply) => {
  const body: any = request.body;

  if (!musicGenerationService) {
    return reply.status(503).send({
      success: false,
      error: 'Service not available',
    });
  }

  try {
    const result = await musicGenerationService.generateMusic({
      prompt: body.prompt,
      style: body.style || 'pop',
      duration: body.duration || 60,
      quality: body.quality || 'standard',
      userId: body.userId || 'anonymous',
    });

    if (result.status === 'failed') {
      return reply.status(500).send({
        success: false,
        error: result.error,
      });
    }

    return reply.send({
      success: true,
      generationId: result.generationTaskId,
      status: result.status,
      estimatedTime: result.estimatedTime,
    });
  } catch (err: any) {
    fastify.log.error(err);
    return reply.status(500).send({
      success: false,
      error: err.message,
    });
  }
});

// Generation status endpoint
fastify.get('/api/generation/:taskId/status', async (request, reply) => {
  const { taskId } = request.params as { taskId: string };

  if (!musicGenerationService) {
    return reply.status(503).send({
      success: false,
      error: 'Service not available',
    });
  }

  try {
    const status = await musicGenerationService.getGenerationStatus(taskId);
    return reply.send({
      success: true,
      ...status,
    });
  } catch (err: any) {
    return reply.status(500).send({
      success: false,
      error: err.message,
    });
  }
});

// Server start
async function start() {
  try {
    await registerPlugins();
    fastify.log.info('Plugins registered');

    // Load Suno tokens
    const sunoTokens = process.env.SUNO_TOKENS?.split(',').filter(t => t.trim()) || [];
    if (sunoTokens.length === 0) {
      fastify.log.warn('⚠️ No SUNO_TOKENS configured – music generation will be disabled');
    } else {
      fastify.log.info(`Found ${sunoTokens.length} Suno token(s)`);
    }

    // Initialise Prisma and TokenManager
    const prisma = new PrismaClient();
    tokenManager = new TokenManager(prisma, sunoTokens);
    fastify.log.info('TokenManager initialized');

    // Initialise MusicGenerationService
    musicGenerationService = new MusicGenerationService(tokenManager);
    fastify.log.info('MusicGenerationService initialized');

    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });

    fastify.log.info(`🚀 Server listening on ${host}:${port}`);
    fastify.log.info(`🎵 Music Generation: ${sunoTokens.length > 0 ? 'ACTIVE' : 'INACTIVE'}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
