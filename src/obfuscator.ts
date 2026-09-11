import JavaScriptObfuscator, { type ObfuscatorOptions } from 'javascript-obfuscator';
import type { ObfuscationResult } from './types';

export interface ObfuscateChunkParams {
  code: string;
  fileName: string;
  options: ObfuscatorOptions;
}

/**
 * Obfuscates code using javascript-obfuscator.
 * Handles performance timing and formats actionable errors with chunk location.
 */
export function obfuscateChunk({
  code,
  fileName,
  options,
}: ObfuscateChunkParams): ObfuscationResult {
  if (!code || code.trim() === '') {
    return {
      code,
      originalSize: code.length,
      obfuscatedSize: code.length,
      durationMs: 0,
    };
  }

  // Explicitly suppress "JavaScript Obfuscator Pro" terminal advertisement banners
  const finalOptions: ObfuscatorOptions = {
    advertisement: false,
    ...options,
  };

  const startTime = Date.now();
  const originalSize = Buffer.byteLength(code, 'utf8');

  try {
    const result = JavaScriptObfuscator.obfuscate(code, finalOptions);
    const obfuscatedCode = result.getObfuscatedCode();
    const sourceMap = finalOptions.sourceMap ? result.getSourceMap() : undefined;
    const durationMs = Date.now() - startTime;
    const obfuscatedSize = Buffer.byteLength(obfuscatedCode, 'utf8');

    return {
      code: obfuscatedCode,
      sourceMap,
      originalSize,
      obfuscatedSize,
      durationMs,
    };
  } catch (error: any) {
    const message = error?.message ?? String(error);
    const enhancedError = new Error(
      `Failed to obfuscate chunk "${fileName}": ${message}\n` +
      `Check if this chunk contains unsupported or experimental syntax, ` +
      `or consider adding it to the 'exclude' option.`,
    );
    (enhancedError as any).cause = error;
    throw enhancedError;
  }
}
