# Snowman Hot Pack State and Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make liquid and crystallized states visually distinct, grow the white freeze from the movable metal disc, support disc drag and phone tilt, and refit the hat to the head.

**Architecture:** Preserve the dependency-free single `index.html`. CSS owns liquid transparency, white freeze layers, hat layering, and GPU-friendly transitions; vanilla JavaScript owns a shared normalized disc position, pointer input, orientation permission, tilt smoothing, and state transitions. Extend the existing Node contract test and finish with direct browser checks.

**Tech Stack:** HTML5, CSS3, Pointer Events, Device Orientation API, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- Keep all production code in `index.html` with no external images, fonts, libraries, or network dependencies.
- Treat movement under 6px as a crystallization click and movement of 6px or more as a drag.
- Keep the disc inside the belly safe area.
- Start the freeze from the current disc position and finish with a nearly opaque white fill.
- Keep drag available when orientation permission is denied or unsupported.
- Preserve dark mode, reduced motion, the two-click melt confirmation, and the exact 4-10 second melt duration.

---

### Task 1: Separate liquid and crystallized visual states and refit the hat

**Files:**
- Modify: `index.html:8-594`
- Modify: `index.html:597-636`
- Test: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: Existing `.head`, `.belly`, `.pack.crystallizing`, `.pack.solid`, and `.pack.melting` states.
- Produces: `.freeze-fill`, `.head-freeze`, `.belly-freeze`, `.hat-crown`, `.hat-brim`, and CSS variables `--freeze-x`, `--freeze-y`.

- [ ] **Step 1: Add a failing visual-state contract test**

```js
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
```

- [ ] **Step 2: Run the test and verify the new assertions fail**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL because freeze layers and split hat elements do not exist.

- [ ] **Step 3: Add transparent liquid surfaces and freeze layers**

Add a freeze layer inside both sealed shapes:

```html
<div class="belly">
  <span class="freeze-fill belly-freeze"></span>
  <!-- existing decorative layers -->
</div>
<div class="head">
  <span class="freeze-fill head-freeze"></span>
  <!-- existing decorative layers -->
</div>
```

Use the current disc coordinates for the belly origin and a bottom-center origin for the head. Keep the ready surface transparent and make the completed state nearly opaque:

```css
.pack { --freeze-x: 50%; --freeze-y: 72%; --frozen-opacity: 0; }
.head, .belly { background-color: rgba(224, 241, 240, .08); }
.freeze-fill {
  position: absolute;
  width: 210%;
  aspect-ratio: 1;
  left: var(--origin-x);
  top: var(--origin-y);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.98) 0 38%, rgba(247,251,250,.9) 58%, rgba(236,246,245,.32) 76%, transparent 78%);
  opacity: 0;
  transform: translate(-50%, -50%) scale(.02);
  pointer-events: none;
}
.belly-freeze { --origin-x: var(--freeze-x); --origin-y: var(--freeze-y); }
.head-freeze { --origin-x: 50%; --origin-y: 108%; }
.pack.crystallizing .freeze-fill { animation: freezeBloom 2.35s cubic-bezier(.16,.76,.24,1) forwards; }
.pack.solid { --frozen-opacity: .96; }
.pack.solid .freeze-fill { opacity: var(--frozen-opacity); transform: translate(-50%, -50%) scale(1); }
```

Sequence the head fill after the belly using `animation-delay`, retain delayed crystal growth, and reverse both fill and crystal opacity during melting.

- [ ] **Step 4: Replace the floating hat with layered crown and brim markup**

```html
<div class="hat-crown"><span class="hat-pom"></span></div>
<div class="hat-brim"><span class="hat-knit"></span></div>
```

Place `.hat-crown` behind the head with a lower z-index, make its lower curve overlap the head by 2-3%, and place `.hat-brim` above the forehead with a shallow curved lower edge. Preserve the current red palette and use one highlight and one shadow per layer.

- [ ] **Step 5: Run all automated checks**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS with the new state and hat tests included.

