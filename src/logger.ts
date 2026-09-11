import type { LogLevel } from './types';

export class Logger {
  private level: LogLevel;
  private headerPrinted = false;

  constructor(level: LogLevel = 'info') {
    this.level = level;
  }

  private printHeader(): void {
    if (!this.headerPrinted && this.level !== 'silent') {
      console.log('\x1b[36m\x1b[1m[tyro-obfuscator]\x1b[0m');
      this.headerPrinted = true;
    }
  }

  public obfuscated(fileName: string, originalBytes: number, obfuscatedBytes: number, durationMs: number): void {
    if (this.level === 'silent' || this.level === 'warn' || this.level === 'error') {
      return;
    }
    this.printHeader();
    const origKb = (originalBytes / 1024).toFixed(1);
    const obfKb = (obfuscatedBytes / 1024).toFixed(1);
    const delta = originalBytes > 0 ? `${(((obfuscatedBytes - originalBytes) / originalBytes) * 100).toFixed(0)}%` : '+0%';
    console.log(
      `  \x1b[32m✓\x1b[0m ${fileName} \x1b[90m(${origKb} kB -> ${obfKb} kB, +${delta}, ${durationMs}ms)\x1b[0m`,
    );
  }

  public skipped(fileName: string, reason: string): void {
    if (this.level === 'silent' || this.level === 'warn' || this.level === 'error') {
      return;
    }
    this.printHeader();
    console.log(`  \x1b[33m○\x1b[0m ${fileName} \x1b[90m(skipped: ${reason})\x1b[0m`);
  }

  public warn(message: string): void {
    if (this.level === 'silent' || this.level === 'error') {
      return;
    }
    this.printHeader();
    console.warn(`  \x1b[33m⚠ [tyro-obfuscator]\x1b[0m ${message}`);
  }

  public error(message: string): void {
    if (this.level === 'silent') {
      return;
    }
    this.printHeader();
    console.error(`  \x1b[31m✖ [tyro-obfuscator]\x1b[0m ${message}`);
  }
}
