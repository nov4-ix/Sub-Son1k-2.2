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
  return reply.status(503).send({
    error: 'Music generation service temporarily unavailable. Backend routes being restored.',
    message: 'Por favor espera mientras restauramos las rutas de generación'
  });
});

fastify.post('/api/generate', async (request, reply) => {
  return reply.status(503).send({
    error: 'Music generation service temporarily unavailable',
    message: 'Servicio en mantenimiento'
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
