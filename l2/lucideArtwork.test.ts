/// <mls fileReference="_102036_/l2/lucideArtwork.test.ts" enhancement="_blank" />

import assert from 'node:assert/strict';
import test from 'node:test';
import { LUCIDE_ARTWORK_VERSION, lucideArtwork } from './lucideArtwork.js';

test('known Lucide name returns a drawing and an unknown name returns undefined', () => {
  const house = lucideArtwork('house');
  assert.equal(typeof house, 'string');
  assert.equal(house?.startsWith('<'), true);
  assert.equal(lucideArtwork('nao-existe'), undefined);
  assert.equal(LUCIDE_ARTWORK_VERSION, '1.62.0');
});
