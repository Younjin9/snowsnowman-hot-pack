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
