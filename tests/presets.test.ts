import { describe, expect, it } from 'vitest';
import {
  AGGRESSIVE_PRESET,
  BALANCED_PRESET,
  LIGHT_PRESET,
  PRESETS,
  resolvePresetOptions,
} from '../src/presets';

describe('Presets', () => {
  it('provides light, balanced, and aggressive preset configurations', () => {
    expect(PRESETS.light).toBeDefined();
    expect(PRESETS.balanced).toBeDefined();
    expect(PRESETS.aggressive).toBeDefined();
  });

  it('light preset prioritizes speed and low impact', () => {
    expect(LIGHT_PRESET.controlFlowFlattening).toBe(false);
    expect(LIGHT_PRESET.deadCodeInjection).toBe(false);
    expect(LIGHT_PRESET.identifierNamesGenerator).toBe('mangled');
    expect(LIGHT_PRESET.compact).toBe(true);
  });

  it('balanced preset activates hexadecimal identifiers and control flow flattening', () => {
    expect(BALANCED_PRESET.identifierNamesGenerator).toBe('hexadecimal');
    expect(BALANCED_PRESET.controlFlowFlattening).toBe(true);
    expect(BALANCED_PRESET.controlFlowFlatteningThreshold).toBe(0.4);
    expect(BALANCED_PRESET.splitStrings).toBe(true);
    expect(BALANCED_PRESET.stringArrayEncoding).toEqual(['base64']);
  });

  it('aggressive preset configures high thresholds and rc4 encoding', () => {
    expect(AGGRESSIVE_PRESET.controlFlowFlattening).toBe(true);
    expect(AGGRESSIVE_PRESET.controlFlowFlatteningThreshold).toBe(0.75);
    expect(AGGRESSIVE_PRESET.deadCodeInjection).toBe(true);
    expect(AGGRESSIVE_PRESET.numbersToExpressions).toBe(true);
    expect(AGGRESSIVE_PRESET.stringArrayEncoding).toEqual(['rc4', 'base64']);
  });

  it('resolvePresetOptions defaults to balanced', () => {
    const resolved = resolvePresetOptions();
    expect(resolved.identifierNamesGenerator).toBe('hexadecimal');
    expect(resolved.controlFlowFlatteningThreshold).toBe(0.4);
  });

  it('resolvePresetOptions allows overriding options', () => {
    const resolved = resolvePresetOptions('balanced', {
      controlFlowFlatteningThreshold: 0.9,
      compact: false,
    });
    expect(resolved.controlFlowFlatteningThreshold).toBe(0.9);
    expect(resolved.compact).toBe(false);
    // Unaltered preset properties remain intact
    expect(resolved.identifierNamesGenerator).toBe('hexadecimal');
  });
});
