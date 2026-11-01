/// <mls fileReference="_102036_/l2/lucideArtwork.test.ts" enhancement="_blank" />

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { LUCIDE_ARTWORK_VERSION, lucideArtwork } from './lucideArtwork.js';

const here = dirname(fileURLToPath(import.meta.url));

test('known Lucide name returns a drawing and an unknown name returns undefined', () => {
  const house = lucideArtwork('house');
  assert.equal(typeof house, 'string');
  assert.equal(house?.startsWith('<'), true);
  assert.equal(lucideArtwork('nao-existe'), undefined);
  assert.equal(LUCIDE_ARTWORK_VERSION, '1.62.0');
});

test('artwork body matches the 102035 file except the fileReference line', () => {
  const local = readFileSync(join(here, 'lucideArtwork.ts'), 'utf8').split('\n').slice(1).join('\n');
  const source = readFileSync(join(here, '../../mls-102035/l2/newRelease/widgets/lucideArtwork.ts'), 'utf8').split('\n').slice(1).join('\n');
  assert.equal(local, source);
});
