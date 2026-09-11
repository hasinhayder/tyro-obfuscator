import { tyroObfuscator } from './plugin';

export { tyroObfuscator } from './plugin';
export { ChunkFilter } from './chunk-filter';
export { Logger } from './logger';
export { obfuscateChunk } from './obfuscator';
export {
  PRESETS,
  LIGHT_PRESET,
  BALANCED_PRESET,
  AGGRESSIVE_PRESET,
  resolvePresetOptions,
} from './presets';
export { configureSourcemaps } from './sourcemaps';
export type {
  TyroObfuscatorOptions,
  ObfuscationPreset,
  ObfuscateChunksStrategy,
  LogLevel,
  ChunkFilterDecision,
  ObfuscationResult,
} from './types';

export default tyroObfuscator;
