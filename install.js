(function () {
  var slot = document.getElementById('install-cta');
  if (!slot) return;
  var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (standalone) return;
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    render();
  });
  var ua = window.navigator.userAgent || '';
  var isIOS = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
  function render() {
    if (slot.firstChild) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'inline-block border-2 border-gold text-gold font-bold px-6 py-2.5 rounded-full hover:bg-gold hover:text-navy transition';
    btn.innerHTML = '<i class="fas fa-mobile-screen-button ml-2"></i>ثبّت صفوة على هاتفك';
    btn.addEventListener('click', function () {
      if (deferred) {
        deferred.prompt();
        deferred.userChoice.then(function () { deferred = null; });
      } else if (isIOS) {
        var p = document.getElementById('ios-install-steps');
        if (p) p.classList.toggle('hidden');
      }
    });
    slot.appendChild(btn);
  }
  if (isIOS) {
    render();
    var steps = document.createElement('div');
    steps.id = 'ios-install-steps';
    steps.className = 'hidden mt-4 bg-white/10 border border-gold/30 rounded-2xl p-5 text-white/90 leading-relaxed max-w-xl mx-auto';
    steps.innerHTML = 'لتثبيت صفوة على آيفون وتلقّي التنبيهات الفورية:<br>' +
      '١. اضغط زر <b>المشاركة</b> في أسفل متصفح سفاري.<br>' +
      '٢. اختر <b>«إضافة إلى الشاشة الرئيسية»</b>.<br>' +
      '٣. اضغط <b>«إضافة»</b> — ثم افتح صفوة من أيقونتها وفعّل التنبيه الفوري.';
    slot.appendChild(steps);
  }
})();
