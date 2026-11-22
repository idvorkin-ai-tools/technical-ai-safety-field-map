// 4.1 superposition: a tiny version of the toy model in Toy Models of Superposition
// (Elhage et al. 2022), as the page describes it (unit4/ch1.html#superposition-neuron-wrong):
// 5 features squeezed into 2 dimensions, x' = ReLU(W^T W x + b), loss weighted by importance.
// Dense features: the model keeps the 2 most important and drops the rest.
// Sparse features: it keeps all 5 in overlapping directions.
(function (root) {
  var N = 5, M = 2;
  function rng(seed) { // mulberry32: same seed, same run, so the widget and the test agree
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // density: chance each feature is non-zero on an input (1 = dense, 0.05 = sparse).
  function train(density, opt) {
    opt = opt || {};
    var steps = opt.steps || 4000, batch = opt.batch || 128, lr = opt.lr || 0.01, decay = opt.decay || 0.9;
    var r = rng(opt.seed || 7), I = [], W = [[], []], b = [], i, a;
    for (i = 0; i < N; i++) { I.push(Math.pow(decay, i)); b.push(0); for (a = 0; a < M; a++) W[a].push((r() - 0.5) * 0.6); }
    var mW = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], vW = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], mb = [0, 0, 0, 0, 0], vb = [0, 0, 0, 0, 0];
    var x = [], h = [0, 0], g = [], gW = [[], []], gb = [], loss = 0;
    for (var s = 1; s <= steps; s++) {
      for (a = 0; a < M; a++) for (i = 0; i < N; i++) gW[a][i] = 0;
      for (i = 0; i < N; i++) gb[i] = 0;
      loss = 0;
      for (var n = 0; n < batch; n++) {
        for (i = 0; i < N; i++) x[i] = r() < density ? r() : 0;
        for (a = 0; a < M; a++) { h[a] = 0; for (i = 0; i < N; i++) h[a] += W[a][i] * x[i]; }
        for (i = 0; i < N; i++) {
          var y = b[i]; for (a = 0; a < M; a++) y += W[a][i] * h[a];
          var e = (y > 0 ? y : 0) - x[i];
          loss += I[i] * e * e;
          g[i] = y > 0 ? 2 * I[i] * e : 0;
        }
        // y = W^T W x + b  =>  dL/dW[a][k] = g[k] h[a] + x[k] (W g)[a]
        for (a = 0; a < M; a++) {
          var Wg = 0; for (i = 0; i < N; i++) Wg += W[a][i] * g[i];
          for (i = 0; i < N; i++) gW[a][i] += g[i] * h[a] + x[i] * Wg;
        }
        for (i = 0; i < N; i++) gb[i] += g[i];
      }
      var c1 = 1 - Math.pow(0.9, s), c2 = 1 - Math.pow(0.999, s);
      function adam(p, gr, m, v, j) {
        gr /= batch; m[j] = 0.9 * m[j] + 0.1 * gr; v[j] = 0.999 * v[j] + 0.001 * gr * gr;
        p[j] -= lr * (m[j] / c1) / (Math.sqrt(v[j] / c2) + 1e-8);
      }
      for (a = 0; a < M; a++) for (i = 0; i < N; i++) adam(W[a], gW[a][i], mW[a], vW[a], i);
      for (i = 0; i < N; i++) adam(b, gb[i], mb, vb, i);
    }
    var norms = [], kept = 0;
    for (i = 0; i < N; i++) { norms.push(Math.hypot(W[0][i], W[1][i])); if (norms[i] > 0.5) kept++; }
    return { W: W, b: b, importance: I, norms: norms, kept: kept, loss: loss / batch };
  }
  // train(density) for the widget's six stops, rounded to 3 decimals, so the page draws without
  // training on load; tools/tests/superposition.test.js checks train() still reproduces them.
  var PRE = {
    '1': [[-0.621,0.781,0.031,-0.041,-0.015],[-0.78,-0.618,0.026,0.009,0.004]],
    '0.5': [[-0.869,0.863,0.474,0.028,-0.433],[-0.483,0.426,-0.878,0.013,0.818]],
    '0.3': [[-0.85,0.848,-0.009,0.561,-0.544],[-0.564,0.549,-0.013,-0.848,0.835]],
    '0.1': [[-1.088,0.757,0.986,-0.13,-0.509],[-0.219,0.828,-0.474,-1.08,0.97]],
    '0.05': [[-1.142,0.774,1.002,-0.19,-0.471],[-0.155,0.82,-0.506,-1.106,0.99]],
    '0.03': [[-1.137,0.834,0.989,-0.22,-0.461],[-0.132,0.762,-0.562,-1.137,1.022]]
  };
  function fromTable(W) {
    var norms = [], kept = 0, importance = [];
    for (var i = 0; i < N; i++) { importance.push(Math.pow(0.9, i)); norms.push(Math.hypot(W[0][i], W[1][i])); if (norms[i] > 0.5) kept++; }
    return { W: W, importance: importance, norms: norms, kept: kept };
  }
  function run(density) { return PRE[String(density)] ? fromTable(PRE[String(density)]) : train(density); }
  var api = { train: train, run: run, PRE: PRE, N: N, M: M };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TASLab = Object.assign(root.TASLab || {}, api);
})(this);
