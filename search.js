(function () {
  function norm(x) {
    return (x || '')
      .replace(/[ً-ٰٟ]/g, '')
      .replace(/[إأآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .toLowerCase();
  }
  document.querySelectorAll('.site-search').forEach(function (wrap) {
    var input = wrap.querySelector('.site-search-input');
    var box = wrap.querySelector('.site-search-results');
    var prefix = wrap.getAttribute('data-prefix') || '';
    function hide() { box.classList.add('hidden'); }
    function render() {
      var nq = norm(input.value.trim());
      if (nq.length < 2) { hide(); return; }
      var hits = (window.SAFWA_SEARCH || []).filter(function (e) {
        return norm(e.t).indexOf(nq) > -1 || norm(e.k).indexOf(nq) > -1;
      }).slice(0, 8);
      if (!hits.length) {
        box.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500">لا توجد نتائج مطابقة</div>';
      } else {
        box.innerHTML = hits.map(function (e) {
          return '<a href="' + prefix + e.u + '" class="block px-4 py-2.5 text-sm text-navy hover:bg-yellow-50 border-b border-gray-50">' + e.t + '</a>';
        }).join('');
      }
      box.classList.remove('hidden');
    }
    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') hide(); });
    document.addEventListener('click', function (ev) { if (!wrap.contains(ev.target)) hide(); });
  });
})();
