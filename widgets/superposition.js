// 4.1 superposition: train the 5-features-into-2-dimensions toy in the browser and draw W.
// Maths in lab/superposition.js (tested in tools/tests/superposition.test.js).
(function () {
  var H = window.AIToolsWidgets, L = window.TASLab;
  if (!H || !L || !L.run) return;
  var $ = H.$, STOPS = [1, 0.5, 0.3, 0.1, 0.05, 0.03];
  H.register('superposition', function (el) {
    var p = 'sp' + H.uid(), cache = {};
    el.innerHTML = H.presets([['dense', 'Dense: every feature always on'], ['sparse', 'Sparse: each on 5% of the time']]) +
      '<div class="lab-ctl">' + H.slider(p + '-d', 'How often each feature is present (left dense, right sparse)', 0, STOPS.length - 1, 1, 0) + '</div>' +
      '<svg viewBox="0 0 360 176" role="img" aria-labelledby="' + p + '-sum"></svg>' +
      '<div class="statgrid">' + H.stat('features kept', p + '-k') + H.stat('features per dimension', p + '-r') + '</div>' + H.sum(p + '-sum');
    var d = $(el, p + '-d'), svg = el.querySelector('svg');
    function draw() {
      var dens = STOPS[+d.value], r = cache[dens] || (cache[dens] = L.run(dens));
      var label = dens === 1 ? 'every input' : Math.round(dens * 100) + '% of inputs';
      $(el, p + '-d-o').textContent = Math.round(dens * 100) + '%';
      d.setAttribute('aria-valuetext', 'each feature present on ' + label);
      $(el, p + '-k').textContent = r.kept + ' of 5';
      $(el, p + '-r').textContent = H.f2(r.kept / 2);
      var cx = 88, cy = 86, S = 58, s = '';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + S + '" class="ln-grid" fill="none"/>';
      s += '<line x1="' + (cx - S - 8) + '" y1="' + cy + '" x2="' + (cx + S + 8) + '" y2="' + cy + '" class="ln-grid"/>';
      s += '<line x1="' + cx + '" y1="' + (cy - S - 8) + '" x2="' + cx + '" y2="' + (cy + S + 8) + '" class="ln-grid"/>';
      s += H.t(cx, 172, 'the 2 hidden dimensions', 't-dim', 'text-anchor="middle"');
      for (var i = 0; i < 5; i++) {
        var kx = r.W[0][i], ky = r.W[1][i], on = r.norms[i] > 0.5, ex = cx + S * kx, ey = cy - S * ky;
        s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex + '" y2="' + ey + '" class="' + (on ? 'ln-def' : 'ln-dim') + '" stroke-width="2.5"/>';
        if (on) s += H.t(ex + (kx >= 0 ? 4 : -4), ey + (ky >= 0 ? -3 : 11), 'f' + (i + 1), 't-ink', 'text-anchor="' + (kx >= 0 ? 'start' : 'end') + '"');
        var y = 22 + i * 28;
        s += H.t(196, y + 10, 'f' + (i + 1), 't-mid');
        s += '<rect x="216" y="' + y + '" width="' + (84 * r.importance[i]) + '" height="5" rx="1" class="bar-dim"/>';
        s += '<rect x="216" y="' + (y + 8) + '" width="' + Math.max(1, 84 * Math.min(1.2, r.norms[i]) / 1.2) + '" height="7" rx="1" class="' + (on ? 'bar-def' : 'bar-off') + '"/>';
        s += H.t(306, y + 14, on ? 'kept' : 'dropped', on ? 't-ink' : 't-dim');
      }
      s += H.t(196, 12, 'thin: importance', 't-dim');
      s += H.t(196, 172, 'thick: length in W', 't-dim');
      svg.innerHTML = s;
      $(el, p + '-sum').textContent = 'With each feature present on ' + label + ', the trained model keeps ' + r.kept + ' of 5 features in 2 dimensions' +
        (r.kept > 2 ? ', so some directions must overlap: superposition.' : ', one per dimension, and drops the rest.');
    }
    function preset(n) { d.value = n === 'sparse' ? 4 : 0; draw(); }
    el.labPreset = preset;
    d.addEventListener('input', draw);
    el.querySelectorAll('.lab-pre button').forEach(function (bt) { bt.addEventListener('click', function () { preset(bt.getAttribute('data-p')); }); });
    draw();
  });
})();
