# Snowman Hot Pack Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, warm product-illustration version of the interactive snowman hot pack as a standalone HTML file.

**Architecture:** Keep the project dependency-free and place the illustration, stateful interaction, and responsive styling in one `index.html`, matching the supplied single-file format. Add a small Node-based contract test that validates required structure, accessibility hooks, state labels, and syntax; finish with visual and interaction checks in a real browser.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- Preserve the warm cream background, transparent vinyl material, soft shadow, and red winter accessories of direction A.
- Preserve the click → crystallize → melt interaction and the existing two-click melt confirmation.
- Keep the random melt duration at exactly 4–10 seconds.
- Do not add external images, fonts, libraries, or network dependencies.
- Support small mobile screens, visible keyboard focus, `aria-live` status updates, and reduced-motion preferences.

---

### Task 1: Establish the standalone artifact and visual contract

**Files:**
- Create: `index.html`
- Create: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: The original HTML supplied by the user and the approved design spec.
- Produces: `index.html` with stable element IDs `pack`, `disc`, `status`, `countdown`, and `meltBtn`; CSS state classes `crystallizing`, `solid`, and `melting`.

- [ ] **Step 1: Write the failing structure and visual-contract test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL with `ENOENT` because `index.html` does not exist.

- [ ] **Step 3: Create the polished static illustration shell**

Build `index.html` from the supplied document and keep this top-level structure:

```html
<main class="stage">
  <p class="eyebrow">REUSABLE POCKET WARMER</p>
  <section class="pack-wrap" aria-label="눈사람 모양 재사용 핫팩">
    <div class="pack" id="pack" data-state="ready">
      <div class="body">
        <div class="belly"><span class="seam"></span><span class="liquid-glow"></span></div>
        <div class="head"><span class="seam"></span><span class="liquid-glow"></span></div>
        <div class="hat"><span class="hat-fold"></span></div>
        <div class="scarf"><span class="scarf-fringe"></span></div>
        <button class="disc" id="disc" aria-label="핫팩 똑딱이 누르기"></button>
      </div>
    </div>
  </section>
  <p class="status" id="status" aria-live="polite">금속 똑딱이를 눌러 따뜻하게 해보세요</p>
  <div class="countdown" id="countdown" aria-live="polite"></div>
  <button class="melt-btn" id="meltBtn">녹이기</button>
</main>
```

Define these exact visual tokens and use layered gradients instead of external assets:

```css
:root {
  --cream: #f3ecdc;
  --cream-deep: #ded0b6;
  --ink: #24211d;
  --vinyl: rgba(244, 252, 251, .48);
  --vinyl-edge: rgba(255, 255, 255, .88);
  --red: #c94f45;
  --red-deep: #9f342f;
  --metal: #a9aaa5;
}

.head, .belly {
  background:
    linear-gradient(120deg, rgba(255,255,255,.66), transparent 24% 64%, rgba(171,203,204,.18)),
    var(--vinyl);
  box-shadow: inset 8px 8px 18px rgba(255,255,255,.65),
              inset -10px -14px 22px rgba(82,111,111,.10),
              0 0 0 2px rgba(150,151,143,.14);
}
```

Add asymmetric but restrained head/body radii, a softer connecting bridge, aligned facial features, dimensional hat/scarf layers, stitched vinyl seams, a grounded oval shadow, and a concentric brushed-metal disc. Ensure decorative elements have `pointer-events: none`.

- [ ] **Step 4: Run the contract test**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS for both tests.

