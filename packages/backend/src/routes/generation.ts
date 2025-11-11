/**
 * Generation Routes
 * Handles music generation requests with Suno API integration
 */

import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { SunoService } from '../services/sunoService';
import { AnalyticsService } from '../services/analyticsService';
import { authMiddleware, quotaMiddleware } from '../middleware/auth';
import { addGenerationJob, getJobStatus } from '../queue';
import { generationRequestSchema, validateRequest } from '../lib/validation';
import { env } from '../lib/config';

export function generationRoutes(sunoService: SunoService, analyticsService: AnalyticsService) {
  return async function(fastify: FastifyInstance) {
    // Generate music with Suno API
    fastify.post('/create', {
      preHandler: [authMiddleware, quotaMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;

      try {
        // ✅ VALIDAR INPUT CON ZOD (Backend validation)
        let validatedData;
        try {
          validatedData = validateRequest(generationRequestSchema, request.body);
        } catch (validationError: any) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: validationError.message,
              details: validationError.details
            }
          });
        }

        const { prompt, style, duration, quality } = validatedData;

        // Check user limits
        const quotaInfo = (request as any).quotaInfo;
        if (quotaInfo.remainingGenerations <= 0) {
          return reply.code(403).send({
            success: false,
            error: {
              code: 'QUOTA_EXCEEDED',
              message: 'Monthly generation quota exceeded'
            }
          });
        }

        // ✅ VALIDAR VARIABLES DE ENTORNO (Prevenir crashes)
        if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
          console.error('❌ Supabase configuration missing');
          return reply.code(500).send({
            success: false,
            error: {
              code: 'CONFIGURATION_ERROR',
              message: 'Server configuration error. Contact support.'
            }
          });
        }

        // Create generation record
        const generation = await fastify.prisma.generation.create({
          data: {
            userId: user.id,
            prompt,
            style: style || 'pop',
            duration: duration || 60,
            quality: quality || 'standard',
            status: 'pending'
          }
        });

        // Track analytics
        await analyticsService.trackGeneration({
          userId: user.id,
          generationId: generation.id,
          prompt,
          style,
          duration,
          quality,
          timestamp: new Date()
        });

        // Add generation job to queue (async processing)
        // ✅ CRÉDITOS SOLO SE DECREMENTAN DESPUÉS DE ÉXITO (en el worker)
        await addGenerationJob({
          generationId: generation.id,
          userId: user.id,
          prompt,
          style: style || 'pop',
          duration: duration || 60,
          quality: quality || 'standard',
          tier: user.tier || 'FREE'
        });

        // ✅ NO DECREMENTAR CRÉDITOS AQUÍ - Solo después de éxito en el worker
        // Los créditos se actualizan en generation.worker.ts después de éxito confirmado

        // Return immediately with pending status
        return {
          success: true,
          data: {
            generationId: generation.id,
            status: 'pending',
            message: 'Generation queued successfully. You will receive updates via WebSocket.',
            estimatedTime: 60 // Estimated time in seconds
          }
        };

      } catch (error) {
        console.error('Generation error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'GENERATION_FAILED',
            message: 'Failed to generate music'
          }
        });
      }
    });

    // Get generation status
    fastify.get('/:generationId/status', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { generationId } = request.params as any;

      try {
        const generation = await fastify.prisma.generation.findFirst({
          where: {
            id: generationId,
            userId: user.id
          }
        });

        if (!generation) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'GENERATION_NOT_FOUND',
              message: 'Generation not found'
            }
          });
        }

        // Check job status from queue if still pending or processing
        if (generation.status === 'pending' || generation.status === 'processing') {
          const jobStatus = await getJobStatus(generation.id);
          
          if (jobStatus) {
            // Update generation status based on job state
            if (jobStatus.state === 'completed' && generation.status !== 'COMPLETED') {
              // Job completed, check if we have audio URL
              if (!generation.audioUrl) {
                // Still waiting for audio URL, keep as processing
                generation.status = 'PROCESSING';
              }
            } else if (jobStatus.state === 'failed') {
              generation.status = 'FAILED';
            } else if (jobStatus.state === 'active' || jobStatus.state === 'waiting') {
              generation.status = 'PROCESSING';
            }
          }

          // Also check with Suno API if we have sunoId
          if (generation.sunoId && (generation.status === 'pending' || generation.status === 'processing')) {
            const status = await sunoService.checkGenerationStatus(generation.sunoId);
            
            // Normalize status (pending -> processing for consistency)
            const normalizedStatus = status.status === 'pending' ? 'processing' : status.status;
            
            if (normalizedStatus !== generation.status || status.audioUrl) {
              await fastify.prisma.generation.update({
                where: { id: generation.id },
                data: {
                  status: normalizedStatus.toUpperCase(),
                  audioUrl: status.audioUrl || generation.audioUrl,
                  metadata: status.metadata ? JSON.stringify(status.metadata) : generation.metadata
                }
              });

              generation.status = normalizedStatus.toUpperCase();
              generation.audioUrl = status.audioUrl || generation.audioUrl;
              if (status.metadata) {
                generation.metadata = JSON.stringify(status.metadata);
              }
            }
          }
        }

        return {
          success: true,
          data: {
            id: generation.id,
            status: generation.status,
            prompt: generation.prompt,
            style: generation.style,
            duration: generation.duration,
            quality: generation.quality,
            audioUrl: generation.audioUrl,
            metadata: generation.metadata,
            createdAt: generation.createdAt,
            updatedAt: generation.updatedAt
          }
        };

      } catch (error) {
        console.error('Status check error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'STATUS_CHECK_FAILED',
            message: 'Failed to check generation status'
          }
        });
      }
    });

    // Get user generations
    fastify.get('/history', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { page = 1, limit = 20 } = request.query as any;

      try {
        const skip = (page - 1) * limit;

        const [generations, total] = await Promise.all([
          fastify.prisma.generation.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: {
              id: true,
              prompt: true,
              style: true,
              duration: true,
              quality: true,
              status: true,
              audioUrl: true,
              createdAt: true,
              updatedAt: true
            }
          }),
          fastify.prisma.generation.count({
            where: { userId: user.id }
          })
        ]);

        return {
          success: true,
          data: {
            generations,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit)
            }
          }
        };

      } catch (error) {
        console.error('History fetch error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'HISTORY_FETCH_FAILED',
            message: 'Failed to fetch generation history'
          }
        });
      }
    });

    // Delete generation
    fastify.delete('/:generationId', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { generationId } = request.params as any;

      try {
        const generation = await fastify.prisma.generation.findFirst({
          where: {
            id: generationId,
            userId: user.id
          }
        });

        if (!generation) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'GENERATION_NOT_FOUND',
              message: 'Generation not found'
            }
          });
        }

        await fastify.prisma.generation.delete({
          where: { id: generationId }
        });

        return {
          success: true,
          data: {
            message: 'Generation deleted successfully'
          }
        };

      } catch (error) {
        console.error('Delete error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'DELETE_FAILED',
            message: 'Failed to delete generation'
          }
        });
      }
    });

    // Generate cover (for Ghost Studio)
    fastify.post('/cover', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { audio_url, prompt, style, customMode } = request.body as any;

      try {
        // Validate input
        if (!audio_url || !prompt) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'INVALID_INPUT',
              message: 'audio_url and prompt are required'
            }
          });
        }

        // Get a healthy token from pool
        const tokenData = await fastify.tokenManager.getHealthyToken(user.id);
        
        if (!tokenData) {
          return reply.code(503).send({
            success: false,
            error: {
              code: 'NO_TOKENS_AVAILABLE',
              message: 'No available tokens in pool'
            }
          });
        }

        // Call Suno Cover API
        const response = await axios.post('https://usa.imgkits.com/node-api/suno/cover', {
          audio_url,
          prompt,
          customMode: customMode || true,
          style: style || 'cover'
        }, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${tokenData.token}`,
            'channel': 'node-api',
            'origin': 'https://www.livepolls.app',
            'referer': 'https://www.livepolls.app/'
          },
          timeout: 30000
        });

        if (response.status !== 200 || !response.data) {
          return reply.code(500).send({
            success: false,
            error: {
              code: 'SUNO_API_ERROR',
              message: 'Suno API error'
            }
          });
        }

        const data = response.data;
        const taskId = data.data?.taskId || data.taskId || data.task_id;

        if (!taskId) {
          return reply.code(500).send({
            success: false,
            error: {
              code: 'NO_TASK_ID',
              message: 'No task ID received from Suno'
            }
          });
        }

        // Update token usage
        await fastify.tokenManager.updateTokenUsage(tokenData.tokenId, {
          endpoint: '/cover',
          method: 'POST',
          statusCode: response.status,
          responseTime: 0,
          timestamp: new Date()
        });

        return {
          success: true,
          data: {
            taskId,
            status: 'pending',
            message: 'Cover generation started'
          }
        };

      } catch (error: any) {
        console.error('Cover generation error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'COVER_GENERATION_FAILED',
            message: error.response?.data?.message || error.message || 'Failed to generate cover'
          }
        });
      }
    });
  };
}
