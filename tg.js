(function () {
  var tg = window.Telegram && window.Telegram.WebApp;
  if (!tg) return;
  document.documentElement.classList.add('in-telegram');
  try { tg.ready(); tg.expand(); } catch (e) {}
  try { tg.setHeaderColor('#1a1b35'); } catch (e) {}
  try { tg.setBackgroundColor('#ffffff'); } catch (e) {}
  var p = location.pathname;
  var isHome = /\/landingpage\/?$/.test(p) || /\/index\.html$/.test(p);
  if (!isHome && tg.BackButton) {
    try {
      tg.BackButton.show();
      tg.BackButton.onClick(function () { history.back(); });
    } catch (e) {}
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="http"]') : null;
    if (a && a.hostname !== location.hostname) {
      ev.preventDefault();
      try { tg.openLink(a.href); } catch (e) { window.open(a.href, '_blank'); }
    }
  });
})();