- [ ] **Step 5: Commit the static visual shell**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "feat: polish snowman hot pack illustration"
```

---

### Task 2: Refine crystallization, melting, and accessible state feedback

**Files:**
- Modify: `index.html`
- Modify: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: IDs and state classes created in Task 1.
- Produces: `setState(nextState, message)`, `prepareCrystals()`, `startCrystallization()`, `armMelt()`, `startMelting(seconds)`, and `resetPack()` functions; `data-state` values `ready`, `crystallizing`, `solid`, `armed`, and `melting`.

- [ ] **Step 1: Extend the test with state and motion contracts**

```js
test('implements every interaction state through named functions', () => {
  for (const name of [
    'setState', 'prepareCrystals', 'startCrystallization',
    'armMelt', 'startMelting', 'resetPack'
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

test('contains valid inline JavaScript syntax', async () => {
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'missing inline script');
  assert.doesNotThrow(() => new Function(script));
});
```

- [ ] **Step 2: Run the extended test to verify it fails**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL because the named state functions and reduced-motion contract are incomplete.

- [ ] **Step 3: Implement the interaction state controller**

Use a single state setter for class, dataset, and live-region updates:

```js
function setState(nextState, message) {
  state = nextState;
  pack.dataset.state = nextState;
  status.textContent = message;
}

function resetPack() {
  clearInterval(meltTimer);
  meltTimer = null;
  meltArmed = false;
  pack.classList.remove('crystallizing', 'solid', 'melting', 'bump');
  document.querySelectorAll('.crystal-layer').forEach(layer => layer.replaceChildren());
  countdown.classList.remove('show');
  countdown.textContent = '';
  meltBtn.classList.remove('show');
  meltBtn.disabled = false;
  meltBtn.textContent = '녹이기';
  setState('ready', '금속 똑딱이를 눌러 따뜻하게 해보세요');
}
```

Keep crystal positions seeded from the disc area. Vary branch length, rotation, opacity, and animation delay so the pattern grows organically without changing the existing 2.35-second crystallization duration. Maintain the square-wave click sound, but reuse and close the audio context safely.

- [ ] **Step 4: Add keyboard focus and reduced-motion behavior**

```css
.disc:focus-visible, .melt-btn:focus-visible {
  outline: 3px solid var(--ink);
  outline-offset: 5px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

Use `setState()` messages for all transitions: crystallizing, ready-to-melt, confirmation armed, melting countdown, and reset.

- [ ] **Step 5: Run all automated checks**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS for every test with no syntax errors.

- [ ] **Step 6: Commit the interaction and accessibility refinement**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "feat: refine hot pack states and accessibility"
```

---

### Task 3: Verify the finished illustration in a real browser

**Files:**
- Modify only if verification finds a defect: `index.html`
- Modify only if a fixed defect needs a regression assertion: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: The complete standalone `index.html` from Tasks 1 and 2.
- Produces: A visually verified desktop/mobile artifact with the full interaction cycle confirmed.

- [ ] **Step 1: Open the local artifact at desktop size**

Open the absolute `index.html` path in a browser at approximately 1440 × 900.

Expected: The complete snowman, grounded shadow, status line, and interactive disc are visible without clipping; the lower button area remains clear.

- [ ] **Step 2: Verify the complete state cycle**

Perform: focus the disc with Tab → press Enter → wait for solid state → click `녹이기` → confirm label changes to `진짜 녹이기` → click again → wait for reset.

Expected: Focus is visible, crystals spread outward, status text describes each state, countdown remains visible, and the pack returns to a clean ready state with no duplicate crystals.

- [ ] **Step 3: Verify mobile and short-screen layouts**

Check at 390 × 844 and 844 × 390.

Expected: The snowman remains centered and entirely visible, the disc stays at least 44 × 44 CSS pixels, and status/countdown/buttons do not overlap the illustration.

- [ ] **Step 4: Verify reduced motion and console health**

Enable the browser's reduced-motion emulation and run one full cycle while monitoring the console.

Expected: State changes remain understandable without prolonged motion and the console contains no errors.

- [ ] **Step 5: Re-run automated checks after any visual fixes**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS for every test.

- [ ] **Step 6: Commit verification fixes if needed**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "fix: resolve snowman hot pack visual QA findings"
```

If no files changed during verification, do not create an empty commit.
