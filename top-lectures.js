(function () {
  var sec = document.getElementById('top-lectures');
  var list = document.getElementById('top-lectures-list');
  if (!sec || !list) return;
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  fetch('top-lectures.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.items || !d.items.length) return;
      list.innerHTML = d.items.map(function (it, i) {
        return '<a href="https://youtu.be/' + encodeURIComponent(it.vid) + '" data-goatcounter-click="lec-' + esc(it.vid) + '" target="_blank" rel="noopener" class="flex items-start gap-3 bg-white rounded-xl border border-gold/30 shadow-sm p-4 hover:border-gold transition">'
          + '<span class="shrink-0 w-8 h-8 rounded-full bg-gold text-navy font-black flex items-center justify-center">' + (i + 1) + '</span>'
          + '<span><span class="block font-bold text-navy leading-relaxed">' + esc(it.title) + '</span>'
          + (it.lecturer ? '<span class="block text-gray-500 text-sm mt-1">' + esc(it.lecturer) + '</span>' : '')
          + '<span class="block text-gold-dark text-xs font-bold mt-1">' + it.count + ' مشاهدة من الموقع</span></span></a>';
      }).join('');
      sec.classList.remove('hidden');
    })
    .catch(function () {});
})();
