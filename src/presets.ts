import type { ObfuscatorOptions } from 'javascript-obfuscator';
import type { ObfuscationPreset } from './types';

/**
 * Light Preset:
 * Optimized for maximum build speed, conservative transformation,
 * and zero/negligible impact on bundle execution performance and size.
 */
export const LIGHT_PRESET: Partial<ObfuscatorOptions> = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'mangled',
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: false,
  stringArray: true,
  stringArrayCallsTransform: false,
  stringArrayEncoding: [],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 0.5,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};

/**
 * Balanced Preset (Default):
 * The recommended setting for production apps.
 * Strips identifiers, encodes strings, applies moderate control flow flattening,
 * and splits strings without exploding bundle size or crippling CPU.
 */
export const BALANCED_PRESET: Partial<ObfuscatorOptions> = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.4,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 0.75,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};

/**
 * Aggressive Preset:
 * Maximum resilience against decompilation and reverse-engineering.
 * Enables high control-flow flattening, rc4+base64 multi-string encoding,
 * conservative dead code injection, and number expression transformations.
 *
 * NOTE: Yields larger bundle sizes and higher execution overhead.
 */
export const AGGRESSIVE_PRESET: Partial<ObfuscatorOptions> = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.15,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 3,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.75,
  stringArrayEncoding: ['rc4', 'base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 0.9,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};

export const PRESETS: Record<ObfuscationPreset, Partial<ObfuscatorOptions>> = {
  light: LIGHT_PRESET,
  balanced: BALANCED_PRESET,
  aggressive: AGGRESSIVE_PRESET,
};

/**
 * Resolves full ObfuscatorOptions from the preset name and user override options.
 */
export function resolvePresetOptions(
  preset: ObfuscationPreset = 'balanced',
  userOverrides: Partial<ObfuscatorOptions> = {},
): ObfuscatorOptions {
  const base = PRESETS[preset] ?? PRESETS.balanced;
  return {
    ...base,
    ...userOverrides,
  } as ObfuscatorOptions;
}
