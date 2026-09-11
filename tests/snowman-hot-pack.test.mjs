import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

function loadSnowman(randomValues = [.5]) {
  const listeners = new Map();
  const timeoutQueue = [];
  let randomIndex = 0;
  const makeElement = () => ({
    classList: {
      values: new Set(),
      add(...names) { names.forEach((name) => this.values.add(name)); },
      remove(...names) { names.forEach((name) => this.values.delete(name)); },
      contains(name) { return this.values.has(name); },
    },
    style: { setProperty() {} },
    dataset: {},
    textContent: '',
    disabled: false,
    addEventListener(type, handler) { listeners.set(`${this.id}:${type}`, handler); },
    getBoundingClientRect() { return { left: 0, top: 0, width: 100, height: 100 }; },
    replaceChildren() {},
    setPointerCapture() {},
    hasPointerCapture() { return false; },
    releasePointerCapture() {},
    appendChild() {},
    offsetWidth: 100,
  });
  const ids = Object.fromEntries(['pack', 'disc', 'meltBtn', 'tiltBtn', 'countdown', 'status'].map((id) => {
    const element = makeElement();
    element.id = id;
    return [id, element];
  }));
  const head = makeElement();
  const belly = makeElement();
  const crystalLayer = makeElement();
  const document = {
    getElementById: (id) => ids[id],
    querySelector: (selector) => selector === '.head' ? head : selector === '.belly' ? belly : crystalLayer,
    querySelectorAll: () => [crystalLayer],
    createElement: makeElement,
  };
  const window = {
    matchMedia: () => ({ matches: true }),
    addEventListener() {},
    removeEventListener() {},
  };
  const controlledMath = Object.create(Math);
  controlledMath.random = () => randomValues[Math.min(randomIndex++, randomValues.length - 1)];
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
  const exposedScript = script.replace(
    /\}\)\(\);\s*$/,
    'window.__snowman = { setState, chooseMeltOutcome, pickFailureMessage, showMeltFailure };})();',
  );
  const run = new Function('window', 'document', 'Math', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame', exposedScript);
  run(
    window,
    document,
    controlledMath,
    (callback) => { timeoutQueue.push(callback); return timeoutQueue.length; },
    () => {},
    () => 1,
    () => {},
    () => 1,
    () => {},
  );
  return { api: window.__snowman, ids, runTimeout: () => timeoutQueue.shift()?.() };
}

