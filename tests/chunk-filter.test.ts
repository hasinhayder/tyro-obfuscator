import { describe, expect, it } from 'vitest';
import type { RenderedChunk } from 'rollup';
import { ChunkFilter } from '../src/chunk-filter';

function makeMockChunk(overrides: Partial<RenderedChunk> = {}): RenderedChunk {
  return {
    type: 'chunk',
    fileName: 'assets/app-12345.js',
    name: 'app',
    isEntry: true,
    isDynamicEntry: false,
    isImplicitEntry: false,
    facadeModuleId: '/project/resources/js/app.js',
    moduleIds: ['/project/resources/js/app.js', '/project/resources/js/utils.js'],
    modules: {
      '/project/resources/js/app.js': { renderedLength: 100 } as any,
      '/project/resources/js/utils.js': { renderedLength: 50 } as any,
    },
    imports: [],
    dynamicImports: [],
    exports: [],
    implicitlyLoadedBefore: [],
    importedBindings: {},
    referencedFiles: [],
    ...overrides,
  };
}

describe('ChunkFilter', () => {
  it('allows standard JavaScript chunks', () => {
    const filter = new ChunkFilter();
    const chunk = makeMockChunk();
    const decision = filter.evaluate(chunk);
    expect(decision.shouldObfuscate).toBe(true);
  });

  it('rejects non-JavaScript chunks', () => {
    const filter = new ChunkFilter();
    const cssChunk = makeMockChunk({ fileName: 'assets/app-12345.css' });
    const decision = filter.evaluate(cssChunk);
    expect(decision.shouldObfuscate).toBe(false);
    expect(decision.reason).toBe('not a JavaScript chunk');
  });

  it('respects include glob patterns', () => {
    const filter = new ChunkFilter({ include: ['**/app-*.js'] });
    const appChunk = makeMockChunk({ fileName: 'assets/app-12345.js' });
    const otherChunk = makeMockChunk({ fileName: 'assets/other-12345.js' });

    expect(filter.evaluate(appChunk).shouldObfuscate).toBe(true);
    expect(filter.evaluate(otherChunk).shouldObfuscate).toBe(false);
  });

  it('respects exclude glob patterns', () => {
    const filter = new ChunkFilter({ exclude: ['**/legacy-*.js'] });
    const regularChunk = makeMockChunk({ fileName: 'assets/app-12345.js' });
    const legacyChunk = makeMockChunk({ fileName: 'assets/legacy-12345.js' });

    expect(filter.evaluate(regularChunk).shouldObfuscate).toBe(true);
    expect(filter.evaluate(legacyChunk).shouldObfuscate).toBe(false);
    expect(filter.evaluate(legacyChunk).reason).toBe('matched exclude pattern');
  });

  it('identifies and skips vendor chunks under "application" strategy', () => {
    const filter = new ChunkFilter({ obfuscateChunks: 'application' });

    // Vendor by filename
    const vendorByFilename = makeMockChunk({
      fileName: 'assets/vendor-abcde.js',
      moduleIds: ['/project/resources/js/app.js'],
      modules: { '/project/resources/js/app.js': {} as any },
    });
    expect(filter.evaluate(vendorByFilename).shouldObfuscate).toBe(false);
    expect(filter.evaluate(vendorByFilename).reason).toBe('vendor chunk');

    // Vendor by moduleIds (node_modules)
    const vendorByModules = makeMockChunk({
      fileName: 'assets/deps-12345.js',
      moduleIds: [
        '/project/node_modules/vue/dist/vue.esm.js',
        '/project/node_modules/axios/index.js',
      ],
      modules: {
        '/project/node_modules/vue/dist/vue.esm.js': {} as any,
        '/project/node_modules/axios/index.js': {} as any,
      },
    });
    expect(filter.evaluate(vendorByModules).shouldObfuscate).toBe(false);
    expect(filter.evaluate(vendorByModules).reason).toBe('vendor chunk');
  });

  it('allows vendor chunks when strategy is "all"', () => {
    const filter = new ChunkFilter({ obfuscateChunks: 'all' });
    const vendorChunk = makeMockChunk({
      fileName: 'assets/vendor-abcde.js',
      moduleIds: ['/project/node_modules/lodash/index.js'],
      modules: { '/project/node_modules/lodash/index.js': {} as any },
    });
    expect(filter.evaluate(vendorChunk).shouldObfuscate).toBe(true);
  });

  it('filters non-entry chunks when strategy is "entries"', () => {
    const filter = new ChunkFilter({ obfuscateChunks: 'entries' });
    const entryChunk = makeMockChunk({ isEntry: true, fileName: 'assets/entry.js' });
    const dynamicChunk = makeMockChunk({ isEntry: false, fileName: 'assets/chunk.js' });

    expect(filter.evaluate(entryChunk).shouldObfuscate).toBe(true);
    expect(filter.evaluate(dynamicChunk).shouldObfuscate).toBe(false);
    expect(filter.evaluate(dynamicChunk).reason).toBe('not an entry chunk');
  });

  it('supports custom predicate functions', () => {
    const filter = new ChunkFilter({
      obfuscateChunks: (chunk) => chunk.name === 'admin',
    });

    const adminChunk = makeMockChunk({ name: 'admin', fileName: 'assets/admin.js' });
    const appChunk = makeMockChunk({ name: 'app', fileName: 'assets/app.js' });

    expect(filter.evaluate(adminChunk).shouldObfuscate).toBe(true);
    expect(filter.evaluate(appChunk).shouldObfuscate).toBe(false);
  });
});
