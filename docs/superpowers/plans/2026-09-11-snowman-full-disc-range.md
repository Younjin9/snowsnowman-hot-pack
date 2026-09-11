# Snowman Full Disc Range Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the metal disc move continuously through the snowman's head, neck, and belly while showing exactly three black decorative buttons.

**Architecture:** Replace the single belly ellipse clamp with the union of a head ellipse, neck corridor, and belly ellipse. Project out-of-bounds input to the nearest valid region so pointer and tilt movement share one stable boundary. Derive freeze origins and region classes from the final clamped disc position.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- Keep production code in the existing standalone `index.html`.
- Preserve pointer drag, phone tilt, click activation, melting, accessibility, dark mode, and reduced motion.
- Display exactly three black buttons.
- Keep the metal disc within the visible snowman head, neck, or belly.
- Start the freeze in the region containing the metal disc.

---

### Task 1: Expand movement to the full snowman and add the third button

**Files:**
- Modify: `index.html`
- Modify: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: Existing `setDiscPosition(x, y)`, pointer movement, and tilt movement.
- Produces: `projectToEllipse(point, zone)`, `projectToRect(point, zone)`, `closestSnowmanPoint(x, y)`, and an expanded `clampDiscPosition(x, y)`.

- [ ] **Step 1: Add failing contracts for the full movement geometry and button count**

```js
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
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL because the union helpers and third button do not exist.

- [ ] **Step 3: Implement the combined snowman boundary**

Use normalized pack percentages:

```js
const headZone = { cx: 50, cy: 24, rx: 16, ry: 12 };
const neckZone = { left: 43, right: 57, top: 34, bottom: 45 };
const bellyZone = { cx: 50, cy: 66.5, rx: 25, ry: 23 };
```

Return the input unchanged when it is inside any zone. Otherwise project to each zone boundary and return the candidate with the shortest Euclidean distance to the input. Keep `clampDiscPosition(x, y)` as the shared entry point used by both pointer and tilt input.

- [ ] **Step 4: Move the metal disc start position and add the third black button**

```html
<span class="button-dot one"></span>
<span class="button-dot two"></span>
<span class="button-dot three"></span>
```

Place the black buttons at 50%, 57%, and 64%. Set the metal disc baseline and `discPosition` to `{ x: 50, y: 80 }`, below the third button. Update transform offset calculations to use 80 as the y baseline.

- [ ] **Step 5: Run all automated checks**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS with zero failures.

- [ ] **Step 6: Commit the movement and button update**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "feat: move disc across full snowman"
```

---

### Task 2: Start freezing from the disc's current region

**Files:**
- Modify: `index.html`
- Modify: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: Full-range `discPosition` from Task 1.
- Produces: `getDiscRegion(position) -> 'head' | 'neck' | 'belly'`; classes `freeze-from-head`, `freeze-from-neck`, and `freeze-from-belly`; CSS variables `--head-freeze-x`, `--head-freeze-y`, `--belly-freeze-x`, and `--belly-freeze-y`.

- [ ] **Step 1: Add a failing directional-freeze contract**

```js
test('selects the freeze sequence from the current disc region', () => {
  assert.match(html, /function\s+getDiscRegion\s*\(/);
  for (const name of ['freeze-from-head', 'freeze-from-neck', 'freeze-from-belly']) {
    assert.ok(html.includes(name), `missing ${name}`);
  }
  for (const token of ['--head-freeze-x', '--head-freeze-y', '--belly-freeze-x', '--belly-freeze-y']) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL because region-aware freeze sequencing does not exist.

- [ ] **Step 3: Derive local freeze origins from the clamped position**

In `setDiscPosition()`, convert the global disc point into both head-local and belly-local percentages. Clamp each local coordinate to `0-100` before assigning all four CSS variables.

```js
pack.style.setProperty('--head-freeze-x', `${headX}%`);
pack.style.setProperty('--head-freeze-y', `${headY}%`);
pack.style.setProperty('--belly-freeze-x', `${bellyX}%`);
pack.style.setProperty('--belly-freeze-y', `${bellyY}%`);
```

- [ ] **Step 4: Apply region-specific animation ordering**

Before adding `crystallizing`, remove all freeze origin classes and add `freeze-from-${getDiscRegion(discPosition)}`. Use these sequences:

- Head: head starts immediately, belly starts after 0.55s.
- Belly: belly starts immediately, head starts after 0.62s.
- Neck: both start immediately.

Remove all three origin classes in `resetPack()`.

- [ ] **Step 5: Run the complete test suite**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS with zero failures and valid inline JavaScript syntax.

- [ ] **Step 6: Commit the directional freeze update**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "feat: freeze from movable disc position"
```

---

### Task 3: Verify the combined experience

**Files:**
- Modify only if a defect is found: `index.html`
- Modify only if a fixed behavior needs regression coverage: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: Verified full-range movement, directional freezing, and three-button layout.

- [ ] **Step 1: Run the complete automated suite**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS with zero failures.

- [ ] **Step 2: Reload the local page and drag through all regions**

Expected: The metal disc moves continuously from belly through neck into the head and never leaves the snowman.

- [ ] **Step 3: Test freeze ordering from head, neck, and belly**

Expected: The region containing the metal disc turns white first and the other region follows.

- [ ] **Step 4: Inspect the three black buttons and all existing interactions**

Expected: Three black buttons are centered and evenly spaced; drag, tilt, click, and melt interactions remain available.
