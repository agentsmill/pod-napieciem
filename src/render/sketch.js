'use strict';
/* Pencil-on-paper drawing primitives, paper texture and graphite grain. */
(function () {
  const PN = window.PN;

  PN.THEMES = {
    light: {
      name: 'light', paper: '#eeece5', paperDark: '#e2dfd5', grid: 'rgba(58,98,148,0.075)', grid5: 'rgba(58,98,148,0.15)',
      ink: '#2a2c30', water: '#3f7cb4', waterWash: 'rgba(80,134,190,0.11)', waterHatch: 'rgba(63,124,180,0.55)',
      forest: '#4f8a45', field: '#b39a45', mountain: '#4a4440', snow: '#ffffff', red: '#c23b2b', orange: '#d27a22', yellow: '#e2ae16',
      glow: 'rgba(255,196,40,', violet: '#8a4fc7', green: '#3f8f5a', halo: 'rgba(238,236,229,0.92)', label: '#26282c', sea: '#365f8a',
      foreign: 0.45, grainAlpha: 0.38, flow: '#e2ae16', smoke: 'rgba(60,60,64,', night: false,
    },
    dark: {
      name: 'dark', paper: '#23262c', paperDark: '#1b1d22', grid: 'rgba(150,185,230,0.05)', grid5: 'rgba(150,185,230,0.10)',
      ink: '#d9d5cc', water: '#77aee0', waterWash: 'rgba(90,145,210,0.10)', waterHatch: 'rgba(120,170,225,0.45)',
      forest: '#86b873', field: '#cdb46a', mountain: '#c4b8a8', snow: '#f4f1ea', red: '#ff7a66', orange: '#f2a457', yellow: '#ffd24d',
      glow: 'rgba(255,200,70,', violet: '#c39cff', green: '#7fd39a', halo: 'rgba(35,38,44,0.92)', label: '#ebe7de', sea: '#9cc1e6',
      foreign: 0.4, grainAlpha: 0.3, flow: '#ffd24d', smoke: 'rgba(210,210,205,', night: true,
    },
  };
  const S = (PN.Sketch = { th: PN.THEMES.light });

  S.canvas = function (w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const wob = (r, a) => (r() - 0.5) * 2 * a;
  S.wob = wob;

  /* smooth jittered polyline through flat points */
  S.trace = function (ctx, pts, r, amp, closed) {
    const n = pts.length / 2; if (n < 2) return;
    let px = pts[0] + wob(r, amp), py = pts[1] + wob(r, amp);
    const sx = px, sy = py;
    ctx.moveTo(px, py);
    for (let i = 1; i < n; i++) {
      const x = pts[2 * i] + wob(r, amp), y = pts[2 * i + 1] + wob(r, amp);
      ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2); px = x; py = y;
    }
    if (closed) ctx.quadraticCurveTo(px, py, (px + sx) / 2, (py + sy) / 2); else ctx.lineTo(px, py);
  };
  /* two-pass pencil stroke of a path builder */
  S.pencil = function (ctx, build, o) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = o.color || S.th.ink;
    const a = o.alpha == null ? 0.85 : o.alpha;
    ctx.globalAlpha = a; ctx.lineWidth = o.w;
    ctx.beginPath(); build(0); ctx.stroke();
    if (o.passes !== 1) { ctx.globalAlpha = a * 0.45; ctx.lineWidth = o.w * 0.7; ctx.beginPath(); build(1); ctx.stroke(); }
    ctx.globalAlpha = 1;
  };
  S.line = function (ctx, x1, y1, x2, y2, r, o) {
    const len = Math.hypot(x2 - x1, y2 - y1), amp = o.amp == null ? len * 0.012 : o.amp;
    const nx = -(y2 - y1) / (len || 1), ny = (x2 - x1) / (len || 1), bow = wob(r, len * 0.02);
    S.pencil(ctx, (p) => {
      const j = p ? amp * 1.5 : amp;
      ctx.moveTo(x1 + wob(r, j), y1 + wob(r, j));
      const mx = (x1 + x2) / 2 + nx * bow + wob(r, j), my = (y1 + y2) / 2 + ny * bow + wob(r, j);
      ctx.quadraticCurveTo(mx, my, x2 + wob(r, j), y2 + wob(r, j));
    }, o);
  };
  S.circlePath = function (ctx, cx, cy, rx, ry, r, amp, over) {
    const n = 14, a0 = r() * Math.PI * 2, ex = over == null ? 0.35 : over;
    const pts = [];
    for (let i = 0; i <= n * (1 + ex / (Math.PI * 2) * 2); i++) {
      const a = a0 + (i / n) * Math.PI * 2;
      const k = 1 + wob(r, amp);
      pts.push(cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k);
    }
    S.trace(ctx, pts, r, 0, false);
  };
  S.circle = function (ctx, cx, cy, rx, ry, r, o) {
    S.pencil(ctx, () => S.circlePath(ctx, cx, cy, rx, ry, r, o.amp == null ? 0.06 : o.amp), o);
  };
  /* parallel hatch strokes covering a rectangle (caller clips) */
  S.hatch = function (ctx, x, y, w, h, ang, gap, r, o) {
    const c = Math.cos(ang), s = Math.sin(ang), d = Math.hypot(w, h);
    const cx = x + w / 2, cy = y + h / 2;
    ctx.lineCap = 'round'; ctx.strokeStyle = o.color || S.th.ink; ctx.lineWidth = o.w; ctx.globalAlpha = o.alpha == null ? 0.5 : o.alpha;
    ctx.beginPath();
    for (let t = -d / 2; t <= d / 2; t += gap * (0.8 + r() * 0.4)) {
      const px = cx - s * t, py = cy + c * t;
      const l0 = -d / 2 * (0.9 + r() * 0.1), l1 = d / 2 * (0.9 + r() * 0.1);
      ctx.moveTo(px + c * l0 + wob(r, gap * 0.2), py + s * l0 + wob(r, gap * 0.2));
      ctx.lineTo(px + c * l1 + wob(r, gap * 0.2), py + s * l1 + wob(r, gap * 0.2));
    }
    ctx.stroke(); ctx.globalAlpha = 1;
  };

  /* graphite grain: alpha noise used to erode strokes (destination-out) */
  S.makeGrain = function (size) {
    const c = S.canvas(size, size), x = c.getContext('2d'), img = x.createImageData(size, size), r = PN.rng(4242);
    for (let i = 0; i < size * size; i++) {
      const px = i % size, py = (i / size) | 0;
      const v = r(), streak = PN.vnoise(px / 1.6, py / 6, 7) * 0.6 + PN.vnoise(px / 9, py / 2.2, 9) * 0.4;
      const a = Math.max(0, v * 0.75 + streak * 0.6 - 0.62) * 2.4;
      img.data[4 * i] = img.data[4 * i + 1] = img.data[4 * i + 2] = 0; img.data[4 * i + 3] = Math.min(255, a * 255);
    }
    x.putImageData(img, 0, 0); return c;
  };
  /* paper texture: fibres + tooth, tinted for the theme */
  S.makePaper = function (size, th) {
    const c = S.canvas(size, size), x = c.getContext('2d');
    x.fillStyle = th.paper; x.fillRect(0, 0, size, size);
    const img = x.getImageData(0, 0, size, size), r = PN.rng(777);
    const dark = th.night;
    for (let i = 0; i < size * size; i++) {
      const px = i % size, py = (i / size) | 0;
      const n = (PN.fbm(px / 40, py / 40, 3, 3) - 0.5) * 10 + (PN.vnoise(px / 2.5, py / 2.5, 5) - 0.5) * 9 + (r() - 0.5) * 7;
      const k = dark ? n * 0.6 : n;
      img.data[4 * i] = Math.max(0, Math.min(255, img.data[4 * i] + k));
      img.data[4 * i + 1] = Math.max(0, Math.min(255, img.data[4 * i + 1] + k));
      img.data[4 * i + 2] = Math.max(0, Math.min(255, img.data[4 * i + 2] + k * 0.9));
    }
    x.putImageData(img, 0, 0);
    // fibres
    x.lineCap = 'round';
    for (let k = 0; k < size / 3; k++) {
      const fx = r() * size, fy = r() * size, a = r() * Math.PI * 2, l = 4 + r() * 14;
      x.strokeStyle = dark ? 'rgba(255,255,255,0.035)' : (r() < 0.5 ? 'rgba(120,110,95,0.06)' : 'rgba(255,255,255,0.25)');
      x.lineWidth = 0.6; x.beginPath(); x.moveTo(fx, fy); x.quadraticCurveTo(fx + Math.cos(a) * l * 0.5 + wob(r, 2), fy + Math.sin(a) * l * 0.5 + wob(r, 2), fx + Math.cos(a) * l, fy + Math.sin(a) * l); x.stroke();
    }
    return c;
  };
  /* erode an ink canvas with grain so strokes look like graphite */
  S.erode = function (cnv, strength, offX, offY) {
    if (!S.grain) S.grain = S.makeGrain(256);
    const x = cnv.getContext('2d');
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0);
    x.globalCompositeOperation = 'destination-out'; x.globalAlpha = strength;
    const p = x.createPattern(S.grain, 'repeat');
    if (p.setTransform && (offX || offY)) p.setTransform(new DOMMatrix([1, 0, 0, 1, -(offX % 256), -(offY % 256)]));
    x.fillStyle = p; x.fillRect(0, 0, cnv.width, cnv.height);
    x.restore();
  };

  /* Minimal rough.js-compatible fallback (used only if the CDN script is unavailable). */
  S.rough = function (cnv) {
    if (window.rough && window.rough.canvas) return window.rough.canvas(cnv);
    const ctx = cnv.getContext('2d');
    const st = (o) => ({ color: o.stroke || S.th.ink, w: o.strokeWidth || 1, alpha: 0.9 });
    const fill = (o, path) => { if (!o.fill) return; ctx.save(); ctx.beginPath(); path(); ctx.clip(); const r = PN.rng(o.seed || 1); if (o.fillStyle === 'solid') { ctx.fillStyle = o.fill; ctx.fill(); } else S.hatch(ctx, 0, 0, cnv.width, cnv.height, ((o.hachureAngle || -41) * Math.PI) / 180, o.hachureGap || 4, r, { color: o.fill, w: o.fillWeight || 0.7, alpha: 0.8 }); ctx.restore(); };
    return {
      line(x1, y1, x2, y2, o) { S.line(ctx, x1, y1, x2, y2, PN.rng(o.seed || 1), st(o)); },
      rectangle(x, y, w, h, o) { fill(o, () => ctx.rect(x, y, w, h)); const r = PN.rng(o.seed || 1); S.pencil(ctx, () => S.trace(ctx, [x, y, x + w, y, x + w, y + h, x, y + h, x, y], r, 0.6, false), st(o)); },
      circle(x, y, d, o) { fill(o, () => ctx.arc(x, y, d / 2, 0, 7)); S.circle(ctx, x, y, d / 2, d / 2, PN.rng(o.seed || 1), st(o)); },
      ellipse(x, y, w, h, o) { fill(o, () => ctx.ellipse(x, y, w / 2, h / 2, 0, 0, 7)); S.circle(ctx, x, y, w / 2, h / 2, PN.rng(o.seed || 1), st(o)); },
      polygon(pts, o) { const flat = []; pts.forEach((p) => flat.push(p[0], p[1])); fill(o, () => { ctx.moveTo(pts[0][0], pts[0][1]); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.closePath(); }); flat.push(pts[0][0], pts[0][1]); S.pencil(ctx, () => S.trace(ctx, flat, PN.rng(o.seed || 1), 0.5, false), st(o)); },
      linearPath(pts, o) { const flat = []; pts.forEach((p) => flat.push(p[0], p[1])); S.pencil(ctx, () => S.trace(ctx, flat, PN.rng(o.seed || 1), 0.4, false), st(o)); },
      curve(pts, o) { this.linearPath(pts, o); },
      arc(x, y, w, h, a0, a1, closed, o) { const pts = []; for (let k = 0; k <= 12; k++) { const a = a0 + ((a1 - a0) * k) / 12; pts.push([x + (Math.cos(a) * w) / 2, y + (Math.sin(a) * h) / 2]); } this.linearPath(pts, o); },
      path(d, o) { const p = new Path2D(d); if (o.fill) { ctx.save(); ctx.fillStyle = o.fill; ctx.globalAlpha = 0.5; ctx.fill(p); ctx.restore(); } ctx.strokeStyle = o.stroke || S.th.ink; ctx.lineWidth = o.strokeWidth || 1; ctx.stroke(p); },
    };
  };
})();
