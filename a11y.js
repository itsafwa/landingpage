/* Safwa reading accessibility controls: font size steps + dark mode.
   State persists per visitor in localStorage. Buttons are injected here so
   every page gets them from one include. */
(function () {
  var root = document.documentElement;
  function applyFont(n) {
    if (n > 0) root.setAttribute('data-font', String(n)); else root.removeAttribute('data-font');
  }
  function applyDark(on) { root.classList.toggle('dark', !!on); }
  var font = 0, dark = false;
  try {
    font = parseInt(localStorage.getItem('safwa-font') || '0', 10) || 0;
    dark = localStorage.getItem('safwa-dark') === '1';
  } catch (e) { /* private mode */ }
  applyFont(font); applyDark(dark);

  function build() {
    if (document.getElementById('safwa-a11y')) return;
    var box = document.createElement('div');
    box.id = 'safwa-a11y';
    var bFont = document.createElement('button');
    bFont.type = 'button';
    bFont.title = 'حجم الخط';
    bFont.setAttribute('aria-label', 'تبديل حجم الخط');
    bFont.innerHTML = '<i class="fas fa-text-height"></i>';
    var bDark = document.createElement('button');
    bDark.type = 'button';
    bDark.title = 'الوضع الليلي';
    bDark.setAttribute('aria-label', 'تبديل الوضع الليلي');
    function moonIcon() { bDark.innerHTML = '<i class="fas ' + (dark ? 'fa-sun' : 'fa-moon') + '"></i>'; }
    moonIcon();
    bFont.addEventListener('click', function () {
      font = (font + 1) % 3;
      applyFont(font);
      try { localStorage.setItem('safwa-font', String(font)); } catch (e) {}
    });
    bDark.addEventListener('click', function () {
      dark = !dark;
      applyDark(dark); moonIcon();
      try { localStorage.setItem('safwa-dark', dark ? '1' : '0'); } catch (e) {}
    });
    var actions = document.createElement('div');
    actions.className = 'a11y-actions';
    actions.appendChild(bFont);
    actions.appendChild(bDark);
    var bToggle = document.createElement('button');
    bToggle.type = 'button';
    bToggle.className = 'a11y-toggle';
    bToggle.title = 'خيارات سهولة الوصول';
    bToggle.setAttribute('aria-label', 'خيارات سهولة الوصول');
    bToggle.setAttribute('aria-expanded', 'false');
    bToggle.innerHTML = '<i class="fas fa-universal-access"></i>';
    bToggle.addEventListener('click', function () {
      var open = box.classList.toggle('open');
      bToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    box.appendChild(actions);
    box.appendChild(bToggle);
    document.body.appendChild(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
