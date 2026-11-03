'use strict';
/* Boot, start screen, game loop and input. */
(function () {
  const PN = window.PN, S = PN.Sketch, UI = PN.UI;
  const $ = (s) => document.querySelector(s);
  let G = null, V = null, acc = 0, last = performance.now(), started = false;
  const MONTH_SEC = 1.5;

  /* ----------------------------------------------------------- theme */
  function pickTheme() {
    let t = null;
    try { t = localStorage.getItem('pn_theme'); } catch (e) { t = null; }
    const attr = document.documentElement.getAttribute('data-theme');
    if (!t && (attr === 'dark' || attr === 'light')) t = attr;
    if (!t) t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return t;
  }
  function applyTheme(name) {
    const th = PN.THEMES[name] || PN.THEMES.light; S.th = th;
    document.documentElement.setAttribute('data-theme', name);
    const tex = S.makePaper(220, th);
    document.documentElement.style.setProperty('--paper-tex', 'url(' + tex.toDataURL('image/png') + ')');
    PN.Sprites.build(th);
    if (V) V.setTheme(th);
    if (G) { UI.buildTools(); UI.refreshInfo(true); }
    drawStartThumbs();
  }
  PN.toggleTheme = function () { const n = S.th.name === 'light' ? 'dark' : 'light'; try { localStorage.setItem('pn_theme', n); } catch (e) { /* ignore */ } applyTheme(n); };

  /* ------------------------------------------------------- save / load */
  PN.saveGame = function (silent) { if (!G) return false; try { localStorage.setItem('pn_save_' + G.code, PN.serialize(G)); return true; } catch (e) { if (!silent) console.warn(e); return false; } };
  PN.autosave = () => PN.saveGame(true);
  PN.loadGame = function (code) {
    let s = null; try { s = localStorage.getItem('pn_save_' + code); } catch (e) { s = null; }
    if (!s) return false;
    try { startWith(PN.deserialize(s)); return true; } catch (e) { console.error(e); return false; }
  };
  const hasSave = (code) => { try { return !!localStorage.getItem('pn_save_' + code); } catch (e) { return false; } };

  /* ------------------------------------------------------- start screen */
  /* best final grade per campaign, kept in this browser */
  PN.bestScore = function (code) { try { return JSON.parse(localStorage.getItem('pn_best_' + code) || 'null'); } catch (e) { return null; } };
  PN.saveBest = function (code, f) {
    const old = PN.bestScore(code); if (old && old.score >= f.score) return;
    try { localStorage.setItem('pn_best_' + code, JSON.stringify({ score: f.score, stars: f.stars, title: f.title, when: Date.now() })); } catch (e) { /* storage blocked */ }
  };
  PN.showStart = function () {
    UI.closeModal && UI.closeModal();
    const st = $('#start'); st.hidden = false; document.body.classList.add('at-start');
    const card = (code) => {
      const sc = PN.SCEN[code];
      const best = PN.bestScore(code);
      return '<div class="scen" data-code="' + code + '"><canvas class="thumb" data-thumb="' + code + '" width="520" height="300"></canvas><h2>' + PN.esc(sc.title) + '</h2><p>' + PN.esc(sc.blurb) + '</p>' + (best ? '<p class="best">Twój najlepszy wynik: ' + UI.starsHtml(best.stars) + ' <b>' + Math.round(best.score) + ' pkt</b> · ' + PN.esc(best.title) + '</p>' : '') + '<div class="row"><button class="act prim" data-go="' + code + '">Zacznij w ' + sc.start.year + ' r.</button>' + (hasSave(code) ? '<button class="act" data-load="' + code + '">Wczytaj zapis</button>' : '') + '</div></div>';
    };
    st.innerHTML = '<div class="start-in"><header><h1>Pod Napięciem</h1><p class="sub">kronika sieci elektroenergetycznej · od pierwszej żarówki do fuzji</p></header><div class="scens">' + card('PL') + card('US') + '</div><p class="foot"><b>Cel:</b> daj prąd jak największej liczbie ludzi – bez przerw, tanio, a z czasem czysto – i wypadnij lepiej niż prawdziwa historia. Siedem rozdziałów, każdy z oceną, na koniec ocena końcowa. Buduj elektrownie i kopalnie, prowadź linie od średniego po najwyższe napięcie, elektryfikuj miasta i wsie. Technologie, ceny i wydarzenia idą za prawdziwą historią Polski i USA, a po 2026 r. – za ogłoszonymi planami. <button class="linkish" data-help="1">Jak grać</button> · <button class="linkish" data-theme-toggle="1">Dzień / noc</button></p></div>';
    st.onclick = (e) => {
      const go = e.target.closest('[data-go]'); if (go) { startNew(go.dataset.go); return; }
      const ld = e.target.closest('[data-load]'); if (ld) { PN.loadGame(ld.dataset.load); return; }
      if (e.target.closest('[data-help]')) { UI.help(); return; }
      if (e.target.closest('[data-theme-toggle]')) PN.toggleTheme();
    };
    drawStartThumbs();
  };
  function drawStartThumbs() {
    document.querySelectorAll('canvas[data-thumb]').forEach((c) => {
      const code = c.dataset.thumb, geo = window['PN_GEO_' + code], sc = PN.SCEN[code]; if (!geo) return;
      const x = c.getContext('2d'), th = S.th, W = c.width, H = c.height;
      x.clearRect(0, 0, W, H);
      const P = PN.Albers(sc.proj.lon0, sc.proj.lat0, sc.proj.lat1, sc.proj.lat2);
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const home = geo.countries.find((q) => q.code === sc.homeCode);
      for (const r of home.rings) for (let i = 0; i < r.pts.length; i += 2) { const [px, py] = P.fwd(r.pts[i], r.pts[i + 1]); x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); }
      const k = Math.min((W - 40) / (x1 - x0), (H - 40) / (y1 - y0)), ox = (W - (x1 - x0) * k) / 2, oy = (H - (y1 - y0) * k) / 2;
      const r0 = PN.rng(code.length * 99);
      x.save(); x.beginPath();
      for (const r of home.rings) { for (let i = 0; i < r.pts.length; i += 2) { const [px, py] = P.fwd(r.pts[i], r.pts[i + 1]); const X = ox + (px - x0) * k, Y = oy + (py - y0) * k; if (i) x.lineTo(X, Y); else x.moveTo(X, Y); } x.closePath(); }
      x.clip('evenodd'); S.hatch(x, 0, 0, W, H, -0.75, 7, r0, { color: th.ink, w: 1.1, alpha: 0.28 }); x.restore();
      for (let pass = 0; pass < 2; pass++) {
        x.strokeStyle = th.ink; x.globalAlpha = pass ? 0.35 : 0.9; x.lineWidth = pass ? 1 : 2; x.lineJoin = 'round'; x.beginPath();
        for (const r of home.rings) { for (let i = 0; i < r.pts.length; i += 2) { const [px, py] = P.fwd(r.pts[i], r.pts[i + 1]); const X = ox + (px - x0) * k + (pass ? (r0() - 0.5) * 2 : 0), Y = oy + (py - y0) * k + (pass ? (r0() - 0.5) * 2 : 0); if (i) x.lineTo(X, Y); else x.moveTo(X, Y); } x.closePath(); }
        x.stroke();
      }
      x.globalAlpha = 1;
      const places = window['PN_PLACES_' + code];
      if (places && places.historicPlants) {
        for (const p of places.historicPlants.slice(0, 40)) { const [px, py] = P.fwd(p.lon, p.lat); const X = ox + (px - x0) * k, Y = oy + (py - y0) * k; if (X < 0 || X > W || Y < 0 || Y > H) continue; x.fillStyle = (PN.TECH[p.tech] && PN.TECH[p.tech].color) || th.ink; x.globalAlpha = 0.85; x.beginPath(); x.arc(X, Y, 3.4, 0, 6.3); x.fill(); }
        x.globalAlpha = 1;
      }
      S.erode(c, th.grainAlpha * 0.7, 0, 0);
    });
  }

  /* -------------------------------------------------------------- start */
  function startNew(code) {
    const g = PN.newGame(code);
    // events that happened before the campaign starts become the prologue
    const startKey = g.y + '-' + String(g.m + 1).padStart(2, '0');
    g.prologue = g.events.filter((e) => e.date < startKey);
    for (const e of g.prologue) { g.fired[e.id] = true; PN.applyEffects(g, e); }
    startWith(g, true);
  }
  function startWith(g, fresh) {
    G = g; PN.G = g;
    if (PN.Tutorial && PN.Tutorial.active) PN.Tutorial.cancel();
    $('#start').hidden = true; document.body.classList.remove('at-start');
    if (!V) V = new PN.View($('#map'), G); else { V.G = G; V.terrain = new PN.Terrain(G); V.citySpr.clear(); V.lineGeo.clear(); V.ovCache = {}; V.prepareLabels(); const v = G.sc.view, t = G.map.toTile(v.lon, v.lat); V.cam = { x: t[0], y: t[1], z: v.zoom || 1 }; V.sel = null; V.tool = null; V.overlay = null; }
    V.firstFrames = 2; V.trace = null; V.focusOffer = null;
    PN.discoverTech(G); // what already exists at the start is known, not news
    UI.bind(G, V); UI.setTool(null); UI.setSpeed(0);
    PN.energize(G);
    if (fresh) intro(); else UI.setSpeed(1);
    if (!started) { started = true; requestAnimationFrame(loop); }
  }
  function intro() {
    const pro = (G.prologue || []).slice(-6);
    const ms = G.sc.missions[0];
    let html = '<h2>' + PN.esc(G.sc.title) + '</h2><p class="lead">' + (G.code === 'PL'
      ? 'Jest ' + G.y + ' rok. Warszawa, Łódź i Kraków świecą lampami gazowymi i naftowymi – lampa Łukasiewicza ma już ponad trzydzieści lat. Ziemie polskie są podzielone między trzy mocarstwa, ale prąd nie zna granic. Masz kapitał na pierwszą elektrownię.'
      : 'Jest ' + G.y + ' rok. Manhattan oświetlają lampy gazowe, a Thomas Edison przygotowuje elektrownię przy Pearl Street. Kto pierwszy da miastu tani i bezpieczny prąd, zdobędzie rynek.') + '</p>';
    if (pro.length) html += '<h3>Wcześniej</h3><ul class="pro">' + pro.map((e) => '<li><span class="d">' + e.date.slice(0, 4) + '</span> ' + PN.esc(e.title) + '</li>').join('') + '</ul>';
    const ch0 = (G.sc.chapters || [])[0];
    html += '<h3>Cel gry</h3><p>Daj prąd jak największej liczbie ludzi – bez przerw, tanio, a z czasem czysto. Kronika ma ' + (G.sc.chapters || []).length + ' rozdziałów; po każdym dostaniesz ocenę w porównaniu z prawdziwą historią' + (ch0 ? ' (pierwszy: <b>' + PN.esc(ch0.name) + '</b>, do ' + Math.floor(ch0.to) + ' r.)' : '') + '. Wskaźniki są na górze Przeglądu.</p>';
    if (ms) html += '<h3>Pierwsze zadanie</h3><p><b>' + PN.esc(ms.title) + '</b>: ' + PN.esc(ms.text) + '</p>';
    const tutDone = PN.Tutorial && PN.Tutorial.done();
    html += '<p class="note">' + (tutDone ? 'Wybierz <b>Elektrownie → ' + PN.esc(PN.TECH.steam_dc.name) + '</b> i kliknij w obrębie miasta. Potem puść czas przyciskiem 1×.' : 'Pierwszy raz? Samouczek krok po kroku przeprowadzi Cię przez pierwszą elektrownię, czas, panel miasta, linie i warstwy mapy.') + '</p><div class="row end"><button class="act" data-m="help">Jak grać</button>' +
      (tutDone ? '<button class="act" data-m="tut">Samouczek</button><button class="act prim" data-m="go">Zaczynamy</button>' : '<button class="act" data-m="go">Bez samouczka</button><button class="act prim" data-m="tut">Zacznij z samouczkiem</button>') + '</div>';
    UI.modal(html, { pause: false, on: (k) => { if (k === 'help') { setTimeout(UI.help, 10); } else { UI.setSpeed(0); if (k === 'tut' && PN.Tutorial) setTimeout(() => PN.Tutorial.start(), 60); } } });
    UI.setSpeed(0);
  }

  /* --------------------------------------------------------------- loop */
  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (G && !UI.modalOpen && UI.speed > 0 && !G.over && !document.hidden) {
      acc += dt * UI.speed;
      let n = 0; const tb = performance.now();
      // a heavy month (huge late-game grid) gets a frame of its own, so the map never freezes
      while (acc >= MONTH_SEC && n < 3 && (n === 0 || performance.now() - tb < 25)) { try { PN.step(G); } catch (e) { console.error(e); } acc -= MONTH_SEC; n++; }
      if (acc > MONTH_SEC * 2) acc = MONTH_SEC;
    }
    if (V && G) { try { V.frame(dt); } catch (e) { console.error(e); } UI.hud(); if (PN.Tutorial) PN.Tutorial.tick(); }
    requestAnimationFrame(loop);
  }

  /* -------------------------------------------------------------- input */
  function bindInput() {
    const cv = $('#map'); const ptrs = new Map(); let drag = null, pinch = null;
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointerdown', (e) => {
      cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, pos(e));
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: V.cam.z }; drag = null; return; }
      const [x, y] = pos(e); drag = { x, y, cx: V.cam.x, cy: V.cam.y, moved: false, btn: e.button, type: e.pointerType };
      if (e.pointerType === 'touch' || e.pointerType === 'pen') UI.touch = true; else if (e.pointerType === 'mouse') UI.touch = false;
    });
    cv.addEventListener('pointermove', (e) => {
      if (!V) return; const p = pos(e);
      if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, p);
      if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; const f = (pinch.z * d) / pinch.d / V.cam.z; V.zoomAt(mx, my, f); return; }
      if (drag) {
        const dx = p[0] - drag.x, dy = p[1] - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 6) drag.moved = true;
        if (drag.moved) { const s = V.scale(); V.cam.x = drag.cx - dx / s; V.cam.y = drag.cy - dy / s; V.clampCam(); UI.tip(0, 0, null); return; }
      }
      hover(p[0], p[1], e.clientX, e.clientY);
    });
    const end = (e) => {
      const had = ptrs.has(e.pointerId); ptrs.delete(e.pointerId);
      if (pinch) { if (ptrs.size < 2) pinch = null; drag = null; return; }
      if (!had || !drag) return;
      const p = pos(e); const d = drag; drag = null;
      if (!d.moved && e.type === 'pointerup') { if (d.btn === 2) { UI.setTool(null); return; } click(p[0], p[1], e.clientX, e.clientY, d.type); }
    };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('pointerleave', () => { UI.tip(0, 0, null); if (V) V.hover = null; });
    cv.addEventListener('contextmenu', (e) => e.preventDefault());
    cv.addEventListener('wheel', (e) => { e.preventDefault(); if (!V) return; const p = pos(e); V.zoomAt(p[0], p[1], Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0016))); }, { passive: false });
    window.addEventListener('resize', () => { if (V) V.resize(); });
    window.addEventListener('keydown', (e) => {
      if (!G || e.target.closest('input,textarea')) return;
      if (e.key === 'Escape') { if (UI.modalOpen) { UI.closeModal(); return; } if (V.lineStart) { V.lineStart = null; return; } UI.setTool(null); UI.closeFly(); UI.select(null); return; }
      if (UI.modalOpen) return;
      if (e.key === ' ') { e.preventDefault(); UI.setSpeed(UI.speed ? 0 : UI.lastSpeed || 1); }
      if (e.key >= '1' && e.key <= '4') { UI.setSpeed([1, 2, 4, 8][+e.key - 1]); }
      if (UI.speed) UI.lastSpeed = UI.speed;
      const s = 60 / V.scale();
      if (e.key === 'ArrowLeft' || e.key === 'a') V.cam.x -= s; if (e.key === 'ArrowRight' || e.key === 'd') V.cam.x += s;
      if (e.key === 'ArrowUp' || e.key === 'w') V.cam.y -= s; if (e.key === 'ArrowDown' || e.key === 's') V.cam.y += s;
      if (e.key === '+' || e.key === '=') V.zoomAt(V.W / 2, V.H / 2, 1.25); if (e.key === '-') V.zoomAt(V.W / 2, V.H / 2, 0.8);
      if ((e.key === 'Delete' || e.key === 'Backspace') && UI.sel && UI.sel.type !== 'city' && !UI.sel.local && UI.sel.owner !== 'ipp') { PN.demolish(G, UI.sel); UI.select(null); }
      V.clampCam();
    });
  }

  function virtualEnd(wx, wy) {
    const n = PN.nodeAt(G, wx, wy, Math.max(0.55, 12 / V.scale())); if (n) return { node: n, x: n.x, y: n.y };
    const tx = Math.floor(wx), ty = Math.floor(wy), c = PN.canPlace(G, 'substation', tx, ty);
    return { node: null, x: tx + 0.5, y: ty + 0.5, tx, ty, sub: c };
  }
  function hover(sx, sy, cx, cy) {
    const tool = UI.tool; const [wx, wy] = V.toWorld(sx, sy); const tx = Math.floor(wx), ty = Math.floor(wy);
    V.hover = { sx, sy, wx, wy, tx, ty };
    if (!tool) {
      const p = V.pick(sx, sy); cvCursor(p ? 'pointer' : 'grab'); V.hover.node = p && p.type === 'node' ? p.obj : null;
      if (p) UI.tip(cx, cy, quickTip(p.obj)); else UI.tip(0, 0, null);
      return;
    }
    if (tool.kind === 'build') { const c = PN.canPlace(G, tool.id, tx, ty); V.hover.check = c; UI.tip(cx, cy, UI.buildTip(c), c.ok); cvCursor(c.ok ? 'crosshair' : 'not-allowed'); return; }
    if (tool.kind === 'line') {
      const e = virtualEnd(wx, wy); V.hover.snap = e.node ? e.node : null;
      if (V.lineStart) {
        const a = V.lineStart, b = e.node || { x: e.x, y: e.y, type: 'sub' };
        const c = PN.lineCheck(G, tool.id, a.node || { x: a.x, y: a.y, type: 'sub', id: -1 }, b.id ? b : Object.assign({ id: -2 }, b));
        let extra = 0; if (!a.node) extra += a.sub && a.sub.cost ? a.sub.cost : 0; if (!e.node) extra += e.sub && e.sub.cost ? e.sub.cost : 0;
        if (!e.node && e.sub && !e.sub.ok && !e.sub.poor) { c.ok = false; c.why = c.why || e.sub.why; }
        if (c.cost != null) c.cost += extra; V.hover.lcheck = c;
        UI.tip(cx, cy, UI.lineTip(c, tool.id) + (extra ? '<div>w tym nowe stacje: ' + PN.money(extra) + '</div>' : ''), c.ok);
      } else UI.tip(cx, cy, '<b>' + PN.esc(PN.TECH[tool.id].name) + '</b><div>' + (e.node ? 'Początek: ' + PN.esc(nodeName(e.node)) : e.sub.ok ? 'Początek: nowa stacja (' + PN.money(e.sub.cost) + ')' : PN.esc(e.sub.why)) + '</div>', e.node || e.sub.ok);
      cvCursor('crosshair'); return;
    }
    if (tool.kind === 'demolish') { const p = V.pick(sx, sy, { noLocal: true }); V.hover.pick = p && p.type !== 'city' ? p : null; UI.tip(cx, cy, V.hover.pick ? 'Wyburz: ' + PN.esc(nodeName(p.obj)) : null); cvCursor('crosshair'); }
  }
  function nodeName(n) { if (!n) return ''; if (n.a) return (PN.TECH[n.type] ? PN.TECH[n.type].short : '') + ' ' + nodeName(G.byId[n.a]) + ' – ' + nodeName(G.byId[n.b]); return n.type === 'city' ? PN.cityName(n, G.y) : n.name; }
  function quickTip(o) {
    if (o.a && o.local) return '<b>Sieć niskiego napięcia (nN)</b><div>Elektrownia stoi w mieście i zasila je wprost, bez linii przesyłowej.</div>';
    if (o.a) { const t = PN.TECH[o.type]; return '<b>' + PN.esc(nodeName(o)) + '</b><div>' + PN.esc(t ? UI.kv(o.type) || t.short : '') + ' · ' + PN.mw(Math.abs(o.flow || 0)) + ' / ' + PN.mw(o.cap) + (o.built ? '' : ' · w budowie') + '</div>'; }
    if (o.owner === 'ipp') return '<b>' + PN.esc(o.name) + '</b><div>Prywatna · ' + PN.esc(o.company) + ' · ' + PN.mw(o.cap) + (o.built ? (o.links.length ? '' : ' · czeka na przyłączenie') : ' · w budowie ' + PN.pct(o.prog)) + '</div>';
    if (o.type === 'city') return '<b>' + PN.esc(PN.cityName(o, G.y)) + '</b><div>' + PN.nf(o.pop, 0) + ' mieszk. · ' + (o.demE > 0 ? 'zasilono ' + PN.pct(o.served) : PN.cityOwned(G, o) ? 'bez prądu' : 'poza Twoim obszarem') + '</div>';
    return '<b>' + PN.esc(o.name) + '</b>' + (o.cap ? '<div>' + PN.mw(o.cap) + (o.built ? '' : ' · w budowie ' + PN.pct(o.prog)) + '</div>' : '');
  }
  function cvCursor(c) { $('#map').style.cursor = c; }
  function click(sx, sy, cx, cy, type) {
    const tool = UI.tool; const [wx, wy] = V.toWorld(sx, sy); const tx = Math.floor(wx), ty = Math.floor(wy);
    // a finger cannot hover: the first touch shows cost, time and reach, a second touch on the same spot builds
    if ((type === 'touch' || type === 'pen') && tool && (tool.kind === 'build' || (tool.kind === 'line' && V.lineStart))) {
      const ve = tool.kind === 'line' ? virtualEnd(wx, wy) : null;
      const key = tool.kind + ':' + tool.id + ':' + (ve && ve.node ? 'n' + ve.node.id : tx + ',' + ty);
      if (UI.tapArm !== key) { UI.tapArm = key; hover(sx, sy, cx, cy); return; }
      UI.tapArm = null; UI.tip(0, 0, null);
    }
    if (!tool) { const p = V.pick(sx, sy); UI.select(p ? p.obj : null); return; }
    if (tool.kind === 'build') {
      const r = PN.build(G, tool.id, tx, ty);
      if (!r.ok) UI.toast(PN.esc(r.why), 'warn'); else { V.flash.push({ x: tx + 0.5, y: ty + 0.5, until: performance.now() + 700 }); UI.hud(true); UI.refreshInfo(true); }
      return;
    }
    if (tool.kind === 'line') {
      const e = virtualEnd(wx, wy);
      if (!V.lineStart) { if (!e.node && !e.sub.ok) { UI.toast(PN.esc(e.sub.why), 'warn'); return; } V.lineStart = e; return; }
      const a = V.lineStart;
      if (a.node && e.node && a.node === e.node) return;
      const extra = (!a.node ? a.sub.cost || 0 : 0) + (!e.node ? e.sub.cost || 0 : 0);
      const va = a.node || { x: a.x, y: a.y, type: 'sub', id: -1 }, vb = e.node || { x: e.x, y: e.y, type: 'sub', id: -2 };
      const chk = PN.lineCheck(G, tool.id, va, vb);
      if (!chk.ok) { UI.toast(PN.esc(chk.why), 'warn'); return; }
      if (!e.node && !e.sub.ok) { UI.toast(PN.esc(e.sub.why), 'warn'); return; }
      if (G.money < chk.cost + extra) { UI.toast('Brakuje pieniędzy: potrzeba ' + PN.money(chk.cost + extra) + '.', 'warn'); return; }
      const na = a.node || PN.build(G, 'substation', a.tx, a.ty).node;
      const nb = e.node || PN.build(G, 'substation', e.tx, e.ty).node;
      if (!na || !nb) { UI.toast('Nie udało się postawić stacji.', 'warn'); return; }
      const r = PN.buildLine(G, tool.id, na, nb);
      if (!r.ok) UI.toast(PN.esc(r.why), 'warn');
      V.lineStart = { node: nb, x: nb.x, y: nb.y }; // continue from the end point
      UI.hud(true); UI.refreshInfo(true);
      return;
    }
    if (tool.kind === 'demolish') {
      const p = V.pick(sx, sy, { noLocal: true }); if (!p || p.type === 'city') return;
      if (p.obj.owner === 'ipp') { UI.toast('To elektrownia prywatnego inwestora – nie możesz jej wyburzyć.', 'warn'); return; }
      if (UI.pendingDemolish !== p.obj) { UI.pendingDemolish = p.obj; UI.toast('Kliknij jeszcze raz, aby wyburzyć: ' + PN.esc(nodeName(p.obj)) + '.', 'warn'); return; }
      PN.demolish(G, p.obj); UI.pendingDemolish = null; UI.refreshInfo(true);
    }
  }

  /* --------------------------------------------------------------- boot */
  function boot() {
    UI.init(); bindInput();
    applyTheme(pickTheme());
    const hot = window.claude && window.claude.hot;
    const start = (data) => {
      if (data && data.save) { try { startWith(PN.deserialize(data.save)); return; } catch (e) { /* fall through */ } }
      PN.showStart();
    };
    const go = () => { if (hot && hot.ready) hot.ready(start); else start((hot && hot.data) || {}); };
    if (document.fonts && document.fonts.load) Promise.race([Promise.all([document.fonts.load('600 20px Caveat'), document.fonts.load('400 16px Kalam')]), new Promise((r) => setTimeout(r, 1500))]).then(go, go); else go();
    try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => (G ? { save: PN.serialize(G) } : {})); } catch (e) { /* not in viewer */ }
  }
  PN.boot = boot;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
