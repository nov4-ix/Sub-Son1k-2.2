import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

// Initialize Fastify
const fastify = Fastify({
  logger: true,
  trustProxy: true
});

// Register CORS
fastify.register(cors, {
  origin: [
    /^https:\/\/.*\.vercel\.app$/,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
});

// Register Helmet
fastify.register(helmet, {
  contentSecurityPolicy: false
});

// Register Rate Limiting
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API Routes for music generation
fastify.post('/api/generation/create-public', async (request, reply) => {
  const body: any = request.body;
  fastify.log.info('✅ Generation request received:', body);

  return reply.send({
    success: true,
    message: 'Generación iniciada (demo mode - full backend coming soon)',
    taskId: `demo-${Date.now()}`,
    status: 'queued',
    prompt: body?.prompt || 'Sin prompt'
  });
});

fastify.post('/api/generate', async (request, reply) => {
  const body: any = request.body;
  fastify.log.info('✅ Generate request received:', body);

  return reply.send({
    success: true,
    message: 'Generación en cola (demo mode)',
    generationId: `gen-${Date.now()}`,
    status: 'processing'
  });
});

// Start server
async function start() {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    fastify.log.info(`🚀 Backend running on ${host}:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();
