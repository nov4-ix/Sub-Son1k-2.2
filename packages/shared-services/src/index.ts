/**
 * Shared Services for Super-Son1k platform
 * Centralized API logic
 */
export { MusicService, getMusicService, createMusicService } from './musicService';
export { ApiService } from './apiService';
export type { ApiServiceConfig } from './apiService';
// Re-export MusicServiceConfig from shared-types for convenience
export type { MusicServiceConfig } from '@super-son1k/shared-types';

