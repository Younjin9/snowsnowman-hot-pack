# Snowman Hat Layer Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the red knit beanie sit fully in front of the snowman's head without the head breaking through it.

**Architecture:** Keep the existing crown, pom, and brim markup. Correct only their geometry and stacking so the crown overlaps the head, the narrow brim hides the join, and the pom hangs from the crown's right edge.

**Tech Stack:** HTML5, CSS3, Node.js built-in test runner

## Global Constraints

- Preserve the red knit beanie design and existing markup.
- Place both crown and brim above the head layer.
- Keep the brim narrower than the head.
- Do not alter drag, tilt, crystallization, buttons, or melting behavior.

---

### Task 1: Correct beanie stacking and silhouette

**Files:**
- Modify: `index.html`
- Modify: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: `.head`, `.hat-crown`, `.hat-pom`, `.hat-brim`, and `.hat-fold`.
- Produces: A crown with z-index 18, a brim with z-index 20, crown height 18%, and brim width 45%.

- [ ] **Step 1: Add a failing hat geometry regression test**

```js
test('keeps the fitted beanie entirely in front of the head', () => {
  const crown = html.match(/\.hat-crown\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  const brim = html.match(/\.hat-brim\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(crown, /z-index:\s*18/);
  assert.match(crown, /height:\s*18%/);
  assert.match(brim, /z-index:\s*20/);
  assert.match(brim, /width:\s*45%/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL because the crown remains behind the head at z-index 4.

- [ ] **Step 3: Replace the flat crown geometry**

Set `.hat-crown` to `top: -2%`, `width: 43%`, `height: 18%`, `z-index: 18`, and a tall rounded silhouette. Use a restrained asymmetric `clip-path` so the upper-right side bends toward the pom while the lower edge fully overlaps the head.

```css
.hat-crown {
  top: -2%;
  width: 43%;
  height: 18%;
  z-index: 18;
  clip-path: polygon(9% 100%, 8% 70%, 17% 35%, 38% 9%, 61% 5%, 80% 22%, 94% 54%, 96% 100%);
}
```

- [ ] **Step 4: Fit the brim and pom to the crown**

Set `.hat-brim` to `top: 12.5%`, `width: 45%`, `height: 5.7%`, and `z-index: 20`. Place `.hat-pom` at `left: 78%`, `top: 16%`, reduce it to 24% of crown width, and add a slight clockwise rotation so it touches the crown instead of floating above it.

- [ ] **Step 5: Run the complete suite**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: PASS with zero failures and valid inline JavaScript syntax.

- [ ] **Step 6: Commit the fix**

```bash
git add index.html tests/snowman-hot-pack.test.mjs
git commit -m "fix: place beanie in front of snowman head"
```
