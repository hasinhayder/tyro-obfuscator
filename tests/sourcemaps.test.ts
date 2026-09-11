import { describe, expect, it } from 'vitest';
import { configureSourcemaps } from '../src/sourcemaps';

describe('Sourcemaps configuration', () => {
  it('disables sourcemaps by default or when false', () => {
    const config = configureSourcemaps(false, { compact: true });
    expect(config.sourceMap).toBe(false);
  });

  it('enables separate sourcemaps when requested', () => {
    const config = configureSourcemaps(true, { compact: true });
    expect(config.sourceMap).toBe(true);
    expect(config.sourceMapMode).toBe('separate');
  });

  it('preserves existing options while toggling sourcemaps', () => {
    const config = configureSourcemaps(true, {
      compact: true,
      identifierNamesGenerator: 'hexadecimal',
    });
    expect(config.compact).toBe(true);
    expect(config.identifierNamesGenerator).toBe('hexadecimal');
    expect(config.sourceMap).toBe(true);
  });
});
