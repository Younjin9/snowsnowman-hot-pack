# Disc Depth and Pack Position Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place the movable metal snap visually inside the snowman and lower the product illustration responsively.

**Architecture:** Preserve the single-file page and existing DOM. Change only CSS stacking and the pack wrapper transform, leaving disc coordinates and JavaScript interactions unchanged.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- The movable disc remains one interactive element across the head, neck, and belly.
- The disc renders below the eyes, black buttons, and scarf.
- The pack moves down by a responsive 50–70px on portrait screens.
- Landscape screens at 480px height or less keep the current position.
- No dependencies or JavaScript behavior changes.

---

### Task 1: Embedded disc and responsive vertical placement

**Files:**
- Modify: `index.html`
- Modify: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: existing `.pack-wrap`, `.disc`, `.face`, `.button-dot`, `.scarf`, and landscape media query
- Produces: CSS stacking contract with `.disc { z-index: 4; }` and placement contract with `.pack-wrap { transform: translateY(clamp(50px, 8dvh, 70px)); }`

- [x] **Step 1: Write the failing test**

Add this behavior contract to `tests/snowman-hot-pack.test.mjs`:

```js
test('embeds the disc below decorations and lowers the pack responsively', () => {
  const disc = html.match(/\.disc\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const packWrap = html.match(/\.pack-wrap\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const landscape = html.match(/@media\s*\(max-height:\s*480px\)[\s\S]*?(?=@media|<\/style>)/)?.[0] ?? '';
  assert.match(disc, /z-index:\s*4/);
  assert.match(packWrap, /transform:\s*translateY\(clamp\(50px,\s*8dvh,\s*70px\)\)/);
  assert.match(landscape, /\.pack-wrap[\s\S]*?transform:\s*none/);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: the new test fails because the disc is currently `z-index: 25` and `.pack-wrap` has no vertical transform.

- [x] **Step 3: Write the minimal implementation**

In `index.html`, add `transform: translateY(clamp(50px, 8dvh, 70px));` to the base `.pack-wrap`, change `.disc` from `z-index: 25` to `z-index: 4`, and add `transform: none;` to `.pack-wrap` inside the short-landscape media query.

- [x] **Step 4: Run the tests to verify they pass**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: all tests pass with no failures.

- [x] **Step 5: Verify and commit**

Run `git diff --check`, then stage `index.html`, `tests/snowman-hot-pack.test.mjs`, and this plan. Commit with message `fix: embed disc and lower snowman`.

- [x] **Step 6: Push and verify deployment**

Push the current branch to `origin/main`, wait for Vercel to report the Git-triggered production deployment as Ready, and confirm `https://snowman-hot-pack.vercel.app` returns HTTP 200 with `<title>눈사람 핫팩</title>`.
