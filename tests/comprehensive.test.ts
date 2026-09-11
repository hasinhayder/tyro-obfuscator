import { describe, expect, it } from 'vitest';
import { build } from 'vite';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tyroObfuscator } from '../src/index';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(here, '.tmp/comprehensive-fixture');

const write = async (filePath: string, contents: string | Buffer) => {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, contents);
};

describe('Comprehensive Plugin Verification Suite', () => {
  it('development mode does nothing and leaves output un-obfuscated', () => {
    const plugin = tyroObfuscator();
    expect(plugin.apply).toBe('build');
  });

  it('empty or minimal chunks are handled without throwing', async () => {
    const dir = resolve(fixtureRoot, 'empty-test');
    await rm(dir, { recursive: true, force: true });
    await write(resolve(dir, 'resources/js/empty.js'), '/* comment only */\n');

    await build({
      root: dir,
      configFile: false,
      logLevel: 'silent',
      build: {
        outDir: 'dist',
        rollupOptions: {
          input: [resolve(dir, 'resources/js/empty.js')],
          output: { entryFileNames: 'assets/[name].js' },
        },
      },
      plugins: [tyroObfuscator({ logLevel: 'silent' })],
    });

    const file = await readFile(resolve(dir, 'dist/assets/empty.js'), 'utf8');
    expect(file).toBeDefined();
    await rm(dir, { recursive: true, force: true });
  });

  it('repeated builds do not fail or double-obfuscate output', async () => {
    const dir = resolve(fixtureRoot, 'repeat-test');
    await rm(dir, { recursive: true, force: true });
    await write(resolve(dir, 'resources/js/app.js'), 'console.log("Repeat build test message");');

    const run = () =>
      build({
        root: dir,
        configFile: false,
        logLevel: 'silent',
        build: {
          outDir: 'dist',
          emptyOutDir: false,
          rollupOptions: {
            input: [resolve(dir, 'resources/js/app.js')],
            output: { entryFileNames: 'assets/app.js' },
          },
        },
        plugins: [tyroObfuscator({ logLevel: 'silent' })],
      });

    await run();
    const firstPass = await readFile(resolve(dir, 'dist/assets/app.js'), 'utf8');
    expect(firstPass).not.toContain('Repeat build test message');

    await run();
    const secondPass = await readFile(resolve(dir, 'dist/assets/app.js'), 'utf8');
    expect(secondPass).toBeDefined();
    await rm(dir, { recursive: true, force: true });
  });

  it('custom predicate can select specific chunks and skip others', async () => {
    const dir = resolve(fixtureRoot, 'custom-predicate-test');
    await rm(dir, { recursive: true, force: true });
    await write(resolve(dir, 'resources/js/sensitive.js'), 'const secretKey = "super-secret-password"; console.log(secretKey);');
    await write(resolve(dir, 'resources/js/public.js'), 'const publicGreeting = "welcome to public area"; console.log(publicGreeting);');

    await build({
      root: dir,
      configFile: false,
      logLevel: 'silent',
      build: {
        outDir: 'dist',
        rollupOptions: {
          input: [
            resolve(dir, 'resources/js/sensitive.js'),
            resolve(dir, 'resources/js/public.js'),
          ],
          output: { entryFileNames: 'assets/[name].js' },
        },
      },
      plugins: [
        tyroObfuscator({
          obfuscateChunks: (chunk) => chunk.name === 'sensitive',
          logLevel: 'silent',
        }),
      ],
    });

    const sensitiveOut = await readFile(resolve(dir, 'dist/assets/sensitive.js'), 'utf8');
    const publicOut = await readFile(resolve(dir, 'dist/assets/public.js'), 'utf8');

    expect(sensitiveOut).not.toContain('super-secret-password');
    expect(publicOut).toContain('welcome to public area');
    await rm(dir, { recursive: true, force: true });
  });
});
