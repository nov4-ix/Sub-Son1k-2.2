/**
 * Environment Configuration
 * Centralized validation of all environment variables
 * Prevents crashes from missing API keys in production
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('Database URL inválida'),
  
  // Redis
  REDIS_URL: z.string().url().optional().or(z.string().startsWith('redis://')),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  
  // Supabase
  SUPABASE_URL: z.string().url('Supabase URL inválida'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key requerida'),
  
  // Suno API
  SUNO_API_URL: z.string().url().optional(),
  SUNO_POLLING_URL: z.string().url().optional(),
  SUNO_API_KEY: z.string().min(1, 'Suno API key requerida').optional(),
  
  // Frontend
  FRONTEND_URL: z.string().min(1, 'Frontend URL requerida'),
  
  // Backend Secret
  BACKEND_SECRET: z.string().min(32, 'BACKEND_SECRET debe tener al menos 32 caracteres'),
  
  // Queue Configuration
  GENERATION_CONCURRENCY: z.string().optional(),
  GENERATION_RATE_LIMIT: z.string().optional(),
  
  // Token Pool
  MIN_TOKENS: z.string().optional(),
  MAX_TOKENS: z.string().optional(),
  ROTATION_INTERVAL: z.string().optional(),
  HEALTH_CHECK_INTERVAL: z.string().optional(),
  
  // Stripe (opcional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),
  STRIPE_PREMIUM_PRICE_ID: z.string().optional(),
  STRIPE_ENTERPRISE_PRICE_ID: z.string().optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  HOST: z.string().optional(),
});

// Validar variables de entorno
function validateEnv() {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      REDIS_URL: process.env.REDIS_URL,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      JWT_SECRET: process.env.JWT_SECRET,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUNO_API_URL: process.env.SUNO_API_URL,
      SUNO_POLLING_URL: process.env.SUNO_POLLING_URL,
      SUNO_API_KEY: process.env.SUNO_API_KEY,
      FRONTEND_URL: process.env.FRONTEND_URL,
      BACKEND_SECRET: process.env.BACKEND_SECRET,
      GENERATION_CONCURRENCY: process.env.GENERATION_CONCURRENCY,
      GENERATION_RATE_LIMIT: process.env.GENERATION_RATE_LIMIT,
      MIN_TOKENS: process.env.MIN_TOKENS,
      MAX_TOKENS: process.env.MAX_TOKENS,
      ROTATION_INTERVAL: process.env.ROTATION_INTERVAL,
      HEALTH_CHECK_INTERVAL: process.env.HEALTH_CHECK_INTERVAL,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
      STRIPE_PREMIUM_PRICE_ID: process.env.STRIPE_PREMIUM_PRICE_ID,
      STRIPE_ENTERPRISE_PRICE_ID: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      LOG_LEVEL: process.env.LOG_LEVEL,
      HOST: process.env.HOST,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
      console.error('❌ ERROR: Variables de entorno faltantes o inválidas:\n', missingVars);
      throw new Error(`Environment validation failed:\n${missingVars}`);
    }
    throw error;
  }
}

// Exportar env validado
export const env = validateEnv();

// Helper para verificar si una variable está configurada
export function requireEnv(key: keyof typeof env): string {
  const value = env[key];
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value as string;
}

// Log de validación exitosa (solo en desarrollo)
if (env.NODE_ENV === 'development') {
  console.log('✅ Environment variables validated successfully');
}

