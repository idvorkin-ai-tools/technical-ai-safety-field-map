// 3.3 automated R&D threshold: what "double the historical rate of progress" means.
// RSP v3.4 footnote, as printed on unit3/ch3.html#four-thresholds-plain: doubling the rate is
// "as much progress in one year as two years at baseline", so a 9x baseline effective
// scale-up per year becomes roughly 81x, not 18x.
(function (root) {
  // Progress compounds, so a rate k times faster packs k baseline-years into one year:
  // per-year multiplier = baseline^k.
  function perYear(baseline, k) {
    if (!(baseline > 0) || !(k >= 0)) return null;
    return Math.pow(baseline, k);
  }
  // The misreading the footnote rules out: "researchers are k times as productive",
  // multiplying the yearly scale-up instead of compounding it.
  function misread(baseline, k) {
    if (!(baseline > 0) || !(k >= 0)) return null;
    return baseline * k;
  }
  // Years at the baseline rate needed to match one year at k times the rate.
  function baselineYears(baseline, k) {
    var m = perYear(baseline, k);
    if (m === null || baseline === 1) return null;
    return Math.log(m) / Math.log(baseline);
  }
  var api = { perYear: perYear, misread: misread, baselineYears: baselineYears };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TASLab = Object.assign(root.TASLab || {}, api);
})(this);
