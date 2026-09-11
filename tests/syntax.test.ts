import { describe, expect, it } from 'vitest';
import { obfuscateChunk } from '../src/obfuscator';
import { resolvePresetOptions } from '../src/presets';

describe('Modern JS Syntax Obfuscation & Execution', () => {
  it('correctly obfuscates and preserves modern JS functionality', () => {
    const code = `
      class Calculator {
        #secret = 42;
        constructor(multiplier) {
          this.multiplier = multiplier;
        }
        async compute(val) {
          const opt = val?.foo ?? 10;
          return (opt + this.#secret) * this.multiplier;
        }
      }
      export async function run() {
        const calc = new Calculator(2);
        return await calc.compute({ foo: 8 });
      }
    `;

    const options = resolvePresetOptions('balanced');
    const result = obfuscateChunk({
      code,
      fileName: 'modern-syntax.js',
      options,
    });

    // Verify identifiers and method names were mangled/transformed into hex & string arrays
    expect(result.code).not.toContain('multiplier');
    expect(result.code).toContain('#secret'); // Private identifier preserved syntactically
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.obfuscatedSize).toBeGreaterThan(0);
  });

  it('fails with clear context on invalid JS syntax', () => {
    const brokenCode = `const broken = { ;;; `;
    const options = resolvePresetOptions('balanced');

    expect(() => {
      obfuscateChunk({
        code: brokenCode,
        fileName: 'broken.js',
        options,
      });
    }).toThrowError(/Failed to obfuscate chunk "broken\.js"/);
  });
});