- [ ] **Step 6: Commit the visual state work**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "feat: distinguish liquid and frozen hot pack states"
```

---

### Task 2: Make the metal disc draggable without accidental activation

**Files:**
- Modify: `index.html:347-389`
- Modify: `index.html:638-786`
- Test: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: `startCrystallization()`, `state`, `.belly`, and the shared CSS variables from Task 1.
- Produces: `clampDiscPosition(x, y) -> { x, y }`, `setDiscPosition(x, y)`, `beginDiscDrag(event)`, `moveDisc(event)`, and `endDiscDrag(event)`; normalized `discPosition` percentages.

- [ ] **Step 1: Add a failing movement contract test**

```js
test('supports bounded pointer dragging with a six pixel activation threshold', () => {
  for (const name of ['clampDiscPosition', 'setDiscPosition', 'beginDiscDrag', 'moveDisc', 'endDiscDrag']) {
    assert.match(html, new RegExp(`function\\s+${name}\\s*\\(`));
  }
  assert.match(html, /setPointerCapture/);
  assert.match(html, /Math\.hypot[\s\S]*?<\s*6/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL because pointer movement functions do not exist.

- [ ] **Step 3: Switch disc positioning to CSS variables**

```css
.pack { --disc-x: 50%; --disc-y: 72%; --disc-dx: 0px; --disc-dy: 0px; }
.disc {
  left: 50%;
  top: 72%;
  transform: translate(-50%, -50%) translate(var(--disc-dx), var(--disc-dy));
  touch-action: none;
  will-change: transform;
}
```

Convert normalized x/y into pixel offsets relative to the pack rectangle for `--disc-dx` and `--disc-dy`. Update `--freeze-x` and `--freeze-y` from the same normalized values before crystallization begins.

- [ ] **Step 4: Implement bounded pointer movement**

Use the belly rectangle as the coordinate frame. Clamp x to 28-72% and y to 57-84%, then apply an ellipse check so diagonal positions remain inside the visible belly:

```js
function clampDiscPosition(x, y) {
  const dx = (x - 50) / 22;
  const dy = (y - 70.5) / 13.5;
  const distance = Math.hypot(dx, dy);
  if (distance <= 1) return { x, y };
  return { x: 50 + (dx / distance) * 22, y: 70.5 + (dy / distance) * 13.5 };
}
```

On pointer down, record the start point and capture the pointer. On move, update the disc only while `state === 'ready'`. On pointer up, compare the pointer travel with 6px; call `startCrystallization()` only below the threshold.

- [ ] **Step 5: Run all automated checks**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS with movement contracts included.

- [ ] **Step 6: Commit the pointer movement**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "feat: make hot pack disc draggable"
```

---

### Task 3: Add opt-in phone tilt with safe fallback

**Files:**
- Modify: `index.html:497-593`
- Modify: `index.html:597-636`
- Modify: `index.html:638-786`
- Test: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: `setDiscPosition(x, y)`, `clampDiscPosition(x, y)`, `setState(nextState, message)`, and `discPosition` from Task 2.
- Produces: button ID `tiltBtn`; `requestTiltPermission()`, `handleOrientation(event)`, `startTiltLoop()`, and `stopTiltLoop()`.

- [ ] **Step 1: Add a failing sensor and fallback contract test**

```js
test('requests orientation permission from a user gesture and keeps a fallback', () => {
  assert.match(html, /id=["']tiltBtn["']/);
  for (const name of ['requestTiltPermission', 'handleOrientation', 'startTiltLoop', 'stopTiltLoop']) {
    assert.match(html, new RegExp(`function\\s+${name}\\s*\\(`));
  }
  assert.match(html, /DeviceOrientationEvent\.requestPermission/);
  assert.match(html, /addEventListener\(["']deviceorientation["']/);
  assert.match(html, /기울기 센서를 사용할 수 없어요\. 똑딱이를 직접 움직여주세요/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL because no tilt button or orientation handlers exist.

- [ ] **Step 3: Add the opt-in tilt control**

```html
<button class="tilt-btn" id="tiltBtn" type="button">기울기 켜기</button>
```

Show the control on coarse-pointer devices and keep it keyboard accessible. While requesting permission, disable the button and display `기울기 센서 권한을 확인하고 있어요`. On success, change the label to `기울기 끄기`; on denial or unsupported browsers, hide or disable the control and keep drag active.

- [ ] **Step 4: Implement permission and smoothed movement**

```js
async function requestTiltPermission() {
  const Orientation = window.DeviceOrientationEvent;
  if (!Orientation) return showTiltFallback();
  if (typeof Orientation.requestPermission === 'function') {
    const result = await Orientation.requestPermission();
    if (result !== 'granted') return showTiltFallback();
  }
  window.addEventListener('deviceorientation', handleOrientation, { passive: true });
  startTiltLoop();
}
```

Map `gamma` to x and `beta` to y, clamped to `[-30, 30]`. Convert to target percentages inside the same ellipse used by pointer dragging. In one `requestAnimationFrame` loop, move 14% of the remaining distance per frame; use immediate positioning under reduced motion. Stop the loop and remove the orientation listener when toggled off or on page hide.

- [ ] **Step 5: Run all automated checks and syntax validation**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS for all tests with no inline JavaScript syntax error.

- [ ] **Step 6: Commit the tilt support**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "feat: move hot pack disc with phone tilt"
```

---

### Task 4: Verify the full experience

**Files:**
- Modify only if a defect is found: `index.html`
- Modify only when a fixed behavior needs regression coverage: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: The complete `index.html` from Tasks 1-3.
- Produces: A verified ready, drag, tilt, freeze, solid, and melt flow.

- [ ] **Step 1: Run the complete automated suite**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS with zero failures.

- [ ] **Step 2: Check desktop ready and frozen states**

Open `index.html`, reload once, drag the disc, then click it without moving.

Expected: Ready state is visibly transparent; white fill begins at the moved disc; crystals and opacity spread outward; solid state is nearly white.

- [ ] **Step 3: Check pointer boundaries and activation threshold**

Drag toward every belly edge and release after a long move, then perform a short click.

Expected: The disc stays inside the belly, drag does not freeze the pack, and a short click does.

- [ ] **Step 4: Check phone tilt and fallback**

On a supported phone, tap `기울기 켜기`, allow permission, and tilt in four directions. Repeat once with permission denied or on an unsupported browser.

Expected: Allowed tilt moves smoothly within bounds; denied or unsupported tilt shows the fallback message and pointer drag remains available.

- [ ] **Step 5: Check hat, responsive layouts, and melt reset**

Inspect desktop, 390 × 844 portrait, and 844 × 390 landscape. Complete the two-click melt flow.

Expected: The crown stays behind the head, the brim hugs the forehead, controls do not overlap, and melting returns the fill and crystals to the transparent ready state.

- [ ] **Step 6: Re-run automated checks after any fixes**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS with zero failures.
