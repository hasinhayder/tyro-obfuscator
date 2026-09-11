import type { ObfuscatorOptions } from 'javascript-obfuscator';

export interface SourcemapConfig {
  sourceMap: boolean;
  sourceMapMode: 'separate' | 'inline';
}

/**
 * Normalizes sourcemap options for javascript-obfuscator based on user settings
 * and whether the build or user enabled sourcemaps.
 */
export function configureSourcemaps(
  userSourcemapSetting: boolean | undefined,
  baseOptions: Partial<ObfuscatorOptions>,
): Partial<ObfuscatorOptions> {
  const shouldGenerateMap = userSourcemapSetting === true;

  if (!shouldGenerateMap) {
    return {
      ...baseOptions,
      sourceMap: false,
      sourceMapMode: 'separate',
    };
  }

  return {
    ...baseOptions,
    sourceMap: true,
    sourceMapMode: 'separate',
    sourceMapBaseUrl: '',
    sourceMapFileName: '',
  };
}
