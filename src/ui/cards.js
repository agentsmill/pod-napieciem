'use strict';
/* The world keeps moving while the clock runs: newspaper clippings, new inventions and investor
   projects arrive as cards that do not stop the game. Also the map legend and the layer buttons,
   which appear together with the technologies that need them. */
(function () {
  const PN = window.PN, UI = PN.UI, S = PN.Sketch, esc = PN.esc;
  const $ = (s) => document.querySelector(s);
  const C = (PN.Cards = {});
  const kv = (k, v, cls) => '<div class="kv' + (cls ? ' ' + cls : '') + '"><span>' + k + '</span><b>' + v + '</b></div>';
  const LW = { line_sn: 1, line_60: 1.3, line_110: 1.6, line_220: 2, line_345: 2.4, line_400: 2.5, line_500: 2.8, line_750: 3.2, hvdc: 2.6, cable_sea: 1.8 };

  /* ---------------------------------------------------------------- cards */
  const box = () => $('#cards');
  const maxCards = () => (window.innerWidth <= 820 ? 2 : window.innerHeight < 760 ? 2 : 3);
  C.add = function (kind, html, opts) {
    opts = opts || {};
    const b = box(); if (!b) return null;
    if (opts.key) { for (const old of b.children) if (old.dataset.key === opts.key) { old.remove(); break; } }
    const d = document.createElement('div');
    d.className = 'gcard ' + kind + 'c'; d.setAttribute('role', 'status');
    d.innerHTML = '<button class="x" data-c="close" aria-label="Zamknij">×</button>' + html;
    if (opts.key) d.dataset.key = opts.key;
    if (opts.sticky) d.dataset.sticky = '1';
    // decisions sit at the bottom of the stack (always visible); news piles up above them
    if (opts.sticky) b.insertBefore(d, b.firstChild); else b.appendChild(d);
    let extra = b.children.length - maxCards();
    for (const c of [...b.children]) { if (extra <= 0) break; if (c !== d && !c.dataset.sticky) { c.remove(); extra--; } }
    for (const c of [...b.children]) { if (extra <= 0) break; if (c !== d) { c.remove(); extra--; } }
    d.querySelectorAll('canvas[data-spr]').forEach((cv) => { const sp = PN.Sprites.get(cv.dataset.spr); if (sp) cv.getContext('2d').drawImage(sp, 0, 0, cv.width, cv.height); });
    d.querySelectorAll('[data-lineicon]').forEach((sp) => sp.appendChild(UI.lineIcon(sp.dataset.lineicon)));
    d.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-c]'); if (!btn) return;
      if (btn.dataset.c === 'close') { C.drop(d); return; }
      if (opts.on) opts.on(btn.dataset.c, d, btn);
    });
    if (opts.life) { // fades on its own; hovering or an open dialog holds it
      let left = opts.life, last = performance.now();
      const tick = () => { if (!d.isConnected) return; const now = performance.now(); if (!d.matches(':hover') && !UI.modalOpen && !document.hidden) left -= now - last; last = now; if (left <= 0) C.drop(d); else setTimeout(tick, 400); };
      setTimeout(tick, 400);
    }
    return d;
  };
  C.drop = function (d) { if (!d || !d.isConnected || d.classList.contains('out')) return; d.classList.add('out'); setTimeout(() => d.remove(), 420); };
  C.clear = function () { const b = box(); if (b) b.innerHTML = ''; const l = $('#legend'); if (l) l.hidden = true; };

  /* newspaper clipping for an event that does not change the rules */
  C.clip = function (ev) {
    const G = UI.G, [yy, mm] = ev.date.split('-').map(Number);
    const fx = (ev.effects || []).map(UI.effectText).filter(Boolean);
    const short = ev.text.length > 130 ? ev.text.slice(0, 125).replace(/\s+\S*$/, '') + '…' : ev.text;
    const html = '<div class="k">' + esc(ev.paper || (G.code === 'PL' ? 'Kronika Energetyczna' : 'The Electrical World')) + ' · ' + PN.MONTHS[mm - 1] + ' ' + yy + '</div><h4>' + esc(ev.title) + '</h4><p>' + esc(short) + '</p>' +
      (fx.length ? '<p class="fxs">W grze: ' + esc(fx.slice(0, 2).join('; ')) + (fx.length > 2 ? ' …' : '') + '</p>' : '') +
      '<div class="row end"><button class="act" data-c="read">Czytaj całość</button></div>';
    C.add('clip', html, { life: 16000, key: 'ev:' + ev.id, on: (k, d) => { if (k === 'read') { C.drop(d); UI.showEvent(ev, 'card'); } } });
  };

  /* a new technology: what it is and what it changes */
  const isLine = (id) => PN.TECH[id] && PN.TECH[id].cat === 'line';
  function whatChanges(G, id) {
    const t = PN.TECH[id], y = PN.ym(G);
    if (id === 'line_sn' && !G.lines.some((l) => !l.local)) return 'Prąd przemienny i transformatory: linia średniego napięcia (' + UI.kv(id) + ') przesyła do ' + PN.mw(PN.tv(t.cap, y)) + ' na odległość do ok. ' + t.maxKm + ' km. Elektrownia nie musi już stać w mieście – jedna może zasilać kilka miast.';
    if (isLine(id)) return t.name + ' przesyła do ' + PN.mw(PN.tv(t.cap, y)) + ' na odległość do ok. ' + t.maxKm + ' km, z mniejszymi stratami niż niższe napięcia. ' + (t.desc || '');
    if (id === 'substation') return 'Stacja rozgałęzia linie i zmienia napięcie. Linię możesz też zacząć na pustym polu – stacja powstanie sama.';
    return t.desc || '';
  }
  C.tech = function (ids) {
    const G = UI.G; ids = ids.filter((id) => PN.TECH[id]); if (!ids.length) return;
    const main = ids.find((id) => id !== 'substation') || ids[0], t = PN.TECH[main];
    const firstLine = ids.some(isLine) && !G.lines.some((l) => !l.local);
    const pic = isLine(main) ? '<span class="pic" data-lineicon="' + main + '"></span>' : '<canvas width="104" height="104" data-spr="' + esc(main) + '"></canvas>';
    const html = pic + '<div class="k">' + (ids.length > 1 ? 'Nowe technologie' : 'Nowa technologia') + '</div><h4>' + esc(ids.map((id) => PN.TECH[id].name).join(' i ')) + '</h4><p>' + esc(whatChanges(G, main)) + '</p><p class="fxs">' + UI.techLine(main) + '</p>' +
      '<div class="row end">' + (firstLine ? '<button class="act prim" data-c="howline">Pokaż, jak postawić linię</button>' : '') + '<button class="act" data-c="show">Pokaż w menu</button></div>';
    C.add('tech', html, { life: firstLine ? 60000 : 22000, key: 'tech:' + ids.join(','), on: (k, d) => {
      if (k === 'show') { C.drop(d); UI.setTool(null); UI.openFly(UI.catOf(main), main); }
      if (k === 'howline') { C.drop(d); if (PN.Tutorial && PN.Tutorial.startLines) PN.Tutorial.startLines(); }
    } });
  };

  /* an investor's project waiting for the player's yes or no */
  C.ipp = function (o) {
    const G = UI.G, t = PN.TECH[o.tech], near = o.near != null ? G.byId[o.near] : null, net = PN.ippNet(G), margin = net - o.ppa;
    const html = '<canvas width="104" height="104" data-spr="' + esc(o.tech) + '"></canvas><div class="k">Projekt inwestora prywatnego</div><h4>' + esc(o.company) + ': ' + esc(t.name.toLowerCase()) + ', ' + PN.mw(o.cap) + '</h4>' +
      '<div class="kvs">' + kv('Miejsce', near ? 'okolice: ' + esc(PN.cityName(near, G.y)) : '–') + kv('Odkup energii', PN.price(o.ppa)) + kv('Twoja marża', PN.price(margin), margin < 0 ? 'neg' : 'pos') + kv('Umowa', o.years + ' lat') + kv('Przyłączenie', o.inCity ? 'w mieście, bez linii' : 'linia ok. ' + PN.nf(o.gridKm, 0) + ' km') + '</div>' +
      '<p class="fxs">Inwestor sam płaci za budowę. Ty przyłączasz elektrownię i kupujesz jej energię.</p><div class="row end"><button class="act" data-c="where">Pokaż</button><button class="act" data-c="no">Odrzuć</button><button class="act prim" data-c="yes">Przyłącz</button></div>';
    C.add('ipp', html, { sticky: true, key: 'ipp:' + o.id, on: (k, d) => {
      const live = (G.ippOffers || []).find((x) => x.id === o.id); if (!live) { C.drop(d); return; }
      if (k === 'where') { UI.V.centerOn(o.tx + 0.5, o.ty + 0.5, Math.max(UI.V.cam.z, 1.4)); UI.V.focusOffer = o; return; }
      if (k === 'yes') { const n = PN.acceptIpp(G, live); C.drop(d); if (n) { UI.V.centerOn(n.x, n.y, Math.max(UI.V.cam.z, 1.4)); UI.select(n); } }
      if (k === 'no') { PN.declineIpp(G, live); C.drop(d); }
      UI.V.focusOffer = null; UI.hud(true); UI.refreshInfo(true);
    } });
  };
  /* a data centre wants a contract (offer stays half a year) */
  C.dc = function (o) {
    const G = UI.G, c = G.byId[o.city];
    const html = '<canvas width="104" height="104" data-spr="datacenter"></canvas><div class="k">Propozycja umowy</div><h4>' + esc(o.company) + ': ' + (o.ai ? 'centrum obliczeń AI' : 'centrum danych') + '</h4>' +
      '<div class="kvs">' + kv('Miejsce', 'okolice: ' + esc(c ? PN.cityName(c, G.y) : '?')) + kv('Moc docelowa', PN.mw(o.mw)) + kv('Dojście do pełnej mocy', PN.months(o.years * 12)) + kv('Taryfa', '+' + PN.pct(o.premium) + ' ponad cenę') + '</div>' +
      '<p class="fxs">Zasilanie 24/7 – za braki płacisz kary.</p><div class="row end"><button class="act" data-c="no">Odrzuć</button><button class="act prim" data-c="yes">Podpisz</button></div>';
    C.add('ipp', html, { sticky: true, key: 'dc:' + o.id, on: (k, d) => {
      const live = G.offers.find((x) => x.id === o.id); C.drop(d); if (!live) return;
      if (k === 'yes') { const n = PN.acceptOffer(G, live); if (n) { UI.V.centerOn(n.x, n.y, Math.max(UI.V.cam.z, 1.4)); UI.select(n); } }
      if (k === 'no') PN.declineOffer(G, live);
      UI.hud(true); UI.refreshInfo(true);
    } });
  };
  /* drop cards of offers that expired or were decided elsewhere */
  C.sync = function () {
    const G = UI.G, b = box(); if (!G || !b) return;
    const ids = new Set((G.ippOffers || []).map((o) => 'ipp:' + o.id).concat(G.offers.map((o) => 'dc:' + o.id)));
    for (const c of [...b.children]) if (c.dataset.key && /^(ipp|dc):/.test(c.dataset.key) && !ids.has(c.dataset.key)) C.drop(c);
    if (UI.V && UI.V.focusOffer && !(G.ippOffers || []).includes(UI.V.focusOffer)) UI.V.focusOffer = null;
  };

  /* the moment private money arrives */
  C.transformation = function (tr) {
    const G = UI.G, small = tr.scope === 'small';
    const lead = small ? 'Ustawa PURPA zobowiązuje Cię do kupowania prądu od małych, niezależnych elektrowni: kogeneracji, wiatru, biomasy i małej wody. Pierwszy raz do sieci przyłączają się cudze źródła.'
      : G.code === 'PL' ? 'Prawo energetyczne kończy epokę jednego państwowego przedsiębiorstwa. Odtąd do Twojej sieci chcą się przyłączać prywatne firmy z własnymi elektrowniami – najpierw nieliczne, z czasem coraz więcej i coraz większe.'
        : 'Order 888 otwiera sieci przesyłowe dla wszystkich. Każdy wytwórca może sprzedawać energię, a Ty musisz ją przyjąć i przesłać.';
    const html = '<h2>' + (small ? 'Niezależni wytwórcy' : 'Transformacja: rynek energii') + '</h2><canvas class="evicon" width="200" height="200" data-icon="handshake"></canvas><p class="lead">' + esc(lead) + '</p><h3>Co się zmienia</h3><ul class="help">' +
      '<li><b>Projekty inwestorów</b> przychodzą jako karty po lewej stronie (i w zakładce Przegląd). Inwestor sam płaci za budowę.</li>' +
      '<li><b>Ty przyłączasz</b>: gdy elektrownia stanie, poprowadź do niej linię. Masz na to rok, potem inwestor skarży się regulatorowi, a po trzech latach rezygnuje.</li>' +
      '<li><b>Kupujesz ich energię</b> po cenie z umowy. Tania energia z wiatru czy słońca poprawia Twój wynik, droga go pogarsza – patrz na marżę.</li>' +
      '<li><b>Możesz odmówić</b>, ale częste odmowy psują reputację.</li>' +
      '<li>Elektrownie prywatne mają <b class="ownr">fioletową chorągiewkę</b>. Nie rozbudujesz ich ani nie wyburzysz.</li></ul><div class="row end"><button class="act prim" data-m="ok">Rozumiem</button></div>';
    UI.modal(html, { queue: true, pause: G.settings.pauseOnEvents });
  };

  /* ------------------------------------------------------- layers, legend */
  C.updateLayers = function () {
    const G = UI.G; if (!G) return;
    document.querySelectorAll('#layers button[data-ov]').forEach((b) => {
      const ok = PN.layerAvail(G, b.dataset.ov); b.hidden = !ok;
      if (!ok && UI.V && UI.V.overlay === b.dataset.ov) { UI.V.overlay = null; b.classList.remove('on'); }
    });
  };
  function sample(kind) {
    const c = S.canvas(112, 44), x = c.getContext('2d'), th = S.th; c.style.width = '56px'; c.style.height = '22px'; x.scale(2, 2);
    x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = th.ink; x.fillStyle = th.ink;
    const path = () => { x.beginPath(); x.moveTo(4, 15); x.quadraticCurveTo(28, 5, 52, 12); };
    const ticks = (len) => { x.lineWidth = 0.9; x.beginPath(); for (const px of [18, 36]) { x.moveTo(px - 1, 12 - len); x.lineTo(px + 1, 12 + len); } x.stroke(); };
    if (kind === 'local') { x.globalAlpha = 0.7; x.lineWidth = 1; x.setLineDash([2, 3]); path(); x.stroke(); }
    else if (LW[kind]) {
      x.lineWidth = LW[kind]; if (kind === 'hvdc') x.setLineDash([10, 3, 2, 3]); if (kind === 'cable_sea') { x.setLineDash([7, 3]); x.strokeStyle = th.water; }
      path(); x.stroke(); x.setLineDash([]); if (kind !== 'cable_sea') ticks(kind === 'line_sn' ? 2.5 : 3 + LW[kind]);
    } else if (kind === 'flow') { x.lineWidth = 1.6; path(); x.stroke(); x.strokeStyle = th.flow; x.lineWidth = 2.2; x.setLineDash([3, 7]); path(); x.stroke(); }
    else if (kind === 'hot' || kind === 'over') { x.lineWidth = 2; x.strokeStyle = kind === 'hot' ? th.orange : th.red; path(); x.stroke(); }
    else if (kind === 'trace') { x.strokeStyle = th.yellow; x.globalAlpha = 0.5; x.lineWidth = 9; path(); x.stroke(); x.globalAlpha = 1; x.strokeStyle = th.ink; x.lineWidth = 1.6; path(); x.stroke(); }
    else if (kind === 'plug') { x.strokeStyle = th.red; x.lineWidth = 1.8; x.beginPath(); x.moveTo(18, 18); x.quadraticCurveTo(24, 22, 28, 13); x.lineTo(34, 7); x.moveTo(30, 4); x.lineTo(38, 11); x.stroke(); }
    else if (kind === 'ipp') { x.strokeStyle = th.ink; x.lineWidth = 1.3; x.beginPath(); x.moveTo(24, 20); x.lineTo(24, 3); x.stroke(); x.fillStyle = th.violet; x.beginPath(); x.moveTo(24.5, 3.5); x.lineTo(36, 7); x.lineTo(24.5, 11); x.closePath(); x.fill(); }
    else if (kind === 'reach') { x.strokeStyle = th.water; x.lineWidth = 1.4; x.setLineDash([4, 3]); x.beginPath(); x.ellipse(28, 11, 22, 9, 0, 0, 6.3); x.stroke(); }
    return c;
  }
  C.legend = function () {
    const G = UI.G, y = PN.ym(G), el = $('#legend'); if (!el) return;
    if (!el.hidden) { el.hidden = true; return; }
    const rows = [['local', 'Sieć niskiego napięcia (nN): elektrownia w mieście zasila je wprost, bez linii przesyłowej.']];
    for (const id of PN.LINE_ORDER) if (PN.techAvail(G, id)) { const t = PN.TECH[id]; rows.push([id, t.name + ' – do ok. ' + t.maxKm + ' km, ' + PN.mw(PN.tv(t.cap, y)) + ' na linię.']); }
    if (rows.length === 1) rows.push(['reach', 'Linie przesyłowe pojawią się wraz z rozwojem techniki.']);
    rows.push(['flow', 'Żółte kreski: prąd płynie w tę stronę (w szczycie).'], ['hot', 'Pomarańczowa linia: obciążenie ponad 80%.'], ['over', 'Czerwona linia: przeciążenie – prąd nie dociera.'],
      ['trace', 'Żółta poświata: droga prądu do zaznaczonego miasta albo z zaznaczonej elektrowni.'], ['plug', 'Czerwona wtyczka: obiekt niepodłączony do sieci.'], ['reach', 'Przerywany krąg przy budowie: zasięg elektrowni albo linii.']);
    if (G.ippScope) rows.push(['ipp', 'Fioletowa chorągiewka: elektrownia prywatnego inwestora.']);
    el.innerHTML = '<button class="x" data-legend="1" aria-label="Zamknij legendę">×</button><h4>Legenda</h4>' + rows.map(([k, t]) => '<div class="lg"><span class="sw" data-k="' + k + '"></span><span>' + esc(t) + '</span></div>').join('');
    el.querySelectorAll('.sw').forEach((sp) => sp.appendChild(sample(sp.dataset.k)));
    el.hidden = false;
  };
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-legend]'); if (b) C.legend(); });
})();
