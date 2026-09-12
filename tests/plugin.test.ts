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

  it('defaults sourceMap to false and produces no sourcemap even if resolvedConfig has sourcemap enabled', async () => {
    const plugin = tyroObfuscator({ logLevel: 'silent' });
    if (plugin.configResolved) {
      // Simulate Vite resolvedConfig with build.sourcemap: true
      (plugin.configResolved as any)({
        command: 'build',
        build: { sourcemap: true },
      });
    }

    const chunk = { fileName: 'test.js', isEntry: true, modules: {} } as any;
    const result = await (plugin.renderChunk as any).call({}, 'const secret = "hello";', chunk);

    expect(result).toBeDefined();
    expect(result.map).toBeNull();
  });
});