test('contains the standalone snowman controls and live status', () => {
  for (const id of ['pack', 'disc', 'status', 'countdown', 'meltBtn']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /aria-live=["']polite["']/);
  assert.match(html, /aria-label=["']핫팩 똑딱이 누르기["']/);
});

test('defines the approved warm product visual system', () => {
  for (const token of ['--cream:', '--vinyl:', '--red:', '--metal:']) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
  for (const selector of ['.seam', '.liquid-glow', '.hat-fold', '.scarf-fringe']) {
    assert.ok(html.includes(selector), `missing ${selector}`);
  }
});

test('implements every interaction state through named functions', () => {
  for (const name of [
    'setState',
    'prepareCrystals',
    'startCrystallization',
    'armMelt',
    'startMelting',
    'resetPack',
  ]) {
    assert.match(html, new RegExp(`function\\s+${name}\\s*\\(`));
  }
  for (const state of ['ready', 'crystallizing', 'solid', 'armed', 'melting']) {
    assert.ok(html.includes(`'${state}'`), `missing state ${state}`);
  }
});

test('keeps timing and motion accessibility requirements', () => {
  assert.match(html, /Math\.floor\(Math\.random\(\)\s*\*\s*7\)\s*\+\s*4/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(html, /:focus-visible/);
});

test('contains valid inline JavaScript syntax', () => {
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'missing inline script');
  assert.doesNotThrow(() => new Function(script));
});

test('separates the transparent liquid and opaque frozen states', () => {
  for (const selector of ['.freeze-fill', '.head-freeze', '.belly-freeze']) {
    assert.ok(html.includes(selector), `missing ${selector}`);
  }
  assert.match(html, /\.pack\.solid[\s\S]*?--frozen-opacity:\s*\.96/);
  assert.match(html, /@keyframes\s+freezeBloom/);
});

test('builds the hat from a crown behind the head and a brim above it', () => {
  assert.match(html, /class=["']hat-crown["']/);
  assert.match(html, /class=["']hat-brim["']/);
});

test('supports bounded pointer dragging with a six pixel activation threshold', () => {
  for (const name of ['clampDiscPosition', 'setDiscPosition', 'beginDiscDrag', 'moveDisc', 'endDiscDrag']) {
    assert.match(html, new RegExp(`function\\s+${name}\\s*\\(`));
  }
  assert.match(html, /setPointerCapture/);
  assert.match(html, /Math\.hypot[\s\S]*?<\s*6/);
});

test('requests orientation permission from a user gesture and keeps a fallback', () => {
  assert.match(html, /id=["']tiltBtn["']/);
  for (const name of ['requestTiltPermission', 'handleOrientation', 'startTiltLoop', 'stopTiltLoop']) {
    assert.match(html, new RegExp(`function\\s+${name}\\s*\\(`));
  }
  assert.match(html, /DeviceOrientationEvent\.requestPermission/);
  assert.match(html, /addEventListener\(["']deviceorientation["']/);
  assert.match(html, /기울기 센서를 사용할 수 없어요\. 똑딱이를 직접 움직여주세요/);
});

test('clamps movement to the union of head neck and belly regions', () => {
  for (const name of ['projectToEllipse', 'projectToRect', 'closestSnowmanPoint']) {
    assert.match(html, new RegExp(`function\\s+${name}\\s*\\(`));
  }
  assert.match(html, /const\s+headZone\s*=/);
  assert.match(html, /const\s+neckZone\s*=/);
  assert.match(html, /const\s+bellyZone\s*=/);
});

test('renders exactly three black decorative buttons', () => {
  const buttons = html.match(/<span class="button-dot (?:one|two|three)"><\/span>/g) ?? [];
  assert.equal(buttons.length, 3);
});

test('selects the freeze sequence from the current disc region', () => {
  assert.match(html, /function\s+getDiscRegion\s*\(/);
  for (const name of ['freeze-from-head', 'freeze-from-neck', 'freeze-from-belly']) {
    assert.ok(html.includes(name), `missing ${name}`);
  }
  for (const token of ['--head-freeze-x', '--head-freeze-y', '--belly-freeze-x', '--belly-freeze-y']) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
});

test('keeps the fitted beanie entirely in front of the head', () => {
  const crown = html.match(/\.hat-crown\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const brim = html.match(/\.hat-brim\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(crown, /z-index:\s*18/);
  assert.match(crown, /height:\s*18%/);
  assert.match(brim, /z-index:\s*20/);
  assert.match(brim, /width:\s*45%/);
});

test('resolves confirmed melting with a thirty percent success boundary', () => {
  assert.equal(loadSnowman([.299]).api.chooseMeltOutcome(), 'success');
  assert.equal(loadSnowman([.3]).api.chooseMeltOutcome(), 'failure');
});

test('does not repeat a failure message on consecutive attempts', () => {
  const { api } = loadSnowman([0, 0]);
  const first = api.pickFailureMessage();
  const second = api.pickFailureMessage();
  assert.notEqual(first, second);
});

test('failed melting stays frozen and resets the button for retry', () => {
  const { api, ids, runTimeout } = loadSnowman([0]);
  ids.pack.classList.add('solid');
  api.setState('armed', '한 번 더 누르면 녹이기 시작해요');
  api.showMeltFailure();

  assert.equal(ids.pack.classList.contains('solid'), true);
  assert.equal(ids.meltBtn.disabled, true);
  assert.notEqual(ids.status.textContent, '');

  runTimeout();
  assert.equal(ids.pack.dataset.state, 'solid');
  assert.equal(ids.meltBtn.disabled, false);
  assert.equal(ids.meltBtn.textContent, '녹이기');
});

test('embeds the disc below decorations and lowers the pack responsively', () => {
  const disc = html.match(/\.disc\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const packWrap = html.match(/\.pack-wrap\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const landscape = html.match(/@media\s*\(max-height:\s*480px\)[\s\S]*?(?=@media|<\/style>)/)?.[0] ?? '';
  assert.match(disc, /z-index:\s*4/);
  assert.match(packWrap, /transform:\s*translateY\(clamp\(50px,\s*8dvh,\s*70px\)\)/);
  assert.match(landscape, /\.pack-wrap[\s\S]*?transform:\s*none/);
});
