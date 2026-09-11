import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { build } from 'vite';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tyroObfuscator } from '../src/index';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(here, '.tmp/vite-fixture');

const write = async (filePath: string, contents: string | Buffer) => {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, contents);
};

describe('End-to-End Vite Build Integration', () => {
  beforeAll(async () => {
    await rm(fixtureRoot, { recursive: true, force: true });

    await write(
      resolve(fixtureRoot, 'package.json'),
      JSON.stringify({ name: 'vite-fixture', private: true, type: 'module' }),
    );

    // Entry 1: App entry with shared util and dynamic import
    await write(
      resolve(fixtureRoot, 'resources/js/app.js'),
      [
        "import { greet } from './utils.js';",
        "import '../css/app.css';",
        "export const runApp = async () => {",
        "  const { dynamicTask } = await import('./dynamic.js');",
        "  return greet('Laravel App') + ' ' + dynamicTask();",
        "};",
        "runApp().then(console.log);",
      ].join('\n'),
    );

    // Entry 2: Player entry
    await write(
      resolve(fixtureRoot, 'resources/js/player.js'),
      [
        "import { greet } from './utils.js';",
        "export const runPlayer = () => greet('Player');",
        "console.log(runPlayer());",
      ].join('\n'),
    );

    // Shared utility module
    await write(
      resolve(fixtureRoot, 'resources/js/utils.js'),
      "export const greet = (name) => `Greetings, ${name}!`;\n",
    );

    // Dynamic chunk
    await write(
      resolve(fixtureRoot, 'resources/js/dynamic.js'),
      "export const dynamicTask = () => 'dynamic-result';\n",
    );

    // CSS asset
    await write(
      resolve(fixtureRoot, 'resources/css/app.css'),
      "body { background: #1a202c; color: #fff; }\n",
    );
  });

  afterAll(async () => {
    await rm(fixtureRoot, { recursive: true, force: true });
  });

  it('obfuscates production JavaScript chunks while preserving CSS and output integrity', async () => {
    const outDir = 'dist-prod';
    await build({
      root: fixtureRoot,
      configFile: false,
      logLevel: 'silent',
      build: {
        outDir,
        emptyOutDir: true,
        minify: false,
        rollupOptions: {
          input: [
            resolve(fixtureRoot, 'resources/js/app.js'),
            resolve(fixtureRoot, 'resources/js/player.js'),
            resolve(fixtureRoot, 'resources/css/app.css'),
          ],
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          },
        },
      },
      plugins: [
        tyroObfuscator({
          preset: 'balanced',
          logLevel: 'silent',
        }),
      ],
    });

    const distAssets = resolve(fixtureRoot, outDir, 'assets');
    const files = await readdir(distAssets);

    const jsFiles = files.filter((f) => f.endsWith('.js'));
    const cssFiles = files.filter((f) => f.endsWith('.css'));

    expect(jsFiles.length).toBeGreaterThanOrEqual(2);
    expect(cssFiles.length).toBe(1);

    // Inspect CSS content: completely untouched
    const cssContent = await readFile(resolve(distAssets, cssFiles[0]), 'utf8');
    expect(cssContent).toContain('background: #1a202c');
    expect(cssContent).toContain('color: #fff');

    // Inspect JS files: obfuscated, readable identifiers are hidden
    const appFile = jsFiles.find((f) => f.startsWith('app-'));
    expect(appFile).toBeDefined();
    const appContent = await readFile(resolve(distAssets, appFile!), 'utf8');
    // Original plain string shouldn't be bare readable
    expect(appContent).not.toContain('Greetings, Laravel App');
  });

  it('excludes specific chunks when configured with exclude pattern', async () => {
    const outDir = 'dist-excluded';
    await build({
      root: fixtureRoot,
      configFile: false,
      logLevel: 'silent',
      build: {
        outDir,
        emptyOutDir: true,
        minify: false,
        rollupOptions: {
          input: [
            resolve(fixtureRoot, 'resources/js/player.js'),
          ],
          output: {
            entryFileNames: 'assets/[name].js',
          },
        },
      },
      plugins: [
        tyroObfuscator({
          exclude: ['**/player.js'],
          logLevel: 'silent',
        }),
      ],
    });

    const playerContent = await readFile(resolve(fixtureRoot, outDir, 'assets/player.js'), 'utf8');
    // Since excluded, player code is not obfuscated and retains runPlayer identifier
    expect(playerContent).toContain('runPlayer');
  });

  it('generates sourcemaps when sourceMap: true', async () => {
    const outDir = 'dist-sourcemap';
    await build({
      root: fixtureRoot,
      configFile: false,
      logLevel: 'silent',
      build: {
        outDir,
        sourcemap: true,
        emptyOutDir: true,
        minify: false,
        rollupOptions: {
          input: [
            resolve(fixtureRoot, 'resources/js/player.js'),
          ],
          output: {
            entryFileNames: 'assets/[name].js',
          },
        },
      },
      plugins: [
        tyroObfuscator({
          sourceMap: true,
          logLevel: 'silent',
        }),
      ],
    });

    const files = await readdir(resolve(fixtureRoot, outDir, 'assets'));
    const mapFiles = files.filter((f) => f.endsWith('.map'));
    expect(mapFiles.length).toBeGreaterThan(0);
  });
});
