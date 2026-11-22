const test = require('node:test');
const assert = require('node:assert');
const L = require('../../lab/rd-rate.js');

test('9x baseline at double the rate is 81x a year (unit3/ch3.html#four-thresholds-plain)', () => {
  assert.equal(L.perYear(9, 2), 81);
});
test('doubling the rate is two baseline-years per year', () => {
  assert.ok(Math.abs(L.baselineYears(9, 2) - 2) < 1e-12);
  assert.ok(Math.abs(L.baselineYears(4, 1.5) - 1.5) < 1e-12);
});
test('the ruled-out reading, twice as productive, gives 18x', () => {
  assert.equal(L.misread(9, 2), 18);
});
test('at the baseline rate nothing changes', () => {
  assert.equal(L.perYear(9, 1), 9);
  assert.equal(L.misread(9, 1), 9);
});
test('bad inputs give null, not NaN', () => {
  assert.equal(L.perYear(0, 2), null);
  assert.equal(L.misread(-1, 2), null);
  assert.equal(L.baselineYears(1, 2), null);
});
