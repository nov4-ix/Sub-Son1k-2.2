import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { TokenManager } from './services/tokenManager';
import { MusicGenerationService } from './services/musicGenerationService';
import { env } from './lib/config';

const fastify = Fastify({
  logger: true  // Simple logger without pino-pretty
});

// Initialize services
let tokenManager: TokenManager;
let musicGenerationService: MusicGenerationService;

// Register plugins
async function registerPlugins() {
  // CORS - Allow requests from Vercel deployments and localhost
  await fastify.register(cors, {
    origin: [
      /^https:\/\/.*\.vercel\.app$/,  // All Vercel domains
      'http://localhost:5173',          // Local dev
      'http://localhost:3000',          // Local dev  
      'http://localhost:4173',          // Local preview
      process.env.FRONTEND_URL || ''   // Custom domain if configured
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
  });

  // Helmet for security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false  // Disable for API
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  fastify.log.info('✅ Plugins registered successfully');
}

// Health check
fastify.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      musicGeneration: !!musicGenerationService,
      tokenManager: !!tokenManager
    }
  };
});

// API Routes for music generation
fastify.post('/api/generation/create-public', async (request, reply) => {
  const body: any = request.body;
  fastify.log.info('✅ Generation request received:', body);

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
      userId: 'public-user' // For public generations
    });

    if (result.status === 'failed') {
      return reply.status(500).send({
        success: false,
        error: result.error || 'Generation failed'
      });
    }

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

fastify.post('/api/generate', async (request, reply) => {
  const body: any = request.body;
  fastify.log.info('✅ Generate request received:', body);

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
        error: result.error || 'Generation failed'
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
      error: error.message || 'Internal server error'
    });
  }
});

// Check generation status
fastify.get('/api/generation/:taskId/status', async (request, reply) => {
  const { taskId } = request.params as { taskId: string };

  if (!musicGenerationService) {
    return reply.status(503).send({
      success: false,
      error: 'Music generation service not initialized'
    });
  }

  try {
    // This would need to be implemented in the service
    // For now, return a placeholder
    return reply.send({
      success: true,
      taskId,
      status: 'processing',
      progress: 50
    });
  } catch (error: any) {
    fastify.log.error('Status check error:', error);
    return reply.status(500).send({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Start server
async function start() {
  try {
    // Register plugins first
    await registerPlugins();

    // Initialize TokenManager
    const sunoTokens = process.env.SUNO_TOKENS?.split(',').filter(t => t.trim()) || [];

    if (sunoTokens.length === 0) {
      fastify.log.warn('⚠️  No SUNO_TOKENS found in environment');
    } else {
      fastify.log.info(`📝 Found ${sunoTokens.length} Suno tokens`);
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

    fastify.log.info(`🚀 Server listening on ${host}:${port}`);
    fastify.log.info(`🎵 Music Generation System: READY`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
