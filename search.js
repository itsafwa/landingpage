(function () {
  function norm(x) {
    return (x || '')
      .replace(/[ً-ٰٟ]/g, '')
      .replace(/[إأآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .toLowerCase();
  }
  function esc(x) {
    return (x || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var GROUPS = [['صفحة', 'الصفحات', 4], ['كتاب', 'الكتب', 5], ['لقاء', 'اللقاءات', 5]];
  document.querySelectorAll('.site-search').forEach(function (wrap) {
    var input = wrap.querySelector('.site-search-input');
    var box = wrap.querySelector('.site-search-results');
    var prefix = wrap.getAttribute('data-prefix') || '';
    function hide() { box.classList.add('hidden'); }
    function render() {
      var nq = norm(input.value.trim());
      if (nq.length < 2) { hide(); return; }
      var all = (window.SAFWA_SEARCH || []).filter(function (e) {
        return norm(e.t).indexOf(nq) > -1 || norm(e.k).indexOf(nq) > -1 || norm(e.s).indexOf(nq) > -1;
      });
      if (!all.length) {
        box.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500">لا توجد نتائج مطابقة</div>';
      } else {
        var html = '';
        GROUPS.forEach(function (g) {
          var hits = all.filter(function (e) { return (e.g || 'صفحة') === g[0]; }).slice(0, g[2]);
          if (!hits.length) return;
          html += '<div class="px-4 pt-2.5 pb-1 text-[11px] font-bold text-gold-dark">' + g[1] + '</div>';
          html += hits.map(function (e) {
            var sub = e.s ? '<span class="block text-xs text-gray-400 mt-0.5">' + esc(e.s) + '</span>' : '';
            return '<a href="' + prefix + e.u + '" class="block px-4 py-2 text-sm text-navy hover:bg-yellow-50 border-b border-gray-50">' + esc(e.t) + sub + '</a>';
          }).join('');
        });
        box.innerHTML = html;
      }
      box.classList.remove('hidden');
    }
    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') hide(); });
    document.addEventListener('click', function (ev) { if (!wrap.contains(ev.target)) hide(); });
  });
})();
