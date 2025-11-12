/**
 * Generation Routes
 * Handles music generation requests with AI generation API integration
 */

import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { MusicGenerationService } from '../services/musicGenerationService';
import { AnalyticsService } from '../services/analyticsService';
import { authMiddleware, quotaMiddleware } from '../middleware/auth';
import { addGenerationJob, getJobStatus } from '../queue';
import { generationRequestSchema, validateRequest } from '../lib/validation';
import { env } from '../lib/config';

export function generationRoutes(musicGenerationService: MusicGenerationService, analyticsService: AnalyticsService) {
  return async function(fastify: FastifyInstance) {
    // Generate music with AI generation API
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

        // Call generation API
        const response = await axios.post('https://ai.imgkits.com/suno/generate', {
          prompt,
          style: style || 'pop',
          duration: duration || 60,
          quality: quality || 'standard'
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
              code: 'GENERATION_API_ERROR',
              message: 'Generation API error'
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
              message: 'No task ID received from generation API'
            }
          });
        }

        // Create generation record in database
        const generation = await fastify.prisma.generation.create({
          data: {
            userId: user.id,
            prompt,
            style: style || 'pop',
            duration: duration || 60,
            quality: quality || 'standard',
            status: 'PENDING',
            generationTaskId: taskId,
            metadata: JSON.stringify({
              type: 'standard',
              style: style || 'pop',
              duration: duration || 60,
              quality: quality || 'standard'
            })
          }
        });

        // Add generation to queue for processing
        await addGenerationJob({
          generationId: generation.id,
          userId: user.id,
          prompt,
          style: style || 'pop',
          duration: duration || 60,
          quality: quality || 'standard'
        });

        // Update token usage
        await fastify.tokenManager.updateTokenUsage(tokenData.tokenId, {
          endpoint: '/generate',
          method: 'POST',
          statusCode: response.status,
          responseTime: 0,
          timestamp: new Date()
        });

        // Track analytics
        await analyticsService.trackGeneration({
          userId: user.id,
          generationId: generation.id,
          prompt,
          style: style || 'pop',
          duration: duration || 60,
          quality: quality || 'standard',
          timestamp: new Date()
        });

        return {
          success: true,
          data: {
            generationId: generation.id,
            generationTaskId: taskId,
            status: 'PENDING',
            message: 'Generation started'
          }
        };

      } catch (error: any) {
        console.error('Generation error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'GENERATION_FAILED',
            message: error.response?.data?.message || error.message || 'Failed to generate music'
          }
        });
      }
    });

    // Get generation status
    fastify.get('/:id/status', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { id } = request.params as any;

      try {
        const generation = await fastify.prisma.generation.findFirst({
          where: {
            id,
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

        // Check status with generation API if still pending or processing
        if (generation.status === 'PENDING' || generation.status === 'PROCESSING') {
          if (generation.generationTaskId) {
            const status = await musicGenerationService.checkGenerationStatus(generation.generationTaskId);
            
            // Normalize status
            const normalizedStatus = status.status === 'pending' ? 'PROCESSING' : 
                                     status.status === 'processing' ? 'PROCESSING' :
                                     status.status === 'completed' ? 'COMPLETED' :
                                     status.status === 'failed' ? 'FAILED' : generation.status;
            
            if (normalizedStatus !== generation.status || status.audioUrl) {
              await fastify.prisma.generation.update({
                where: { id: generation.id },
                data: {
                  status: normalizedStatus,
                  generationTaskId: status.generationTaskId || generation.generationTaskId,
                  audioUrl: status.audioUrl || generation.audioUrl,
                  metadata: status.metadata ? JSON.stringify(status.metadata) : generation.metadata
                }
              });

              generation.status = normalizedStatus;
              generation.generationTaskId = status.generationTaskId || generation.generationTaskId;
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
            generationTaskId: generation.generationTaskId,
            status: generation.status,
            audioUrl: generation.audioUrl,
            prompt: generation.prompt,
            style: generation.style,
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

    // Get generation history
    fastify.get('/history', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { limit = 50, offset = 0 } = request.query as any;

      try {
        const generations = await fastify.prisma.generation.findMany({
          where: {
            userId: user.id
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: parseInt(limit) || 50,
          skip: parseInt(offset) || 0
        });

        return {
          success: true,
          data: generations.map(g => ({
            id: g.id,
            generationTaskId: g.generationTaskId,
            prompt: g.prompt,
            style: g.style,
            duration: g.duration,
            status: g.status,
            audioUrl: g.audioUrl,
            createdAt: g.createdAt,
            updatedAt: g.updatedAt
          }))
        };

      } catch (error) {
        console.error('History error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'HISTORY_FAILED',
            message: 'Failed to fetch generation history'
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

        // Call generation API for cover
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
              code: 'GENERATION_API_ERROR',
              message: 'Generation API error'
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
              message: 'No task ID received from generation API'
            }
          });
        }

        // ✅ CREAR GENERACIÓN EN BASE DE DATOS (como en /create)
        const generation = await fastify.prisma.generation.create({
          data: {
            userId: user.id,
            prompt: `Cover: ${prompt}`,
            style: style || 'cover',
            duration: 120, // Default duration for covers
            quality: 'standard',
            status: 'PENDING',
            generationTaskId: taskId,
            metadata: JSON.stringify({
              type: 'cover',
              audio_url,
              customMode: customMode || true,
              originalPrompt: prompt
            })
          }
        });

        // Add generation to queue for processing
        await addGenerationJob({
          generationId: generation.id,
          userId: user.id,
          prompt: `Cover: ${prompt}`,
          style: style || 'cover',
          duration: 120,
          quality: 'standard'
        });

        // Update token usage
        await fastify.tokenManager.updateTokenUsage(tokenData.tokenId, {
          endpoint: '/cover',
          method: 'POST',
          statusCode: response.status,
          responseTime: 0,
          timestamp: new Date()
        });

        // Track analytics
        await analyticsService.trackGeneration({
          userId: user.id,
          generationId: generation.id,
          prompt: `Cover: ${prompt}`,
          style: style || 'cover',
          duration: 120,
          quality: 'standard',
          timestamp: new Date()
        });

        return {
          success: true,
          data: {
            generationId: generation.id,
            taskId,
            status: 'PENDING',
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

    // Get cover status by taskId
    fastify.get('/cover/status/:taskId', {
      preHandler: [authMiddleware]
    }, async (request, reply) => {
      const user = (request as any).user;
      const { taskId } = request.params as any;

      try {
        // Find generation by taskId
        const generation = await fastify.prisma.generation.findFirst({
          where: {
            generationTaskId: taskId,
            userId: user.id
          }
        });

        if (!generation) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'GENERATION_NOT_FOUND',
              message: 'Cover generation not found'
            }
          });
        }

        // Check status with generation API if still pending or processing
        if (generation.status === 'PENDING' || generation.status === 'PROCESSING') {
          const status = await musicGenerationService.checkCoverStatus(taskId);
          
          // Normalize status
          const normalizedStatus = status.status === 'pending' ? 'PROCESSING' : 
                                   status.status === 'processing' ? 'PROCESSING' :
                                   status.status === 'completed' ? 'COMPLETED' :
                                   status.status === 'failed' ? 'FAILED' : generation.status;
          
          if (normalizedStatus !== generation.status || status.audioUrl) {
            await fastify.prisma.generation.update({
              where: { id: generation.id },
              data: {
                status: normalizedStatus,
                generationTaskId: status.generationTaskId || generation.generationTaskId,
                audioUrl: status.audioUrl || generation.audioUrl,
                metadata: status.metadata ? JSON.stringify(status.metadata) : generation.metadata
              }
            });

            generation.status = normalizedStatus;
            generation.generationTaskId = status.generationTaskId || generation.generationTaskId;
            generation.audioUrl = status.audioUrl || generation.audioUrl;
            if (status.metadata) {
              generation.metadata = JSON.stringify(status.metadata);
            }
          }
        }

        return {
          success: true,
          data: {
            id: generation.id,
            taskId: generation.generationTaskId,
            status: generation.status,
            audioUrl: generation.audioUrl,
            prompt: generation.prompt,
            style: generation.style,
            createdAt: generation.createdAt,
            updatedAt: generation.updatedAt
          }
        };

      } catch (error) {
        console.error('Cover status check error:', error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'STATUS_CHECK_FAILED',
            message: 'Failed to check cover status'
          }
        });
      }
    });
  };
}
