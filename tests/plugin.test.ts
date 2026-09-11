import { describe, expect, it } from 'vitest';
import { tyroObfuscator } from '../src/index';

describe('Plugin initialization', () => {
  it('creates a Vite plugin with expected defaults and metadata', () => {
    const plugin = tyroObfuscator();
    expect(plugin.name).toBe('tyro-obfuscator');
    expect(plugin.enforce).toBe('post');
    expect(plugin.apply).toBe('build');
    expect(typeof plugin.renderChunk).toBe('function');
  });

  it('respects custom configuration options', () => {
    const plugin = tyroObfuscator({
      preset: 'aggressive',
      sourceMap: true,
      logLevel: 'silent',
    });
    expect(plugin.name).toBe('tyro-obfuscator');
  });
});
