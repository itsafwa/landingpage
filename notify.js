/* Safwa «نبّهني» on-site form: enhances the Google-Form notify links on the
   six program pages into a branded inline form that posts to the SAME
   Google Form (responses land in the form + its sheet unchanged).
   Without JS, the links keep working as plain Google Form links. */
(function () {
  var FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfmRw261T5iv-ObUxF9QOfuaxKxHuzTBWLvrsT0JZRaTdJ7Mw/viewform';
  var POST_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfmRw261T5iv-ObUxF9QOfuaxKxHuzTBWLvrsT0JZRaTdJ7Mw/formResponse';
  var PROGRAMS = ['زبدة الأدب', 'غور الأدب', 'بوابة القراءة', 'مدارات القراءة', 'فضاءات القراءة', 'كفايات القراءة'];
  var BY_PAGE = {
    'zubdat-al-adab': 'زبدة الأدب', 'ghawr-al-adab': 'غور الأدب', 'bawabat-al-qiraa': 'بوابة القراءة',
    'madarat-al-qiraa': 'مدارات القراءة', 'fadaat-al-qiraa': 'فضاءات القراءة', 'kifayat-al-qiraa': 'كفايات القراءة'
  };
  var E = { program: 'entry.1510532129', name: 'entry.812685396', email: 'entry.585306555', telegram: 'entry.1087425899' };

  function pageProgram() {
    var m = location.pathname.match(/([a-z-]+)\.html/);
    return (m && BY_PAGE[m[1]]) || '';
  }

  function input(cls, type, name, ph, req) {
    var i = document.createElement('input');
    i.type = type; i.name = name; i.placeholder = ph; i.required = !!req;
    i.className = cls;
    return i;
  }

  function buildForm(anchor) {
    var wrap = document.createElement('div');
    wrap.className = 'notify-form-wrap bg-white rounded-2xl shadow-lg border border-gold/40 p-6 mt-5 max-w-xl mx-auto text-right';
    var prog = pageProgram();
    var opts = PROGRAMS.map(function (p) {
      return '<option value="' + p + '"' + (p === prog ? ' selected' : '') + '>' + p + '</option>';
    }).join('');
    wrap.innerHTML =
      '<h4 class="font-bold text-navy text-lg mb-1">نبّهني عند فتح التسجيل</h4>' +
      '<p class="text-gray-500 text-sm mb-4">اترك بياناتك وسنعلمك فور فتح باب التسجيل.</p>' +
      '<form novalidate>' +
      '<label class="block font-bold text-navy text-sm mb-1">البرنامج</label>' +
      '<select name="' + E.program + '" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-3 text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/60">' + opts + '</select>' +
      '<label class="block font-bold text-navy text-sm mb-1">الاسم</label>' +
      '<input type="text" name="' + E.name + '" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-3 text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/60" placeholder="اسمك الكريم">' +
      '<label class="block font-bold text-navy text-sm mb-1">البريد الإلكتروني</label>' +
      '<input type="email" name="' + E.email + '" required dir="ltr" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-3 text-navy text-left focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/60" placeholder="you@example.com">' +
      '<label class="block font-bold text-navy text-sm mb-1">معرف تليجرام (اختياري)</label>' +
      '<input type="text" name="' + E.telegram + '" dir="ltr" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-4 text-navy text-left focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/60" placeholder="@username">' +
      '<button type="submit" class="w-full bg-gold text-navy font-bold py-3 rounded-full hover:bg-gold-light transition shadow">أعلمني عند الفتح</button>' +
      '<p class="err hidden text-red-600 text-sm mt-3">تعذّر الإرسال؛ تحقق من اتصالك أو <a class="underline font-bold" target="_blank" rel="noopener" href="' + FORM_URL + '">سجّل عبر نموذج Google</a>.</p>' +
      '</form>';
    var form = wrap.querySelector('form');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'جارٍ الإرسال…';
      var body = new URLSearchParams(new FormData(form));
      fetch(POST_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
        .then(function () {
          var p = form.querySelector('select').value;
          wrap.innerHTML = '<div class="text-center py-4"><i class="fas fa-check-circle text-4xl text-green-600 mb-3"></i>' +
            '<h4 class="font-bold text-navy text-lg mb-1">تمّ استلام طلبك</h4>' +
            '<p class="text-gray-600">سنعلمك فور فتح تسجيل «' + p + '». شكرًا لاهتمامك ببرامج صفوة.</p></div>';
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'أعلمني عند الفتح';
          form.querySelector('.err').classList.remove('hidden');
        });
    });
    return wrap;
  }

  function enhance(anchor) {
    anchor.addEventListener('click', function (ev) {
      ev.preventDefault();
      var next = anchor.closest('div');
      var existing = document.querySelector('.notify-form-wrap');
      if (existing) { existing.remove(); if (anchor._notifyOpen) { anchor._notifyOpen = false; return; } }
      var wrap = buildForm(anchor);
      var host = anchor.parentElement;
      host.parentElement.insertBefore(wrap, host.nextSibling);
      anchor._notifyOpen = true;
      var first = wrap.querySelector('input[name="' + E.name + '"]');
      if (first) first.focus();
    });
  }

  function init() {
    var links = document.querySelectorAll('a[data-goatcounter-click^="notify-"]');
    for (var i = 0; i < links.length; i++) enhance(links[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
