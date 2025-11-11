/**
 * Generation Worker
 * Processes music generation jobs from BullMQ queue
 * Handles retries, errors, and WebSocket updates
 */
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { SunoService } from '../services/sunoService';
import { Server as SocketIOServer } from 'socket.io';

// Redis connection for worker
const redisConnection = new Redis(process.env.REDIS_URL || process.env.REDIS_HOST || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export interface GenerationWorkerData {
  generationId: string;
  userId: string;
  prompt: string;
  style: string;
  duration: number;
  quality: string;
}

/**
 * Create generation worker
 */
export function createGenerationWorker(
  prisma: PrismaClient,
  sunoService: SunoService,
  io: SocketIOServer
): Worker<GenerationWorkerData> {
  const worker = new Worker<GenerationWorkerData>(
    'generation',
    async (job: Job<GenerationWorkerData>) => {
      const { generationId, userId, prompt, style, duration, quality } = job.data;

      try {
        // Update progress: 10% - Starting
        await job.updateProgress(10);
        await prisma.generation.update({
          where: { id: generationId },
          data: { status: 'PROCESSING' }
        });

        // Emit WebSocket update
        io.to(`user:${userId}`).emit('generation:progress', {
          generationId,
          progress: 10,
          status: 'processing',
          message: 'Iniciando generación...'
        });

        // Update progress: 30% - Calling Suno API
        await job.updateProgress(30);
        io.to(`user:${userId}`).emit('generation:progress', {
          generationId,
          progress: 30,
          status: 'processing',
          message: 'Conectando con Suno API...'
        });

        // Generate music with Suno
        const result = await sunoService.generateMusic({
          prompt,
          style,
          duration,
          quality,
          userId,
          generationId
        });

        // Update progress: 70% - Processing result
        await job.updateProgress(70);
        io.to(`user:${userId}`).emit('generation:progress', {
          generationId,
          progress: 70,
          status: 'processing',
          message: 'Procesando audio...'
        });

        // Update progress: 90% - Finalizing
        await job.updateProgress(90);
        await prisma.generation.update({
          where: { id: generationId },
          data: {
            status: result.status === 'completed' ? 'COMPLETED' : 'PROCESSING',
            sunoId: result.sunoId,
            audioUrl: result.audioUrl || undefined,
            metadata: result.metadata ? JSON.stringify(result.metadata) : undefined
          }
        });

        io.to(`user:${userId}`).emit('generation:progress', {
          generationId,
          progress: 90,
          status: 'finalizing',
          message: 'Finalizando...'
        });

        // Update progress: 100% - Complete
        await job.updateProgress(100);

        // If audio URL is available, update to completed
        if (result.audioUrl) {
          await prisma.generation.update({
            where: { id: generationId },
            data: {
              status: 'COMPLETED',
              audioUrl: result.audioUrl
            }
          });
        }

        // Emit completion
        io.to(`user:${userId}`).emit('generation:complete', {
          generationId,
          audioUrl: result.audioUrl,
          status: 'completed',
          message: '¡Música generada exitosamente!'
        });

        return {
          success: true,
          generationId,
          audioUrl: result.audioUrl,
          sunoId: result.sunoId
        };

      } catch (error: any) {
        console.error(`Generation job ${generationId} failed:`, error);

        // Update DB with error
        await prisma.generation.update({
          where: { id: generationId },
          data: {
            status: 'FAILED',
            metadata: JSON.stringify({
              error: error.message,
              stack: error.stack,
              attempts: job.attemptsMade
            })
          }
        });

        // Emit error
        io.to(`user:${userId}`).emit('generation:error', {
          generationId,
          error: error.message || 'Error desconocido',
          status: 'failed',
          message: 'Error al generar música. Inténtalo de nuevo.'
        });

        // Re-throw for BullMQ retry mechanism
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: parseInt(process.env.GENERATION_CONCURRENCY || '5'), // Process 5 jobs at a time
      limiter: {
        max: parseInt(process.env.GENERATION_RATE_LIMIT || '10'),
        duration: 1000, // 10 jobs per second max
      },
    }
  );

  // Event handlers
  worker.on('completed', (job) => {
    console.log(`✅ Generation job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Generation job ${job?.id} failed:`, err);
  });

  worker.on('error', (err) => {
    console.error('❌ Generation worker error:', err);
  });

  worker.on('stalled', (jobId) => {
    console.warn(`⚠️ Generation job ${jobId} stalled`);
  });

  return worker;
}

/**
 * Close worker and cleanup
 */
export async function closeWorker(worker: Worker<GenerationWorkerData>) {
  await worker.close();
  await redisConnection.quit();
}

