// Tyro Obfuscator Interactive Lab & Code Engine

document.addEventListener('DOMContentLoaded', () => {
  // Preset demo snippets
  const demos = {
    payment: {
      name: 'resources/js/checkout.js',
      clear: `export class PaymentEngine {
  #apiKey = "pk_live_920fa3894";

  async processCheckout(cart, token) {
    const payload = {
      cartId: cart?.id ?? null,
      amount: cart?.totalAmount,
      source: token,
      timestamp: Date.now()
    };

    const response = await fetch('/api/v1/charge', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.#apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  }
}`,
      presets: {
        light: `function _0x3b21(){const _0x1a=['cartId','amount','totalAmount','source','timestamp','/api/v1/charge','POST','Bearer\\x20','Authorization','Content-Type','application/json'];_0x3b21=function(){return _0x1a;};return _0x3b21();}export class PaymentEngine{#secret='pk_live_920fa3894';async processCheckout(_0x4e12,_0x3f9a){const _0x2c=_0x3b21();const _0x11={[_0x2c[0]]:_0x4e12?.id??null,[_0x2c[1]]:_0x4e12?.[_0x2c[2]],[_0x2c[3]]:_0x3f9a,[_0x2c[4]]:Date.now()};const _0x15=await fetch(_0x2c[5],{'method':_0x2c[6],'headers':{[_0x2c[8]]:_0x2c[7]+this.#secret,[_0x2c[9]]:_0x2c[10]},'body':JSON.stringify(_0x11)});return await _0x15.json();}}`,
        balanced: `const _0x5359=_0x4458;function _0x4458(){const _0x4603=['cGF5bG9hZA==','cGtfbGl2ZV85MjBmYTM4OTQ=','L2FwaS92MS9jaGFyZ2U=','UE9TVA==','QXV0aG9yaXphdGlvbg==','QmVhcmVyIA==','Q29udGVudC1UeXBl','YXBwbGljYXRpb24vanNvbg==','dG90YWxBbW91bnQ='];_0x4458=function(){return _0x4603;};return _0x4458();}(function(_0x1f,_0x2b){const _0x4c=_0x5359,_0x3a=_0x1f();while(!![]){try{const _0x1d=-parseInt(_0x4c(0x0))/0x1;if(_0x1d===_0x2b)break;else _0x3a['push'](_0x3a['shift']());}catch(_0xe){_0x3a['push'](_0x3a['shift']());}}}(_0x4458,0x1));export class PaymentEngine{#0x12a=atob(_0x5359(0x1));async['processCheckout'](_0x48e5,_0x2a1b){const _0x3e={'c':atob(_0x5359(0x2)),'m':atob(_0x5359(0x3))};const _0x5c={['cartId']:_0x48e5?.['id']??null,['amount']:_0x48e5?.[atob(_0x5359(0x8))],['source']:_0x2a1b,['timestamp']:Date['now']()};const _0x12=await fetch(_0x3e['c'],{'method':_0x3e['m'],'headers':{[atob(_0x5359(0x4))]:atob(_0x5359(0x5))+this.#0x12a,[atob(_0x5359(0x6))]:atob(_0x5359(0x7))},'body':JSON['stringify'](_0x5c)});return await _0x12['json']();}}`,
        aggressive: `(function(_0x5c1a,_0x3f22){const _0x2e=_0x42f0,_0x4a=_0x5c1a();while(!![]){try{const _0x12=parseInt(_0x2e(0x1a))/0x1*(parseInt(_0x2e(0x1b))/0x2)+-parseInt(_0x2e(0x1c))/0x3;if(_0x12===_0x3f22)break;else _0x4a['push'](_0x4a['shift']());}catch(_0x9){_0x4a['push'](_0x4a['shift']());}}}(_0x3f01,0x5241b));class PaymentEngine{#0x53e=function(){return'\\x70\\x6b\\x5f\\x6c\\x69\\x76\\x65\\x5f\\x39\\x32\\x30\\x66\\x61\\x33\\x38\\x39\\x34';}();async['\\x70\\x72\\x6f\\x63\\x65\\x73\\x73\\x43\\x68\\x65\\x63\\x6b\\x6f\\x75\\x74'](_0x1a82,_0x3d01){const _0x4f={'\\x70\\x61\\x79\\x6c\\x6f\\x61\\x64':{'\\x63\\x61\\x72\\x74\\x49\\x64':_0x1a82?.['\\x69\\x64']??null,'\\x61\\x6d\\x6f\\x75\\x6e\\x74':_0x1a82?.['\\x74\\x6f\\x74\\x61\\x6c\\x41\\x6d\\x6f\\x75\\x6e\\x74'],['\\x73\\x6f\\x75\\x72\\x63\\x65']:_0x3d01,['\\x74\\x69\\x6d\\x65\\x73\\x74\\x61\\x6d\\x70']:Date['\\x6e\\x6f\\x77']()}};const _0x27=await fetch('/\\x61\\x70\\x69/\\x76\\x31/\\x63\\x68\\x61\\x72\\x67\\x65',{'\\x6d\\x65\\x74\\x68\\x6f\\x64':'\\x50\\x4f\\x53\\x54','\\x68\\x65\\x61\\x64\\x65\\x72\\x73':{'\\x41\\x75\\x74\\x68\\x6f\\x72\\x69\\x7a\\x61\\x74\\x69\\x6f\\x6e':'\\x42\\x65\\x61\\x72\\x65\\x72\\x20'+this.#0x53e,'\\x43\\x6f\\x6e\\x74\\x65\\x6e\\x74\\x2d\\x54\\x79\\x70\\x65':'\\x61\\x70\\x70\\x6c\\x69\\x63\\x61\\x74\\x69\\x6f\\x6e/\\x6a\\x73\\x6f\\x6e'},'\\x62\\x6f\\x64\\x79':JSON['\\x73\\x74\\x72\\x69\\x6e\\x67\\x69\\x66\\x79'](_0x4f['\\x70\\x61\\x79\\x6c\\x6f\\x61\\x64'])});return await _0x27['\\x6a\\x73\\x6f\\x6e']();}}export{PaymentEngine};`
      },
      metrics: {
        light: { size: '448 B -> 512 B (+14%)', time: '18ms', entropy: '3.42 bits/byte' },
        balanced: { size: '448 B -> 786 B (+75%)', time: '42ms', entropy: '5.89 bits/byte' },
        aggressive: { size: '448 B -> 1.42 kB (+216%)', time: '112ms', entropy: '7.45 bits/byte' }
      }
    },
    player: {
      name: 'resources/js/player-guard.js',
      clear: `import { decryptStream } from './crypto.js';

export function initializeVideoGuard(videoElement, token) {
  if (window.__DEVTOOLS_OPEN__) {
    videoElement.remove();
    throw new Error("Debugger detected: playback aborted.");
  }

  videoElement.addEventListener('play', async () => {
    const stream = await fetch('/api/video/hls-key', {
      headers: { 'X-Playback-Token': token }
    });
    return decryptStream(stream);
  });
}`,
      presets: {
        light: `import{decryptStream as _0x2}from'./crypto.js';export function initializeVideoGuard(_0x1,_0x3){if(window['__DEVTOOLS_OPEN__']){_0x1['remove']();throw new Error('Debugger\\x20detected:\\x20playback\\x20aborted.');}_0x1['addEventListener']('play',async()=>{const _0x4=await fetch('/api/video/hls-key',{'headers':{'X-Playback-Token':_0x3}});return _0x2(_0x4);});}`,
        balanced: `import{decryptStream as _0x42f}from'./crypto.js';const _0x1a=['cmVtb3Zl','ZGV0ZWN0ZWQ=','YWRkRXZlbnRMaXN0ZW5lcg==','cGxheQ==','L2FwaS92aWRlby9obHMta2V5','WC1QbGF5YmFjay1Ub2tlbg=='];export function initializeVideoGuard(_0x3a,_0x1f){if(window['__DEVTOOLS_OPEN__']){_0x3a[atob(_0x1a[0])]();throw new Error('Playback restricted: debugger attached.');}_0x3a[atob(_0x1a[2])](atob(_0x1a[3]),async()=>{const _0x5b=await fetch(atob(_0x1a[4]),{'headers':{[atob(_0x1a[5])]:_0x1f}});return _0x42f(_0x5b);});}`,
        aggressive: `import{decryptStream as _0x3b}from'./crypto.js';(function(_0xa,_0xb){const _0xc=['\\x72\\x65\\x6d\\x6f\\x76\\x65','\\x70\\x6c\\x61\\x79','\\x61\\x64\\x64\\x45\\x76\\x65\\x6e\\x74\\x4c\\x69\\x73\\x74\\x65\\x6e\\x65\\x72','\\x2f\\x61\\x70\\x69\\x2f\\x76\\x69\\x64\\x65\\x6f\\x2f\\x68\\x6c\\x73\\x2d\\x6b\\x65\\x79'];export function initializeVideoGuard(_0x8,_0x9){const _0x1=window['\\x5f\\x5f\\x44\\x45\\x56\\x54\\x4f\\x4f\\x4c\\x53\\x5f\\x4f\\x50\\x45\\x4e\\x5f\\x5f'];if(!!_0x1){_0x8[_0xc[0]]();throw new Error('\\x41\\x63\\x63\\x65\\x73\\x73\\x20\\x44\\x65\\x6e\\x69\\x65\\x64');}_0x8[_0xc[2]](_0xc[1],async()=>{const _0x7=await fetch(_0xc[3],{'headers':{'\\x58\\x2d\\x50\\x6c\\x61\\x79\\x62\\x61\\x63\\x6b\\x2d\\x54\\x6f\\x6b\\x65\\x6e':_0x9}});return _0x3b(_0x7);});}})(this);`
      },
      metrics: {
        light: { size: '368 B -> 412 B (+12%)', time: '14ms', entropy: '3.38 bits/byte' },
        balanced: { size: '368 B -> 640 B (+74%)', time: '38ms', entropy: '5.92 bits/byte' },
        aggressive: { size: '368 B -> 1.18 kB (+220%)', time: '98ms', entropy: '7.60 bits/byte' }
      }
    }
  };

  let currentDemoKey = 'payment';
  let currentPreset = 'balanced';

  // DOM references
  const clearBox = document.getElementById('code-clear');
  const obfBox = document.getElementById('code-obfuscated');
  const metricSize = document.getElementById('metric-size');
  const metricTime = document.getElementById('metric-time');
  const metricEntropy = document.getElementById('metric-entropy');
  const runBtn = document.getElementById('run-btn');
  const presetPills = document.querySelectorAll('.preset-pill');

  function renderDemo() {
    const demo = demos[currentDemoKey];
    clearBox.textContent = demo.clear;
    obfBox.textContent = demo.presets[currentPreset];

    const m = demo.metrics[currentPreset];
    metricSize.textContent = m.size;
    metricTime.textContent = m.time;
    metricEntropy.textContent = m.entropy;
  }

  // Preset switching
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentPreset = pill.dataset.preset;
      renderDemo();
    });
  });

  // Re-run animation
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      runBtn.style.transform = 'scale(0.95)';
      obfBox.style.opacity = '0.3';
      setTimeout(() => {
        runBtn.style.transform = 'scale(1)';
        obfBox.style.opacity = '1';
        // Toggle demo between payment and player
        currentDemoKey = currentDemoKey === 'payment' ? 'player' : 'payment';
        renderDemo();
      }, 150);
    });
  }

  // Copy install command
  const installTrigger = document.getElementById('install-trigger');
  const copyBtn = document.getElementById('copy-btn');
  const copyLabel = document.getElementById('copy-label');
  const cmdText = document.getElementById('install-cmd')?.innerText;

  if (installTrigger && copyBtn && cmdText) {
    installTrigger.addEventListener('click', () => {
      navigator.clipboard.writeText(cmdText).then(() => {
        copyLabel.textContent = 'COPIED!';
        copyBtn.style.background = '#FFFFFF';
        copyBtn.style.color = '#000000';
        setTimeout(() => {
          copyLabel.textContent = 'COPY';
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }

  // Initial render
  renderDemo();
});
