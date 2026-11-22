// 3.3 Automated R&D threshold: compounding vs the "twice as productive" misreading.
// Maths in lab/rd-rate.js (tested in tools/tests/rd-rate.test.js).
(function () {
  var H = window.AIToolsWidgets, L = window.TASLab;
  if (!H || !L || !L.perYear) return;
  var $ = H.$, TIMES = '×';
  function x(v) { return v < 10 ? v.toFixed(1).replace(/[.]0$/, '') : Math.round(v).toLocaleString('en-US'); }
  H.register('rd-rate', function (el) {
    var p = 'rd' + H.uid();
    el.innerHTML = H.presets([['foot', 'Footnote example: 9' + TIMES + ', rate doubled'], ['base', 'Baseline rate']]) +
      '<div class="lab-ctl">' +
      H.slider(p + '-b', 'Baseline effective scale-up per year (' + TIMES + ')', 2, 20, 1, 9) +
      H.slider(p + '-k', 'Rate of progress, as a multiple of the historical rate', 1, 3, 0.25, 2) + '</div>' +
      '<svg viewBox="0 0 360 132" role="img" aria-labelledby="' + p + '-sum"></svg>' +
      '<div class="statgrid">' + H.stat('per year at this rate', p + '-a') + H.stat('baseline years per year', p + '-y') +
      H.stat('the misreading', p + '-m') + '</div>' + H.sum(p + '-sum');
    var b = $(el, p + '-b'), k = $(el, p + '-k'), svg = el.querySelector('svg');
    function draw() {
      var B = +b.value, K = +k.value, A = L.perYear(B, K), M = L.misread(B, K);
      $(el, p + '-b-o').textContent = B + TIMES;
      $(el, p + '-k-o').textContent = K + TIMES;
      b.setAttribute('aria-valuetext', B + ' times per year');
      k.setAttribute('aria-valuetext', K + ' times the historical rate');
      $(el, p + '-a').textContent = x(A) + TIMES;
      $(el, p + '-y').textContent = String(K);
      $(el, p + '-m').textContent = x(M) + TIMES;
      // log10 axis from 1x to 10,000x
      var X = function (v) { return 92 + 250 * Math.log(v) / Math.log(10000); }, s = '';
      [1, 10, 100, 1000, 10000].forEach(function (v) {
        s += '<line x1="' + X(v) + '" y1="8" x2="' + X(v) + '" y2="100" class="ln-grid"/>';
        s += H.t(X(v), 114, (v >= 1000 ? v / 1000 + 'k' : v) + TIMES, 't-dim', 'text-anchor="middle"');
      });
      [['baseline', B, 'bar-dim'], ['misreading', M, 'bar-off'], ['compounded', A, 'bar-def']].forEach(function (r, i) {
        var y = 14 + i * 30;
        s += H.t(86, y + 13, r[0], 't-mid', 'text-anchor="end"');
        s += '<rect x="' + X(1) + '" y="' + y + '" width="' + Math.max(1, X(r[1]) - X(1)) + '" height="18" rx="2" class="' + r[2] + '"/>';
        s += H.t(Math.min(X(r[1]) + 4, 326), y + 13, x(r[1]) + TIMES, 't-ink');
      });
      s += H.t(217, 129, 'effective scale-up per year, log scale', 't-dim', 'text-anchor="middle"');
      svg.innerHTML = s;
      $(el, p + '-sum').textContent = 'At ' + K + ' times the historical rate, one year holds ' + K + ' baseline years of progress, so a ' + B +
        TIMES + ' baseline year becomes ' + x(A) + TIMES + ', not the ' + x(M) + TIMES + ' you get by multiplying.';
    }
    function preset(n) { b.value = 9; k.value = n === 'foot' ? 2 : 1; draw(); }
    el.labPreset = preset;
    b.addEventListener('input', draw); k.addEventListener('input', draw);
    el.querySelectorAll('.lab-pre button').forEach(function (bt) { bt.addEventListener('click', function () { preset(bt.getAttribute('data-p')); }); });
    draw();
  });
})();
