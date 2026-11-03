'use strict';
/* Main map view: camera, layers, animation, picking. */
(function () {
  const PN = window.PN, S = PN.Sketch;
  const BASE = 20;
  const LW = { line_sn: 1.0, line_60: 1.3, line_110: 1.6, line_220: 2.0, line_345: 2.4, line_400: 2.5, line_500: 2.8, line_750: 3.1, hvdc: 2.6, cable_sea: 1.9, local: 0.9 };

  function View(canvas, G) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.G = G; this.terrain = new PN.Terrain(G);
    const v = G.sc.view, t = G.map.toTile(v.lon, v.lat);
    this.cam = { x: t[0], y: t[1], z: v.zoom || 1 };
    this.overlay = null; this.hover = null; this.tool = null; this.sel = null; this.lineStart = null;
    this.time = 0; this.citySpr = new Map(); this.lineGeo = new Map(); this.incidents = []; this.flash = [];
    this.dirtyOverlay = true; this.ovCache = {};
    this.resize();
    this.prepareLabels();
  }
  PN.View = View;

  View.prototype.resize = function () {
    const r = this.cv.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.W = Math.max(1, r.width); this.H = Math.max(1, r.height);
    this.cv.width = Math.round(this.W * this.dpr); this.cv.height = Math.round(this.H * this.dpr);
  };
  View.prototype.scale = function () { return this.cam.z * BASE; };
  View.prototype.toWorld = function (sx, sy) { const s = this.scale(); return [(sx - this.W / 2) / s + this.cam.x, (sy - this.H / 2) / s + this.cam.y]; };
  View.prototype.toScreen = function (wx, wy) { const s = this.scale(); return [(wx - this.cam.x) * s + this.W / 2, (wy - this.cam.y) * s + this.H / 2]; };
  View.prototype.worldT = function () { const s = this.scale(), d = this.dpr; this.ctx.setTransform(d * s, 0, 0, d * s, d * (this.W / 2 - this.cam.x * s), d * (this.H / 2 - this.cam.y * s)); };
  View.prototype.screenT = function () { this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); };
  View.prototype.zoomAt = function (sx, sy, f) {
    const [wx, wy] = this.toWorld(sx, sy);
    this.cam.z = PN.clamp(this.cam.z * f, 0.22, 6);
    const [nx, ny] = this.toWorld(sx, sy);
    this.cam.x += wx - nx; this.cam.y += wy - ny; this.clampCam();
  };
  View.prototype.clampCam = function () { const M = this.G.map; this.cam.x = PN.clamp(this.cam.x, 0, M.W); this.cam.y = PN.clamp(this.cam.y, 0, M.H); };
  View.prototype.centerOn = function (x, y, z) { this.cam.x = x; this.cam.y = y; if (z) this.cam.z = z; this.clampCam(); };
  View.prototype.fit = function () {
    const M = this.G.map, panel = document.getElementById('panel');
    const side = this.W > 820 && panel && !panel.classList.contains('closed') ? 400 : 0, left = this.W > 820 ? 96 : 0, top = 80;
    const aw = this.W - side - left, ah = this.H - top - 70;
    this.cam.z = Math.min(aw / (M.W * BASE), ah / (M.H * BASE)) * 0.98;
    const s = this.scale();
    this.cam.x = M.W / 2 - (left - side) / 2 / s; this.cam.y = M.H / 2 - (top - 70) / 2 / s;
  };

  View.prototype.setTheme = function (th) { S.th = th; PN.Sprites.build(th); this.terrain.clear(); this.citySpr.clear(); this.ovCache = {}; };

  /* ------------------------------------------------------------ labels prep */
  View.prototype.prepareLabels = function () {
    const M = this.G.map, acc = {};
    for (let y = 0; y < M.H; y += 2) for (let x = 0; x < M.W; x += 2) {
      const c = M.country[y * M.W + x]; if (!c || c === M.homeIdx) continue;
      const a = (acc[c] = acc[c] || [0, 0, 0]); a[0] += x; a[1] += y; a[2]++;
    }
    this.countryLabels = Object.keys(acc).filter((c) => acc[c][2] > 20).map((c) => ({ name: M.countryNames[M.codes[c]] || M.codes[c], x: acc[c][0] / acc[c][2], y: acc[c][1] / acc[c][2], n: acc[c][2] }));
    // river labels: longest piece per river
    const best = {};
    for (const r of M.rivers) { if (!r.name || r.cls < 2) continue; const n = r.pts.length / 2; if (!best[r.name] || n > best[r.name].n) best[r.name] = { n, r }; }
    this.riverLabels = Object.values(best).map(({ r }) => { const p = r.pts, n = p.length / 2, k = Math.floor(n / 2) - 1; const k2 = Math.min(n - 1, k + 2); const a = Math.atan2(p[2 * k2 + 1] - p[2 * k + 1], p[2 * k2] - p[2 * k]); return { name: r.name, x: p[2 * k], y: p[2 * k + 1], a: Math.abs(a) > Math.PI / 2 ? a + Math.PI : a, cls: r.cls }; });
    this.seaLabels = (this.G.sc.seaLabels || []).map((s) => { const t = M.toTile(s.lon, s.lat); return { name: s.name, x: t[0], y: t[1], size: s.size }; });
    const reg = this.G.places.regions || {}, R = {};
    for (const key of ['russian', 'austrian', 'german1945', 'prussian1919']) {
      const polys = reg[key]; if (!polys || !polys.length) continue; const list = Array.isArray(polys[0][0]) ? polys : [polys];
      let sx = 0, sy = 0, n = 0, big = 0, bx = 0, by = 0;
      for (const poly of list) { let px = 0, py = 0; poly.forEach((q) => { const t = M.toTile(q[0], q[1]); px += t[0]; py += t[1]; }); if (poly.length > big) { big = poly.length; bx = px / poly.length; by = py / poly.length; } sx += px; sy += py; n += poly.length; }
      R[key] = { x: bx || sx / n, y: by || sy / n };
    }
    this.regionLabels = R;
  };

  /* --------------------------------------------------------------- frame */
  View.prototype.frame = function (dt) {
    this.time += dt;
    const ctx = this.ctx, G = this.G, th = S.th, s = this.scale();
    this.screenT(); ctx.fillStyle = th.paper; ctx.fillRect(0, 0, this.W, this.H);
    this.drawTerrain();
    this.worldT();
    this.drawRegions();
    if (this.overlay) this.drawOverlay(this.overlay);
    this.drawSites();
    this.drawLines();
    this.drawCities();
    this.drawNodes();
    this.drawIncidents();
    this.drawTool();
    this.screenT();
    this.drawLabels();
    this.drawVignette();
    void s; void G;
  };

  View.prototype.visibleRect = function (m) {
    const [x0, y0] = this.toWorld(0, 0), [x1, y1] = this.toWorld(this.W, this.H); m = m || 0;
    return { x0: x0 - m, y0: y0 - m, x1: x1 + m, y1: y1 + m };
  };
  View.prototype.drawTerrain = function () {
    const ctx = this.ctx, T = this.terrain, CH = PN.CHUNK, s = this.scale(), eff = s * this.dpr;
    let lod = eff <= 12 ? 0 : eff <= 24 ? 1 : 2;
    const vr = this.visibleRect(0), M = this.G.map;
    const cx0 = Math.max(0, Math.floor(vr.x0 / CH)), cy0 = Math.max(0, Math.floor(vr.y0 / CH));
    const cx1 = Math.min(Math.ceil(M.W / CH) - 1, Math.floor(vr.x1 / CH)), cy1 = Math.min(Math.ceil(M.H / CH) - 1, Math.floor(vr.y1 / CH));
    let budget = this.firstFrames > 0 ? 64 : 1; const t0 = performance.now();
    this.worldT(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    // draw from centre outwards
    const list = [];
    for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) list.push([cx, cy, Math.hypot(cx * CH + CH / 2 - this.cam.x, cy * CH + CH / 2 - this.cam.y)]);
    list.sort((a, b) => a[2] - b[2]);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, M.W, M.H); ctx.clip();
    for (const [cx, cy] of list) {
      let c = T.get(lod, cx, cy, false);
      if (!c && budget > 0 && performance.now() - t0 < 24) { c = T.get(lod, cx, cy, true); budget--; }
      if (!c) { for (const l2 of [lod - 1, lod + 1, lod - 2, lod + 2]) { if (l2 < 0 || l2 > 2) continue; c = T.get(l2, cx, cy, false); if (c) break; } }
      if (!c && lod > 0) { c = T.get(0, cx, cy, true); }
      if (c) ctx.drawImage(c, cx * CH, cy * CH, CH, CH);
    }
    ctx.restore();
    if (this.firstFrames > 0) this.firstFrames--;
    this.drawFrame();
  };
  /* cartographic frame with graticule ticks */
  View.prototype.drawFrame = function () {
    const ctx = this.ctx, M = this.G.map, th = S.th, s = this.scale();
    ctx.strokeStyle = th.ink; ctx.lineJoin = 'miter';
    ctx.globalAlpha = 0.85; ctx.lineWidth = 2.2 / s; ctx.strokeRect(-0.35, -0.35, M.W + 0.7, M.H + 0.7);
    ctx.globalAlpha = 0.6; ctx.lineWidth = 0.9 / s; ctx.strokeRect(0, 0, M.W, M.H);
    // alternating scale bar along the frame (every 5 tiles)
    ctx.globalAlpha = 0.55; ctx.fillStyle = th.ink;
    for (let x = 0; x < M.W; x += 5) if ((x / 5) % 2 === 0) { ctx.fillRect(x, -0.35, Math.min(5, M.W - x), 0.35); ctx.fillRect(x, M.H, Math.min(5, M.W - x), 0.35); }
    for (let y = 0; y < M.H; y += 5) if ((y / 5) % 2 === 0) { ctx.fillRect(-0.35, y, 0.35, Math.min(5, M.H - y)); ctx.fillRect(M.W, y, 0.35, Math.min(5, M.H - y)); }
    ctx.globalAlpha = 1;
  };

  /* pre-1945 lands etc. (Poland) */
  View.prototype.drawRegions = function () {
    const G = this.G; if (G.code !== 'PL') return;
    const ctx = this.ctx, th = S.th, T = this.terrain, s = this.scale();
    const show = [];
    if (!PN.regionOpen(G, 3) && T.regions.german1945) show.push(T.regions.german1945);
    if (!PN.regionOpen(G, 1) && T.regions.prussian1919) show.push(T.regions.prussian1919);
    if (!PN.regionOpen(G, 2) && T.regions.silesia1922) show.push(T.regions.silesia1922);
    if (!show.length) return;
    const vr = this.visibleRect(2);
    for (const p of show) {
      ctx.save(); ctx.clip(p, 'evenodd');
      ctx.fillStyle = th.paper; ctx.globalAlpha = 0.35; ctx.fillRect(vr.x0, vr.y0, vr.x1 - vr.x0, vr.y1 - vr.y0); ctx.globalAlpha = 1;
      S.hatch(ctx, vr.x0, vr.y0, vr.x1 - vr.x0, vr.y1 - vr.y0, 0.78, 0.32, PN.rng(5), { color: th.ink, w: 0.9 / s, alpha: 0.22 });
      ctx.restore();
      ctx.globalAlpha = 0.55; ctx.strokeStyle = th.ink; ctx.lineWidth = 1.2 / s; ctx.setLineDash([6 / s, 4 / s]); ctx.stroke(p); ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
  };

  /* hydro sites, protected areas, deposit hints */
  View.prototype.drawSites = function () {
    const G = this.G, M = G.map, ctx = this.ctx, th = S.th, s = this.scale(), y = PN.ym(G);
    const tool = this.tool && this.tool.id;
    const showHydro = this.overlay === 'res' || tool === 'hydro_dam' || tool === 'pumped' || tool === 'hydro_small' || this.cam.z > 1.6;
    if (showHydro) {
      for (const h of M.hydro) {
        if (G.nodes.some((n) => n.site === h.k && n.type === 'plant')) continue;
        const want = !tool || (tool === 'pumped' ? h.type === 'pumped' : tool === 'hydro_dam' ? h.type !== 'pumped' : true);
        if (!want) continue;
        const x = h.tx + 0.5, yy = h.ty + 0.5, r = 0.32;
        ctx.globalAlpha = 0.9; ctx.strokeStyle = th.water; ctx.lineWidth = 1.4 / s;
        ctx.beginPath(); ctx.arc(x, yy, r, 0, 6.3); ctx.stroke();
        ctx.beginPath(); for (let k = 0; k < 2; k++) { const yy2 = yy - 0.06 + k * 0.12; ctx.moveTo(x - 0.18, yy2); ctx.quadraticCurveTo(x - 0.09, yy2 - 0.07, x, yy2); ctx.quadraticCurveTo(x + 0.09, yy2 + 0.07, x + 0.18, yy2); } ctx.stroke();
        if (h.type === 'pumped') { ctx.beginPath(); ctx.moveTo(x, yy - 0.42); ctx.lineTo(x, yy - 0.55); ctx.moveTo(x - 0.05, yy - 0.5); ctx.lineTo(x, yy - 0.55); ctx.lineTo(x + 0.05, yy - 0.5); ctx.stroke(); }
        ctx.globalAlpha = 1;
      }
    }
    if (this.overlay === 'res' || tool === 'coal_mine' || tool === 'lignite_mine' || tool === 'gas_well' || tool === 'lignite' || tool === 'geothermal') this.drawDeposits(tool);
    if (this.overlay === 'res') this.drawHistoric();
    if (this.cam.z > 0.9 || this.overlay === 'res') {
      for (const p of M.protected) {
        if (p.from > y) continue;
        ctx.globalAlpha = 0.55; ctx.strokeStyle = th.green; ctx.lineWidth = 1.2 / s; ctx.setLineDash([2 / s, 4 / s]);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
    }
  };
  /* where history built real plants: dotted ghost markers with name and year */
  View.prototype.drawHistoric = function () {
    const G = this.G, ctx = this.ctx, th = S.th, s = this.scale(), y = PN.ym(G), M = G.map;
    const list = (G.places.historicPlants || []);
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (const p of list) {
      const t = M.toTile(p.lon, p.lat); const tech = PN.TECH[p.tech];
      const future = p.year > y;
      ctx.globalAlpha = future ? 0.45 : 0.8; ctx.strokeStyle = (tech && tech.color) || th.ink; ctx.lineWidth = 1.6 / s; ctx.setLineDash([2.5 / s, 2.5 / s]);
      const r = Math.max(0.35, 9 / s); ctx.beginPath(); ctx.arc(t[0], t[1], r, 0, 6.3); ctx.stroke(); ctx.setLineDash([]);
      if (this.cam.z > 0.7) { ctx.fillStyle = th.ink; ctx.font = '600 ' + (12 / s) + 'px Caveat, cursive'; ctx.fillText(p.name + ' · ' + p.year, t[0], t[1] + r * 1.15); }
    }
    ctx.restore();
  };
  const DEP_COL = { coal: 'ink', lignite: '#8a6a48', gas: 'orange', oil: 'violet', uranium: 'green', geothermal: 'red' };
  View.prototype.drawDeposits = function (tool) {
    const G = this.G, M = G.map, ctx = this.ctx, th = S.th, s = this.scale();
    const kindFor = { coal_mine: 'coal', lignite_mine: 'lignite', lignite: 'lignite', gas_well: 'gas', geothermal: 'geothermal' }[tool];
    for (const d of M.deposits) {
      if (kindFor && d.kind !== kindFor) continue;
      const col = th[DEP_COL[d.kind]] || DEP_COL[d.kind] || th.ink;
      ctx.save();
      const p = new Path2D();
      if (d.ring) { p.moveTo(d.ring[0], d.ring[1]); for (let i = 2; i < d.ring.length; i += 2) p.lineTo(d.ring[i], d.ring[i + 1]); p.closePath(); }
      else p.arc(d.x, d.y, Math.max(0.7, d.r || 1), 0, 6.3);
      ctx.clip(p);
      const bb = d.ring ? bbox(d.ring) : { x: d.x - (d.r || 1), y: d.y - (d.r || 1), w: 2 * (d.r || 1), h: 2 * (d.r || 1) };
      S.hatch(ctx, bb.x - 0.5, bb.y - 0.5, bb.w + 1, bb.h + 1, d.kind === 'coal' ? 0.8 : d.kind === 'lignite' ? -0.5 : 1.3, d.kind === 'coal' ? 0.18 : 0.26, PN.rng(d.k + 9), { color: col, w: 1.1 / s, alpha: 0.55 });
      if (d.kind === 'coal') S.hatch(ctx, bb.x - 0.5, bb.y - 0.5, bb.w + 1, bb.h + 1, -0.8, 0.26, PN.rng(d.k + 19), { color: col, w: 0.8 / s, alpha: 0.35 });
      ctx.restore();
      ctx.globalAlpha = 0.85; ctx.strokeStyle = col; ctx.lineWidth = 1.4 / s; ctx.stroke(p); ctx.globalAlpha = 1;
    }
  };
  function bbox(r) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < r.length; i += 2) { x0 = Math.min(x0, r[i]); x1 = Math.max(x1, r[i]); y0 = Math.min(y0, r[i + 1]); y1 = Math.max(y1, r[i + 1]); } return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; }

  /* ---------------------------------------------------------------- overlays */
  View.prototype.drawOverlay = function (kind) {
    const G = this.G, M = G.map, ctx = this.ctx, th = S.th, s = this.scale();
    if (kind === 'wind' || kind === 'solar') {
      const key = kind + th.name;
      if (!this.ovCache[key]) this.ovCache[key] = this.buildField(kind);
      const ov = this.ovCache[key];
      ctx.imageSmoothingEnabled = true; ctx.globalAlpha = 0.55; ctx.drawImage(ov.img, 0, 0, M.W, M.H); ctx.globalAlpha = 1;
      ctx.lineCap = 'round';
      for (const lv of ov.levels) {
        ctx.strokeStyle = th.ink; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.1 / s; ctx.stroke(lv.path); ctx.globalAlpha = 1;
      }
      this.ovLabels = ov.labels;
    } else if (kind === 'res') {
      this.drawDeposits(null);
    } else if (kind === 'demand') {
      for (const c of G.cities) {
        if (!PN.cityOwned(G, c)) continue;
        const pot = c.potU + (c.popR * G.satR * G.dpc) / 1e6, d = c.demPk || 0;
        const r = Math.sqrt(Math.max(pot, d)) * (G.code === 'PL' ? 0.08 : 0.025) + 0.15;
        const ok = c.served >= 0.98 ? th.green : c.served >= 0.85 ? th.orange : th.red;
        ctx.globalAlpha = 0.18; ctx.fillStyle = d > 0 ? ok : th.ink; ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.3); ctx.fill();
        ctx.globalAlpha = 0.8; ctx.strokeStyle = d > 0 ? ok : th.ink; ctx.lineWidth = 1.3 / s; ctx.setLineDash(d > 0 ? [] : [3 / s, 3 / s]); ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.3); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
    }
  };
  View.prototype.buildField = function (kind) {
    const M = this.G.map, th = S.th, img = S.canvas(M.W, M.H), x = img.getContext('2d'), id = x.createImageData(M.W, M.H);
    const val = kind === 'wind' ? M.wind : M.solar;
    let lo, hi, steps;
    if (kind === 'wind') { lo = 4.5; hi = 10; steps = [5, 6, 7, 8, 9, 10]; }
    else if (this.G.code === 'PL') { lo = 950; hi = 1160; steps = [1000, 1050, 1100, 1150]; }
    else { lo = 1200; hi = 2400; steps = [1400, 1600, 1800, 2000, 2200]; }
    const ramp = kind === 'wind' ? [[0, [200, 215, 230]], [0.35, [120, 180, 200]], [0.6, [90, 170, 120]], [0.8, [230, 190, 60]], [1, [215, 100, 50]]] : [[0, [200, 205, 215]], [0.4, [240, 215, 120]], [0.7, [240, 160, 60]], [1, [210, 70, 40]]];
    const col = (t) => { for (let k = 1; k < ramp.length; k++) if (t <= ramp[k][0]) { const [a, ca] = ramp[k - 1], [b, cb] = ramp[k]; const f = (t - a) / (b - a); return ca.map((v, j) => v + (cb[j] - v) * f); } return ramp[ramp.length - 1][1]; };
    for (let i = 0; i < M.N; i++) {
      const sea = M.terr[i] === PN.TERR.SEA;
      const foreign = !sea && M.country[i] !== M.homeIdx;
      const show = kind === 'wind' ? (!foreign && (!sea || (M.nearLand[i] === M.homeIdx && M.distLand[i] * M.T < 100))) : !sea && !foreign;
      const t = PN.clamp((val[i] - lo) / (hi - lo), 0, 1), c = col(t);
      id.data[4 * i] = c[0]; id.data[4 * i + 1] = c[1]; id.data[4 * i + 2] = c[2]; id.data[4 * i + 3] = show ? 150 : 0;
    }
    x.putImageData(id, 0, 0);
    // isolines (marching squares)
    const levels = [], labels = [];
    const W = M.W, H = M.H;
    const mask = (i) => { const sea = M.terr[i] === PN.TERR.SEA; return kind === 'wind' ? (M.country[i] === M.homeIdx || (sea && M.nearLand[i] === M.homeIdx && M.distLand[i] * M.T < 100)) : M.country[i] === M.homeIdx; };
    for (const lv of steps) {
      const p = new Path2D(); let segs = 0;
      for (let yy = 0; yy < H - 1; yy++) for (let xx = 0; xx < W - 1; xx++) {
        const i = yy * W + xx; if (!mask(i)) continue;
        const a = val[i], b = val[i + 1], c = val[i + W + 1], d = val[i + W];
        const pts = [];
        const edge = (v1, v2, x1, y1, x2, y2) => { if ((v1 < lv) !== (v2 < lv)) { const f = (lv - v1) / (v2 - v1); pts.push(x1 + (x2 - x1) * f + 0.5, y1 + (y2 - y1) * f + 0.5); } };
        edge(a, b, xx, yy, xx + 1, yy); edge(b, c, xx + 1, yy, xx + 1, yy + 1); edge(d, c, xx, yy + 1, xx + 1, yy + 1); edge(a, d, xx, yy, xx, yy + 1);
        if (pts.length >= 4) {
          p.moveTo(pts[0], pts[1]); p.lineTo(pts[2], pts[3]); if (pts.length >= 8) { p.moveTo(pts[4], pts[5]); p.lineTo(pts[6], pts[7]); } segs++;
          const far = labels.every((q) => Math.hypot(q.x - pts[0], q.y - pts[1]) > Math.max(W, H) / 7);
          if (segs % 25 === 7 && far && M.distSea[i] > 1.5) labels.push({ x: pts[0], y: pts[1], t: kind === 'wind' ? lv + ' m/s' : PN.nf(lv, 0) });
        }
      }
      levels.push({ lv, path: p });
    }
    return { img, levels, labels };
  };

  /* ------------------------------------------------------------------- lines */
  View.prototype.geo = function (l) {
    const a = this.G.byId[l.a], b = this.G.byId[l.b];
    const key = l.id + ':' + a.x.toFixed(2) + ',' + a.y.toFixed(2) + ':' + b.x.toFixed(2) + ',' + b.y.toFixed(2);
    let g = this.lineGeo.get(l.id);
    if (g && g.key === key) return g;
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const bow = (PN.hash(l.id, 3, 9) - 0.5) * 2 * Math.min(0.6, L * 0.05);
    const cx = (a.x + b.x) / 2 + nx * bow, cy = (a.y + b.y) / 2 + ny * bow;
    const path = new Path2D(); path.moveTo(a.x, a.y); path.quadraticCurveTo(cx, cy, b.x, b.y);
    const path2 = new Path2D(); const j = 0.03; path2.moveTo(a.x + j, a.y - j); path2.quadraticCurveTo(cx - j, cy + j, b.x - j, b.y + j);
    const towers = []; const n = Math.max(1, Math.floor(L / 0.7));
    for (let k = 1; k < n; k++) { const t = k / n, it = 1 - t; const x = it * it * a.x + 2 * it * t * cx + t * t * b.x, y = it * it * a.y + 2 * it * t * cy + t * t * b.y; const tx = 2 * it * (cx - a.x) + 2 * t * (b.x - cx), ty = 2 * it * (cy - a.y) + 2 * t * (b.y - cy); const tl = Math.hypot(tx, ty) || 1; towers.push([x, y, -ty / tl, tx / tl]); }
    g = { key, path, path2, towers, L, cx, cy };
    this.lineGeo.set(l.id, g); return g;
  };
  View.prototype.drawLines = function () {
    const G = this.G, ctx = this.ctx, th = S.th, s = this.scale(), z = this.cam.z, y = PN.ym(G);
    const vr = this.visibleRect(1), px = (v) => v / s;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const l of G.lines) {
      const a = G.byId[l.a], b = G.byId[l.b]; if (!a || !b) continue;
      if (Math.max(a.x, b.x) < vr.x0 || Math.min(a.x, b.x) > vr.x1 || Math.max(a.y, b.y) < vr.y0 || Math.min(a.y, b.y) > vr.y1) continue;
      const g = this.geo(l), w = (LW[l.type] || 1.2) * PN.clamp(z * 0.9, 0.7, 1.7);
      if (l.local) { ctx.strokeStyle = th.ink; ctx.globalAlpha = 0.45; ctx.lineWidth = px(0.9); ctx.setLineDash([px(2), px(3)]); ctx.stroke(g.path); ctx.setLineDash([]); ctx.globalAlpha = 1; continue; }
      const out = l.out > y, sel = this.sel === l;
      if (!l.built) {
        ctx.strokeStyle = th.ink; ctx.globalAlpha = 0.45; ctx.lineWidth = px(w * 0.8); ctx.setLineDash([px(5), px(5)]); ctx.stroke(g.path); ctx.setLineDash([]);
        ctx.globalAlpha = 0.9; ctx.lineWidth = px(w * 1.1);
        const t = PN.clamp(l.prog, 0, 1); ctx.beginPath(); const steps = 12; for (let k = 0; k <= steps * t; k++) { const tt = k / steps, it = 1 - tt; const xx = it * it * a.x + 2 * it * tt * g.cx + tt * tt * b.x, yy = it * it * a.y + 2 * it * tt * g.cy + tt * tt * b.y; if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); } ctx.stroke();
        ctx.globalAlpha = 1; continue;
      }
      // load colouring
      const col = l.dmg ? th.red : out ? th.ink : l.load > 0.985 ? th.red : l.load > 0.8 ? th.orange : th.ink;
      if (sel) { ctx.strokeStyle = th.yellow; ctx.globalAlpha = 0.45; ctx.lineWidth = px(w + 7); ctx.stroke(g.path); }
      ctx.strokeStyle = col; ctx.globalAlpha = out ? 0.35 : 0.9; ctx.lineWidth = px(w);
      if (out || l.dmg) ctx.setLineDash([px(4), px(4)]);
      if (l.type === 'hvdc' || l.type === 'cable_sea') { ctx.setLineDash(l.type === 'cable_sea' ? [px(7), px(3)] : [px(10), px(3), px(2), px(3)]); if (l.type === 'cable_sea') ctx.strokeStyle = l.dmg ? th.red : th.water; }
      ctx.stroke(g.path);
      ctx.globalAlpha = 0.35; ctx.lineWidth = px(w * 0.55); ctx.stroke(g.path2); ctx.setLineDash([]);
      if (w >= 2.3 && z > 0.7) { ctx.globalAlpha = 0.5; ctx.lineWidth = px(0.6); ctx.stroke(g.path2); }
      // towers
      if (z > 0.55 && l.type !== 'cable_sea') {
        ctx.globalAlpha = 0.75; ctx.strokeStyle = col; ctx.lineWidth = px(0.9); ctx.beginPath();
        const tl = (l.type === 'line_sn' ? 2.5 : 3 + w) / s;
        for (const [x, yy, nx, ny] of g.towers) { ctx.moveTo(x - nx * tl, yy - ny * tl); ctx.lineTo(x + nx * tl, yy + ny * tl); if (w >= 2) { ctx.moveTo(x - nx * tl * 0.6 - ny * tl * 0.4, yy - ny * tl * 0.6 + nx * tl * 0.4); ctx.lineTo(x + nx * tl * 0.6 - ny * tl * 0.4, yy + ny * tl * 0.6 + nx * tl * 0.4); } }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // current flow
      if (!out && !l.dmg && Math.abs(l.flow) > l.cap * 0.01) {
        const dir = l.flow >= 0 ? 1 : -1, sp = 18 + 60 * PN.clamp(l.load, 0, 1);
        ctx.strokeStyle = th.flow; ctx.globalAlpha = th.night ? 0.95 : 0.85; ctx.lineWidth = px(Math.max(1.4, w * 0.75));
        ctx.setLineDash([px(3), px(13)]); ctx.lineDashOffset = -dir * px(this.time * sp);
        ctx.stroke(g.path); ctx.setLineDash([]); ctx.lineDashOffset = 0; ctx.globalAlpha = 1;
      }
      if (out && z > 0.6) { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, k = px(5); ctx.strokeStyle = th.red; ctx.lineWidth = px(1.8); ctx.beginPath(); ctx.moveTo(mx - k, my - k); ctx.lineTo(mx + k, my + k); ctx.moveTo(mx + k, my - k); ctx.lineTo(mx - k, my + k); ctx.stroke(); }
    }
  };

  /* ------------------------------------------------------------------- cities */
  View.prototype.citySprite = function (c) {
    const G = this.G, th = S.th, eff = this.scale() * this.dpr;
    const R = eff < 30 ? 24 : eff < 60 ? 48 : 96;
    const lit = PN.clamp(c.eU || 0, 0, 1) * (c.demE > 0 ? PN.clamp(c.served, 0, 1) : 1);
    const black = c.demE > 0 && c.served < 0.9;
    const modern = G.y >= 1955, own = PN.cityOwned(G, c);
    const key = th.name + ':' + R + ':' + Math.round(Math.log(Math.max(1000, c.pop)) * 6) + ':' + Math.round(Math.sqrt(lit) * 16) + ':' + (black ? 1 : 0) + ':' + (own ? 1 : 0) + ':' + (modern ? 1 : 0);
    let spr = this.citySpr.get(c.id);
    if (spr && spr.key === key) return spr;
    const rad = c.rad, W = rad * 2 + 1.2, size = Math.ceil(W * R);
    const cv = S.canvas(size, size), x = cv.getContext('2d'), r = PN.rng(c.id * 99991 + 7);
    x.scale(R, R); x.translate(W / 2, W / 2);
    const px = (v) => (v / R) * Math.sqrt(R / 24);
    // urban wash
    const g0 = x.createRadialGradient(0, 0, 0, 0, 0, rad * 1.05);
    g0.addColorStop(0, th.night ? 'rgba(220,216,207,0.10)' : 'rgba(42,44,48,0.10)'); g0.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g0; x.beginPath(); x.arc(0, 0, rad * 1.05, 0, 6.3); x.fill();
    // streets
    x.lineCap = 'round'; x.strokeStyle = th.ink; x.globalAlpha = 0.32; x.lineWidth = px(0.9);
    const ns = 4 + Math.min(5, Math.floor(c.pop / 2.5e5));
    for (let k = 0; k < ns; k++) { const a = (k / ns) * 6.28 + r() * 0.5, L = rad * (0.85 + r() * 0.3); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(Math.cos(a + 0.25) * L * 0.5, Math.sin(a + 0.25) * L * 0.5, Math.cos(a) * L, Math.sin(a) * L); x.stroke(); }
    if (c.pop > 3e5) { x.beginPath(); x.ellipse(0, 0, rad * 0.55, rad * 0.5, r(), 0, 6.3); x.stroke(); }
    x.globalAlpha = 1;
    if (c.pop > 90000) { // old-town quarters
      const nb = Math.min(22, 4 + Math.floor(Math.sqrt(c.pop / 1e5) * 4)), rot = r() * 0.6 - 0.3, cs = Math.cos(rot), sn = Math.sin(rot);
      x.strokeStyle = th.ink; x.lineWidth = px(0.8);
      for (let k = 0; k < nb; k++) {
        const gx = (k % 5) - 2, gy = Math.floor(k / 5) - 2, bw = 0.17 + r() * 0.05, bh = 0.13 + r() * 0.05, sp = 0.24;
        const ux = gx * sp + (r() - 0.5) * 0.03, uy = gy * sp * 0.85 + (r() - 0.5) * 0.03;
        if (Math.hypot(ux, uy) > rad * 0.55) continue;
        const bx = ux * cs - uy * sn, by = ux * sn + uy * cs;
        x.save(); x.translate(bx, by); x.rotate(rot); x.beginPath(); x.rect(-bw / 2, -bh / 2, bw, bh);
        x.fillStyle = th.paper; x.globalAlpha = 0.9; x.fill(); x.globalAlpha = 0.75; x.stroke();
        x.clip(); S.hatch(x, -bw / 2, -bh / 2, bw, bh, 0.8, 0.035, r, { color: th.ink, w: px(0.5), alpha: 0.35 }); x.restore();
      }
      x.globalAlpha = 1;
    }
    const N = Math.round(PN.clamp(10 + 85 * Math.sqrt(c.pop / 1e6), 8, 150));
    const houses = [];
    for (let k = 0; k < N; k++) { const u = r(), a = r() * 6.283, d = Math.pow(u, 0.62) * rad * 0.95; houses.push([Math.cos(a) * d, Math.sin(a) * d * 0.88, d]); }
    houses.sort((p, q) => p[2] - q[2]);
    const nLit = Math.round(N * lit);
    const ga = (th.night ? 0.5 : 0.3) * PN.clamp(2.6 / Math.sqrt(nLit + 1), 0.35, 1);
    for (let k = 0; k < nLit; k++) {
      const [hx, hy] = houses[k], gr = 0.24;
      const g = x.createRadialGradient(hx, hy, 0, hx, hy, gr);
      g.addColorStop(0, th.glow + ga.toFixed(3) + ')'); g.addColorStop(1, th.glow + '0)');
      x.fillStyle = g; x.beginPath(); x.arc(hx, hy, gr, 0, 6.3); x.fill();
    }
    const towers = modern && c.pop > 4e5 ? 3 + Math.floor(c.pop / 6e5) : 0;
    x.lineJoin = 'round';
    for (let k = N - 1; k >= 0; k--) {
      const [hx, hy, d] = houses[k];
      const core = d < rad * 0.35;
      const tall = core && k < towers;
      const w = tall ? 0.09 : core ? 0.075 + r() * 0.03 : 0.055 + r() * 0.025, hgt = tall ? 0.22 + r() * 0.16 : w * (0.8 + r() * 0.4);
      x.beginPath();
      if (tall) { x.rect(hx - w / 2, hy - hgt, w, hgt); }
      else if (core && r() < 0.5) { x.rect(hx - w * 0.7, hy - hgt, w * 1.4, hgt); x.moveTo(hx - w * 0.7, hy - hgt); x.lineTo(hx - w * 0.5, hy - hgt - w * 0.4); x.lineTo(hx + w * 0.9, hy - hgt - w * 0.4); x.lineTo(hx + w * 0.7, hy - hgt); }
      else { x.moveTo(hx - w / 2, hy); x.lineTo(hx - w / 2, hy - hgt); x.lineTo(hx, hy - hgt - w * 0.7); x.lineTo(hx + w / 2, hy - hgt); x.lineTo(hx + w / 2, hy); x.closePath(); }
      x.fillStyle = th.paper; x.globalAlpha = 0.95; x.fill();
      x.strokeStyle = th.ink; x.globalAlpha = own ? 0.85 : 0.5; x.lineWidth = px(0.85); x.stroke();
      if (k < nLit) { x.fillStyle = th.yellow; x.globalAlpha = 1; const ws = Math.max(0.018, w * 0.28); x.fillRect(hx - ws / 2, hy - hgt * 0.62, ws, ws); if (tall) { x.fillRect(hx - ws / 2, hy - hgt * 0.35, ws, ws); x.fillRect(hx - ws / 2, hy - hgt * 0.85, ws, ws); } }
    }
    // old-town landmark: church spire
    if (c.pop > 60000) {
      const hx = 0.05, hy = -0.02, hgt = 0.34 + Math.min(0.2, c.pop / 5e6);
      x.globalAlpha = 0.95; x.fillStyle = th.paper; x.strokeStyle = th.ink; x.lineWidth = px(1);
      x.beginPath(); x.rect(hx - 0.045, hy - hgt * 0.55, 0.09, hgt * 0.55); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(hx - 0.055, hy - hgt * 0.55); x.lineTo(hx, hy - hgt); x.lineTo(hx + 0.055, hy - hgt * 0.55); x.closePath(); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(hx, hy - hgt); x.lineTo(hx, hy - hgt - 0.05); x.stroke();
    }
    x.globalAlpha = 1;
    if (black) {
      x.strokeStyle = th.red; x.lineWidth = px(1.4); x.globalAlpha = 0.75; x.beginPath();
      for (let k = 0; k < 6; k++) { const a = r() * 6.3, d = r() * rad * 0.7; x.moveTo(Math.cos(a) * d - 0.12, Math.sin(a) * d - 0.08); x.lineTo(Math.cos(a) * d + 0.12, Math.sin(a) * d + 0.08); }
      x.stroke(); x.globalAlpha = 1;
    }
    S.erode(cv, th.grainAlpha * 0.55, c.id * 17, c.id * 31);
    spr = { key, cv, w: W }; this.citySpr.set(c.id, spr); return spr;
  };
  View.prototype.drawCities = function () {
    const G = this.G, ctx = this.ctx, th = S.th, vr = this.visibleRect(3), s = this.scale();
    // village lights
    if (this.cam.z > 0.55) {
      ctx.fillStyle = th.yellow;
      const M = G.map;
      for (const v of M.villages) {
        if (v.x < vr.x0 || v.x > vr.x1 || v.y < vr.y0 || v.y > vr.y1) continue;
        const d = M.district[v.i]; if (d < 0) continue; const c = G.cities[d]; if (!c || !PN.cityOwned(G, c)) continue;
        const lit = c.eR * (c.served > 0.9 ? 1 : c.served); if (v.thr >= lit) continue;
        ctx.globalAlpha = th.night ? 0.9 : 0.75; ctx.beginPath(); ctx.arc(v.x, v.y - 0.04, Math.max(0.035, 1.6 / s), 0, 6.3); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    for (const c of G.cities) {
      if (!(c.pop > 0)) continue;
      if (c.x + c.rad < vr.x0 || c.x - c.rad > vr.x1 || c.y + c.rad < vr.y0 || c.y - c.rad > vr.y1) continue;
      const sp = this.citySprite(c);
      const own = PN.cityOwned(G, c);
      ctx.globalAlpha = own ? 1 : 0.55;
      ctx.drawImage(sp.cv, c.x - sp.w / 2, c.y - sp.w / 2, sp.w, sp.w);
      ctx.globalAlpha = 1;
      if (this.sel === c) { ctx.strokeStyle = th.yellow; ctx.lineWidth = 3 / s; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(c.x, c.y, c.rad + 0.25, 0, 6.3); ctx.stroke(); ctx.globalAlpha = 1; }
    }
  };

  /* ------------------------------------------------------------------- nodes */
  View.prototype.nodeSize = function (n) {
    let k = 1.7;
    if (n.type === 'plant') k = 1.25 + 0.42 * Math.log10(1 + (n.cap || 1)) * (this.G.code === 'US' ? 0.85 : 1);
    else if (n.type === 'mine') k = 1.7; else if (n.type === 'sub') k = 1.05; else if (n.type === 'border') k = 1.3; else if (n.type === 'load') k = 1.5 + 0.25 * Math.log10(1 + PN.loadMW(this.G, n));
    const s = this.scale(), minPx = n.type === 'sub' ? 18 : 30;
    if (k * s < minPx) k = minPx / s;
    return k;
  };
  View.prototype.drawNodes = function () {
    const G = this.G, ctx = this.ctx, th = S.th, s = this.scale(), vr = this.visibleRect(2), t = this.time, U = PN.SPRITE_U, y = PN.ym(G);
    const sorted = G.nodes.filter((n) => n.type !== 'city' && n.x > vr.x0 && n.x < vr.x1 && n.y > vr.y0 && n.y < vr.y1).sort((a, b) => a.y - b.y);
    for (const n of sorted) {
      const key = PN.Sprites.keyFor(n), spr = PN.Sprites.get(key), m = spr.meta;
      const k = this.nodeSize(n), w = k, sc = w / U;
      const ox = n.x - m.anchor[0] * sc, oy = n.y - m.anchor[1] * sc + 0.3 * sc * U * 0.12;
      const building = !n.built;
      const P = (px, py) => [ox + px * sc, oy + py * sc];
      // selection halo
      if (this.sel === n) { ctx.fillStyle = th.yellow; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.ellipse(n.x, n.y, w * 0.55, w * 0.32, 0, 0, 6.3); ctx.fill(); ctx.globalAlpha = 1; }
      ctx.globalAlpha = building ? 0.38 : n.dmg ? 0.6 : n.on === false ? 0.5 : (n.type === 'load' && !n.links.length) || n.closed ? 0.5 : 1;
      ctx.drawImage(spr, ox, oy, w, w);
      ctx.globalAlpha = 1;
      if (building) {
        ctx.drawImage(PN.Sprites.get('construction'), ox, oy, w, w);
        const bw = w * 0.6, bx = n.x - bw / 2, by = n.y + 0.12;
        ctx.strokeStyle = th.ink; ctx.lineWidth = 1 / s; ctx.strokeRect(bx, by, bw, 4 / s);
        ctx.fillStyle = th.orange; ctx.fillRect(bx, by, bw * PN.clamp(n.prog, 0, 1), 4 / s);
        continue;
      }
      if (n.dmg) { ctx.drawImage(PN.Sprites.get('damaged'), ox, oy, w, w); continue; }
      if (n.pending) { const bw = w * 0.6, bx = n.x - bw / 2, by = n.y + 0.12; ctx.strokeStyle = th.ink; ctx.lineWidth = 1 / s; ctx.strokeRect(bx, by, bw, 3 / s); ctx.fillStyle = th.orange; ctx.fillRect(bx, by, bw * n.pending.prog, 3 / s); }
      const run = n.type === 'plant' ? (n.lastCF || 0) : n.type === 'mine' ? 0.7 : 0.6;
      // smoke
      if (m.smoke.length && run > 0.03 && n.on !== false) {
        for (const [px0, py0] of m.smoke) {
          const [bx, by] = P(px0, py0);
          for (let q = 0; q < 4; q++) {
            const ph = (t * 0.22 + q / 4 + (n.id % 7) / 7) % 1;
            const rr = (2 + ph * 7) * sc, xx = bx + (ph * 14 + Math.sin(t + q) * 1.5) * sc, yy = by - ph * 20 * sc;
            ctx.strokeStyle = th.smoke + (0.55 * (1 - ph) * Math.min(1, run * 2)).toFixed(3) + ')'; ctx.lineWidth = 0.9 / s;
            ctx.beginPath(); ctx.arc(xx, yy, rr, 0, 6.3); ctx.stroke();
            if (y < 1990 && !n.fgd) { ctx.fillStyle = th.smoke + (0.12 * (1 - ph)).toFixed(3) + ')'; ctx.fill(); }
          }
        }
      }
      if (m.steam.length && run > 0.03) {
        for (const [px0, py0] of m.steam) {
          const [bx, by] = P(px0, py0);
          for (let q = 0; q < 3; q++) {
            const ph = (t * 0.15 + q / 3 + (n.id % 5) / 5) % 1;
            const rr = (4 + ph * 9) * sc, xx = bx + ph * 8 * sc, yy = by - (2 + ph * 16) * sc;
            ctx.fillStyle = th.night ? 'rgba(235,235,235,' + (0.35 * (1 - ph)).toFixed(3) + ')' : 'rgba(255,255,255,' + (0.75 * (1 - ph)).toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(xx, yy, rr, 0, 6.3); ctx.fill();
            ctx.strokeStyle = th.smoke + (0.3 * (1 - ph)).toFixed(3) + ')'; ctx.lineWidth = 0.8 / s; ctx.stroke();
          }
        }
      }
      if (m.hubs.length) {
        const speed = n.type === 'plant' ? 0.6 + 4 * (n.lastCF || 0.25) : 1;
        ctx.strokeStyle = th.ink; ctx.lineWidth = Math.max(0.9, 1.1 * sc * 2) / s * Math.min(1.6, s / 20 + 0.4); ctx.lineCap = 'round';
        m.hubs.forEach(([hx, hy, L], q) => {
          const [bx, by] = P(hx, hy), a0 = t * speed + q * 1.7 + n.id;
          ctx.beginPath(); for (let b2 = 0; b2 < 3; b2++) { const a = a0 + (b2 * Math.PI * 2) / 3; ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a) * L * sc, by + Math.sin(a) * L * sc * 0.95); } ctx.stroke();
        });
      }
      if (m.leds.length) { m.leds.forEach(([lx, ly], q) => { const [bx, by] = P(lx, ly); const a = 0.4 + 0.6 * Math.max(0, Math.sin(t * 5 + q * 1.3 + n.id)); ctx.fillStyle = q % 3 ? th.green : th.water; ctx.globalAlpha = a; ctx.fillRect(bx - 1.2 / s, by - 1.2 / s, 2.4 / s, 2.4 / s); }); ctx.globalAlpha = 1; }
      if (m.glow) {
        const [gx, gy] = P(m.glow[0], m.glow[1]); const pulse = 0.75 + 0.25 * Math.sin(t * 3 + n.id);
        const col = key === 'fusion' ? th.violet : th.yellow;
        ctx.save(); ctx.globalCompositeOperation = th.night ? 'lighter' : 'source-over';
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, m.glow[2] * sc * 1.6);
        g.addColorStop(0, hexA(col, 0.65 * pulse)); g.addColorStop(1, hexA(col, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(gx, gy, m.glow[2] * sc * 1.6, m.glow[3] * sc * 1.6, 0, 0, 6.3); ctx.fill(); ctx.restore();
      }
      // not connected to anything: dangling plug marker
      if ((n.type === 'plant' || n.type === 'mine') && !n.links.length) {
        const bx = n.x + w * 0.38, by = n.y - w * 0.62, k2 = 7 / s;
        ctx.strokeStyle = th.red; ctx.lineWidth = 1.8 / s; ctx.beginPath(); ctx.moveTo(bx - k2, by + k2); ctx.quadraticCurveTo(bx - k2 * 0.2, by + k2 * 1.6, bx + k2 * 0.4, by + k2 * 0.2); ctx.moveTo(bx + k2 * 0.4, by + k2 * 0.2); ctx.lineTo(bx + k2 * 1.1, by - k2 * 0.5); ctx.moveTo(bx + k2 * 0.6, by - k2 * 0.9); ctx.lineTo(bx + k2 * 1.5, by - k2 * 0.1); ctx.stroke();
      }
      // unserved load marker
      if ((n.type === 'load' || n.type === 'mine') && n.links.length && n.demE > 0 && n.servedE < n.demE * 0.9) {
        ctx.fillStyle = th.red; ctx.font = 'bold ' + (16 / s) + 'px Caveat, cursive'; ctx.textAlign = 'center'; ctx.fillText('!', n.x + w * 0.35, n.y - w * 0.55);
      }
    }
  };
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')'; }

  View.prototype.drawIncidents = function () {
    const ctx = this.ctx, th = S.th, s = this.scale(), now = performance.now();
    this.incidents = this.incidents.filter((i) => i.until > now);
    for (const i of this.incidents) {
      if (!i.reg) continue; const a = PN.clamp((i.until - now) / 3000, 0, 1);
      ctx.strokeStyle = i.kind === 'heat' ? th.orange : th.red; ctx.globalAlpha = 0.7 * a; ctx.lineWidth = 2 / s; ctx.setLineDash([8 / s, 6 / s]);
      ctx.beginPath(); ctx.arc(i.reg.x, i.reg.y, i.reg.r, 0, 6.3); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    for (const f of this.flash) { const a = PN.clamp((f.until - now) / 900, 0, 1); if (a <= 0) continue; ctx.strokeStyle = th.yellow; ctx.globalAlpha = a; ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.arc(f.x, f.y, 1.4 * (1.6 - a), 0, 6.3); ctx.stroke(); ctx.globalAlpha = 1; }
    this.flash = this.flash.filter((f) => f.until > now);
  };

  /* tool previews */
  View.prototype.drawTool = function () {
    const G = this.G, ctx = this.ctx, th = S.th, s = this.scale(), h = this.hover, tool = this.tool;
    if (!tool || !h) return;
    if (tool.kind === 'build' && h.check) {
      const tx = h.tx + 0.5, ty = h.ty + 0.5;
      ctx.strokeStyle = h.check.ok ? th.green : th.red; ctx.lineWidth = 2 / s; ctx.globalAlpha = 0.9; ctx.setLineDash([5 / s, 4 / s]);
      ctx.strokeRect(h.tx + 0.05, h.ty + 0.05, 0.9, 0.9); ctx.setLineDash([]);
      const spr = PN.Sprites.get(tool.id === 'substation' ? 'substation' : tool.id), w = Math.max(1.6, 34 / s), sc = w / PN.SPRITE_U, m = spr.meta;
      ctx.globalAlpha = h.check.ok ? 0.75 : 0.35; ctx.drawImage(spr, tx - m.anchor[0] * sc, ty - m.anchor[1] * sc, w, w); ctx.globalAlpha = 1;
      if (h.check.city) { ctx.strokeStyle = th.ink; ctx.globalAlpha = 0.5; ctx.setLineDash([2 / s, 3 / s]); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(h.check.city.x, h.check.city.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
    }
    if (tool.kind === 'line' && this.lineStart) {
      const a = this.lineStart, bx = h.snap ? h.snap.x : h.wx, by = h.snap ? h.snap.y : h.wy;
      const ok = h.lcheck ? h.lcheck.ok : false;
      ctx.strokeStyle = ok ? th.ink : th.red; ctx.globalAlpha = 0.8; ctx.lineWidth = ((LW[tool.id] || 1.5) + 0.5) / s; ctx.setLineDash([6 / s, 4 / s]);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = th.yellow; ctx.beginPath(); ctx.arc(a.x, a.y, 5 / s, 0, 6.3); ctx.fill();
    }
    if (tool.kind === 'line' && h.snap) { ctx.strokeStyle = th.yellow; ctx.lineWidth = 3 / s; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(h.snap.x, h.snap.y, Math.max(0.45, 12 / s), 0, 6.3); ctx.stroke(); ctx.globalAlpha = 1; }
    if (tool.kind === 'demolish' && h.pick) { const p = h.pick.obj; const x = p.a ? (G.byId[p.a].x + G.byId[p.b].x) / 2 : p.x, y = p.a ? (G.byId[p.a].y + G.byId[p.b].y) / 2 : p.y; ctx.strokeStyle = th.red; ctx.lineWidth = 3 / s; const k = Math.max(0.4, 12 / s); ctx.beginPath(); ctx.moveTo(x - k, y - k); ctx.lineTo(x + k, y + k); ctx.moveTo(x + k, y - k); ctx.lineTo(x - k, y + k); ctx.stroke(); }
  };

  /* ------------------------------------------------------------------ labels */
  View.prototype.drawLabels = function () {
    const G = this.G, ctx = this.ctx, th = S.th, z = this.cam.z, y = PN.ym(G);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    const txt = (t, x, yy, size, color, opts) => {
      opts = opts || {};
      ctx.font = (opts.italic ? 'italic ' : '') + (opts.weight || 600) + ' ' + size + 'px Caveat, "Segoe Print", cursive';
      if (opts.spacing) { try { ctx.letterSpacing = opts.spacing + 'px'; } catch (e) { /* older browsers */ } }
      if (opts.halo !== false) { ctx.strokeStyle = th.halo; ctx.lineWidth = Math.max(3, size * 0.28); ctx.globalAlpha = opts.alpha == null ? 1 : opts.alpha; ctx.strokeText(t, x, yy); }
      ctx.fillStyle = color; ctx.globalAlpha = opts.alpha == null ? 1 : opts.alpha; ctx.fillText(t, x, yy); ctx.globalAlpha = 1;
      if (opts.spacing) { try { ctx.letterSpacing = '0px'; } catch (e) { /* noop */ } }
    };
    // seas and foreign countries
    for (const l of this.seaLabels) { const [sx, sy] = this.toScreen(l.x, l.y); if (sx > -200 && sx < this.W + 200) txt(l.name, sx, sy, Math.round(17 * l.size * PN.clamp(z, 0.6, 1.4)), th.sea, { italic: true, halo: false, alpha: 0.8, spacing: 3 }); }
    for (const l of this.countryLabels) { const [sx, sy] = this.toScreen(l.x, l.y); if (sx > -200 && sx < this.W + 200 && sy > -50 && sy < this.H + 50) txt(l.name.toUpperCase(), sx, sy, Math.round(15 * PN.clamp(z, 0.7, 1.6)), th.ink, { halo: false, alpha: 0.38, spacing: 5 }); }
    if (G.code === 'PL' && this.regionLabels && z < 1.1) {
      const R = this.regionLabels;
      if (y < 1918.9) {
        if (R.russian) { const [sx, sy] = this.toScreen(R.russian.x, R.russian.y); txt('zabór rosyjski', sx, sy - 40, 15, th.ink, { halo: false, alpha: 0.42, italic: true, spacing: 2 }); }
        if (R.austrian) { const [sx, sy] = this.toScreen(R.austrian.x, R.austrian.y); txt('zabór austriacki', sx, sy, 15, th.ink, { halo: false, alpha: 0.42, italic: true, spacing: 2 }); }
      }
      if (!PN.regionOpen(G, 3) && R.german1945) { const [sx, sy] = this.toScreen(R.german1945.x, R.german1945.y); txt(y < 1918.9 ? 'Cesarstwo Niemieckie' : 'Niemcy', sx, sy, 18, th.ink, { halo: true, alpha: 0.6, italic: true, spacing: 3 }); }
      if (!PN.regionOpen(G, 1) && R.prussian1919) { const [sx, sy] = this.toScreen(R.prussian1919.x, R.prussian1919.y); txt('zabór pruski', sx, sy, 15, th.ink, { halo: true, alpha: 0.55, italic: true, spacing: 2 }); }
    }
    if (z > 1.05) for (const r of this.riverLabels) { const [sx, sy] = this.toScreen(r.x, r.y); if (sx < -50 || sx > this.W + 50 || sy < -50 || sy > this.H + 50) continue; ctx.save(); ctx.translate(sx, sy); ctx.rotate(r.a); txt(r.name, 0, -7, r.cls === 3 ? 14 : 12, th.water, { italic: true, halo: true, alpha: 0.9, weight: 500 }); ctx.restore(); }
    if (this.overlay && (this.overlay === 'wind' || this.overlay === 'solar') && this.ovLabels) for (const l of this.ovLabels) { const [sx, sy] = this.toScreen(l.x, l.y); if (sx > 0 && sx < this.W && sy > 0 && sy < this.H) txt(l.t, sx, sy, 13, th.ink, { alpha: 0.85 }); }
    // cities
    const topN = z < 0.45 ? 9 : z < 0.7 ? 18 : z < 1.0 ? 34 : 999;
    const rank = new Set(G.cities.filter((c) => c.pop > 0).sort((a, b) => b.pop - a.pop).slice(0, topN));
    for (const c of G.cities) {
      if (!rank.has(c) && this.sel !== c) continue;
      const [sx, sy] = this.toScreen(c.x, c.y + c.rad + 0.15);
      if (sx < -80 || sx > this.W + 80 || sy < -40 || sy > this.H + 40) continue;
      const size = Math.round(PN.clamp(11 + 5.5 * Math.log10(c.pop / 30000), 12, 26) * PN.clamp(0.75 + z * 0.2, 0.8, 1.2));
      txt(PN.cityName(c, G.y), sx, sy + size * 0.35, size, th.label, { alpha: PN.cityOwned(G, c) ? 1 : 0.6 });
    }
    // node names: selected or hovered, plus plants at very high zoom
    const hov = this.hover && this.hover.node;
    for (const n of G.nodes) {
      if (n.type === 'city' || n.type === 'sub') continue;
      if (!(this.sel === n || hov === n || (z > 3.4 && n.type === 'plant'))) continue;
      const [sx, sy] = this.toScreen(n.x, n.y); if (sx < -50 || sx > this.W + 50 || sy < -30 || sy > this.H + 30) continue;
      txt(n.name, sx, sy + 12, 12, th.label, { alpha: 0.85, weight: 500 });
    }
  };
  View.prototype.drawVignette = function () {
    const ctx = this.ctx, th = S.th;
    if (!this.vig || this.vig.w !== this.W || this.vig.h !== this.H || this.vig.t !== th.name) {
      const c = S.canvas(this.W, this.H), x = c.getContext('2d');
      const g = x.createRadialGradient(this.W / 2, this.H / 2, Math.min(this.W, this.H) * 0.45, this.W / 2, this.H / 2, Math.hypot(this.W, this.H) * 0.62);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, th.night ? 'rgba(0,0,0,0.35)' : 'rgba(90,80,60,0.16)');
      x.fillStyle = g; x.fillRect(0, 0, this.W, this.H);
      this.vig = { w: this.W, h: this.H, t: th.name, c };
    }
    ctx.drawImage(this.vig.c, 0, 0, this.W, this.H);
  };

  /* ------------------------------------------------------------------ picking */
  View.prototype.pick = function (sx, sy, opts) {
    opts = opts || {};
    const G = this.G, [wx, wy] = this.toWorld(sx, sy), s = this.scale();
    let best = null, bd = 1e9;
    for (const n of G.nodes) {
      if (n.type === 'city') continue;
      const k = this.nodeSize(n); const d = Math.hypot(n.x - wx, (n.y - k * 0.25) - wy);
      const r = Math.max(k * 0.45, 14 / s);
      if (d < r && d < bd) { bd = d; best = { type: 'node', obj: n }; }
    }
    if (best) return best;
    if (!opts.noLines) {
      for (const l of G.lines) {
        if (l.local) continue;
        const a = G.byId[l.a], b = G.byId[l.b]; const g = this.geo(l);
        let dmin = 1e9; for (let k = 0; k <= 20; k++) { const t = k / 20, it = 1 - t; const x = it * it * a.x + 2 * it * t * g.cx + t * t * b.x, y = it * it * a.y + 2 * it * t * g.cy + t * t * b.y; dmin = Math.min(dmin, Math.hypot(x - wx, y - wy)); }
        if (dmin < Math.max(0.15, 7 / s) && dmin < bd) { bd = dmin; best = { type: 'line', obj: l }; }
      }
      if (best) return best;
    }
    for (const c of G.cities) { if (!(c.pop > 0)) continue; const d = Math.hypot(c.x - wx, c.y - wy); if (d < Math.max(c.rad * 0.8, 10 / s) && d < bd) { bd = d; best = { type: 'city', obj: c }; } }
    return best;
  };
})();
