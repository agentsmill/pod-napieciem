'use strict';
/* Terrain renderer: draws the map as pencil sketch in cached chunks at several levels of detail. */
(function () {
  const PN = window.PN, S = PN.Sketch;
  const CH = 24, LODS = [10, 20, 32];
  PN.CHUNK = CH; PN.LODS = LODS;

  function jitterFlat(pts, amp, seed) { // deterministic per-vertex jitter so chunks join seamlessly
    const o = new Float32Array(pts.length);
    for (let i = 0; i < pts.length; i += 2) {
      o[i] = pts[i] + (PN.hash(i, seed, 1) - 0.5) * 2 * amp;
      o[i + 1] = pts[i + 1] + (PN.hash(i, seed, 2) - 0.5) * 2 * amp;
    }
    return o;
  }
  /* Chaikin corner cutting: converges to the same quadratic B-spline as smoothPath */
  function chaikin(pts, iters) {
    let a = pts;
    for (let it = 0; it < iters; it++) {
      const n = a.length / 2, o = new Float32Array(n * 4);
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, x0 = a[2 * i], y0 = a[2 * i + 1], x1 = a[2 * j], y1 = a[2 * j + 1];
        o[4 * i] = 0.75 * x0 + 0.25 * x1; o[4 * i + 1] = 0.75 * y0 + 0.25 * y1;
        o[4 * i + 2] = 0.25 * x0 + 0.75 * x1; o[4 * i + 3] = 0.25 * y0 + 0.75 * y1;
      }
      a = o;
    }
    return a;
  }
  function polyPath(p, pts) { if (pts.length < 6) return; p.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) p.lineTo(pts[i], pts[i + 1]); p.closePath(); }
  function smoothPath(p, pts, closed) {
    const n = pts.length / 2; if (n < 2) return;
    p.moveTo(pts[0], pts[1]);
    for (let i = 1; i < n - 1; i++) p.quadraticCurveTo(pts[2 * i], pts[2 * i + 1], (pts[2 * i] + pts[2 * i + 2]) / 2, (pts[2 * i + 1] + pts[2 * i + 3]) / 2);
    p.lineTo(pts[2 * n - 2], pts[2 * n - 1]);
    if (closed) p.closePath();
  }

  function Terrain(G) {
    this.G = G; this.M = G.map; this.cache = new Map(); this.pixels = 0; this.maxPixels = 46e6;
    this.tmp = {}; this.prepare();
  }
  PN.Terrain = Terrain;

  Terrain.prototype.prepare = function () {
    const M = this.M, home = M.sc.homeCode;
    const bb = (p) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < p.length; i += 2) { if (p[i] < x0) x0 = p[i]; if (p[i] > x1) x1 = p[i]; if (p[i + 1] < y0) y0 = p[i + 1]; if (p[i + 1] > y1) y1 = p[i + 1]; } return [x0, y0, x1, y1]; };
    this.rings = M.landRings.map((r) => { const pts = chaikin(r.pts, 2); return { pts, foreign: r.code !== home, bb: bb(pts) }; });
    this.lakes = M.lakeRings.map((r) => { const pts = chaikin(r.pts, 2); return { pts, bb: bb(pts) }; });
    // coast / border classification
    const tileAt = (x, y) => M.idx(Math.floor(x), Math.floor(y));
    const isWater = (i) => i < 0 || M.terr[i] === PN.TERR.SEA || M.terr[i] === PN.TERR.LAKE;
    const coast = [], hb = [], fb = [];
    M.landRings.forEach((r) => {
      const p = r.pts, n = p.length / 2;
      let cur = null, curCls = null;
      const flush = () => { if (cur && cur.length >= 4) (curCls === 'c' ? coast : curCls === 'h' ? hb : fb).push(cur); cur = null; };
      for (let k = 0; k < n; k++) {
        const x1 = p[2 * k], y1 = p[2 * k + 1], x2 = p[(2 * k + 2) % p.length], y2 = p[(2 * k + 3) % p.length];
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(x2 - x1, y2 - y1) || 1;
        const nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
        const a = tileAt(mx + nx * 0.45, my + ny * 0.45), b = tileAt(mx - nx * 0.45, my - ny * 0.45);
        let cls;
        if (isWater(a) || isWater(b)) cls = 'c';
        else {
          const ca = M.codes[M.country[a]], cb = M.codes[M.country[b]];
          const other = ca === r.code ? cb : ca;
          if (r.code === home) cls = other === home ? null : 'h';
          else if (other === home) cls = null;
          else cls = r.code < other ? 'f' : null;
        }
        if (cls !== curCls) { flush(); curCls = cls; if (cls) cur = [x1, y1]; }
        if (cls) cur.push(x2, y2);
      }
      flush();
    });
    const jit = (list, amp, seed) => list.map((l, k) => jitterFlat(l, amp, seed + k * 7));
    this.lines = {
      coast0: jit(coast, 0.03, 11), coast1: jit(coast, 0.06, 23), hb: jit(hb, 0.02, 31), fb: jit(fb, 0.02, 41),
      lake: jit(M.lakeRings.map((r) => { const a = Array.from(r.pts); a.push(a[0], a[1]); return a; }), 0.03, 71),
      states: M.stateLines ? jit(M.stateLines, 0.02, 81) : [],
    };
    for (let cls = 1; cls <= 3; cls++) { const ls = M.rivers.filter((r) => r.cls === cls).map((r) => r.pts); this.lines['r' + cls + 'a'] = jit(ls, 0.035, 50 + cls); this.lines['r' + cls + 'b'] = jit(ls, 0.07, 60 + cls); }
    for (const k of Object.keys(this.lines)) this.lines[k] = this.lines[k].map((pts) => ({ pts, bb: bb(pts) }));
    this.geoCache = new Map();
    // villages per chunk
    this.vil = new Map();
    for (const v of M.villages) { const k = Math.floor(v.x / CH) + ':' + Math.floor(v.y / CH); if (!this.vil.has(k)) this.vil.set(k, []); this.vil.get(k).push(v); }
    // historic regions (PL)
    this.regions = {};
    const reg = this.G.places.regions || {};
    for (const key of ['prussian1919', 'silesia1922', 'german1945']) {
      const polys = reg[key]; if (!polys || !polys.length) continue;
      const list = Array.isArray(polys[0][0]) ? polys : [polys];
      const path = new Path2D();
      for (const poly of list) { const flat = []; poly.forEach((q) => { const t = M.toTile(q[0], q[1]); flat.push(t[0], t[1]); }); smoothPath(path, flat, true); }
      this.regions[key] = path;
    }
  };

  /* polygon clip against an axis-aligned box (Sutherland–Hodgman) on flat arrays */
  function clipPoly(p, b) {
    let pts = []; for (let i = 0; i < p.length; i += 2) pts.push([p[i], p[i + 1]]);
    const E = [[(q) => q[0] >= b[0], (a, c) => [b[0], a[1] + ((b[0] - a[0]) / (c[0] - a[0])) * (c[1] - a[1])]], [(q) => q[0] <= b[2], (a, c) => [b[2], a[1] + ((b[2] - a[0]) / (c[0] - a[0])) * (c[1] - a[1])]], [(q) => q[1] >= b[1], (a, c) => [a[0] + ((b[1] - a[1]) / (c[1] - a[1])) * (c[0] - a[0]), b[1]]], [(q) => q[1] <= b[3], (a, c) => [a[0] + ((b[3] - a[1]) / (c[1] - a[1])) * (c[0] - a[0]), b[3]]]];
    for (const [inside, inter] of E) { if (!pts.length) break; const out = []; for (let i = 0; i < pts.length; i++) { const cur = pts[i], prev = pts[(i + pts.length - 1) % pts.length]; if (inside(cur)) { if (!inside(prev)) out.push(inter(prev, cur)); out.push(cur); } else if (inside(prev)) out.push(inter(prev, cur)); } pts = out; }
    const f = []; for (const q of pts) f.push(q[0], q[1]); return f;
  }
  const hit = (a, b) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
  /* geometry of one chunk (shared by all levels of detail) */
  Terrain.prototype.chunkGeo = function (cx, cy) {
    const key = cx + ':' + cy; let g = this.geoCache.get(key); if (g) return g;
    const M = this.M, m = 2.4, box = [cx * CH - m, cy * CH - m, (cx + 1) * CH + m, (cy + 1) * CH + m];
    g = { land: new Path2D(), lake: new Path2D(), foreign: new Path2D(), water: false, strokes: {} };
    for (const r of this.rings) { if (!hit(r.bb, box)) continue; const c = clipPoly(r.pts, box); if (c.length < 6) continue; const sp = new Path2D(); polyPath(sp, c); g.land.addPath(sp); if (r.foreign) g.foreign.addPath(sp); }
    for (const r of this.lakes) { if (!hit(r.bb, box)) continue; const c = clipPoly(r.pts, box); if (c.length < 6) continue; const sp = new Path2D(); polyPath(sp, c); g.lake.addPath(sp); }
    for (let y = Math.max(0, Math.floor(box[1])); y < Math.min(M.H, Math.ceil(box[3])) && !g.water; y++) for (let x = Math.max(0, Math.floor(box[0])); x < Math.min(M.W, Math.ceil(box[2])); x++) { const t = M.terr[y * M.W + x]; if (t === PN.TERR.SEA || t === PN.TERR.LAKE) { g.water = true; break; } }
    if (box[0] < 0 || box[1] < 0 || box[2] > M.W || box[3] > M.H) g.water = true;
    for (const k of Object.keys(this.lines)) {
      const p = new Path2D(); let any = false;
      for (const l of this.lines[k]) {
        if (!hit(l.bb, box)) continue;
        const pts = l.pts; let run = [];
        const flush = () => { if (run.length >= 4) { smoothPath(p, run, false); any = true; } run = []; };
        for (let i = 0; i < pts.length; i += 2) { const x = pts[i], y = pts[i + 1]; if (x >= box[0] && x <= box[2] && y >= box[1] && y <= box[3]) run.push(x, y); else { if (run.length) { run.push(x, y); flush(); } else if (i + 2 < pts.length) { const nx = pts[i + 2], ny = pts[i + 3]; if (nx >= box[0] && nx <= box[2] && ny >= box[1] && ny <= box[3]) run.push(x, y); } } }
        flush();
      }
      g.strokes[k] = any ? p : null;
    }
    this.geoCache.set(key, g); return g;
  };

  Terrain.prototype.tmpCanvas = function (k, w, h) {
    let c = this.tmp[k];
    if (!c || c.width !== w || c.height !== h) { c = this.tmp[k] = S.canvas(w, h); }
    const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.clearRect(0, 0, w, h); x.setLineDash([]);
    return c;
  };

  Terrain.prototype.key = (lod, cx, cy) => lod + ':' + cx + ':' + cy;
  Terrain.prototype.get = function (lod, cx, cy, allowRender) {
    const k = this.key(lod, cx, cy);
    let c = this.cache.get(k);
    if (c) { this.cache.delete(k); this.cache.set(k, c); return c; }
    if (!allowRender) return null;
    c = this.render(lod, cx, cy);
    this.cache.set(k, c); this.pixels += c.width * c.height;
    while (this.pixels > this.maxPixels && this.cache.size > 4) { const [k0, c0] = this.cache.entries().next().value; this.cache.delete(k0); this.pixels -= c0.width * c0.height; }
    return c;
  };
  Terrain.prototype.clear = function () { this.cache.clear(); this.pixels = 0; };

  Terrain.prototype.render = function (lod, cx, cy) {
    const M = this.M, th = S.th, res = LODS[lod], sz = CH * res, ox = cx * CH, oy = cy * CH;
    const out = S.canvas(sz, sz), o = out.getContext('2d');
    const T = (ctx) => ctx.setTransform(res, 0, 0, res, -ox * res, -oy * res);
    const px = (v) => v / res; // pixels -> tile units
    // 1. paper
    o.fillStyle = th.paper; o.fillRect(0, 0, sz, sz);
    if (!this.paper || this.paperTheme !== th.name) { this.paper = S.makePaper(384, th); this.paperTheme = th.name; }
    const pat = o.createPattern(this.paper, 'repeat');
    if (pat.setTransform) pat.setTransform(new DOMMatrix([1, 0, 0, 1, -((ox * res) % 384), -((oy * res) % 384)]));
    o.fillStyle = pat; o.fillRect(0, 0, sz, sz);
    // 2. engineering grid
    T(o); o.lineWidth = px(0.8);
    if (res >= 16) { o.strokeStyle = th.grid; o.beginPath(); for (let x = ox; x <= ox + CH; x++) { o.moveTo(x, oy); o.lineTo(x, oy + CH); } for (let y = oy; y <= oy + CH; y++) { o.moveTo(ox, y); o.lineTo(ox + CH, y); } o.stroke(); }
    o.strokeStyle = th.grid5; o.lineWidth = px(1); o.beginPath();
    for (let x = Math.ceil(ox / 5) * 5; x <= ox + CH; x += 5) { o.moveTo(x, oy); o.lineTo(x, oy + CH); }
    for (let y = Math.ceil(oy / 5) * 5; y <= oy + CH; y += 5) { o.moveTo(ox, y); o.lineTo(ox + CH, y); }
    o.stroke();

    // 3. ink layer
    const g = this.chunkGeo(cx, cy);
    const ink = this.tmpCanvas('ink', sz, sz), k = ink.getContext('2d');
    if (g.water) {
      // water mask
      const wm = this.tmpCanvas('wm', sz, sz), w = wm.getContext('2d');
      w.fillStyle = '#000'; w.fillRect(0, 0, sz, sz); T(w);
      w.globalCompositeOperation = 'destination-out'; w.fill(g.land, 'nonzero');
      w.globalCompositeOperation = 'source-over'; w.fill(g.lake, 'nonzero');
      // wash
      k.drawImage(wm, 0, 0); k.globalCompositeOperation = 'source-in'; k.fillStyle = th.waterWash; k.fillRect(0, 0, sz, sz); k.globalCompositeOperation = 'source-over';
      // coastal hatching band
      const band = this.tmpCanvas('band', sz, sz), b = band.getContext('2d');
      T(b); b.strokeStyle = '#000'; b.lineJoin = 'round'; b.lineWidth = 1.1; b.stroke(g.land); b.stroke(g.lake);
      b.setTransform(1, 0, 0, 1, 0, 0); b.globalCompositeOperation = 'destination-in'; b.drawImage(wm, 0, 0);
      const hat = this.tmpCanvas('hat', sz, sz), hh = hat.getContext('2d');
      const rh = PN.rng(cx * 7919 + cy * 104729 + 3);
      T(hh); S.hatch(hh, ox - 1, oy - 1, CH + 2, CH + 2, -0.62, 0.13, rh, { color: th.waterHatch, w: px(0.9), alpha: 0.75 });
      hh.setTransform(1, 0, 0, 1, 0, 0); hh.globalCompositeOperation = 'destination-in'; hh.drawImage(band, 0, 0);
      k.drawImage(hat, 0, 0);
      // ripple contours on the water side
      for (const [d, a] of [[0.34, 0.5], [0.7, 0.3], [1.15, 0.16]]) {
        if ((res < 16 && d > 0.5) || (res < 30 && d > 1)) continue;
        const rp = this.tmpCanvas('rip', sz, sz), r = rp.getContext('2d');
        T(r); r.lineJoin = 'round'; r.strokeStyle = th.water; r.lineWidth = 2 * d; r.stroke(g.land); r.stroke(g.lake);
        r.globalCompositeOperation = 'destination-out'; r.lineWidth = Math.max(0.01, 2 * d - px(1.1)); r.stroke(g.land); r.stroke(g.lake);
        r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'destination-in'; r.drawImage(wm, 0, 0);
        k.globalAlpha = a; k.drawImage(rp, 0, 0); k.globalAlpha = 1;
      }
    }
    // 4. land features
    T(k);
    this.features(k, res, ox, oy, th);
    // 5. rivers
    const rw = [0, 0.75, 1.3, 2.1], St = g.strokes;
    k.lineCap = 'round'; k.lineJoin = 'round';
    for (let cls = 1; cls <= 3; cls++) {
      if (res < 16 && cls === 1) continue;
      if (St['r' + cls + 'a']) { k.strokeStyle = th.water; k.globalAlpha = 0.85; k.lineWidth = px(rw[cls] * Math.min(1.6, res / 20)); k.stroke(St['r' + cls + 'a']); }
      if (St['r' + cls + 'b']) { k.globalAlpha = 0.35; k.lineWidth = px(0.7); k.stroke(St['r' + cls + 'b']); }
    }
    if (St.lake) { k.globalAlpha = 0.8; k.strokeStyle = th.water; k.lineWidth = px(0.9); k.stroke(St.lake); }
    // 6. coast and borders
    if (St.coast0) { k.globalAlpha = 0.92; k.strokeStyle = th.ink; k.lineWidth = px(1.25); k.stroke(St.coast0); }
    if (St.coast1) { k.globalAlpha = 0.4; k.strokeStyle = th.ink; k.lineWidth = px(0.8); k.stroke(St.coast1); }
    k.strokeStyle = th.ink;
    if (St.hb) { k.globalAlpha = 0.85; k.lineWidth = px(1.5); k.setLineDash([0.42, 0.14, 0.04, 0.14]); k.stroke(St.hb); }
    if (St.fb) { k.globalAlpha = 0.45; k.lineWidth = px(1); k.setLineDash([0.25, 0.16]); k.stroke(St.fb); }
    if (St.states) { k.globalAlpha = 0.38; k.lineWidth = px(0.9); k.setLineDash([0.06, 0.16]); k.stroke(St.states); }
    k.setLineDash([]); k.globalAlpha = 1;
    // 7. graphite grain
    S.erode(ink, th.grainAlpha, ox * res, oy * res);
    o.setTransform(1, 0, 0, 1, 0, 0); o.drawImage(ink, 0, 0);
    // 8. fade foreign land
    T(o); o.globalAlpha = 1 - th.foreign; o.fillStyle = th.paper; o.fill(g.foreign, 'nonzero'); o.globalAlpha = 1;
    return out;
  };

  Terrain.prototype.features = function (k, res, ox, oy, th) {
    const M = this.M, px = (v) => v / res, low = res < 16, hi = res >= 30;
    const TR = PN.TERR;
    // pass 1: colour washes (forest canopy, fields) so strokes sit on top
    for (let ty = oy - 1; ty < oy + CH + 1; ty++) for (let tx = ox - 1; tx < ox + CH + 1; tx++) {
      const i = M.idx(tx, ty); if (i < 0) continue;
      const t = M.terr[i]; if (t === TR.SEA || t === TR.LAKE) continue;
      const r = PN.rng(((tx * 73856093) ^ (ty * 19349663) ^ 0x5bd1e995) >>> 0);
      if (M.forest[i]) {
        const fx = tx + 0.5 + (r() - 0.5) * 0.3, fy = ty + 0.5 + (r() - 0.5) * 0.3, fr = (low ? 1.15 : 0.9) + r() * 0.2;
        const gf = k.createRadialGradient(fx, fy, 0, fx, fy, fr);
        gf.addColorStop(0, th.forest); gf.addColorStop(low ? 0.2 : 0.5, th.forest); gf.addColorStop(1, 'rgba(0,0,0,0)');
        k.fillStyle = gf; k.globalAlpha = low ? 0.13 : 0.12;
        k.beginPath(); k.arc(fx, fy, fr, 0, 6.3); k.fill();
        if (low) { k.globalAlpha = 0.35; k.strokeStyle = th.forest; k.lineWidth = px(0.8); k.beginPath(); for (let q = 0; q < 3; q++) { const x = tx + 0.15 + r() * 0.6, y = ty + 0.2 + r() * 0.6; k.moveTo(x, y); k.lineTo(x + 0.18, y - 0.18); } k.stroke(); }
      } else if (t === TR.PLAIN && !low && r() < (M.country[i] === M.homeIdx ? 0.3 : 0.15)) {
        const x = tx + r() * 0.4, y = ty + r() * 0.4, w = 0.45 + r() * 0.45, hh = 0.3 + r() * 0.35;
        const ang = [0, Math.PI / 2, 0.5, -0.5, 1.1][Math.floor(r() * 5)];
        k.save(); k.translate(x + w / 2, y + hh / 2); k.rotate((r() - 0.5) * 0.5); k.beginPath(); k.rect(-w / 2, -hh / 2, w, hh); k.clip();
        S.hatch(k, -w / 2, -hh / 2, w, hh, ang, 0.07, r, { color: r() < 0.55 ? th.field : th.forest, w: px(0.8), alpha: 0.24 });
        k.restore();
      }
      k.globalAlpha = 1;
    }
    // pass 2: strokes
    for (let ty = oy - 1; ty < oy + CH + 1; ty++) for (let tx = ox - 1; tx < ox + CH + 1; tx++) {
      const i = M.idx(tx, ty); if (i < 0) continue;
      const t = M.terr[i]; if (t === TR.SEA || t === TR.LAKE) continue;
      const r = PN.rng(((tx * 73856093) ^ (ty * 19349663)) >>> 0);
      if (M.forest[i] && !low) {
        const n = hi ? 4 + Math.floor(r() * 3) : 2 + Math.floor(r() * 2);
        for (let q = 0; q < n; q++) {
          const x = tx + 0.12 + r() * 0.76, y = ty + 0.16 + r() * 0.7, rad = (hi ? 0.1 : 0.13) + r() * 0.07;
          S.circle(k, x, y, rad, rad * 0.9, r, { color: th.ink, w: px(hi ? 0.8 : 0.75), alpha: 0.55, passes: hi ? 2 : 1, amp: 0.13 });
          k.globalAlpha = 0.5; k.strokeStyle = th.forest; k.lineWidth = px(0.9); k.beginPath();
          for (let s2 = 0; s2 < 3; s2++) { const a = 0.15 + s2 * 0.45; k.moveTo(x + Math.cos(a) * rad * 0.35, y + Math.sin(a) * rad * 0.35); k.lineTo(x + Math.cos(a) * rad * 0.95, y + Math.sin(a) * rad * 0.95); }
          k.stroke();
          if (hi) { k.globalAlpha = 0.45; k.strokeStyle = th.ink; k.lineWidth = px(0.6); k.beginPath(); k.moveTo(x, y + rad * 0.9); k.lineTo(x, y + rad + 0.07); k.stroke(); }
          k.globalAlpha = 1;
        }
      }
      if (t === TR.MOUNT) {
        if (r() < 0.3) continue;
        const e = M.elev[i];
        const x = tx + 0.2 + r() * 0.6, y = ty + 0.75 + r() * 0.2, hgt = 0.55 + e * 0.55 + r() * 0.2, hw = 0.38 + r() * 0.22;
        const lean = (r() - 0.5) * 0.25;
        S.pencil(k, () => { k.moveTo(x - hw, y); k.lineTo(x - hw * 0.3 + lean, y - hgt * 0.75); k.lineTo(x + lean, y - hgt); k.lineTo(x + hw * 0.35 + lean, y - hgt * 0.62); k.lineTo(x + hw, y); }, { color: th.mountain, w: px(low ? 0.8 : 1.1), alpha: 0.85, passes: low ? 1 : 2 });
        if (!low) {
          k.globalAlpha = 0.42; k.strokeStyle = th.mountain; k.lineWidth = px(0.7); k.beginPath();
          const nh = hi ? 7 : 4;
          for (let s2 = 1; s2 <= nh; s2++) { const f = s2 / (nh + 1); const ax = x + lean + (hw - lean) * f, ay = y - hgt + hgt * f; k.moveTo(ax, ay); k.lineTo(ax - 0.12 - hw * 0.18, ay + 0.1 + hgt * 0.18 * (1 - f)); }
          k.stroke(); k.globalAlpha = 1;
          if (e > 0.82) { k.globalAlpha = 0.65; k.strokeStyle = th.ink; k.lineWidth = px(0.6); k.beginPath(); k.moveTo(x - hw * 0.45 + lean * 0.5, y - hgt * 0.55); k.lineTo(x - hw * 0.2 + lean, y - hgt * 0.68); k.lineTo(x + lean * 0.8, y - hgt * 0.55); k.lineTo(x + hw * 0.22 + lean, y - hgt * 0.64); k.stroke(); k.globalAlpha = 1; }
        }
      } else if (t === TR.HILL) {
        if (r() < (low ? 0.6 : 0.45)) continue;
        const x = tx + 0.2 + r() * 0.6, y = ty + 0.65 + r() * 0.25, hgt = 0.18 + M.elev[i] * 0.35, hw = 0.32 + r() * 0.25;
        S.pencil(k, () => { k.moveTo(x - hw, y); k.quadraticCurveTo(x - hw * 0.1, y - hgt * 1.9, x + hw, y); }, { color: th.mountain, w: px(0.85), alpha: 0.6, passes: 1 });
        if (!low) { k.globalAlpha = 0.33; k.strokeStyle = th.mountain; k.lineWidth = px(0.6); k.beginPath(); for (let s2 = 0; s2 < 4; s2++) { const ax = x + 0.02 + s2 * hw * 0.22; k.moveTo(ax, y - hgt * (0.85 - s2 * 0.18)); k.lineTo(ax + 0.03, y - 0.02); } k.stroke(); k.globalAlpha = 1; }
      } else if (t === TR.MARSH && !low) {
        k.globalAlpha = 0.5; k.strokeStyle = th.ink; k.lineWidth = px(0.7); k.beginPath();
        for (let q = 0; q < 3; q++) { const x = tx + 0.12 + r() * 0.6, y = ty + 0.25 + r() * 0.6; k.moveTo(x, y); k.lineTo(x + 0.22, y); k.moveTo(x + 0.06, y); k.lineTo(x + 0.04, y - 0.09); k.moveTo(x + 0.11, y); k.lineTo(x + 0.12, y - 0.11); k.moveTo(x + 0.16, y); k.lineTo(x + 0.19, y - 0.08); }
        k.stroke(); k.strokeStyle = th.water; k.globalAlpha = 0.35; k.beginPath(); const x = tx + 0.3 + r() * 0.3, y = ty + 0.55 + r() * 0.3; k.moveTo(x, y); k.lineTo(x + 0.28, y); k.stroke(); k.globalAlpha = 1;
      } else if (t === TR.DESERT) {
        k.fillStyle = th.field; k.globalAlpha = 0.5;
        for (let q = 0; q < (low ? 3 : 8); q++) { k.beginPath(); k.arc(tx + r(), ty + r(), px(0.9), 0, 6.3); k.fill(); }
        if (!low && r() < 0.3) S.pencil(k, () => { const x = tx + 0.15 + r() * 0.4, y = ty + 0.4 + r() * 0.4; k.moveTo(x, y); k.quadraticCurveTo(x + 0.25, y - 0.14, x + 0.5, y); }, { color: th.field, w: px(0.8), alpha: 0.55, passes: 1 });
        k.globalAlpha = 1;
      }
    }
    // villages: little clusters of houses along a lane (home country only)
    if (!low) {
      const vs = [];
      for (const dy of [-1, 0, 1]) for (const dx of [-1, 0, 1]) { const l = this.vil.get(Math.floor(ox / CH) + dx + ':' + (Math.floor(oy / CH) + dy)); if (l) vs.push(...l); }
      k.lineJoin = 'round'; k.lineCap = 'round';
      for (const v of vs) {
        if (v.x < ox - 1 || v.x > ox + CH + 1 || v.y < oy - 1 || v.y > oy + CH + 1) continue;
        const r = PN.rng(v.s), a = r() * Math.PI, len = 0.32 + r() * 0.2, ca = Math.cos(a), sa = Math.sin(a);
        k.globalAlpha = 0.18; k.strokeStyle = th.ink; k.lineWidth = px(0.7);
        k.beginPath(); k.moveTo(v.x - ca * len, v.y - sa * len); k.quadraticCurveTo(v.x + (r() - 0.5) * 0.1, v.y + (r() - 0.5) * 0.1, v.x + ca * len, v.y + sa * len); k.stroke();
        const n = hi ? Math.min(5, v.n) : 2;
        for (let q = 0; q < n; q++) {
          const t2 = (q / Math.max(1, n - 1) - 0.5) * 1.6 * len, side = q % 2 ? 1 : -1;
          const x = v.x + ca * t2 - sa * 0.05 * side, y = v.y + sa * t2 + ca * 0.05 * side, s = hi ? 0.038 + r() * 0.012 : 0.05;
          k.globalAlpha = 0.75; k.strokeStyle = th.ink; k.lineWidth = px(hi ? 0.75 : 0.65);
          k.beginPath(); k.moveTo(x - s, y + s * 0.6); k.lineTo(x - s, y - s * 0.4); k.lineTo(x, y - s * 1.2); k.lineTo(x + s, y - s * 0.4); k.lineTo(x + s, y + s * 0.6); k.closePath(); k.stroke();
        }
        k.globalAlpha = 1;
      }
    }
  };
})();
