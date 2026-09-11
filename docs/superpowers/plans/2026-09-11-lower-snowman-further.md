# Lower Snowman Further Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the snowman an additional 15–20px downward on portrait screens without changing its interactions.

**Architecture:** Update the existing responsive transform on `.pack-wrap` from `clamp(50px, 8dvh, 70px)` to `clamp(65px, 10dvh, 85px)`. Preserve the current short-landscape override and all JavaScript.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- Keep the melt interaction unchanged.
- Keep the metal disc stacking and movement unchanged.
- Use `clamp(65px, 10dvh, 85px)` on portrait screens.
- Keep `transform: none` in the short-landscape media query.

---

### Task 1: Increase the responsive downward offset

**Files:**
- Modify: `index.html`
- Modify: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: existing `.pack-wrap` transform and its short-landscape override
- Produces: portrait placement contract `translateY(clamp(65px, 10dvh, 85px))`

- [x] **Step 1: Update the test first**

Change the pack placement assertion to:

```js
assert.match(packWrap, /transform:\s*translateY\(clamp\(65px,\s*10dvh,\s*85px\)\)/);
```

- [x] **Step 2: Run the test and verify RED**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: one failure because production CSS still uses `clamp(50px, 8dvh, 70px)`.

- [x] **Step 3: Update the production CSS**

Change the base `.pack-wrap` transform in `index.html` to:

```css
transform: translateY(clamp(65px, 10dvh, 85px));
```

- [x] **Step 4: Run the full tests and verify GREEN**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: all 17 tests pass.

- [x] **Step 5: Commit, push, and verify production**

Run `git diff --check`, commit the implementation and this plan as `fix: lower snowman further`, push to `origin/main`, wait for Vercel Ready, and verify the production URL returns HTTP 200.
