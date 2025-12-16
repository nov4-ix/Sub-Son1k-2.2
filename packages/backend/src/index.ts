import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { TokenManager } from './services/tokenManager';
import { MusicGenerationService } from './services/musicGenerationService';

const fastify = Fastify({
  logger: true
});

// Initialize services
let tokenManager: TokenManager;
let musicGenerationService: MusicGenerationService;

// Register plugins
async function registerPlugins() {
  // CORS - Allow requests from Vercel deployments and localhost
  await fastify.register(cors, {
    origin: [
      /^https:\/\/.*\.vercel\.app$/,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4173',
      process.env.FRONTEND_URL || ''
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  fastify.log.info('✅ Plugins registered');
}

// Health check
fastify.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      musicGeneration: !!musicGenerationService,
      tokenManager: !!tokenManager,
      tokensAvailable: tokenManager?.getAvailableTokenCount() || 0
    }
  };
});

// Generate music - Public endpoint
fastify.post('/api/generation/create-public', async (request, reply) => {
  const body: any = request.body;
  fastify.log.info('🎵 Generation request:', { prompt: body.prompt });

  if (!musicGenerationService) {
    return reply.status(503).send({
      success: false,
      error: 'Music generation service not initialized'
    });
  }

  try {
    const result = await musicGenerationService.generateMusic({
      prompt: body.prompt || 'Una canción instrumental',
      style: body.style || 'pop',
      duration: body.duration || 60,
      quality: body.quality || 'standard',
      userId: 'public-user'
    });

    if (result.status === 'failed') {
      fastify.log.error('Generation failed:', result.error);
      return reply.status(500).send({
        success: false,
        error: result.error || 'Generation failed'
      });
    }

    fastify.log.info('✅ Generation started:', result.generationTaskId);

    return reply.send({
      success: true,
      taskId: result.generationTaskId,
      status: result.status,
      estimatedTime: result.estimatedTime || 120,
      message: 'Generación iniciada exitosamente'
    });
  } catch (error: any) {
    fastify.log.error('Generation error:', error);
    return reply.status(500).send({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Alternative generate endpoint
fastify.post('/api/generate', async (request, reply) => {
  const body: any = request.body;

  if (!musicGenerationService) {
    return reply.status(503).send({
      success: false,
      error: 'Music generation service not initialized'
    });
  }

  try {
    const result = await musicGenerationService.generateMusic({
      prompt: body.prompt,
      style: body.style || 'pop',
      duration: body.duration || 60,
      quality: body.quality || 'standard',
      userId: body.userId || 'anonymous'
    });

    if (result.status === 'failed') {
      return reply.status(500).send({
        success: false,
        error: result.error
      });
    }

    return reply.send({
      success: true,
      generationId: result.generationTaskId,
      status: result.status,
      estimatedTime: result.estimatedTime
    });
  } catch (error: any) {
    fastify.log.error('Generation error:', error);
    return reply.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// Check generation status
fastify.get('/api/generation/:taskId/status', async (request, reply) => {
  const { taskId } = request.params as { taskId: string };

  if (!musicGenerationService) {
    return reply.status(503).send({
      success: false,
      error: 'Service not available'
    });
  }

  try {
    const status = await musicGenerationService.getGenerationStatus(taskId);
    return reply.send({
      success: true,
      ...status
    });
  } catch (error: any) {
    return reply.status(500).send({
      success: false,
      error: error.message
    });
  }
});

// Start server
async function start() {
  try {
    await registerPlugins();

    // Initialize TokenManager
    const sunoTokens = process.env.SUNO_TOKENS?.split(',').filter(t => t.trim()) || [];

    if (sunoTokens.length === 0) {
      fastify.log.warn('⚠️  No SUNO_TOKENS configured. Music generation will not work.');
      fastify.log.warn('   Set SUNO_TOKENS environment variable with comma-separated tokens');
    } else {
      fastify.log.info(`📝 Loaded ${sunoTokens.length} Suno token(s)`);
    }

    tokenManager = new TokenManager(sunoTokens);
    fastify.log.info('✅ TokenManager initialized');

    // Initialize MusicGenerationService
    musicGenerationService = new MusicGenerationService(tokenManager);
    fastify.log.info('✅ MusicGenerationService initialized');

    // Start listening
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });

    fastify.log.info(`🚀 Server ready on ${host}:${port}`);
    fastify.log.info(`🎵 Music Generation System: ${sunoTokens.length > 0 ? 'ACTIVE' : 'INACTIVE (no tokens)'}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
