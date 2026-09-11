import type { Plugin, ResolvedConfig } from 'vite';
import type { PluginContext, RenderedChunk, SourceMapInput } from 'rollup';
import { ChunkFilter } from './chunk-filter';
import { Logger } from './logger';
import { obfuscateChunk } from './obfuscator';
import { resolvePresetOptions } from './presets';
import { configureSourcemaps } from './sourcemaps';
import type { TyroObfuscatorOptions } from './types';

/**
 * Creates the Tyro Obfuscator Vite plugin.
 *
 * Runs exclusively on production builds ('vite build'), intercepting generated
 * JavaScript chunks during Rollup's `renderChunk` lifecycle to apply
 * AST-level obfuscation via `javascript-obfuscator`.
 */
export function tyroObfuscator(options: TyroObfuscatorOptions = {}): Plugin {
  let resolvedConfig: ResolvedConfig | undefined;
  const logger = new Logger(options.logLevel ?? 'info');
  const chunkFilter = new ChunkFilter(options);
  const failOnError = options.failOnError ?? true;

  // Track chunk filenames that have already been obfuscated to prevent double-obfuscation
  const processedChunks = new Set<string>();

  return {
    name: 'tyro-obfuscator',

    // Enforce running after standard transformations and plugins have finalized the code
    enforce: 'post',

    // Only apply during production build, never in dev/serve mode
    apply: 'build',

    configResolved(config: ResolvedConfig) {
      resolvedConfig = config;
    },

    async renderChunk(this: PluginContext, code: string, chunk: RenderedChunk) {
      // If dev server or SSR build, skip completely
      if (resolvedConfig && (resolvedConfig.command !== 'build' || resolvedConfig.build?.ssr)) {
        return null;
      }

      // Check double-obfuscation guard
      if (processedChunks.has(chunk.fileName)) {
        return null;
      }

      // Evaluate chunk eligibility
      const decision = chunkFilter.evaluate(chunk);
      if (!decision.shouldObfuscate) {
        if (chunk.fileName.endsWith('.js') || chunk.fileName.endsWith('.mjs')) {
          logger.skipped(chunk.fileName, decision.reason ?? 'filtered');
        }
        return null;
      }

      // Determine sourcemap settings: prioritize plugin's option, then fallback to Vite's build.sourcemap
      const shouldMap = options.sourceMap !== undefined
        ? options.sourceMap
        : Boolean(resolvedConfig?.build?.sourcemap);

      // Resolve base preset options + user overrides + sourcemap configuration
      const baseOptions = resolvePresetOptions(options.preset ?? 'balanced', options.options ?? {});
      const finalOptions = configureSourcemaps(shouldMap, baseOptions);

      try {
        const result = obfuscateChunk({
          code,
          fileName: chunk.fileName,
          options: finalOptions as any,
        });

        processedChunks.add(chunk.fileName);
        logger.obfuscated(chunk.fileName, result.originalSize, result.obfuscatedSize, result.durationMs);

        return {
          code: result.code,
          map: result.sourceMap ? (JSON.parse(result.sourceMap) as SourceMapInput) : null,
        };
      } catch (err: any) {
        logger.error(err.message);

        if (failOnError) {
          if (typeof this?.error === 'function') {
            this.error(err);
          } else {
            throw err;
          }
        } else {
          logger.warn(`Continuing build with unobfuscated chunk "${chunk.fileName}" due to failOnError: false.`);
          return null;
        }
      }
    },
  };
}
