'use strict';
/* DOM interface: HUD, build menu, info panel, charts, modals. */
(function () {
  const PN = window.PN, S = PN.Sketch;
  const $ = (s, r) => (r || document).querySelector(s);
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = PN.esc;

  const UI = (PN.UI = { G: null, V: null, speed: 1, speeds: [0, 1, 2, 4, 8], tab: 'overview', lastHud: 0, pendingDemolish: null });

  const CATS = [
    { id: 'gen', name: 'Elektrownie', items: () => PN.GEN_ORDER, icon: 'coal' },
    { id: 'store', name: 'Magazyny energii', items: () => PN.STORE_ORDER, icon: 'battery' },
    { id: 'grid', name: 'Sieć: linie i stacje', items: () => PN.LINE_ORDER.concat(['substation']), icon: 'substation' },
    { id: 'res', name: 'Zasoby: kopalnie', items: () => PN.RES_ORDER, icon: 'coal_mine' },
  ];

  /* ---------------------------------------------------------------- setup */
  UI.init = function () {
    $('#tools').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-cat]'); if (!b) return;
      const cat = b.dataset.cat;
      if (cat === 'select') { UI.setTool(null); UI.closeFly(); return; }
      if (cat === 'demolish') { UI.setTool({ kind: 'demolish', id: 'demolish' }); UI.closeFly(); return; }
      if (UI.flyCat === cat && !$('#fly').hidden) { UI.closeFly(); return; }
      UI.openFly(cat);
    });
    $('#fly').addEventListener('click', (e) => {
      const it = e.target.closest('[data-tech]'); if (!it || it.classList.contains('off')) return;
      const id = it.dataset.tech, t = PN.TECH[id];
      UI.setTool({ kind: t.cat === 'line' ? 'line' : 'build', id });
      UI.closeFly();
    });
    $('#speed').addEventListener('click', (e) => { const b = e.target.closest('button[data-s]'); if (b) UI.setSpeed(+b.dataset.s); });
    $('#tabs').addEventListener('click', (e) => { if (e.target.closest('[data-close]')) { UI.showPanel(false); return; } const b = e.target.closest('button[data-tab]'); if (b) { UI.select(null); UI.openTab(b.dataset.tab); } });
    $('#layers').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-ov]'); if (!b) return;
      const v = UI.V; v.overlay = v.overlay === b.dataset.ov ? null : b.dataset.ov;
      document.querySelectorAll('#layers button[data-ov]').forEach((x) => x.classList.toggle('on', x.dataset.ov === v.overlay));
    });
    $('#zoomIn').onclick = () => UI.V.zoomAt(UI.V.W / 2, UI.V.H / 2, 1.3);
    $('#zoomOut').onclick = () => UI.V.zoomAt(UI.V.W / 2, UI.V.H / 2, 1 / 1.3);
    $('#zoomFit').onclick = () => UI.V.fit();
    $('#menuBtn').onclick = () => UI.menu();
    $('#ticker').onclick = () => { UI.select(null); UI.openTab('chron'); UI.showPanel(true); };
    $('#panelToggle').onclick = () => UI.showPanel($('#panel').classList.contains('closed'));
    $('#info').addEventListener('click', UI.onInfoClick);
  };

  UI.bind = function (G, V) {
    UI.G = G; UI.V = V; UI.tab = 'overview'; UI.sel = null;
    PN.bus.h = {};
    PN.bus.on('event', (ev) => UI.onEvent(ev));
    PN.bus.on('incident', (i) => { UI.toast('<b>' + esc(i.title) + '</b><br>' + esc(i.text), i.kind === 'heat' ? 'warn' : 'warn'); if (i.reg) V.incidents.push({ reg: i.reg, kind: i.kind, until: performance.now() + 7000 }); });
    PN.bus.on('offer', (o) => UI.onOffer(o));
    PN.bus.on('missionDone', ({ ms }) => UI.toast('<b>Zadanie wykonane: ' + esc(ms.title) + '</b><br>Nagroda: ' + PN.money(ms.reward.money || 0), 'good'));
    PN.bus.on('mission', () => { if (UI.tab === 'overview' || UI.tab === 'goals') UI.refreshInfo(true); });
    PN.bus.on('completed', (o) => { const n = o.a ? null : o; if (n && n.x != null) V.flash.push({ x: n.x, y: n.y, until: performance.now() + 900 }); });
    PN.bus.on('gameover', (k) => UI.gameOver(k));
    PN.bus.on('month', () => { if (UI.sel) UI.V.trace = UI.traceFor(UI.sel); UI.refreshInfo(); if (PN.Cards) PN.Cards.sync(); if (UI.G.m === 0) PN.autosave && PN.autosave(); });
    PN.bus.on('tech', (ids) => { if (PN.Cards) { PN.Cards.tech(ids); PN.Cards.updateLayers(); } if (UI.flyCat && !$('#fly').hidden) UI.openFly(UI.flyCat); });
    PN.bus.on('ipp', (o) => { if (PN.Cards) PN.Cards.ipp(o); });
    PN.bus.on('transformation', (t) => { if (PN.Cards) PN.Cards.transformation(t); });
    PN.bus.on('news', () => UI.renderTicker());
    UI.buildTools();
    if (PN.Cards) { PN.Cards.clear(); PN.Cards.updateLayers(); }
    UI.openTab('overview');
    UI.showPanel(!(window.matchMedia && window.matchMedia('(max-width: 820px)').matches));
    UI.renderTicker();
    UI.hud(true);
  };

  UI.buildTools = function () {
    const tools = $('#tools'); tools.innerHTML = '';
    const mk = (cat, label, icon) => { const b = h('button', 'tool', ''); b.dataset.cat = cat; b.title = label; b.setAttribute('aria-label', label); const ic = PN.Sprites.icon(icon, 44); ic.className = 'ico'; b.appendChild(ic); b.appendChild(h('span', 'tl', label.split(':')[0])); tools.appendChild(b); return b; };
    const sel = mk('select', 'Wskaż i sprawdź', 'substation'); sel.querySelector('.ico').replaceWith(iconCanvas('cursor'));
    CATS.forEach((c) => mk(c.id, c.name, c.icon));
    const dem = mk('demolish', 'Wyburz', 'damaged'); dem.querySelector('.ico').replaceWith(iconCanvas('bulldoze'));
  };
  function iconCanvas(kind) {
    const c = S.canvas(88, 88), x = c.getContext('2d'); c.className = 'ico'; c.style.width = c.style.height = '44px';
    x.scale(2, 2); x.strokeStyle = S.th.ink; x.lineWidth = 2; x.lineCap = 'round'; x.lineJoin = 'round';
    const r = PN.rng(kind.length * 31);
    if (kind === 'cursor') S.pencil(x, () => { x.moveTo(14, 8); x.lineTo(14, 34); x.lineTo(20, 28); x.lineTo(25, 38); x.lineTo(29, 36); x.lineTo(24, 26); x.lineTo(32, 26); x.closePath(); }, { color: S.th.ink, w: 1.8 });
    if (kind === 'bulldoze') { S.pencil(x, () => { x.moveTo(10, 30); x.lineTo(34, 30); x.lineTo(34, 18); x.lineTo(24, 18); x.lineTo(20, 24); x.lineTo(10, 24); x.closePath(); x.moveTo(34, 26); x.lineTo(40, 22); x.lineTo(40, 34); x.lineTo(34, 32); }, { color: S.th.ink, w: 1.6 }); S.circle(x, 15, 34, 4, 4, r, { w: 1.4 }); S.circle(x, 29, 34, 4, 4, r, { w: 1.4 }); }
    return c;
  }

  /* -------------------------------------------------------------- flyout */
  const FLY_EMPTY = {
    store: 'Magazynów energii jeszcze nie wynaleziono. Gdy technika do tego dojrzeje, przeczytasz o tym w gazecie, a tutaj pojawią się nowe pozycje.',
    grid: 'Linii przesyłowych jeszcze nie ma. Na razie elektrownie stoją w miastach i zasilają je bezpośrednio siecią niskiego napięcia (nN). Gdy pojawią się pierwsze linie, dostaniesz wiadomość i krótki samouczek.',
    res: 'Na razie nie umiemy tu nic zbudować.', gen: 'Brak dostępnych elektrowni.',
  };
  UI.catOf = (id) => { const c = CATS.find((q) => q.items().indexOf(id) >= 0); return c ? c.id : 'gen'; };
  UI.openFly = function (cat, mark) {
    const G = UI.G, fly = $('#fly'), c = CATS.find((q) => q.id === cat); UI.flyCat = cat;
    document.querySelectorAll('#tools .tool').forEach((b) => b.classList.toggle('on', b.dataset.cat === cat));
    let html = '<div class="fly-h">' + esc(c.name) + '</div><div class="fly-list">', shown = 0;
    for (const id of c.items()) {
      const t = PN.TECH[id]; if (!t || !PN.techAvail(G, id)) continue; // the future stays hidden until history brings it
      const isNew = PN.techIsNew(G, id); shown++;
      html += '<div class="item' + (isNew ? ' new' : '') + (mark === id ? ' mark' : '') + '" data-tech="' + id + '" title="' + esc(t.desc || '') + '"><span class="ic" data-icon="' + (t.cat === 'line' ? 'line:' + id : id) + '"></span><span class="tx"><b>' + esc(t.name) + (isNew ? '<i class="badge">nowość</i>' : '') + '</b><small>' + UI.techLine(id) + '</small></span></div>';
    }
    html += '</div>';
    if (!shown) html += '<p class="fly-empty">' + esc(FLY_EMPTY[cat] || FLY_EMPTY.res) + '</p>';
    else if (cat === 'grid') html += '<p class="fly-tip">Linia: wybierz napięcie, kliknij początek (elektrownia, miasto albo puste pole), potem koniec. Krąg na mapie pokazuje zasięg.</p>';
    fly.innerHTML = html; fly.hidden = false;
    const mk = mark && fly.querySelector('.item.mark'); if (mk) mk.scrollIntoView({ block: 'nearest' });
    fly.querySelectorAll('[data-icon]').forEach((s) => {
      const k = s.dataset.icon;
      if (k.indexOf('line:') === 0) s.appendChild(lineIcon(k.slice(5)));
      else { const ic = PN.Sprites.icon(k, 40); s.appendChild(ic); }
    });
  };
  function lineIcon(id) {
    const c = S.canvas(80, 80), x = c.getContext('2d'); c.style.width = c.style.height = '40px'; x.scale(2, 2);
    const t = PN.TECH[id], w = { line_sn: 1, line_60: 1.3, line_110: 1.6, line_220: 2, line_345: 2.4, line_400: 2.5, line_500: 2.8, line_750: 3.2, hvdc: 2.6, cable_sea: 1.8 }[id] || 1.5;
    x.strokeStyle = id === 'cable_sea' ? S.th.water : S.th.ink; x.lineWidth = w; x.lineCap = 'round';
    if (id === 'hvdc') x.setLineDash([7, 2, 2, 2]); if (id === 'cable_sea') x.setLineDash([6, 3]);
    x.beginPath(); x.moveTo(4, 30); x.quadraticCurveTo(20, 24, 36, 12); x.stroke(); x.setLineDash([]);
    x.lineWidth = 1; for (const [px, py] of [[12, 26], [24, 19]]) { x.beginPath(); x.moveTo(px - 3, py - 4); x.lineTo(px + 3, py + 4); x.stroke(); }
    x.font = '700 9px Caveat, cursive'; x.fillStyle = S.th.ink; x.fillText(t.short, 3, 12);
    return c;
  }
  UI.lineIcon = lineIcon;
  UI.closeFly = function () { $('#fly').hidden = true; UI.flyCat = null; document.querySelectorAll('#tools .tool').forEach((b) => b.classList.toggle('on', UI.tool && ((b.dataset.cat === 'demolish' && UI.tool.kind === 'demolish')))); };
  UI.techLine = function (id) {
    const G = UI.G, t = PN.TECH[id], y = PN.ym(G);
    if (t.cat === 'line') return esc(UI.kv(id) || '') + ' · ' + PN.mw(PN.tv(t.cap, y)) + ' · do ' + t.maxKm + ' km · ' + PN.money(PN.tv(t.cost, y)) + '/km';
    if (id === 'substation') return PN.money(PN.tv(t.cost, y));
    if (t.cat === 'res') { const out = t.outputMt ? PN.tv(t.outputMt, y) : PN.tv(t.outputGJ, y) / 1e6; return (t.outputMt ? PN.nf(out, 1) + ' mln t/rok' : PN.nf(out, 0) + ' PJ/rok') + ' · ' + PN.money((t.outputMt ? out * 1e6 : out * 1e6) * PN.tv(t.capexPerT || t.capexPerGJ, y, G.code)); }
    const u = PN.unitMW(t, y, G.code) || 0, capex = PN.tv(t.capex, y, G.code);
    return 'blok ' + PN.mw(u) + ' · ' + PN.money(capex * u * 1000) + ' · ' + PN.months(PN.tv(t.build, y, G.code));
  };

  UI.kv = function (id) { const t = PN.TECH[id]; if (!t) return ''; return Array.isArray(t.kvLabel) ? PN.tv(t.kvLabel, PN.ym(UI.G)) : t.kvLabel; };
  UI.setTool = function (tool) {
    UI.tool = tool; UI.V.tool = tool; UI.V.lineStart = null; UI.pendingDemolish = null;
    document.body.classList.toggle('tooling', !!tool);
    $('#toolhint').hidden = !tool;
    if (tool) {
      const t = PN.TECH[tool.id];
      $('#toolhint').innerHTML = tool.kind === 'demolish' ? '<b>Burzenie</b> – kliknij obiekt lub linię. <kbd>Esc</kbd> kończy.' :
        tool.kind === 'line' ? '<b>' + esc(t.name) + '</b> – kliknij początek (elektrownia, miasto, stacja lub puste pole), potem koniec. <kbd>Esc</kbd> kończy.' :
          '<b>' + esc(t.name) + '</b> – kliknij pole na mapie. ' + esc(t.desc || '') + ' <kbd>Esc</kbd> kończy.';
      if (tool.id === 'wind' || tool.id === 'wind_offshore') UI.setOverlay('wind');
      else if (tool.id === 'solar' || tool.id === 'csp') UI.setOverlay('solar');
      else if (['coal_mine', 'lignite_mine', 'gas_well'].indexOf(tool.id) >= 0) UI.setOverlay('res');
    } else { $('#tip').hidden = true; }
    document.querySelectorAll('#tools .tool').forEach((b) => b.classList.toggle('on', !!tool && tool.kind === 'demolish' && b.dataset.cat === 'demolish'));
  };
  UI.setOverlay = function (ov) { UI.V.overlay = ov; document.querySelectorAll('#layers button[data-ov]').forEach((x) => x.classList.toggle('on', x.dataset.ov === ov)); };
  UI.setSpeed = function (s) { UI.speed = s; document.querySelectorAll('#speed button').forEach((b) => b.classList.toggle('on', +b.dataset.s === s)); };

  /* ------------------------------------------------------------- tooltips */
  UI.tip = function (sx, sy, html, ok) {
    const t = $('#tip'); if (!html) { t.hidden = true; return; }
    t.innerHTML = html; t.hidden = false; t.classList.toggle('bad', ok === false);
    const r = t.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
    let x = sx + 18, y = sy + 18; if (x + r.width > W - 8) x = sx - r.width - 14; if (y + r.height > H - 8) y = sy - r.height - 14;
    t.style.left = Math.max(8, x) + 'px'; t.style.top = Math.max(8, y) + 'px';
  };
  UI.buildTip = function (c) {
    const t = PN.TECH[c.id];
    let s = '<b>' + esc(t.name) + '</b>';
    if (!c.ok) s += '<div class="why">' + esc(c.why) + '</div>';
    if (c.info && c.info.length) s += '<ul>' + c.info.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul>';
    if (c.cost != null) s += '<div class="cost">' + (c.capMW ? PN.mw(c.capMW) + ' · ' : '') + PN.money(c.cost) + (c.buildM ? ' · budowa ' + PN.months(c.buildM) : '') + '</div>';
    return s;
  };
  UI.lineTip = function (c, type) {
    const t = PN.TECH[type];
    let s = '<b>' + esc(t.name) + '</b>';
    if (c.km) s += '<div class="cost">' + PN.nf(c.km, 0) + ' km · ' + PN.mw(c.cap) + ' · ' + PN.money(c.cost) + ' · ' + PN.months(c.buildM) + '</div><div>Straty przy pełnym obciążeniu: ' + PN.pct(c.fullLoss || 0, 1) + '</div>';
    if (!c.ok && c.why) s += '<div class="why">' + esc(c.why) + '</div>';
    return s;
  };

  /* ------------------------------------------------------------------ HUD */
  UI.hud = function (force) {
    const G = UI.G; if (!G) return;
    const now = performance.now(); if (!force && now - UI.lastHud < 250) return; UI.lastHud = now;
    const st = G.stats || {};
    $('#date').textContent = PN.MONTHS[G.m] + ' ' + G.y;
    $('#era').textContent = UI.era();
    $('#money').textContent = PN.money(G.money);
    const pf = st.profit || 0; const mp = $('#mprofit'); mp.textContent = PN.money(pf, { sign: true }) + '/mies.'; mp.className = 'sub ' + (pf >= 0 ? 'pos' : 'neg');
    $('#rep').textContent = PN.nf(G.rep, 0);
    $('#repbar').style.width = PN.clamp(G.rep, 0, 100) + '%';
    const peak = st.peak || 0, cap = st.capTot || 0;
    $('#supply').textContent = PN.mw(peak) + ' / ' + PN.mw(cap);
    const q = G.lastQ == null ? 1 : G.lastQ; const sq = $('#served'); sq.textContent = 'zasilono ' + PN.pct(q, q < 0.995 ? 1 : 0); sq.className = 'sub ' + (q >= 0.985 ? 'pos' : q >= 0.9 ? 'warn' : 'neg');
    $('#tariff').textContent = PN.price(PN.curve(G.sc.price, PN.ym(G)));
    const co = PN.helpers(G).co2g(); $('#co2').textContent = co > 0 ? PN.nf(co, 0) + ' g CO₂/kWh' : 'CO₂ –';
    const nudge = UI.speed === 0 && !UI.modalOpen && G.months < 2 && G.nodes.some((n) => n.type === 'plant');
    const b1 = document.querySelector('#speed button[data-s="1"]'); if (b1) b1.classList.toggle('nudge', nudge);
    if (G.debt > 0) { $('#debt').hidden = false; $('#debt').textContent = 'dług ' + PN.money(G.debt); } else $('#debt').hidden = true;
  };
  UI.era = function () {
    const y = PN.ym(UI.G);
    const E = UI.G.code === 'PL'
      ? [[1914.6, 'Belle Époque pod zaborami'], [1918.9, 'Wielka Wojna'], [1939.7, 'II Rzeczpospolita'], [1945.4, 'II wojna światowa'], [1956, 'Odbudowa i plan sześcioletni'], [1970, 'Elektryfikacja kraju'], [1989.5, 'Epoka wielkich bloków'], [2004.3, 'Transformacja ustrojowa'], [2020, 'W Unii Europejskiej'], [2036, 'Transformacja energetyczna'], [9999, 'Przyszłość (scenariusz)']]
      : [[1893, 'Wojna prądów'], [1929.8, 'Era Insulla'], [1945.6, 'Wielki Kryzys i New Deal'], [1973.8, 'Złoty wiek wzrostu'], [1996, 'Kryzysy naftowe i PURPA'], [2020, 'Rynki i gaz łupkowy'], [2036, 'Boom AI'], [9999, 'Przyszłość (scenariusz)']];
    for (const [t, n] of E) if (y < t) return n; return '';
  };

  /* --------------------------------------------------------------- panel */
  UI.showPanel = function (open) { $('#panel').classList.toggle('closed', !open); };
  UI.openTab = function (tab) {
    UI.tab = tab;
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab && !UI.sel));
    UI.refreshInfo(true);
  };
  UI.traceFor = function (o) {
    const G = UI.G; if (!o || o.a) return null;
    const sinks = o.type === 'city' || o.type === 'load' || o.type === 'mine', top = sinks ? o.srcTop : o.dstTop;
    if (!top || !(o.type === 'plant' || o.type === 'border' || sinks)) return null;
    return { dir: sinks ? 'up' : 'down', lines: PN.traceLines(G, o, sinks ? 'up' : 'down'), nodes: new Map(top.list.map(([id, e]) => [id, e / top.tot])) };
  };
  UI.select = function (obj) {
    UI.sel = obj; UI.V.sel = obj; UI.pendingDemolish = null; UI.V.trace = UI.traceFor(obj);
    document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', !obj && b.dataset.tab === UI.tab));
    if (obj) UI.showPanel(true);
    UI.refreshInfo(true);
  };
  UI.refreshInfo = function (force) {
    const G = UI.G; if (!G) return;
    const el = $('#info');
    if (!force && el.matches(':hover') && UI.sel) { /* keep stable while hovering buttons */ }
    let html = '';
    const o = UI.sel;
    if (o && (o.removed || (o.a ? !G.byId[o.id] : o.type !== 'city' && !G.byId[o.id]))) { UI.sel = null; UI.V.sel = null; }
    if (UI.sel) html = UI.objHtml(UI.sel);
    else if (UI.tab === 'overview') html = UI.overviewHtml();
    else if (UI.tab === 'fin') html = UI.finHtml();
    else if (UI.tab === 'goals') html = UI.goalsHtml();
    else if (UI.tab === 'chron') html = UI.chronHtml();
    el.innerHTML = html;
    el.querySelectorAll('canvas[data-chart]').forEach((c) => UI.drawChart(c, c.dataset.chart));
  };

  const row = (k, v, cls) => '<div class="kv' + (cls ? ' ' + cls : '') + '"><span>' + k + '</span><b>' + v + '</b></div>';
  const btn = (act, label, cost, dis, extra) => '<button class="act' + (dis ? ' dis' : '') + '" data-act="' + act + '"' + (dis ? ' disabled' : '') + (extra || '') + '>' + label + (cost != null ? ' <span class="c">' + PN.money(cost) + '</span>' : '') + '</button>';

  UI.overviewHtml = function () {
    const G = UI.G, st = G.stats || {}, y = PN.ym(G), H = PN.helpers(G);
    let s = '<h2>' + esc(G.sc.name) + ' · ' + G.y + '</h2><p class="era">' + esc(UI.era()) + '</p>';
    s += '<div class="kvs">' + row('Szczyt zapotrzebowania', PN.mw(st.peak || 0)) + row('Moc zainstalowana', PN.mw(st.capTot || 0)) + row('Energia dostarczona', PN.mwh(st.servedE || 0) + '/mies.') + row('Straty w sieci', PN.pct((st.lossE || 0) / Math.max(1, st.servedE || 1), 1)) + row('Taryfa', PN.price(PN.curve(G.sc.price, y))) + (PN.co2Price(G) > 0 ? row(G.code === 'PL' ? 'Cena uprawnień CO₂ (EU ETS)' : 'Cena CO₂ (programy stanowe)', PN.money(PN.co2Price(G)) + '/t') : '') + row('Udział OZE (12 mies.)', PN.pct(H.resShare(), 0)) + '</div>';
    const adv = UI.advice();
    if (adv.length) s += '<h3>Doradca</h3><ul class="advice">' + adv.map((a) => '<li' + (a.p >= 8 ? ' class="hot"' : '') + '>' + (a.id ? '<a href="#" data-goto="' + a.id + '">' + esc(a.t) + '</a>' : esc(a.t)) + '</li>').join('') + '</ul>';
    s += '<h3>Doba w tym miesiącu</h3><canvas class="chart" data-chart="day" width="560" height="250"></canvas>';
    s += '<div class="legend" id="dayLegend">' + UI.legendHtml() + '</div>';
    if (G.offers.length) {
      s += '<h3>Oferty</h3>';
      for (const o of G.offers) { const c = G.byId[o.city]; s += '<div class="offer"><b>' + esc(o.company) + '</b> chce zbudować ' + (o.ai ? 'centrum obliczeń AI' : 'centrum danych') + ' (okolice: ' + esc(c ? PN.cityName(c, G.y) : '?') + '): docelowo <b>' + PN.mw(o.mw) + '</b>, taryfa +' + PN.pct(o.premium) + '.<div class="row">' + btn('offer-yes:' + o.id, 'Podpisz umowę') + btn('offer-no:' + o.id, 'Odrzuć') + '</div></div>'; }
    }
    if ((G.ippOffers || []).length || G.ippScope) s += UI.ippHtml();
    const act = G.sc.missions.filter((m) => G.missions[m.id] && G.missions[m.id].state === 'active').slice(0, 3);
    if (act.length) { s += '<h3>Zadania</h3>'; for (const m of act) s += UI.missionHtml(m); }
    if (G.satR > 0.02) { const rc = PN.ruralAllCost(G); s += '<h3>Elektryfikacja wsi</h3><p class="note">Wieś zelektryfikowana: ' + PN.pct(H.ruralShare(), 0) + '. Program obejmuje wszystkie powiaty z dostępem do prądu.</p>' + (rc > 0 ? btn('rural-all', 'Kolejny etap programu w całym kraju', rc, G.money < rc) : '<p class="note">Wszystkie zasilane powiaty mają pełną elektryfikację albo brak im prądu.</p>'); }
    const dmg = PN.repairAllCost(G); if (dmg > 0) s += '<div class="warnbox">Zniszczone obiekty czekają na odbudowę.' + btn('repair-all', 'Odbuduj wszystko', dmg, G.money < dmg) + '</div>';
    s += '<h3>Ustawienia</h3><label class="chk"><input type="checkbox" id="autoDist" ' + (G.settings.autoDist ? 'checked' : '') + '> Automatyczna rozbudowa sieci miejskich (nN)</label><label class="chk"><input type="checkbox" id="pauseEv" ' + (G.settings.pauseOnEvents ? 'checked' : '') + '> Pauza przy ważnych wydarzeniach</label>';
    return s;
  };
  UI.ippHtml = function () {
    const G = UI.G, net = PN.ippNet(G), mine = G.nodes.filter((n) => n.owner === 'ipp');
    let s = '<h3>Inwestorzy prywatni</h3>';
    const wait = mine.filter((n) => n.built && !n.links.length);
    s += '<p class="note">Elektrownie inwestorów: ' + mine.length + ' (' + PN.mw(mine.reduce((a, n) => a + n.cap, 0)) + ')' + (wait.length ? ', czeka na przyłączenie: <b class="neg">' + wait.length + '</b>' : '') + '. Kupujesz ich energię po cenie z umowy; z taryfy zostaje Ci ' + PN.price(net) + ' na wytworzenie 1 MWh.</p>';
    for (const o of G.ippOffers || []) {
      const t = PN.TECH[o.tech], near = o.near != null ? G.byId[o.near] : null;
      s += '<div class="offer"><b>' + esc(o.company) + '</b>: ' + esc(t.name.toLowerCase()) + ' ' + PN.mw(o.cap) + (near ? ' (okolice: ' + esc(PN.cityName(near, G.y)) + ')' : '') + '. Odkup ' + PN.price(o.ppa) + ' – marża <b class="' + (net - o.ppa >= 0 ? 'pos' : 'neg') + '">' + PN.price(net - o.ppa) + '</b>.<div class="row">' + btn('ipp-yes:' + o.id, 'Przyłącz') + btn('ipp-no:' + o.id, 'Odrzuć') + btn('ipp-show:' + o.id, 'Pokaż') + '</div></div>';
    }
    return s;
  };
  /* advisor: the few things that most need the player's attention right now */
  UI.advice = function () {
    const G = UI.G, y = PN.ym(G), out = [], st = G.stats || {};
    const name = (n) => (n.type === 'city' ? PN.cityName(n, G.y) : n.name);
    for (const n of G.nodes) if ((n.type === 'plant' || n.type === 'mine') && n.built && !n.links.length) out.push({ p: 9, t: name(n) + ' nie ma połączenia z siecią.', id: n.id });
    const short = G.cities.filter((c) => PN.cityOwned(G, c) && c.demE > 0 && c.served < 0.95).sort((a, b) => (b.demPk - b.servedPk) - (a.demPk - a.servedPk));
    for (const c of short.slice(0, 2)) out.push({ p: 8, t: name(c) + ': brakuje ok. ' + PN.mw(Math.max(0, (c.demPk || 0) - (c.servedPk || 0))) + ' w szczycie. Dobuduj moc albo linię.', id: c.id });
    const hot = G.lines.filter((l) => l.built && !l.local && l.load > 0.98).sort((a, b) => b.load - a.load);
    if (hot.length) out.push({ p: 7, t: 'Przeciążone linie: ' + hot.length + '. Najgorsza: ' + name(G.byId[hot[0].a]) + ' – ' + name(G.byId[hot[0].b]) + '.', id: hot[0].id });
    const dmg = G.nodes.concat(G.lines).filter((o) => o.dmg).length; if (dmg) out.push({ p: 8, t: 'Zniszczone obiekty: ' + dmg + '. Odbuduj je (przycisk poniżej).' });
    if (st.peak > 0 && st.capTot > 0 && st.capTot < st.peak * 1.1) out.push({ p: 6, t: 'Rezerwa mocy tylko ' + PN.pct(st.capTot / st.peak - 1) + '. Zacznij budowę nowych bloków – budowa trwa latami.' });
    const dry = G.nodes.filter((n) => n.type === 'plant' && n.built && PN.TECH[n.tech].dispatch === 'thermal' && n.fuelOK < 0.5);
    if (dry.length) out.push({ p: 9, t: dry[0].name + ': brak paliwa' + (dry[0].tech === 'lignite' ? ' – zbuduj odkrywkę na złożu obok' : '') + '.', id: dry[0].id });
    const net = PN.curve(G.sc.price, y) - PN.curve(G.sc.dcost, y);
    const loss = G.nodes.filter((n) => n.type === 'plant' && n.built && n.owner !== 'ipp' && n.on !== false && PN.TECH[n.tech].dispatch === 'thermal' && n.mc > net && (n.gen || 0) > 0).sort((a, b) => b.mc - a.mc);
    if (loss.length) out.push({ p: 6, t: 'Nierentowne: ' + loss[0].name + (loss.length > 1 ? ' i ' + (loss.length - 1) + ' inne' : '') + ' – koszt zmienny ' + PN.price(loss[0].mc) + ' przewyższa marżę z taryfy (' + PN.price(net) + '). Zastąp nowocześniejszym blokiem.', id: loss[0].id });
    const old = G.nodes.filter((n) => n.type === 'plant' && n.built && n.owner !== 'ipp' && n.age > PN.TECH[n.tech].life);
    const waitI = G.nodes.filter((n) => n.owner === 'ipp' && n.built && !n.links.length);
    if (waitI.length) out.push({ p: 8, t: waitI[0].name + ' (inwestor ' + waitI[0].company + ') czeka na przyłączenie – poprowadź do niej linię.', id: waitI[0].id });
    if (old.length) out.push({ p: 4, t: 'Bloki po okresie eksploatacji: ' + old.length + ' (np. ' + old[0].name + '). Remont albo zastąpienie.', id: old[0].id });
    const fresh = PN.GEN_ORDER.concat(PN.STORE_ORDER, PN.LINE_ORDER).filter((id) => PN.techAvail(G, id) && G.techSeen && G.techSeen[id] > y - 1.5);
    if (fresh.length) out.push({ p: 5, t: 'Nowa technologia: ' + fresh.map((id) => PN.TECH[id].name).join(', ') + '.' });
    if (G.satR > 0.05 && PN.helpers(G).ruralShare() < G.satR * 0.5 && PN.ruralAllCost(G) > 0) out.push({ p: 5, t: 'Wieś czeka na prąd: uruchom program elektryfikacji (niżej).' });
    if (G.debt > PN.creditLimit(G) * 0.8) out.push({ p: 7, t: 'Dług blisko limitu kredytowego – uważaj na płynność.' });
    if (!G.nodes.some((n) => n.type === 'plant')) out.push({ p: 10, t: 'Zbuduj pierwszą elektrownię: Elektrownie → ' + PN.TECH.steam_dc.name + ', w obrębie miasta.' });
    return out.sort((a, b) => b.p - a.p).slice(0, 5);
  };
  UI.legendHtml = function () {
    const st = UI.G.stats; if (!st || !st.curve) return '';
    return Object.keys(st.curve.tech).filter((k) => st.curve.tech[k].some((v) => v > 0.001)).map((k) => '<span><i style="background:' + PN.TECH[k].color + '"></i>' + esc(PN.TECH[k].short) + '</span>').join('') + '<span><i class="dash"></i>zapotrzebowanie</span>';
  };
  UI.missionHtml = function (m) {
    const st = UI.G.missions[m.id] || {}; const p = st.p || 0;
    const cls = st.state === 'done' ? 'done' : st.state === 'failed' ? 'failed' : '';
    return '<div class="mission ' + cls + '"><b>' + esc(m.title) + '</b> <small>do ' + m.deadline + '</small><p>' + esc(m.text) + '</p><div class="bar"><i style="width:' + Math.round(p * 100) + '%"></i></div><small>' + (st.state === 'done' ? 'Wykonane w ' + Math.floor(st.when) + ' r.' : st.state === 'failed' ? 'Nie udało się' : 'Postęp ' + PN.pct(p) + ' · nagroda ' + PN.money(m.reward.money || 0)) + '</small></div>';
  };
  UI.goalsHtml = function () {
    const G = UI.G; let s = '<h2>Zadania</h2>';
    const list = G.sc.missions.filter((m) => G.missions[m.id] && G.missions[m.id].state !== 'hidden');
    if (!list.length) s += '<p>Zadania pojawią się wraz z epokami.</p>';
    for (const m of list.slice().reverse()) s += UI.missionHtml(m);
    const fut = G.sc.missions.filter((m) => !G.missions[m.id] || G.missions[m.id].state === 'hidden');
    if (fut.length) s += '<p class="note">Kolejne zadania przyniesie historia – jeszcze ' + fut.length + '.</p>';
    return s;
  };
  UI.finHtml = function () {
    const G = UI.G, st = G.stats || {}, F = st.F || {};
    let s = '<h2>Finanse</h2><div class="kvs">' + row('Gotówka', PN.money(G.money)) + row('Dług', PN.money(G.debt)) + row('Limit kredytu', PN.money(PN.creditLimit(G))) + row('Oprocentowanie', PN.pct(PN.loanRate(G), 1) + (PN.esgPremium(G) > 0.0005 ? ' (w tym ESG ' + PN.pct(PN.esgPremium(G), 1) + ')' : '')) + row('Wartość majątku', PN.money(PN.assetValue(G))) + '</div>';
    const cl = PN.creditLimit(G), step = Math.max(G.sc.money, cl * 0.1);
    s += '<div class="row">' + btn('loan', 'Weź kredyt', step, cl - G.debt < 1) + btn('repay', 'Spłać', Math.min(G.debt, step), G.debt <= 0 || G.money <= 0) + '</div>';
    s += '<h3>Ostatni miesiąc</h3><div class="kvs">';
    const lines = [['Sprzedaż energii', F.rev], ['Paliwo', -F.fuel], ['Uprawnienia CO₂', -F.co2], ['Eksploatacja elektrowni', -F.om], ['Utrzymanie linii i stacji', -F.grid], ['Sieci dystrybucyjne', -F.dist], ['Obsługa odbiorców', -F.retail], ['Import energii', -F.imp], ['Energia od inwestorów prywatnych', -F.ipp], ['Kopalnie (saldo)', -F.mine], ['Kary umowne', -F.penalty], ['Odsetki', -F.interest]];
    for (const [k, v] of lines) if (v && Math.abs(v) > 1) s += row(k, PN.money(v), v < 0 ? 'neg' : 'pos');
    s += row('Wynik', PN.money(F.profit || 0), (F.profit || 0) < 0 ? 'neg tot' : 'pos tot') + '</div>';
    s += '<h3>Historia</h3><canvas class="chart" data-chart="hist" width="560" height="230"></canvas><div class="legend"><span><i style="background:' + S.th.ink + '"></i>szczyt zapotrzebowania</span><span><i style="background:' + S.th.orange + '"></i>moc zainstalowana</span></div>';
    s += '<canvas class="chart" data-chart="mix" width="560" height="200"></canvas><p class="note">Struktura produkcji energii w kolejnych latach.</p>';
    return s;
  };
  UI.chronHtml = function () {
    const G = UI.G; let s = '<h2>Kronika</h2><ul class="chron">';
    for (const n of G.news.slice(0, 60)) s += '<li class="' + n.kind + '"><span class="d">' + PN.MONTHS_SHORT[n.m] + ' ' + n.y + '</span> ' + (n.ev ? '<a href="#" data-ev="' + esc(n.ev) + '">' + esc(n.text) + '</a>' : esc(n.text)) + '</li>';
    s += '</ul>';
    return s;
  };

  UI.objHtml = function (o) {
    const G = UI.G, y = PN.ym(G);
    let s = '<button class="close" data-act="close" aria-label="Zamknij">×</button>';
    if (o.a && o.local) { // a plant inside a town feeds the town's own low-voltage network
      const A = G.byId[o.a], B = G.byId[o.b], P = A && A.type !== 'city' ? A : B, Cc = P === A ? B : A;
      s += '<h2>Sieć niskiego napięcia (nN)</h2><p class="era">' + esc(nm(P)) + ' – ' + esc(nm(Cc)) + '</p>';
      s += '<p>' + (P && P.tech === 'steam_dc' ? 'Elektrownia stoi w mieście i zasila je prądem stałym 110 V wprost, bez linii przesyłowej. Prądu stałego nie da się transformować, więc dociera najwyżej ok. 1,5 km – dlatego każde miasto stawiało własną elektrownię.' : 'Elektrownia stoi w obrębie miasta i oddaje prąd wprost do sieci miejskiej przez własną stację. Linia przesyłowa nie jest potrzebna.') + '</p>';
      s += '<div class="kvs">' + row('Przepływ w szczycie', PN.mw(Math.abs(o.flow || 0))) + '</div><p class="note">Żeby wysłać prąd do innego miasta, zbuduj linię z menu Sieć.</p>';
      return s;
    }
    if (o.a) { // line
      const t = PN.TECH[o.type] || { name: 'Połączenie lokalne' }, A = G.byId[o.a], B = G.byId[o.b];
      s += '<h2>' + esc(t.name) + '</h2><p class="era">' + esc(nm(A)) + ' – ' + esc(nm(B)) + '</p><div class="kvs">';
      s += row('Napięcie', esc(UI.kv(o.type) || '–')) + row('Długość', PN.nf(o.km, 0) + ' km' + (t.maxKm && o.km > t.maxKm ? ' (ponad ' + t.maxKm + ' km – duże straty)' : ''), t.maxKm && o.km > t.maxKm ? 'warn' : '') + row('Przepustowość', PN.mw(o.cap));
      if (!o.built) s += row('Budowa', PN.pct(o.prog) + ' · zostało ' + PN.months((1 - o.prog) * o.buildM));
      else { s += row('Przepływ w szczycie', PN.mw(Math.abs(o.flow)) + ' (' + PN.pct(o.load) + ' maks.)', o.load > 0.98 ? 'neg' : ''); s += row('Straty (miesiąc)', PN.mwh(o.lossE || 0)); }
      if (o.out > y) s += row('Stan', 'awaria – wyłączona', 'neg'); if (o.dmg) s += row('Stan', 'zniszczona', 'neg');
      s += row('Koszt budowy', PN.money(o.cost || 0)) + '</div>';
      if (o.load > 0.98) s += '<p class="hint">Linia jest przeciążona: zbuduj równoległą albo linię wyższego napięcia.</p>';
      s += '<div class="row">' + (o.dmg ? btn('repair', 'Napraw', PN.repairCost(G, o), G.money < PN.repairCost(G, o)) : '') + btn('demolish', UI.pendingDemolish === o ? 'Na pewno wyburzyć?' : 'Wyburz') + '</div>';
      return s;
    }
    if (o.type === 'city') {
      const name = PN.cityName(o, G.y), own = PN.cityOwned(G, o);
      s += '<h2>' + esc(name) + '</h2>' + (name !== o.name ? '<p class="era">dziś ' + esc(o.name) + '</p>' : '');
      if (o.src && o.src.note) s += '<p class="note">' + esc(o.src.note) + '</p>';
      s += '<div class="kvs">' + row('Ludność miasta', PN.nf(o.pop, 0)) + row('Okoliczne wsie', PN.nf(o.popR, 0));
      if (!own) { s += '</div><p class="hint">To miasto leży poza Twoim obszarem działania (do ' + (o.region === 3 ? '1945' : o.region === 2 ? '1922' : '1920') + ' r.).</p>'; return s; }
      s += row('Zelektryfikowane: miasto', PN.pct(o.eU, 1)) + row('Zelektryfikowane: wieś', PN.pct(o.eR, 1)) + row('Możliwe dziś (miasto)', PN.pct(G.satU, 1)) + row('Zapotrzebowanie w szczycie', PN.mw(o.demPk || 0)) + row('Zasilono', o.demE > 0 ? PN.pct(o.served, 1) : '–', o.demE > 0 && o.served < 0.97 ? 'neg' : '') + row('Sieć miejska nN', PN.mw(o.distCap) + ' / potrzeba ' + PN.mw(o.potU || 0), o.distCap < (o.potU || 0) * 0.95 ? 'warn' : '') + row('Elektryfikacja wsi', o.ruralLvl + ' / 4') + '</div>';
      if (!o.energized) s += '<p class="hint">Miasto nie ma jeszcze źródła prądu. Zbuduj elektrownię w mieście albo doprowadź linię z elektrowni.</p>';
      s += UI.flowList(o.srcTop, 'Skąd płynie prąd', 'Udział w energii zużytej w tym miesiącu. Na mapie żółta poświata pokazuje drogę prądu.');
      const step = PN.distStepMW(o), dc = PN.distCostFor(G, step);
      s += '<div class="row">' + btn('dist', 'Rozbuduj sieć nN (+' + PN.mw(step) + ')', dc, G.money < dc) + '</div>';
      if (G.satR > 0.001 || o.ruralLvl > 0) { const rc = PN.ruralCostFor(G, o); s += '<div class="row">' + btn('rural', o.ruralLvl >= 4 ? 'Wsie zelektryfikowane' : 'Elektryfikacja wsi (etap ' + (o.ruralLvl + 1) + '/4)', o.ruralLvl >= 4 ? null : rc, o.ruralLvl >= 4 || G.money < rc) + '</div><p class="note">Każdy etap doprowadza linie SN i stacje transformatorowe do kolejnej ćwiartki okolicznych wsi.</p>'; }
      else s += '<p class="note">Elektryfikacja wsi stanie się możliwa, gdy pojawią się pierwsi chętni odbiorcy na wsi (lata 20.–30.). To program, nie rysowanie linii: każdy etap sam doprowadza linie SN i transformatory do części wsi wokół miasta.</p>';
      return s;
    }
    const t = PN.TECH[o.tech] || {};
    if (o.type === 'plant' && o.owner === 'ipp') {
      s += '<h2>' + esc(o.name) + '</h2><p class="era"><b class="ownr">Elektrownia prywatna</b> · ' + esc(t.name) + ' · inwestor ' + esc(o.company) + '</p>';
      s += '<div class="kvs">' + row('Stan', !o.built ? 'w budowie ' + PN.pct(o.prog) : o.dmg ? 'zniszczona – inwestor odbudowuje' : !o.links.length ? 'czeka na przyłączenie' : 'pracuje', !o.built ? 'warn' : !o.links.length ? 'neg' : '') + row('Moc', PN.mw(o.cap));
      if (!o.built) s += row('Zostało', PN.months((1 - o.prog) * o.buildM));
      else s += row('Produkcja (miesiąc)', PN.mwh(o.gen || 0)) + row('Wykorzystanie mocy', PN.pct(o.lastCF || 0, 0)) + row('Płacisz inwestorowi', PN.money((o.gen || 0) * o.ppa) + '/mies.');
      s += row('Cena z umowy', PN.price(o.ppa)) + row('Marża z taryfy', PN.price(PN.ippNet(G) - o.ppa), PN.ippNet(G) - o.ppa < 0 ? 'neg' : 'pos') + row('Umowa do', Math.floor(o.until) + ' r.') + row('Nakłady inwestora', PN.money(o.capex || 0)) + '</div>';
      if (o.built && !o.links.length) s += '<p class="hint">Inwestor czeka na przyłączenie' + (o.waiting > 12 ? ' już ponad rok – reputacja spada co miesiąc, a po trzech latach projekt przepadnie' : ': zostało ok. ' + PN.months(Math.max(0, 12 - (o.waiting || 0))) + ' do skargi') + '. Zbuduj linię z menu Sieć.</p>';
      s += UI.connHtml(o) + UI.flowList(o.dstTop, 'Dokąd płynie prąd');
      s += '<p class="note">Elektrownia należy do inwestora: nie rozbudujesz jej, nie wyłączysz ani nie wyburzysz. Ty odpowiadasz za przyłączenie i odbiór energii.</p>';
      return s;
    }
    if (o.type === 'plant') {
      s += '<h2>' + esc(o.name) + '</h2><p class="era">' + esc(t.name) + ' · od ' + Math.floor(o.since) + ' r.</p>';
      const status = !o.built ? 'w budowie ' + PN.pct(o.prog) : o.dmg ? 'zniszczona' : o.on === false ? 'wyłączona' : o.age > t.life ? 'po okresie projektowym' : 'pracuje';
      s += '<div class="kvs">' + row('Stan', status, o.dmg ? 'neg' : !o.built ? 'warn' : '') + row('Moc', o.units + ' × ' + PN.mw(o.unitMW) + ' = ' + PN.mw(o.cap));
      if (!o.built) s += row('Zostało', PN.months((1 - o.prog) * o.buildM));
      if (o.built) {
        s += row('Produkcja (miesiąc)', PN.mwh(o.gen || 0)) + row('Wykorzystanie mocy', PN.pct(o.lastCF || 0, 0));
        if (t.dispatch === 'wind' || t.dispatch === 'solar') s += row('Potencjał miejsca', PN.pct(o.cf, 0));
        if (t.eff) s += row('Sprawność', PN.pct(o.eff, 1));
        if (t.fuel && PN.FUELS[t.fuel] && t.dispatch === 'thermal') s += row('Paliwo', PN.money(o.fuelPrice || 0) + '/GJ' + (o.fuelOK < 0.99 ? ' · brak ' + PN.pct(1 - o.fuelOK) : ''), o.fuelOK < 0.99 ? 'neg' : '');
        s += row('Koszt zmienny', PN.price(o.mc || 0));
        if (o.co2) s += row('Emisja CO₂', PN.nf(o.co2, 0) + ' t/mies.');
        if (t.dispatch === 'storage') s += row('Pojemność', PN.mwh(o.cap * o.hours)) + row('Oddano / pobrano', PN.mwh(o.dis || 0) + ' / ' + PN.mwh(o.chg || 0));
        s += row('Wiek', PN.nf(o.age || 0, 0) + ' / ' + t.life + ' lat', o.age > t.life ? 'warn' : '');
        if (t.pollution && !o.fgd) s += row('Odsiarczanie spalin', 'brak', y > 1990 ? 'warn' : '');
      }
      s += row('Nakłady', PN.money(o.cost || 0)) + '</div>';
      if (t.fuel === 'lignite' && o.built && o.fuelOK < 0.99) s += '<p class="hint">Elektrowni brakuje węgla brunatnego. Zbuduj odkrywkę na złożu w promieniu ok. 25 km.</p>';
      if (o.built && !o.links.length) s += '<p class="hint">Elektrownia nie jest podłączona do sieci. Zbuduj linię do miasta lub stacji.</p>';
      s += UI.connHtml(o) + UI.flowList(o.dstTop, 'Dokąd płynie prąd');
      s += '<div class="row">';
      if (o.built && !o.dmg && o.units < o.maxUnits && t.cat !== 'res') { const c = PN.unitCost(G, o); s += btn('unit', o.pending ? 'Budowa bloku ' + PN.pct(o.pending.prog) : 'Dobuduj blok +' + PN.mw(o.unitMW), o.pending ? null : c, !!o.pending || G.money < c || !PN.techAvail(G, o.tech)); }
      if (o.built && t.pollution && !o.fgd && y > 1970) { const c = PN.retrofitCost(G, o); s += btn('fgd', 'Instalacja odsiarczania', c, G.money < c); }
      if (o.built && o.age > t.life - 5) { const c = PN.lifeExtCost(G, o); s += btn('extend', 'Remont i modernizacja', c, G.money < c); }
      if (o.dmg) { const c = PN.repairCost(G, o); s += btn('repair', 'Odbuduj', c, G.money < c); }
      if (o.built && !o.dmg) s += btn('toggle', o.on === false ? 'Włącz' : 'Wyłącz');
      s += btn('demolish', UI.pendingDemolish === o ? 'Na pewno wyburzyć?' : 'Wyburz') + '</div>';
      s += '<p class="note">' + esc(t.desc || '') + '</p>';
      return s;
    }
    if (o.type === 'mine') {
      const unit = o.tech === 'gas_well' ? 'GJ' : 't';
      s += '<h2>' + esc(o.name) + '</h2><p class="era">' + esc(t.name) + '</p><div class="kvs">' + row('Stan', o.built ? (o.dmg ? 'zniszczona' : 'wydobycie') : 'w budowie ' + PN.pct(o.prog)) + row('Zdolność wydobywcza', PN.nf(o.out / (unit === 't' ? 1e6 : 1e6), 2) + (unit === 't' ? ' mln t/rok' : ' PJ/rok'));
      if (o.built) s += row('Dla Twoich elektrowni', PN.nf(o.used || 0, 0) + ' ' + unit + '/mies.') + row('Sprzedane', PN.nf(o.sold || 0, 0) + ' ' + unit + '/mies.') + row('Zasilanie kopalni', PN.pct(o.powered || 0), o.powered < 0.7 && y > 1920 ? 'neg' : '');
      s += '</div>' + (o.built && o.powered < 0.7 && y > 1920 ? '<p class="hint">Bez prądu kopalnia wydobywa tylko połowę. Podłącz ją linią do sieci.</p>' : '');
      s += '<div class="row">' + (o.dmg ? btn('repair', 'Odbuduj', PN.repairCost(G, o), G.money < PN.repairCost(G, o)) : '') + btn('demolish', UI.pendingDemolish === o ? 'Na pewno zamknąć?' : 'Zamknij kopalnię') + '</div><p class="note">' + esc(t.desc) + '</p>';
      return s;
    }
    if (o.type === 'load') {
      const kindName = { datacenter: 'Centrum danych', industry: 'Zakład przemysłowy', tram: 'Trakcja tramwajowa', rail: 'Trakcja kolejowa', military: 'Obiekt strategiczny', mine: 'Kopalnia' }[o.kind] || 'Odbiorca';
      s += '<h2>' + esc(o.name) + '</h2><p class="era">' + kindName + '</p><div class="kvs">' + row('Moc zamówiona', PN.mw(PN.loadMW(G, o))) + row('Zasilono', o.demE > 0 ? PN.pct(o.servedE / o.demE, 1) : '–', o.demE > 0 && o.servedE < o.demE * 0.95 ? 'neg' : '') + row('Dopłata do taryfy', PN.pct(o.premium || 0)) + '</div>';
      if (!o.links.length) s += '<p class="hint">Odbiorca nie jest podłączony: zbuduj do niego linię.</p>';
      if (o.note) s += '<p class="note">' + esc(o.note) + '</p>';
      if (o.contract) s += '<p class="note">Umowa wymaga zasilania 24/7. Za niedostarczoną energię płacisz karę.</p>';
      else s += '<p class="note">Odbiorca kupi prąd, jeśli go doprowadzisz – bez kar za braki.</p>';
      return s;
    }
    if (o.type === 'border') {
      s += '<h2>' + esc(o.name) + '</h2><p class="era">Punkt wymiany międzysystemowej</p><div class="kvs">' + row('Zdolność wymiany', PN.mw(o.mw)) + row('Import (miesiąc)', PN.mwh(o.imp || 0)) + row('Eksport (miesiąc)', PN.mwh(o.exp || 0)) + row('Cena hurtowa u sąsiada', PN.price(PN.curve(G.sc.neighborPrice, y))) + '</div>';
      if (o.note) s += '<p class="note">' + esc(o.note) + '</p>';
      if (!o.links.length) s += '<p class="hint">Podłącz punkt linią, aby handlować energią z sąsiadem.</p>';
      return s;
    }
    if (o.type === 'sub') {
      s += '<h2>' + esc(o.name) + '</h2><p class="era">Stacja elektroenergetyczna</p><div class="kvs">' + row('Linie', o.links.length) + '</div><div class="row">' + btn('demolish', UI.pendingDemolish === o ? 'Na pewno wyburzyć?' : 'Wyburz') + '</div>';
      return s;
    }
    return s;
  };
  function nm(n) { return n ? (n.type === 'city' ? PN.cityName(n, UI.G.y) : n.name) : '?'; }
  UI.nm = nm;
  /* who feeds whom: shares of this month's energy, from the proportional-sharing trace */
  UI.flowList = function (top, title, note) {
    const G = UI.G; if (!top || !top.list.length) return '';
    let s = '<h3>' + esc(title) + '</h3><ul class="srcs">';
    for (const [id, e] of top.list.slice(0, 5)) {
      const n = G.byId[id]; if (!n) continue; const sh = e / top.tot;
      s += '<li><a href="#" data-goto="' + id + '">' + esc(nm(n)) + (n.owner === 'ipp' ? ' <small class="ownr">(prywatna)</small>' : '') + '</a><b>' + PN.pct(sh, sh < 0.1 ? 1 : 0) + '</b><i><em style="width:' + Math.max(2, Math.round(sh * 100)) + '%"></em></i></li>';
    }
    return s + '</ul>' + (note ? '<p class="note">' + esc(note) + '</p>' : '');
  };
  /* how a plant is hooked up, and why */
  UI.connHtml = function (o) {
    const G = UI.G, ls = o.links.map((id) => G.byId[id]).filter(Boolean), local = ls.filter((l) => l.local), real = ls.filter((l) => !l.local);
    if (!ls.length) return '';
    let s = '<h3>Przyłączenie</h3>';
    if (local.length) { const l = local[0], c = G.byId[l.a === o.id ? l.b : l.a]; s += '<p>Bezpośrednio do sieci miejskiej nN – ' + esc(nm(c)) + '. ' + (o.tech === 'steam_dc' ? 'Prąd stały 110 V dociera tylko ok. 1,5 km, więc elektrownia musi stać w mieście i zasila tylko to miasto.' : 'Elektrownia stoi w mieście, więc linia przesyłowa nie jest potrzebna. Nadwyżkę możesz wysłać liniami do innych miast.') + '</p>'; }
    if (real.length) s += '<ul class="srcs">' + real.map((l) => { const other = G.byId[l.a === o.id ? l.b : l.a], lt = PN.TECH[l.type]; return '<li><a href="#" data-goto="' + l.id + '">' + esc(lt.short) + ' → ' + esc(nm(other)) + '</a><b>' + PN.nf(l.km, 0) + ' km</b></li>'; }).join('') + '</ul>';
    return s;
  };

  UI.onInfoClick = function (e) {
    const G = UI.G;
    if (e.target.id === 'autoDist') { G.settings.autoDist = e.target.checked; return; }
    if (e.target.id === 'pauseEv') { G.settings.pauseOnEvents = e.target.checked; return; }
    const gl = e.target.closest('[data-goto]'); if (gl) { e.preventDefault(); const o = G.byId[gl.dataset.goto]; if (o) { const x = o.a ? (G.byId[o.a].x + G.byId[o.b].x) / 2 : o.x, yy = o.a ? (G.byId[o.a].y + G.byId[o.b].y) / 2 : o.y; UI.V.centerOn(x, yy, Math.max(UI.V.cam.z, 1.6)); UI.select(o); } return; }
    const evl = e.target.closest('[data-ev]'); if (evl) { e.preventDefault(); const ev = G.events.find((x) => x.id === evl.dataset.ev); if (ev) UI.showEvent(ev, true); return; }
    const b = e.target.closest('button[data-act]'); if (!b || b.disabled) return;
    const [act, arg] = b.dataset.act.split(':'); const o = UI.sel;
    switch (act) {
      case 'close': UI.select(null); break;
      case 'unit': PN.addUnit(G, o); break;
      case 'fgd': PN.retrofit(G, o); break;
      case 'extend': PN.extendLife(G, o); break;
      case 'repair': PN.repair(G, o); break;
      case 'toggle': o.on = o.on === false; break;
      case 'dist': PN.upgradeDist(G, o); break;
      case 'rural': PN.ruralUp(G, o); break;
      case 'repair-all': PN.repairAll(G); break;
      case 'rural-all': PN.ruralAll(G); break;
      case 'loan': PN.takeLoan(G, Math.max(G.sc.money, PN.creditLimit(G) * 0.1)); break;
      case 'repay': PN.repay(G, Math.max(G.sc.money, PN.creditLimit(G) * 0.1)); break;
      case 'offer-yes': { const of = G.offers.find((x) => x.id === arg); if (of) { const n = PN.acceptOffer(G, of); if (n) { UI.V.centerOn(n.x, n.y); UI.select(n); } } break; }
      case 'offer-no': { const of = G.offers.find((x) => x.id === arg); if (of) PN.declineOffer(G, of); break; }
      case 'ipp-yes': { const of = (G.ippOffers || []).find((x) => x.id === arg); if (of) { const n = PN.acceptIpp(G, of); if (n) { UI.V.centerOn(n.x, n.y, Math.max(UI.V.cam.z, 1.4)); UI.select(n); } } if (PN.Cards) PN.Cards.sync(); break; }
      case 'ipp-no': { const of = (G.ippOffers || []).find((x) => x.id === arg); if (of) PN.declineIpp(G, of); if (PN.Cards) PN.Cards.sync(); break; }
      case 'ipp-show': { const of = (G.ippOffers || []).find((x) => x.id === arg); if (of) { UI.V.centerOn(of.tx + 0.5, of.ty + 0.5, Math.max(UI.V.cam.z, 1.4)); UI.V.focusOffer = of; } break; }
      case 'demolish':
        if (o && o.owner === 'ipp') { UI.toast('To elektrownia prywatnego inwestora – nie możesz jej wyburzyć.', 'warn'); break; }
        if (UI.pendingDemolish !== o) { UI.pendingDemolish = o; break; }
        PN.demolish(G, o); UI.select(null); break;
      default: break;
    }
    UI.hud(true); UI.refreshInfo(true);
  };

  /* --------------------------------------------------------------- charts */
  UI.drawChart = function (c, kind) {
    const x = c.getContext('2d'), W = c.width, H = c.height, th = S.th, G = UI.G;
    x.clearRect(0, 0, W, H);
    const pad = { l: 78, r: 12, t: 14, b: 30 };
    const font = (sz) => (x.font = '600 ' + sz + 'px Caveat, cursive');
    const axis = (ymax, unit, xs) => {
      x.strokeStyle = th.ink; x.globalAlpha = 0.8; x.lineWidth = 1.2; x.beginPath(); x.moveTo(pad.l, pad.t); x.lineTo(pad.l, H - pad.b); x.lineTo(W - pad.r, H - pad.b); x.stroke(); x.globalAlpha = 1;
      font(20); x.fillStyle = th.ink; x.textAlign = 'right'; x.textBaseline = 'middle';
      for (let k = 0; k <= 4; k++) { const v = (ymax * k) / 4, yy = H - pad.b - ((H - pad.t - pad.b) * k) / 4; x.globalAlpha = 0.18; x.beginPath(); x.moveTo(pad.l, yy); x.lineTo(W - pad.r, yy); x.stroke(); x.globalAlpha = 1; x.fillText(unit(v), pad.l - 6, yy); }
      x.textAlign = 'center'; x.textBaseline = 'top'; for (const [px, lab] of xs) x.fillText(lab, px, H - pad.b + 4);
    };
    const nice = (v) => { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); const m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; };
    const mwU = (v) => (v >= 1000 ? PN.nf(v / 1000, v >= 10000 ? 0 : 1) + ' GW' : v >= 1 ? PN.nf(v, 0) + ' MW' : PN.nf(v * 1000, 0) + ' kW');
    if (kind === 'day') {
      const st = G.stats; if (!st || !st.curve) { font(22); x.fillStyle = th.ink; x.fillText('Brak danych – czas jeszcze nie ruszył.', 20, 40); return; }
      const cv = st.curve, hours = PN.SAMPLES, techs = Object.keys(cv.tech).filter((k) => cv.tech[k].some((v) => v > 1e-4));
      const order = ['nuclear', 'smr', 'fusion', 'geothermal', 'hydro_small', 'lignite', 'coal', 'steam_dc', 'biomass', 'hydro_dam', 'gas_ccgt', 'wind_offshore', 'wind', 'solar', 'csp', 'oil', 'gas_ocgt', 'pumped', 'battery'];
      techs.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      let ymax = Math.max(...cv.dem); const stack = hours.map((_, s) => techs.reduce((acc, k) => acc + cv.tech[k][s], 0)); ymax = nice(Math.max(ymax, ...stack) * 1.08);
      const X = (hh) => pad.l + ((W - pad.l - pad.r) * hh) / 24, Y = (v) => H - pad.b - ((H - pad.t - pad.b) * v) / ymax;
      axis(ymax, mwU, [[X(0), '0:00'], [X(6), '6:00'], [X(12), '12:00'], [X(18), '18:00'], [X(24), '24:00']]);
      const pts = [0].concat(hours, [24]), idx = (s) => (s === 0 ? 7 : s === pts.length - 1 ? 0 : s - 1);
      const base = pts.map(() => 0);
      for (const k of techs) {
        const top = pts.map((_, s) => base[s] + cv.tech[k][idx(s)]);
        x.beginPath(); x.moveTo(X(pts[0]), Y(base[0])); for (let s = 0; s < pts.length; s++) x.lineTo(X(pts[s]), Y(top[s])); for (let s = pts.length - 1; s >= 0; s--) x.lineTo(X(pts[s]), Y(base[s])); x.closePath();
        x.save(); x.clip(); S.hatch(x, pad.l, pad.t, W, H, -0.7, 4.2, PN.rng(k.length * 7), { color: PN.TECH[k].color, w: 2.2, alpha: 0.85 }); x.restore();
        x.strokeStyle = PN.TECH[k].color; x.lineWidth = 1.6; x.beginPath(); for (let s = 0; s < pts.length; s++) { const xx = X(pts[s]), yy = Y(top[s]); if (s) x.lineTo(xx, yy); else x.moveTo(xx, yy); } x.stroke();
        for (let s = 0; s < pts.length; s++) base[s] = top[s];
      }
      x.strokeStyle = th.ink; x.lineWidth = 2.2; x.setLineDash([8, 6]); x.beginPath(); for (let s = 0; s < pts.length; s++) { const xx = X(pts[s]), yy = Y(cv.dem[idx(s)]); if (s) x.lineTo(xx, yy); else x.moveTo(xx, yy); } x.stroke(); x.setLineDash([]);
    } else if (kind === 'hist' || kind === 'mix') {
      const hs = G.hist.slice(); if (G.stats) hs.push({ y: G.y + (G.m + 1) / 12, peak: G.stats.peak, capTot: G.stats.capTot, gen: G.stats.gen, genE: G.stats.genE });
      if (hs.length < 2) { font(22); x.fillStyle = th.ink; x.fillText('Historia pojawi się po pierwszym roku.', 20, 40); return; }
      const y0 = hs[0].y, y1 = hs[hs.length - 1].y; const X = (yy) => pad.l + ((W - pad.l - pad.r) * (yy - y0)) / Math.max(1, y1 - y0);
      const ticks = []; const stepY = y1 - y0 > 60 ? 20 : y1 - y0 > 25 ? 10 : 5; for (let t = Math.ceil(y0 / stepY) * stepY; t <= y1; t += stepY) ticks.push([X(t), String(t)]);
      if (kind === 'hist') {
        const ymax = nice(Math.max(...hs.map((q) => Math.max(q.peak || 0, q.capTot || 0))) * 1.1 || 1); const Y = (v) => H - pad.b - ((H - pad.t - pad.b) * v) / ymax;
        axis(ymax, mwU, ticks);
        for (const [key, col, dash] of [['capTot', th.orange, []], ['peak', th.ink, [7, 5]]]) { x.strokeStyle = col; x.lineWidth = 2.4; x.setLineDash(dash); x.beginPath(); hs.forEach((q, i) => { const xx = X(q.y), yy = Y(q[key] || 0); if (i) x.lineTo(xx, yy); else x.moveTo(xx, yy); }); x.stroke(); x.setLineDash([]); }
      } else {
        const keys = PN.GEN_ORDER.concat(PN.STORE_ORDER).filter((k) => hs.some((q) => q.gen && q.gen[k] > 0));
        const Y = (v) => H - pad.b - (H - pad.t - pad.b) * v; axis(1, (v) => PN.pct(v), ticks);
        const base = hs.map(() => 0);
        for (const k of keys) {
          const top = hs.map((q, i) => base[i] + (q.genE > 0 && q.gen ? (q.gen[k] || 0) / q.genE : 0));
          x.beginPath(); hs.forEach((q, i) => { const xx = X(q.y), yy = Y(Math.min(1, top[i])); if (i) x.lineTo(xx, yy); else x.moveTo(xx, yy); }); for (let i = hs.length - 1; i >= 0; i--) x.lineTo(X(hs[i].y), Y(Math.min(1, base[i]))); x.closePath();
          x.save(); x.clip(); S.hatch(x, pad.l, pad.t, W, H, 0.7, 4, PN.rng(k.length * 13), { color: PN.TECH[k].color, w: 2.4, alpha: 0.85 }); x.restore();
          for (let i = 0; i < hs.length; i++) base[i] = top[i];
        }
      }
    }
  };

  /* -------------------------------------------------------------- ticker */
  UI.renderTicker = function () {
    const G = UI.G; if (!G) return; const t = $('#ticker');
    t.innerHTML = G.news.slice(0, 3).map((n) => '<div class="' + n.kind + '"><span class="d">' + PN.MONTHS_SHORT[n.m] + ' ' + n.y + '</span> ' + esc(n.text) + '</div>').join('') || '<div>Kronika jest pusta. Zbuduj pierwszą elektrownię.</div>';
  };

  /* --------------------------------------------------------------- toasts */
  UI.toast = function (html, kind) {
    const box = $('#toasts');
    for (const old of box.children) if (old.innerHTML === html) { old.remove(); break; }
    const d = h('div', 'toast ' + (kind || ''), html); box.prepend(d);
    while (box.children.length > 3) box.lastChild.remove();
    setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 600); }, kind === 'warn' ? 4500 : 6000);
  };

  /* --------------------------------------------------------------- modals */
  UI.mq = [];
  UI.modal = function (html, opts) {
    opts = opts || {};
    if (UI.modalOpen && opts.queue) { UI.mq.push([html, opts]); return; }
    const m = $('#modal'); m.innerHTML = '<div class="sheet ' + (opts.cls || '') + '">' + html + '</div>'; m.hidden = false;
    UI.modalOpen = true; if (opts.pause !== false && (UI.speed || !UI.prevSpeed)) { UI.prevSpeed = UI.speed || UI.prevSpeed || 1; UI.setSpeed(0); }
    m.onclick = (e) => {
      const b = e.target.closest('[data-m]'); if (!b) { if (e.target === m && opts.dismiss !== false) UI.closeModal(); return; }
      const k = b.dataset.m; if (opts.on && opts.on(k, b) === false) return; if (k !== 'stay') UI.closeModal();
    };
    const first = m.querySelector('button'); if (first) setTimeout(() => first.focus(), 30);
    m.querySelectorAll('canvas[data-icon]').forEach((c) => UI.eventIcon(c, c.dataset.icon));
  };
  UI.closeModal = function () {
    $('#modal').hidden = true; UI.modalOpen = false;
    if (UI.mq.length) { const [h2, o2] = UI.mq.shift(); UI.modal(h2, o2); return; }
    if (UI.prevSpeed) { UI.setSpeed(UI.prevSpeed); UI.prevSpeed = 0; }
  };

  UI.effectText = function (e) {
    const G = UI.G;
    switch (e.type) {
      case 'unlock': return 'Nowa technologia: ' + (PN.TECH[e.tech] ? PN.TECH[e.tech].name : e.tech);
      case 'demand': return 'Popyt ' + (e.mult >= 1 ? '+' : '') + PN.pct(e.mult - 1) + ' przez ' + PN.months(e.months || 12) + (e.region ? ' (region)' : '');
      case 'fuel': return 'Ceny: ' + PN.FUELS[e.fuel].name + ' ×' + PN.nf(e.mult, 1) + ' przez ' + PN.months(e.months || 12);
      case 'damage': return 'Zniszczenia: ' + (e.target === 'lines' ? 'linie' : e.target === 'plants' ? 'elektrownie' : 'infrastruktura') + ' w regionie';
      case 'outage': return 'Awarie linii w regionie przez ' + PN.months(e.months || 1);
      case 'derate': return 'Ograniczenie mocy ' + PN.pct(1 - e.mult) + ' (' + e.techs.map((t) => (PN.TECH[t] ? PN.TECH[t].short : t)).join(', ') + ')';
      case 'freeze': return 'Wstrzymanie inwestycji na ' + PN.months(e.months);
      case 'money': return (e.amount >= 0 ? 'Wpływ ' : 'Koszt ') + PN.money(Math.abs(e.amount) / (G.sc.fx || 1));
      case 'reputation': return 'Reputacja ' + (e.delta > 0 ? '+' : '') + e.delta;
      case 'subsidy': return 'Dopłaty: ' + ({ rural: 'elektryfikacja wsi', wind: 'wiatr', solar: 'fotowoltaika', nuclear: 'atom', grid: 'sieć', storage: 'magazyny' }[e.target] || e.target) + ' tańsze o ' + PN.pct(1 - e.costMult) + ' przez ' + PN.months(e.months || 60);
      case 'rule': return e.rule === 'wind_distance_km' ? (e.value > 0 ? 'Zakaz stawiania wiatraków blisko zabudowy' : 'Zniesienie ostrych ograniczeń dla wiatraków') : 'Nowe przepisy';
      case 'load': return 'Nowy odbiorca: ' + e.name + ' (' + PN.mw(e.mw) + (e.growToMw && e.growToMw !== e.mw ? ' → ' + PN.mw(e.growToMw) : '') + ')';
      case 'border': return 'Nowe połączenie z zagranicą: ' + e.name;
      case 'regime': return { state: 'Energetyka państwowa: dotacje do inwestycji, niższe odsetki', market: 'Rynek energii: liczą się koszty', concession: 'Koncesje prywatne', private: 'Prywatne spółki' }[e.regime] || 'Zmiana ustroju energetyki';
      case 'prosumer': return 'Prosumenci: +' + PN.mw(e.mwPerYear) + ' fotowoltaiki na dachach rocznie';
      case 'territory': return 'Zmiana granic: nowe ziemie w Twoim zasięgu';
      case 'ipp': return e.scope === 'small' ? 'Mali niezależni wytwórcy zgłaszają projekty' : 'Prywatni inwestorzy zgłaszają własne elektrownie';
      case 'carbon': return (e.price >= 0 ? 'Cena CO₂ +' : 'Cena CO₂ ') + PN.money(e.price) + '/t przez ' + PN.months(e.months || 120);
      case 'esg': return e.premium > 0 ? 'Banki: kredyt droższy o do ' + PN.nf(e.premium * 100, 1) + ' pp – im więcej paliw kopalnych, tym drożej' : 'Banki przestają doliczać ryzyko klimatyczne do kredytów';
      default: return '';
    }
  };
  UI.onEvent = function (ev) {
    if (PN.eventImportant(ev) || !PN.Cards) UI.showEvent(ev, false);
    else PN.Cards.clip(ev);
    UI.renderTicker();
  };
  UI.showEvent = function (ev, fromArchive) {
    const G = UI.G;
    const [yy, mm] = ev.date.split('-').map(Number);
    const fx = (ev.effects || []).map(UI.effectText).filter(Boolean);
    let html = '<div class="clip"><div class="mast">' + esc(ev.paper || (G.code === 'PL' ? 'Kronika Energetyczna' : 'The Electrical World')) + '</div><div class="dateline">' + PN.MONTHS[mm - 1] + ' ' + yy + (ev.speculative ? ' · scenariusz przyszłości' : '') + '</div>';
    html += '<div class="body"><canvas class="evicon" width="200" height="200" data-icon="' + esc(ev.icon || 'bulb') + '"></canvas><h1>' + esc(ev.title) + '</h1><p>' + esc(ev.text) + '</p></div>';
    if (fx.length) html += '<div class="fx"><b>W grze:</b><ul>' + fx.map((f) => '<li>' + esc(f) + '</li>').join('') + '</ul></div>';
    if (ev.hint) html += '<p class="hint">' + esc(ev.hint) + '</p>';
    if (ev.sources && ev.sources.length) html += '<p class="src">Źródło: ' + ev.sources.slice(0, 2).map((u, i) => '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + (i + 1) + '</a>').join(', ') + (ev.certainty === 'medium' ? ' · data przybliżona' : '') + '</p>';
    html += '</div><div class="row end"><button class="act" data-m="ok">Dalej</button></div>';
    UI.modal(html, { cls: 'news', pause: fromArchive === 'card' || (!fromArchive && G.settings.pauseOnEvents), queue: !fromArchive });
  };
  UI.onOffer = function (o) {
    if (PN.Cards) { PN.Cards.dc(o); return; }
    const G = UI.G, c = G.byId[o.city];
    const html = '<h2>Propozycja umowy</h2><canvas class="evicon" width="200" height="200" data-icon="data"></canvas><p><b>' + esc(o.company) + '</b> planuje ' + (o.ai ? 'centrum obliczeń sztucznej inteligencji' : 'centrum danych') + '. Lokalizacja: <b>' + esc(c ? PN.cityName(c, G.y) : '?') + '</b> i okolice.</p><div class="kvs">' + row('Moc docelowa', PN.mw(o.mw)) + row('Dojście do pełnej mocy', PN.months(o.years * 12)) + row('Taryfa', '+' + PN.pct(o.premium) + ' ponad cenę') + row('Warunek', 'zasilanie 24/7, kara za braki') + '</div><p class="note">Oferta czeka pół roku w zakładce Przegląd.</p><div class="row end"><button class="act" data-m="later">Później</button><button class="act" data-m="no">Odrzuć</button><button class="act prim" data-m="yes">Podpisz umowę</button></div>';
    UI.modal(html, { cls: 'offer', queue: true, pause: G.settings.pauseOnEvents, on: (k) => { if (k === 'yes') { const n = PN.acceptOffer(G, o); if (n) { UI.V.centerOn(n.x, n.y); UI.select(n); } } else if (k === 'no') PN.declineOffer(G, o); UI.refreshInfo(true); } });
  };
  UI.gameOver = function (kind) {
    const G = UI.G, H = PN.helpers(G);
    const score = Math.round(G.hist.reduce((s, q) => s + (q.servedE || 0), 0) / 1e3 * (G.rep / 60) + Math.max(0, G.money - G.debt) / 1e6);
    const done = G.sc.missions.filter((m) => G.missions[m.id] && G.missions[m.id].state === 'done').length;
    const html = '<h2>' + (kind === 'bankrupt' ? 'Bankructwo' : 'Koniec kroniki: ' + G.y) + '</h2><p>' + (kind === 'bankrupt' ? 'Wierzyciele przejęli spółkę. Sieć przechodzi w inne ręce.' : 'Kronika dobiegła końca. Oto bilans Twojej sieci.') + '</p><div class="kvs">' + row('Energia dostarczona łącznie', PN.mwh(G.hist.reduce((s, q) => s + (q.servedE || 0), 0))) + row('Wykonane zadania', done + ' / ' + G.sc.missions.length) + row('Udział czystej energii', PN.pct(H.cleanShare())) + row('Emisyjność', PN.nf(H.co2g(), 0) + ' g CO₂/kWh') + row('Reputacja', PN.nf(G.rep, 0)) + row('Wynik', PN.nf(score, 0) + ' pkt') + '</div><div class="row end">' + (kind === 'end' ? '<button class="act" data-m="cont">Graj dalej</button>' : '') + '<button class="act prim" data-m="menu">Menu główne</button></div>';
    UI.modal(html, { dismiss: false, on: (k) => { if (k === 'cont') { G.over = false; G.sc = Object.assign({}, G.sc, { end: 2100 }); } else if (k === 'menu') PN.showStart(); } });
  };
  UI.menu = function () {
    const html = '<h2>Menu</h2><div class="col"><button class="act" data-m="save">Zapisz grę</button><button class="act" data-m="load">Wczytaj ostatni zapis</button><button class="act" data-m="help">Jak grać</button><button class="act" data-m="tut">Samouczek od początku</button><button class="act" data-m="theme">Przełącz: dzień / noc</button><button class="act" data-m="start">Nowa gra (menu główne)</button><button class="act prim" data-m="back">Wróć do gry</button></div>';
    UI.modal(html, { on: (k) => {
      if (k === 'save') { const ok = PN.saveGame(); UI.toast(ok ? 'Gra zapisana w tej przeglądarce.' : 'Nie udało się zapisać (przeglądarka blokuje pamięć).', ok ? 'good' : 'warn'); }
      if (k === 'load') { const ok = PN.loadGame(UI.G.code); if (!ok) UI.toast('Brak zapisu tej kampanii w tej przeglądarce.', 'warn'); }
      if (k === 'help') { setTimeout(() => UI.help(), 10); }
      if (k === 'tut' && PN.Tutorial) setTimeout(() => PN.Tutorial.start(), 60);
      if (k === 'theme') PN.toggleTheme();
      if (k === 'start') PN.showStart();
    } });
  };
  UI.help = function () {
    UI.modal('<h2>Jak grać</h2><ul class="help"><li><b>Elektrownie</b> stawiasz z lewego paska. Na początku są tylko parowe elektrownie w miastach. Kolejne wynalazki przychodzą same, razem z historią – w menu widzisz tylko to, co już istnieje, a nowość ogłasza gazeta.</li><li><b>Linie</b>: wybierz napięcie i kliknij dwa punkty (elektrownia, miasto, stacja lub puste pole – tam powstanie stacja). Wyższe napięcie = większa przepustowość i mniejsze straty.</li><li><b>Niskie napięcie</b>: elektrownia w mieście zasila je wprost (kropkowana kreska nN). Kliknij miasto, by rozbudować sieć miejską; elektryfikacja wsi to program uruchamiany przyciskiem, gdy na wsi pojawią się chętni.</li><li><b>Skąd płynie prąd</b>: kliknij miasto albo elektrownię – panel pokaże udziały, a mapa drogę prądu.</li><li><b>Inwestorzy prywatni</b> pojawiają się po otwarciu rynku. Ich projekty przychodzą jako karty: przyłączasz je linią i kupujesz energię po cenie z umowy.</li><li><b>Wiatr i słońce</b>: warstwy mapy pokazują, gdzie wieje i świeci. Produkcja zależy od pogody i pory dnia – wykres doby pokazuje, kto pokrywa zapotrzebowanie.</li><li><b>Zasoby</b>: kopalnia węgla obniża koszt paliwa, węgiel brunatny wymaga odkrywki tuż obok elektrowni. Kopalnie same potrzebują prądu.</li><li><b>Niezawodność</b>: burze i oblodzenie wyłączają linie. Miasto zasilone kilkoma drogami nie gaśnie.</li><li><b>Sterowanie</b>: przeciągnij mapę, kółko lub szczypanie = zoom, spacja = pauza, 1–4 = prędkość, Esc = anuluj.</li></ul><h3>Legenda</h3><p class="note">Pełna legenda linii i znaczków: przycisk „Legenda” w prawym dolnym rogu.</p><ul class="help"><li>Żółte kreski płynące po linii – prąd i kierunek przepływu w szczycie; pomarańczowa linia – obciążenie powyżej 80%, czerwona – przeciążenie.</li><li>Żółte okna w miastach i kropki przy wsiach – odbiorcy z prądem; czerwone kreski – niedobór mocy.</li><li>Kreskowane obszary – ziemie poza Twoim zasięgiem w danej epoce; koła z falą – miejsca na zapory; przerywane zielone koła – parki narodowe.</li><li>Czerwona wtyczka przy budynku – brak podłączenia do sieci.</li></ul><p class="note">Kontury mapy: Natural Earth. Szkice: Rough.js. Daty, liczby i źródła wydarzeń są podane w wycinkach prasowych (link „Źródło”). Wydarzenia po połowie 2026 r. to scenariusz oparty na ogłoszonych planach.</p><div class="row end"><button class="act prim" data-m="ok">Do pracy</button></div>');
  };

  /* small sketched icons for news clippings */
  UI.eventIcon = function (c, kind) {
    const x = c.getContext('2d'), th = S.th, r = PN.rng(kind.length * 977);
    x.clearRect(0, 0, 200, 200); x.lineCap = 'round'; x.lineJoin = 'round';
    const map = { plant: 'coal', tower: 'substation', nuclear: 'nuclear', wind: 'wind', solar: 'solar', water: 'hydro_dam', factory: 'industry', data: 'datacenter', fusion: 'fusion', gas: 'gas_ccgt', oil: 'oil', coal: 'coal_mine', tram: 'tram', rail: 'tram', flag: 'border', handshake: 'substation' };
    if (map[kind]) { const sp = PN.Sprites.get(map[kind]); x.drawImage(sp, 10, 10, 180, 180); return; }
    const P = (fn, o) => S.pencil(x, fn, Object.assign({ color: th.ink, w: 3 }, o || {}));
    if (kind === 'bulb') { S.circle(x, 100, 82, 46, 50, r, { w: 3 }); P(() => { x.moveTo(78, 120); x.lineTo(80, 150); x.lineTo(120, 150); x.lineTo(122, 120); x.moveTo(82, 160); x.lineTo(118, 160); x.moveTo(88, 170); x.lineTo(112, 170); x.moveTo(88, 105); x.lineTo(95, 80); x.lineTo(100, 100); x.lineTo(105, 80); x.lineTo(112, 105); }); P(() => { for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + (k - 3.5) * 0.35; x.moveTo(100 + Math.cos(a) * 62, 82 + Math.sin(a) * 66); x.lineTo(100 + Math.cos(a) * 80, 82 + Math.sin(a) * 84); } }, { color: th.yellow, w: 4 }); }
    else if (kind === 'war') { P(() => { x.moveTo(30, 160); x.lineTo(60, 120); x.lineTo(90, 150); x.lineTo(120, 90); x.lineTo(150, 140); x.lineTo(175, 110); }, { color: th.red, w: 4 }); for (let k = 0; k < 5; k++) S.circle(x, 60 + k * 22, 70 - (k % 2) * 14, 16, 12, r, { w: 2.2, color: th.ink }); }
    else if (kind === 'crisis' || kind === 'money') { P(() => { x.moveTo(30, 50); x.lineTo(30, 170); x.lineTo(180, 170); x.moveTo(40, 70); x.lineTo(80, 90); x.lineTo(110, 80); x.lineTo(140, 130); x.lineTo(170, 150); }); P(() => { x.moveTo(170, 150); x.lineTo(156, 150); x.moveTo(170, 150); x.lineTo(168, 136); }, { color: th.red, w: 4 }); }
    else if (kind === 'law') { P(() => { x.moveTo(100, 40); x.lineTo(100, 160); x.moveTo(60, 160); x.lineTo(140, 160); x.moveTo(40, 70); x.lineTo(160, 70); x.moveTo(40, 70); x.lineTo(25, 115); x.lineTo(55, 115); x.closePath(); x.moveTo(160, 70); x.lineTo(145, 115); x.lineTo(175, 115); x.closePath(); }); }
    else if (kind === 'storm' || kind === 'cold') { S.circle(x, 90, 70, 50, 26, r, { w: 3 }); S.circle(x, 125, 62, 38, 22, r, { w: 3 }); P(() => { x.moveTo(100, 100); x.lineTo(85, 135); x.lineTo(105, 135); x.lineTo(88, 175); }, { color: kind === 'cold' ? th.water : th.yellow, w: 4 }); }
    else if (kind === 'heat') { S.circle(x, 100, 100, 32, 32, r, { w: 3, color: th.orange }); P(() => { for (let k = 0; k < 10; k++) { const a = (k / 10) * 6.28; x.moveTo(100 + Math.cos(a) * 45, 100 + Math.sin(a) * 45); x.lineTo(100 + Math.cos(a) * 68, 100 + Math.sin(a) * 68); } }, { color: th.orange, w: 3 }); }
    else if (kind === 'blackout') { S.circle(x, 100, 82, 46, 50, r, { w: 3 }); P(() => { x.moveTo(40, 40); x.lineTo(160, 160); }, { color: th.red, w: 5 }); }
    else { S.circle(x, 100, 100, 60, 60, r, { w: 3 }); }
  };

  PN.UI = UI;
})();
