import type { ObfuscatorOptions } from 'javascript-obfuscator';
import type { RenderedChunk } from 'rollup';

export type ObfuscationPreset = 'light' | 'balanced' | 'aggressive';

export type ObfuscateChunksStrategy =
  | 'application'
  | 'all'
  | 'entries'
  | ((chunk: RenderedChunk) => boolean);

export type LogLevel = 'info' | 'warn' | 'error' | 'silent';

export interface TyroObfuscatorOptions {
  /**
   * Preset configuration for obfuscation intensity.
   * - 'light': Conservative, best build speed, minimal bundle impact.
   * - 'balanced': Recommended default. Strong obfuscation with reasonable bundle size and runtime performance.
   * - 'aggressive': Maximum transformation depth. Trades larger bundle size and CPU execution time for reverse-engineering resistance.
   *
   * @default 'balanced'
   */
  preset?: ObfuscationPreset;

  /**
   * Deep overrides or custom options passed directly to javascript-obfuscator.
   * Any options specified here will override the preset defaults.
   */
  options?: Partial<ObfuscatorOptions>;

  /**
   * Glob patterns matching chunks to include for obfuscation.
   * Evaluated against chunk output filenames (e.g., 'assets/app-*.js').
   *
   * @default ['**\/*.js', '**\/*.mjs']
   */
  include?: string | string[];

  /**
   * Glob patterns matching chunks to exclude from obfuscation.
   *
   * @default []
   */
  exclude?: string | string[];

  /**
   * Strategy to determine which chunks are eligible for obfuscation.
   * - 'application': Intelligently skips vendor chunks where code originates from node_modules. (Default)
   * - 'all': Obfuscates every chunk matching include/exclude rules.
   * - 'entries': Only obfuscates entry chunks (`chunk.isEntry === true`).
   * - Function: Custom predicate `(chunk: RenderedChunk) => boolean`. Return `true` to obfuscate, `false` to skip.
   *
   * @default 'application'
   */
  obfuscateChunks?: ObfuscateChunksStrategy;

  /**
   * Whether to generate and preserve source maps for obfuscated output.
   *
   * IMPORTANT: When set to `false`, source maps will NOT be emitted for obfuscated chunks,
   * protecting against leaking original readable source code into production.
   *
   * @default false
   */
  sourceMap?: boolean;

  /**
   * Console logging level during the build.
   * - 'info': Detailed logs of obfuscated chunks and skipped files. (Default)
   * - 'warn': Only warnings and errors.
   * - 'error': Only errors.
   * - 'silent': No terminal output.
   *
   * @default 'info'
   */
  logLevel?: LogLevel;

  /**
   * Whether to fail the Vite build when an obfuscation error occurs.
   * When true, build terminates immediately with the offending chunk's details.
   *
   * @default true
   */
  failOnError?: boolean;
}

export interface ChunkFilterDecision {
  shouldObfuscate: boolean;
  reason?: string;
}

export interface ObfuscationResult {
  code: string;
  sourceMap?: string;
  originalSize: number;
  obfuscatedSize: number;
  durationMs: number;
}
