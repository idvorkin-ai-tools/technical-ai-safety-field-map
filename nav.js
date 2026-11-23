// Page selector: turns the unit/chapter eyebrow on each chapter page into a
// jump-to-page dropdown. The label stays as written; a transparent native
// <select> sits over it, so phones get the system picker and keyboards work.
// PAGES mirrors the unit cards on index.html; add a row here when a page is added.
(function () {
  var PAGES = [
    ['Field map', [['index.html', 'Home · all units']]],
    ['Unit 1 · The technical challenge with AI', [
      ['unit1/ch1.html', '1.1 Making AI go well'],
      ['unit1/ch2.html', '1.2 What might success look like?'],
      ['unit1/ch3.html', '1.3 Building AI safely is hard'],
      ['unit1/ch4.html', '1.4 What future do you want?']]],
    ['Unit 2 · Training safer models', [
      ['unit2/ch1.html', '2.1 Can we train AI to be safe?'],
      ['unit2/ch2.html', '2.2 Feeding AI ‘good’ data'],
      ['unit2/ch3.html', '2.3 Teaching AI right from wrong'],
      ['unit2/ch4.html', '2.4 More safety techniques']]],
    ['Unit 3 · Detecting danger', [
      ['unit3/ch1.html', '3.1 Evaluations: AI can, but will it?'],
      ['unit3/ch2.html', '3.2 How do AI companies test for safety?'],
      ['unit3/ch3.html', '3.3 Option 1: Anthropic'],
      ['unit3/ch4.html', '3.4 Option 2: OpenAI'],
      ['unit3/ch5.html', '3.5 Option 3: Google DeepMind'],
      ['unit3/ch6.html', '3.6 Option 4: Meta']]],
    ['Unit 4 · Understanding AI', [
      ['unit4/ch1.html', '4.1 How does AI think?'],
      ['unit4/ch2.html', '4.2 Interpretability in practice']]],
    ['Unit 5 · Minimising harm', [
      ['unit5/ch1.html', '5.1 Assuming harm'],
      ['unit5/ch2.html', '5.2 Building defences'],
      ['unit5/ch3.html', '5.3 Break the kill chain']]],
    ['Unit 6 · Start contributing', [
      ['unit6/ch1.html', '6.1 Your next steps'],
      ['unit6/ch2.html', '6.2 Choose your focus'],
      ['unit6/ch3.html', '6.3 Create your 1-pager'],
      ['unit6/ch4.html', '6.4 Next steps: Apply to roles'],
      ['unit6/ch5.html', '6.5 Next steps: Technical fellowships'],
      ['unit6/ch6.html', '6.6 Next steps: Policy fellowships'],
      ['unit6/ch7.html', '6.7 Next steps: Other fellowships'],
      ['unit6/ch8.html', '6.8 Next steps: Programs']]]
  ];

  var root = new URL('.', document.currentScript.src);
  function init() {
    var box = document.querySelector('main .eyebrow .box');
    if (!box) return;
    var here = location.pathname.replace(/\/$/, '/index.html');
    var sel = document.createElement('select');
    sel.className = 'page-select';
    sel.setAttribute('aria-label', 'Jump to page');
    var current = null;
    PAGES.forEach(function (g) {
      var og = document.createElement('optgroup');
      og.label = g[0];
      g[1].forEach(function (p) {
        var o = new Option(p[1], new URL(p[0], root).href);
        if (new URL(p[0], root).pathname === here) { o.selected = true; current = o.value; }
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
    if (!current) return; // page not in the list: leave the eyebrow alone
    sel.addEventListener('change', function () { if (sel.value !== current) location.href = sel.value; });
    // Back/forward restores the changed value from the bfcache; put it back.
    addEventListener('pageshow', function () { sel.value = current; });
    box.classList.add('page-pick');
    // Comments mode (annotate.js) comments on selected text, so there only the caret opens the
    // list and the label stays selectable. ponytail: read once at load; toggling comments
    // mid-page keeps the old hit area until reload.
    var annot = /[?&]annotate=(1|true|on)\b/.test(location.search);
    try { annot = annot || (localStorage.getItem('blogAnnotate') === '1' && !/[?&]annotate=(0|false|off)\b/.test(location.search)); } catch (e) {}
    if (annot) box.classList.add('page-pick-caret');
    box.appendChild(sel);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
