# Tyro Obfuscator

[![Tests](https://github.com/hasinhayder/tyro-obfuscator/actions/workflows/ci.yml/badge.svg)](https://github.com/hasinhayder/tyro-obfuscator/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/tyro-obfuscator.svg?style=flat-square)](https://www.npmjs.com/package/tyro-obfuscator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Production-grade Vite plugin for selectively obfuscating client-side JavaScript chunks using the mature [`javascript-obfuscator`](https://github.com/javascript-obfuscator/javascript-obfuscator) engine, designed specifically with **Laravel + Vite** workflows in mind.

---

## Why Tyro Obfuscator?

- 🎯 **Designed for Laravel**: Works out of the box alongside `laravel-vite-plugin` without interfering with `@vite()` directives, asset manifests, or blade helpers.
- ⚡ **Zero Dev Overhead**: Runs exclusively during production builds (`apply: 'build'`). Your local development server remains lightning fast.
- 🧠 **Smart Chunk Selection**: Obfuscates your application code while automatically excluding third-party vendor libraries (`node_modules`), saving compilation time and bundle bloat.
- 🛡️ **Tuned Presets**: Choose between `light`, `balanced` (default), or `aggressive` without needing to master hundreds of compiler flags.
- 🔒 **Safe Lifecycle Execution**: Injects at Rollup's `renderChunk` hook so modern ES syntax, dynamic imports, and chunk graphs are preserved cleanly without breaking file hashes or sourcemaps.
- 🎨 **Asset Protection**: Completely ignores CSS, SVGs, images, fonts, and HTML manifests.

---

## Installation

```bash
npm install -D tyro-obfuscator
```

*Requires Vite `>= 5.0.0` and Node `>= 18.0.0`.*

---

## Quickstart (Laravel + Vite)

Add `tyroObfuscator()` to your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tyroObfuscator from 'tyro-obfuscator';

export default defineConfig({
    plugins: [
        laravel([
            'resources/css/app.css',
            'resources/js/app.js',
        ]),

        tyroObfuscator(),
    ],
});
```

Now run your production build:

```bash
npm run build
```

During the build, you will see a clean, informative status report:

```text
[tyro-obfuscator]
  ✓ assets/app-BA39d12a.js (42.1 kB -> 68.3 kB, +62%, 140ms)
  ✓ assets/player-C7f18a20.js (12.4 kB -> 21.0 kB, +69%, 45ms)
  ○ assets/vendor-D90e812a.js (skipped: vendor chunk)
```

---

## Before & After

### Before Obfuscation
```javascript
export class PaymentService {
  async process(token, amount) {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, amount, timestamp: Date.now() })
    });
    return response.json();
  }
}
```

### After Obfuscation (`preset: 'balanced'`)
```javascript
const _0x5359=_0x4458;function _0x4458(){const _0x4603=['mJCXotm2ofH2y','nvvUDMLlEa','mLDbAuLbrq','/api/checkout','application/json','POST'];...}
class PaymentService{async['process'](_0x1b2f,_0x4a7e){const _0x3b=_0x5359;const _0x52=await fetch(_0x3b(0x3),{'method':_0x3b(0x5),'headers':{'Content-Type':_0x3b(0x4)},'body':JSON['stringify']({'token':_0x1b2f,'amount':_0x4a7e,'timestamp':Date['now']()})});return _0x52['json']();}}
```

---

## Presets

Rather than requiring you to configure complex AST transforms, Tyro Obfuscator provides 3 curated presets:

| Preset | Bundle Size Impact | Build Time | Protection Level | Key Features |
| :--- | :---: | :---: | :---: | :--- |
| **`light`** | Minimal (+5-15%) | Fast | Moderate | Mangled identifiers, compact output, basic string array. |
| **`balanced`** *(Default)* | Moderate (+40-70%) | Normal | High | Hexadecimal identifiers, Base64 string encoding, string splitting, conservative control-flow flattening. |
| **`aggressive`** | Heavy (+100-250%) | Slow | Maximum | RC4 + Base64 string encryption, deep control-flow flattening, dead code injection, numbers to expressions. |

### Selecting a Preset

```js
tyroObfuscator({
    preset: 'light', // 'light' | 'balanced' | 'aggressive'
})
```

---

## Advanced Configuration

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tyroObfuscator from 'tyro-obfuscator';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.js', 'resources/js/admin.js'],
            refresh: true,
        }),

        tyroObfuscator({
            // 1. Preset level
            preset: 'balanced',

            // 2. Chunk targeting strategy
            // 'application' (default: skips vendor chunks)
            // 'all'         (obfuscates every JS chunk)
            // 'entries'     (only obfuscates entry chunks)
            // Function      (chunk) => boolean
            obfuscateChunks: 'application',

            // 3. Include / Exclude globs
            include: ['**/*.js', '**/*.mjs'],
            exclude: ['**/polyfills/**', '**/legacy-*.js'],

            // 4. Source map protection
            // false (default): Do NOT emit sourcemaps for obfuscated chunks in production
            // true: Generate aligned source maps
            sourceMap: false,

            // 5. Console logging
            // 'info' (default) | 'warn' | 'error' | 'silent'
            logLevel: 'info',

            // 6. Fail build on error
            failOnError: true,

            // 7. Deep overrides for javascript-obfuscator
            options: {
                controlFlowFlatteningThreshold: 0.5,
                stringArrayThreshold: 0.8,
            },
        }),
    ],
});
```

---

## Chunk Selection & Vendor Handling

Obfuscating large third-party libraries (like `lodash`, `axios`, `vue`, `react`, etc.) provides almost zero security benefit while multiplying build time and output size by 3x or 4x.

### Default (`obfuscateChunks: 'application'`)
The plugin inspects Rollup's chunk module graph. If a chunk consists primarily of modules originating from `node_modules/` or `vendor/`, it is automatically skipped.

### Custom Predicate
You can also supply your own chunk filter function:

```js
tyroObfuscator({
    obfuscateChunks: (chunk) => {
        // Only obfuscate your proprietary admin or checkout code
        return chunk.name === 'admin' || chunk.name === 'checkout';
    },
})
```

---

## Source Maps & Security

> [!CAUTION]
> **Source Map Disclosure Risk**:
> If you enable standard source maps in production, browsers and reverse-engineers can automatically download the `.map` file and inspect your un-obfuscated original source code!

By default, `tyroObfuscator` enforces `sourceMap: false` for all obfuscated chunks.

If you intentionally require production source maps (for instance, uploading to Sentry or Bugsnag before deleting them from your public directory):

```js
tyroObfuscator({
    sourceMap: true,
})
```

---

## Important Security Expectations

> [!IMPORTANT]
> **JavaScript Obfuscation is NOT Encryption or DRM.**
>
> 1. Any code delivered to a user's browser is inherently subject to execution, inspection, debugging, and tampering.
> 2. **Never store API keys, private credentials, database secrets, or sensitive business logic in client-side JavaScript.**
> 3. Obfuscation significantly raises the cost and complexity of decompilation, reverse-engineering, and casual code copying — but it does not make JavaScript impossible to analyze given sufficient time and determination.

---

## Development vs Production

- **`npm run dev`**: Vite runs an HMR dev server. `tyroObfuscator` is completely inactive (`apply: 'build'`).
- **`npm run build`**: Vite bundles your assets for distribution. `tyroObfuscator` hooks into `renderChunk`, obfuscates eligible assets, and emits production files.

---

## License

MIT License © 2026 [Hasin Hayder](https://github.com/hasinhayder)
