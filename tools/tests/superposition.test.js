const test = require('node:test');
const assert = require('node:assert');
const L = require('../../lab/superposition.js');

// unit4/ch1.html#superposition-neuron-wrong: "switch strategies as sparsity rises, from 'represent a few
// features cleanly and discard the rest' to 'represent all of them in overlapping directions'".
test('dense features: 2 kept in 2 dimensions, the 2 most important', () => {
  const r = L.train(1);
  assert.equal(r.kept, 2);
  assert.ok(r.norms[0] > 0.9 && r.norms[1] > 0.9 && r.norms[4] < 0.2);
});
test('sparse features: all 5 kept in 2 dimensions', () => {
  assert.equal(L.train(0.05).kept, 5);
  assert.equal(L.train(0.03).kept, 5);
});
test('features kept never falls as features get sparser (the widget stops)', () => {
  let prev = 0;
  for (const d of [1, 0.5, 0.3, 0.1, 0.05, 0.03]) { const k = L.train(d).kept; assert.ok(k >= prev, d + ': ' + k + ' < ' + prev); prev = k; }
});
test('same seed, same run', () => {
  assert.deepEqual(L.train(0.1).W, L.train(0.1).W);
});
