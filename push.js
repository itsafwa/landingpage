/* Safwa Web Push — instant alerts when a program opens for registration.
   Subscriptions are stored via a dedicated Google Form owned by the initiative.
   The sender side (pywebpush + VAPID) lives outside the repo. */
(function () {
    if (window.__safwaPushLoaded) return;
    window.__safwaPushLoaded = true;

    var VAPID_PUBLIC = 'BAUMpUVM-eRPXdohlC-oc9Al65j_vazq3qtztB_eGiUNFjezk6l7-E_Dviy1s7kPCRtLy93D6nA--DSvWiQiMVs';
    var FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLScwR_JSp1JCiv_iZDssxLu7QUntSf7_yANJiBUvq-1_VIthhQ/formResponse';
    var ENTRY = 'entry.1861684073';

    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return;
    if (FORM_ACTION.indexOf('__') === 0) return;

    function b64ToUint8(b64) {
        var pad = '='.repeat((4 - (b64.length % 4)) % 4);
        var raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
        var arr = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
        return arr;
    }

    function setState(btn, mode) {
        if (mode === 'on') {
            btn.innerHTML = '<i class="fas fa-bell ml-1"></i> التنبيهات الفورية مفعّلة';
            btn.classList.add('opacity-70', 'pointer-events-none');
        } else if (mode === 'denied') {
            btn.innerHTML = '<i class="fas fa-bell-slash ml-1"></i> التنبيهات محظورة في المتصفح';
            btn.classList.add('opacity-70', 'pointer-events-none');
        } else if (mode === 'busy') {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin ml-1"></i> جارٍ التفعيل...';
        }
    }

    function storeSubscription(sub, program) {
        var payload = JSON.stringify({ subscription: sub.toJSON(), program: program || '', page: location.pathname, ts: new Date().toISOString() });
        var body = new URLSearchParams();
        body.set(ENTRY, payload);
        return fetch(FORM_ACTION, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    }

    function activate(btn) {
        var program = btn.getAttribute('data-program') || '';
        setState(btn, 'busy');
        Notification.requestPermission().then(function (perm) {
            if (perm !== 'granted') { setState(btn, 'denied'); return; }
            navigator.serviceWorker.ready.then(function (reg) {
                reg.pushManager.getSubscription().then(function (existing) {
                    if (existing) { setState(btn, 'on'); return; }
                    reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(VAPID_PUBLIC) })
                        .then(function (sub) { storeSubscription(sub, program).then(function () { setState(btn, 'on'); }); })
                        .catch(function () { setState(btn, 'denied'); });
                });
            });
        });
    }

    function makeButton(program, extraClass) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = extraClass || 'inline-block bg-navy text-gold text-xs font-bold px-3 py-1 rounded-full mr-2 hover:bg-navy-light transition';
        btn.innerHTML = '<i class="fas fa-bell ml-1"></i> فعّل التنبيه الفوري';
        if (program) btn.setAttribute('data-program', program);
        btn.addEventListener('click', function () { activate(btn); });
        if (Notification.permission === 'denied') setState(btn, 'denied');
        else if (Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(function (reg) {
                reg.pushManager.getSubscription().then(function (s) { if (s) setState(btn, 'on'); });
            });
        }
        return btn;
    }

    function init() {
        document.querySelectorAll('a[data-goatcounter-click^="notify-"]').forEach(function (a) {
            var program = (a.getAttribute('data-goatcounter-click') || '').replace('notify-', '');
            a.parentNode.insertBefore(makeButton(program), a.nextSibling);
        });
        var slot = document.getElementById('push-cta');
        if (slot) slot.appendChild(makeButton('', 'inline-block bg-gold text-navy text-lg font-bold px-10 py-4 rounded-full shadow-lg hover:bg-gold-dark transition'));
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
