/**
 * Music Generation Service
 * Handles integration with AI music generation API
 */

import { TokenManager } from './tokenManager';
import { TokenPoolService } from './tokenPoolService';
import axios, { AxiosInstance } from 'axios';
import { env } from '../lib/config';
import { PrismaClient } from '@prisma/client';

export interface GenerationRequest {
  prompt: string;
  style: string;
  duration: number;
  quality: string;
  userId: string; // Required - all generations must be associated with a user
  generationId?: string;
}

export interface CoverRequest {
  audio_url: string;
  prompt: string;
  style?: string;
  customMode?: boolean;
  userId: string;
}

export interface GenerationResult {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generationTaskId?: string;
  audioUrl?: string;
  metadata?: any;
  estimatedTime?: number;
  error?: string;
}

export class MusicGenerationService {
  private axiosInstances: Map<string, AxiosInstance> = new Map();
  private tokenPoolService?: TokenPoolService;

  constructor(private tokenManager: TokenManager, tokenPoolService?: TokenPoolService) {
    this.tokenPoolService = tokenPoolService;
  }

  /**
   * Generate music using AI generation API implementation
   */
  async generateMusic(request: GenerationRequest): Promise<GenerationResult> {
    try {
      // Validate userId is provided (required for all generations)
      if (!request.userId) {
        return {
          status: 'failed',
          error: 'userId is required for all generations'
        };
      }

      let token: string | undefined;
      let tokenId: string | undefined;

      // Try to get token from TokenPoolService first (Phase 1 Hybrid Architecture)
      if (this.tokenPoolService) {
        try {
          // Simply treating all as 'free' for now until Tier integration is robust
          // In future, fetch user tier from DB
          const result = await this.tokenPoolService.selectOptimalToken('enterprise', request.userId);
          token = result.token;
          tokenId = result.tokenId;
          console.log(`[MusicGenerationService] Using token from Pool: ${tokenId} (Tier: ${result.tier})`);
        } catch (err: any) {
          console.warn('[MusicGenerationService] TokenPool selection failed, falling back to legacy TokenManager:', err.message);
        }
      }

      // Fallback to legacy TokenManager if TokenPool unavailable or failed
      if (!token) {
        const tokenData = await this.tokenManager.getHealthyToken(request.userId);
        if (tokenData) {
          token = tokenData.token;
          tokenId = tokenData.tokenId;
          console.log('[MusicGenerationService] Using token from Legacy TokenManager');
        }
      }

      // If still no token, fail
      if (!token || !tokenId) {
        console.error('[MusicGenerationService] No tokens available from any source.');
        return {
          status: 'failed',
          error: 'No available tokens'
        };
      }

      // Create axios instance for this request
      const axiosInstance = this.createAxiosInstance(token);

      // Prepare generation request (formato correcto para ai.imgkits.com)
      const generationData = {
        prompt: request.prompt,
        lyrics: '',
        title: '',
        style: request.style,
        customMode: false,
        instrumental: false
      };

      // Make request to AI generation API
      const response = await axiosInstance.post('/generate', generationData, {
        timeout: 30000
      });

      if (response.status === 200 && response.data) {
        // API devuelve taskId o id
        const generationTaskId = response.data.taskId || response.data.id || response.data.task_id;

        if (!generationTaskId) {
          return {
            status: 'failed',
            error: 'No taskId in API response'
          };
        }

        // Update token usage (Try Pool first, then fallback to Manager - though Manager expects its own IDs)
        // Since we are transitioning, we will try to update health in Pool if it came from Pool
        if (this.tokenPoolService) {
          const responseTime = response.data.responseTime || 0; // Or calculate it ourselves
          // Since we didn't measure exact time here, using 0 or small placeholder
          // Real implementation should wrap axios call with timer
          await this.tokenPoolService.updateTokenHealth(tokenId, true, 1000);
        } else {
          await this.tokenManager.updateTokenUsage(tokenId, {
            endpoint: '/generate',
            method: 'POST',
            statusCode: response.status,
            responseTime: response.data.responseTime || 0,
            timestamp: new Date()
          });
        }

        return {
          status: 'pending',
          generationTaskId,
          estimatedTime: this.estimateGenerationTime(request.duration, request.quality)
        };
      } else {
        // Report failure
        if (this.tokenPoolService) {
          await this.tokenPoolService.updateTokenHealth(tokenId, false, 5000);
        }
        return {
          status: 'failed',
          error: 'Invalid response from generation API'
        };
      }

    } catch (error) {
      console.error('Music generation error:', error);
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate cover using AI generation API
   */
  async generateCover(request: CoverRequest): Promise<GenerationResult> {
    try {
      // Validate userId
      if (!request.userId) {
        return {
          status: 'failed',
          error: 'userId is required for cover generation'
        };
      }

      // Get a healthy token
      const tokenData = await this.tokenManager.getHealthyToken(request.userId);

      if (!tokenData) {
        return {
          status: 'failed',
          error: 'No available tokens'
        };
      }

      // Use the specific cover API URL if different, or default to the main one
      // Note: The original code used 'https://usa.imgkits.com/node-api/suno/cover'
      // We should probably make this configurable or part of the axios instance creation
      const coverApiUrl = env.COVER_API_URL || 'https://usa.imgkits.com/node-api/suno';

      const response = await axios.post(`${coverApiUrl}/cover`, {
        audio_url: request.audio_url,
        prompt: request.prompt,
        customMode: request.customMode || true,
        style: request.style || 'cover'
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

      if (response.status === 200 && response.data) {
        const data = response.data;
        const taskId = data.data?.taskId || data.taskId || data.task_id;

        if (!taskId) {
          return {
            status: 'failed',
            error: 'No task ID received from generation API'
          };
        }

        // Update token usage
        await this.tokenManager.updateTokenUsage(tokenData.tokenId, {
          endpoint: '/cover',
          method: 'POST',
          statusCode: response.status,
          responseTime: 0,
          timestamp: new Date()
        });

        return {
          status: 'pending',
          generationTaskId: taskId,
          estimatedTime: 120 // Covers might take longer?
        };
      } else {
        return {
          status: 'failed',
          error: 'Invalid response from cover generation API'
        };
      }

    } catch (error) {
      console.error('Cover generation error:', error);
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check generation status
   */
  async checkGenerationStatus(generationTaskId: string): Promise<GenerationResult> {
    try {
      // Get a healthy token
      const tokenData = await this.tokenManager.getHealthyToken();

      if (!tokenData) {
        return {
          status: 'failed',
          error: 'No available tokens'
        };
      }

      // Polling endpoint para verificar estado
      const pollingUrl = env.GENERATION_POLLING_URL || env.NEURAL_ENGINE_POLLING_URL || 'https://usa.imgkits.com/node-api/suno';

      const response = await axios.get(`${pollingUrl}/get_mj_status/${generationTaskId}`, {
        timeout: 10000,
        headers: {
          'authorization': `Bearer ${tokenData.token}`,
          'Content-Type': 'application/json',
          'channel': 'node-api',
          'origin': 'https://www.livepolls.app',
          'referer': 'https://www.livepolls.app/'
        }
      });

      if (response.status === 200 && response.data) {
        const data = response.data;

        // Update token usage
        await this.tokenManager.updateTokenUsage(tokenData.tokenId, {
          endpoint: `/get_mj_status/${generationTaskId}`,
          method: 'GET',
          statusCode: response.status,
          responseTime: data.responseTime || 0,
          timestamp: new Date()
        });

        // API devuelve { running: true/false, audio_url, ... }
        if (data.running === false && data.audio_url) {
          return {
            status: 'completed',
            generationTaskId,
            audioUrl: data.audio_url,
            metadata: {
              duration: data.duration,
              createdAt: new Date()
            }
          };
        } else if (data.running === true) {
          return {
            status: 'processing',
            generationTaskId,
            estimatedTime: 60
          };
        } else {
          return {
            status: 'pending',
            generationTaskId,
            estimatedTime: 60
          };
        }
      } else {
        return {
          status: 'failed',
          error: 'Invalid response from generation API'
        };
      }

    } catch (error) {
      console.error('Status check error:', error);
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check cover generation status
   */
  async checkCoverStatus(generationTaskId: string): Promise<GenerationResult> {
    // Reuse checkGenerationStatus as the endpoint seems to be the same for status checks
    return this.checkGenerationStatus(generationTaskId);
  }

  /**
   * Create axios instance for generation API
   */
  private createAxiosInstance(token: string): AxiosInstance {
    const baseURL = env.GENERATION_API_URL || env.NEURAL_ENGINE_API_URL || 'https://ai.imgkits.com/suno';
    return axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'channel': 'node-api',
        'origin': 'https://www.livepolls.app',
        'referer': 'https://www.livepolls.app/',
        'User-Agent': 'Super-Son1k-2.0/2.0',
        'X-Client-Version': '2.0.0'
      }
    });
  }

  /**
   * Generate tags based on style
   */
  private generateTags(style: string): string[] {
    const styleTags: Record<string, string[]> = {
      'pop': ['pop', 'catchy', 'melodic'],
      'rock': ['rock', 'guitar', 'energetic'],
      'hip-hop': ['hip-hop', 'rap', 'urban'],
      'electronic': ['electronic', 'synth', 'dance'],
      'jazz': ['jazz', 'smooth', 'sophisticated'],
      'classical': ['classical', 'orchestral', 'elegant'],
      'country': ['country', 'folk', 'acoustic'],
      'blues': ['blues', 'soulful', 'emotional'],
      'reggae': ['reggae', 'tropical', 'laid-back'],
      'metal': ['metal', 'heavy', 'aggressive']
    };

    return styleTags[style.toLowerCase()] || ['original', 'unique'];
  }

  /**
   * Estimate generation time based on duration and quality
   */
  private estimateGenerationTime(duration: number, quality: string): number {
    let baseTime = duration * 2; // Base 2x duration

    // Adjust based on quality
    switch (quality.toLowerCase()) {
      case 'standard':
        baseTime *= 1;
        break;
      case 'high':
        baseTime *= 1.5;
        break;
      case 'premium':
        baseTime *= 2;
        break;
      case 'enterprise':
        baseTime *= 2.5;
        break;
      default:
        baseTime *= 1;
    }

    // Minimum 30 seconds, maximum 10 minutes
    return Math.max(30, Math.min(600, baseTime));
  }

  /**
   * Health check for generation service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const tokenData = await this.tokenManager.getHealthyToken();

      if (!tokenData) {
        return false;
      }

      // Health check usando un endpoint simple
      try {
        const axiosInstance = this.createAxiosInstance(tokenData.token);
        // Intentar una llamada simple para verificar token
        const response = await axiosInstance.get('/generate', {
          timeout: 5000,
          validateStatus: () => true // Aceptar cualquier status para health check
        });
        // Si no es 401 (Unauthorized), el token es válido
        return response.status !== 401;
      } catch (error) {
        return false;
      }
    } catch (error) {
      console.error('Generation service health check failed:', error);
      return false;
    }
  }

  /**
   * Close service and cleanup
   */
  async close() {
    // Close all axios instances
    this.axiosInstances.clear();
  }
  /**
   * Get the status of a generation task from Suno API
   */
  public async getGenerationStatus(taskId: string): Promise<any> {
    let tokenData: { tokenId: string; token: string } | null = null;
    try {
      tokenData = await this.tokenManager.getHealthyToken('status-check');
      if (!tokenData) throw new Error('No token for status check');

      const axiosInstance = this.createAxiosInstance(tokenData.token);
      const response = await axiosInstance.get(`/status/${taskId}`, { timeout: 15000 });

      if (response.status !== 200) {
        throw new Error(`Unexpected status ${response.status}`);
      }

      return {
        status: response.data.status,
        audioUrl: response.data.audio_url,
        metadata: response.data.metadata || {},
      };
    } catch (err: any) {
      // Update token usage on error
      this.tokenManager.updateTokenUsage(tokenData?.tokenId || '', {
        endpoint: `/status/${taskId}`,
        method: 'GET',
        statusCode: err.response?.status || 500,
        responseTime: err.response?.duration || 0,
        timestamp: new Date(),
        error: err.message,
      });
      throw err;
    }
  }

}
