# Random Melt Outcomes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a replayable 30% success / 70% failure result to the confirmed melt action.

**Architecture:** Keep the standalone page architecture. Add small outcome and message-selection helpers beside the existing melt functions, then route the second confirmation click through them; failures restore the solid state while successes reuse the existing melt timer.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner

## Global Constraints

- Success probability is exactly 30%; failure probability is exactly 70%.
- A failure keeps the pack solid and returns the control to `녹이기` for retry.
- Consecutive failures never repeat the same message.
- Existing interaction and accessibility behavior remains intact.

---

### Task 1: Random outcome and failure feedback

**Files:**
- Modify: `index.html`
- Modify: `tests/snowman-hot-pack.test.mjs`

**Interfaces:**
- Consumes: existing `setState(nextState, message)`, `startMelting(seconds, message)`, `meltBtn`, and `pack`
- Produces: `chooseMeltOutcome(): 'success' | 'failure'`, `pickFailureMessage(): string`, and `showMeltFailure(): void`

- [x] **Step 1: Write the failing tests**

Add tests that execute the page script in a lightweight DOM harness with controlled random values. Assert that `chooseMeltOutcome()` maps values below `0.3` to success and values at or above `0.3` to failure, that repeated message selection produces distinct consecutive messages, and that `showMeltFailure()` preserves the frozen class while resetting the confirmation button after its feedback timeout.

- [x] **Step 2: Run tests to verify they fail**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: FAIL because the three new helper functions do not exist.

- [x] **Step 3: Write the minimal implementation**

Add the ten approved strings, retain the last failure index, select from all other indices, and route the second confirmed click through `chooseMeltOutcome()`. On success, start the existing randomized 4–10 second melt with a success announcement. On failure, disable the button briefly, apply the existing bump feedback, retain the solid state, then reset the button label and armed flag for retry.

- [x] **Step 4: Run tests to verify they pass**

Run: `node --test tests/snowman-hot-pack.test.mjs`

Expected: all tests PASS with no warnings.

- [x] **Step 5: Commit**

Stage only `index.html`, the test file, this plan, and its design spec. Commit with message `feat: add random melt outcomes`.
