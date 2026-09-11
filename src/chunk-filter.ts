import picomatch from 'picomatch';
import type { RenderedChunk } from 'rollup';
import type { ChunkFilterDecision, ObfuscateChunksStrategy, TyroObfuscatorOptions } from './types';

export class ChunkFilter {
  private isIncluded: (path: string) => boolean;
  private isExcluded: (path: string) => boolean;
  private strategy: ObfuscateChunksStrategy;

  constructor(options: TyroObfuscatorOptions = {}) {
    const includePatterns = options.include
      ? (Array.isArray(options.include) ? options.include : [options.include])
      : ['**/*.js', '**/*.mjs'];

    const excludePatterns = options.exclude
      ? (Array.isArray(options.exclude) ? options.exclude : [options.exclude])
      : [];

    this.isIncluded = picomatch(includePatterns, { dot: true });
    this.isExcluded = excludePatterns.length > 0 ? picomatch(excludePatterns, { dot: true }) : () => false;
    this.strategy = options.obfuscateChunks ?? 'application';
  }

  /**
   * Evaluates if a given chunk should be obfuscated based on include/exclude globs,
   * chunk extension, chunk strategy, and vendor origin detection.
   */
  public evaluate(chunk: RenderedChunk): ChunkFilterDecision {
    const fileName = chunk.fileName;

    // 1. Only process JS chunks
    if (!fileName.endsWith('.js') && !fileName.endsWith('.mjs') && !fileName.endsWith('.cjs')) {
      return {
        shouldObfuscate: false,
        reason: 'not a JavaScript chunk',
      };
    }

    // 2. Exclude matching
    if (this.isExcluded(fileName)) {
      return {
        shouldObfuscate: false,
        reason: 'matched exclude pattern',
      };
    }

    // 3. Include matching
    if (!this.isIncluded(fileName)) {
      return {
        shouldObfuscate: false,
        reason: 'did not match include pattern',
      };
    }

    // 4. Custom strategy function
    if (typeof this.strategy === 'function') {
      const allowed = this.strategy(chunk);
      return {
        shouldObfuscate: allowed,
        reason: allowed ? 'passed custom strategy predicate' : 'rejected by custom strategy predicate',
      };
    }

    // 5. 'entries' strategy: only chunks marked as entry point
    if (this.strategy === 'entries') {
      if (!chunk.isEntry) {
        return {
          shouldObfuscate: false,
          reason: 'not an entry chunk',
        };
      }
      return { shouldObfuscate: true };
    }

    // 6. 'application' strategy (Default): intelligently detect vendor/dependency chunks
    if (this.strategy === 'application') {
      if (this.isVendorChunk(chunk)) {
        return {
          shouldObfuscate: false,
          reason: 'vendor chunk',
        };
      }
    }

    // Default: 'all' or 'application' that passed vendor check
    return { shouldObfuscate: true };
  }

  /**
   * Determines if a chunk represents vendor/third-party code.
   * Examines module IDs within the chunk rather than relying solely on the chunk name.
   */
  public isVendorChunk(chunk: RenderedChunk): boolean {
    // Obvious vendor name pattern from Rollup manualChunks: e.g. vendor-xxx.js
    const normalizedName = chunk.fileName.toLowerCase();
    if (normalizedName.includes('/vendor') || normalizedName.startsWith('vendor-') || normalizedName.startsWith('vendor/')) {
      return true;
    }

    const moduleIds = Object.keys(chunk.modules ?? {});
    if (moduleIds.length === 0) {
      // Empty chunk or dynamic runtime wrapper - preserve
      return false;
    }

    // Count how many module IDs originate inside node_modules or common vendor paths
    let vendorCount = 0;
    for (const id of moduleIds) {
      if (id.includes('/node_modules/') || id.includes('\\node_modules\\') || id.includes('/vendor/')) {
        vendorCount++;
      }
    }

    // If all or virtually all (>= 90%) modules in the chunk are from node_modules, treat as vendor
    const ratio = vendorCount / moduleIds.length;
    return ratio >= 0.9;
  }
}
