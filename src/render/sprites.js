'use strict';
/* Pencil sketches of buildings (drawn once per theme with rough.js, then eroded with graphite grain). */
(function () {
  const PN = window.PN, S = PN.Sketch;
  const U = 80, SC = 2; // sprite units and backing resolution
  PN.SPRITE_U = U;

  function make(fn, th, seed) {
    const c = S.canvas(U * SC, U * SC), ctx = c.getContext('2d');
    ctx.scale(SC, SC);
    const rc = S.rough(c);
    // rough.js draws in canvas pixels; wrap to apply our scale
    const R = wrap(rc, ctx);
    const meta = { anchor: [40, 63], smoke: [], steam: [], hubs: [], leds: [], glow: null };
    fn(R, ctx, th, seed || 7, meta);
    S.erode(c, th.grainAlpha * 0.75, seed * 13, seed * 7);
    c.meta = meta;
    return c;
  }
  function wrap(rc, ctx) {
    // rough.canvas draws with the canvas' current transform, so the ctx.scale() above applies
    const base = (o) => Object.assign({ roughness: 1.15, bowing: 0.9, stroke: S.th.ink, strokeWidth: 1.05, hachureGap: 3.2, fillWeight: 0.55, hachureAngle: -41, disableMultiStroke: false }, o || {});
    return {
      rect: (x, y, w, h, o) => rc.rectangle(x, y, w, h, base(o)),
      circle: (x, y, d, o) => rc.circle(x, y, d, base(o)),
      ell: (x, y, w, h, o) => rc.ellipse(x, y, w, h, base(o)),
      line: (x1, y1, x2, y2, o) => rc.line(x1, y1, x2, y2, base(o)),
      poly: (pts, o) => rc.polygon(pts, base(o)),
      path: (pts, o) => rc.linearPath(pts, base(o)),
      curve: (pts, o) => (rc.curve ? rc.curve(pts, base(o)) : rc.linearPath(pts, base(o))),
      arc: (x, y, w, h, a0, a1, closed, o) => rc.arc(x, y, w, h, a0, a1, closed, base(o)),
      ctx,
    };
  }
  const hat = (th, a) => th.night ? 'rgba(220,216,207,' + (a || 0.5) + ')' : 'rgba(42,44,48,' + (a || 0.5) + ')';
  const tint = (col, a) => { // hex -> rgba
    const n = parseInt(col.slice(1), 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  };

  /* building blocks */
  function box(R, x, y, w, h, d, th, o) { // front face + top face (oblique)
    o = o || {};
    R.poly([[x, y], [x + d, y - d * 0.75], [x + w + d, y - d * 0.75], [x + w, y]], { fill: o.top || hat(th, 0.28), fillStyle: 'hachure', hachureGap: 2.6, seed: o.seed });
    R.poly([[x + w, y], [x + w + d, y - d * 0.75], [x + w + d, y + h - d * 0.75], [x + w, y + h]], { fill: hat(th, 0.55), hachureGap: 2, seed: (o.seed || 1) + 1 });
    R.rect(x, y, w, h, { fill: o.front, hachureGap: 3.5, seed: (o.seed || 1) + 2 });
  }
  function chimney(R, x, y0, y1, w, th, stripes, seed) {
    R.poly([[x, y1], [x + w * 0.2, y0], [x + w * 0.8, y0], [x + w, y1]], { seed });
    R.line(x + w * 0.1, y0 + 1, x + w * 0.9, y0 + 1, { seed: seed + 1 });
    if (stripes) for (let k = 0; k < 2; k++) {
      const yy = y0 + 2 + k * 5;
      R.poly([[x + w * 0.2, yy], [x + w * 0.8, yy], [x + w * 0.79, yy + 2.5], [x + w * 0.21, yy + 2.5]], { stroke: th.red, strokeWidth: 0.6, fill: tint(th.red, 0.8), hachureGap: 1.1, fillWeight: 0.8, seed: seed + 5 + k });
    }
  }
  function tower(R, cx, base, top, wb, wt, th, seed) { // hyperbolic cooling tower
    const H = base - top, yw = top + H * 0.66, a = wt * 0.42;
    const bt = Math.abs(top - yw) / Math.sqrt(Math.max(0.01, (wt / 2 / a) ** 2 - 1));
    const bb = Math.abs(base - yw) / Math.sqrt(Math.max(0.01, (wb / 2 / a) ** 2 - 1));
    const pts = [], pts2 = [];
    for (let i = 0; i <= 12; i++) {
      const yy = top + (H * i) / 12, b = yy < yw ? bt : bb, hw = a * Math.sqrt(1 + ((yy - yw) / b) ** 2);
      pts.push([cx - hw, yy]); pts2.push([cx + hw, yy]);
    }
    const outline = pts.concat(pts2.reverse());
    R.poly(outline, { fill: hat(th, 0.2), hachureAngle: 70, hachureGap: 3.8, seed });
    R.ell(cx, top, wt * 0.95, wt * 0.3, { seed: seed + 3 });
    return [cx, top - 1];
  }
  function tank(R, x, y, w, h, th, seed) { R.rect(x, y, w, h, { fill: hat(th, 0.15), hachureGap: 4, seed }); R.ell(x + w / 2, y, w, w * 0.32, { fill: th.night ? '#2c3036' : '#efede6', fillStyle: 'solid', seed: seed + 1 }); }
  function ground(R, th, seed) { R.line(2, 64, 78, 64, { strokeWidth: 0.6, stroke: hat(th, 0.5), seed }); }
  function water(R, x0, x1, y, th, seed, rows) { for (let k = 0; k < (rows || 2); k++) { const pts = []; for (let x = x0; x <= x1; x += 6) pts.push([x, y + k * 3.5 + ((x / 6) % 2 ? 1 : -1)]); R.curve(pts, { stroke: th.water, strokeWidth: 0.8, seed: seed + k }); } }

  const DRAW = {
    steam_dc(R, c, th, s, m) {
      ground(R, th, s);
      R.poly([[14, 42], [36, 29], [58, 42]], { fill: hat(th, 0.35), hachureGap: 2.4, seed: s });
      R.rect(16, 42, 40, 22, { seed: s + 1 });
      for (let k = 0; k < 3; k++) { R.arc(25 + k * 11, 52, 6, 8, Math.PI, Math.PI * 2, false, { seed: s + 4 + k }); R.line(22 + k * 11, 52, 22 + k * 11, 60, { seed: s + 9 + k, strokeWidth: 0.8 }); R.line(28 + k * 11, 52, 28 + k * 11, 60, { seed: s + 12 + k, strokeWidth: 0.8 }); }
      for (let k = 0; k < 4; k++) R.line(17, 45 + k * 5, 22, 45 + k * 5, { strokeWidth: 0.5, stroke: tint(th.red, 0.7), seed: s + 20 + k });
      chimney(R, 60, 8, 64, 7, th, false, s + 30);
      m.smoke.push([63.5, 7]);
    },
    coal(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 6, 44, 34, 20, 6, th, { seed: s });
      box(R, 38, 28, 16, 36, 5, th, { seed: s + 10 });
      chimney(R, 60, 6, 64, 7, th, true, s + 20);
      chimney(R, 70, 14, 64, 5.5, th, true, s + 30);
      R.poly([[2, 64], [9, 55], [17, 53], [24, 64]], { fill: hat(th, 0.85), hachureGap: 1.3, fillWeight: 0.7, seed: s + 40 });
      m.smoke.push([63.5, 5], [72.7, 13]);
    },
    lignite(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 4, 46, 30, 18, 5, th, { seed: s });
      chimney(R, 30, 12, 64, 5, th, true, s + 5);
      m.steam.push(tower(R, 48, 64, 28, 20, 12, th, s + 10));
      m.steam.push(tower(R, 68, 64, 32, 17, 10, th, s + 20));
      m.smoke.push([32.5, 11]);
    },
    oil(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 30, 42, 30, 22, 5, th, { seed: s });
      chimney(R, 64, 10, 64, 6, th, true, s + 10);
      tank(R, 4, 50, 12, 14, th, s + 20); tank(R, 17, 52, 11, 12, th, s + 30);
      m.smoke.push([67, 9]);
    },
    gas_ocgt(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 14, 46, 36, 18, 5, th, { seed: s, front: hat(th, 0.12) });
      R.rect(4, 48, 9, 14, { fill: hat(th, 0.4), hachureAngle: 0, hachureGap: 1.6, seed: s + 5 });
      R.rect(54, 34, 9, 30, { seed: s + 9 });
      R.ell(58.5, 34, 9, 3, { seed: s + 11 });
      R.line(62, 56, 70, 56, { seed: s + 12 }); R.line(70, 56, 70, 64, { seed: s + 13 });
      m.smoke.push([58.5, 33]);
    },
    gas_ccgt(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 4, 44, 32, 20, 5, th, { seed: s, front: hat(th, 0.12) });
      box(R, 38, 30, 16, 34, 5, th, { seed: s + 10 });
      R.rect(60, 18, 7, 46, { seed: s + 20 }); R.ell(63.5, 18, 7, 2.5, { seed: s + 21 });
      for (let k = 0; k < 3; k++) R.circle(10 + k * 9, 38, 6, { seed: s + 30 + k, strokeWidth: 0.7 });
      m.smoke.push([63.5, 17]);
    },
    nuclear(R, c, th, s, m) {
      ground(R, th, s);
      m.steam.push(tower(R, 20, 64, 20, 30, 17, th, s));
      R.rect(42, 40, 22, 24, { seed: s + 10 });
      R.arc(53, 40, 22, 22, Math.PI, Math.PI * 2, false, { fill: hat(th, 0.25), hachureGap: 2.6, seed: s + 11 });
      R.line(42, 40, 64, 40, { seed: s + 12 });
      box(R, 66, 52, 10, 12, 3, th, { seed: s + 20 });
      R.circle(53, 31, 3, { stroke: th.violet, strokeWidth: 0.8, seed: s + 30 });
    },
    smr(R, c, th, s, m) {
      ground(R, th, s);
      R.rect(22, 46, 16, 18, { seed: s }); R.arc(30, 46, 16, 14, Math.PI, Math.PI * 2, false, { fill: hat(th, 0.25), seed: s + 1 });
      box(R, 42, 50, 20, 14, 4, th, { seed: s + 5 });
      for (let x = 8; x < 74; x += 5) R.line(x, 64, x, 60, { strokeWidth: 0.5, seed: s + x });
      R.line(8, 61, 74, 61, { strokeWidth: 0.5, seed: s + 3 });
      R.circle(30, 42, 3, { stroke: th.violet, strokeWidth: 0.8, seed: s + 30 });
    },
    hydro_small(R, c, th, s, m) {
      water(R, 4, 76, 52, th, s, 3);
      R.rect(14, 48, 30, 5, { fill: hat(th, 0.4), hachureGap: 2, seed: s + 4 });
      for (let k = 0; k < 4; k++) R.line(17 + k * 7, 48, 17 + k * 7, 53, { seed: s + 10 + k, strokeWidth: 0.6 });
      R.poly([[46, 40], [55, 33], [64, 40]], { fill: hat(th, 0.35), seed: s + 20 });
      R.rect(47, 40, 16, 14, { seed: s + 21 });
      R.rect(53, 46, 4, 8, { seed: s + 22, strokeWidth: 0.7 });
    },
    hydro_dam(R, c, th, s, m) {
      R.poly([[6, 40], [10, 22], [70, 22], [74, 40]], { stroke: tint(th.water, 0.7), fill: tint(th.water, 0.55), hachureAngle: 0, hachureGap: 3, seed: s });
      R.curve([[4, 44], [22, 38], [40, 36], [58, 38], [76, 44]], { strokeWidth: 2.2, seed: s + 2 });
      R.curve([[4, 48], [22, 42], [40, 40], [58, 42], [76, 48]], { strokeWidth: 1, seed: s + 3 });
      for (let k = 0; k < 6; k++) R.line(30 + k * 4, 41, 29 + k * 4, 52, { stroke: tint(th.water, 0.8), strokeWidth: 0.7, seed: s + 10 + k });
      box(R, 50, 52, 14, 10, 3, th, { seed: s + 20 });
      water(R, 20, 50, 58, th, s + 30, 2);
    },
    pumped(R, c, th, s, m) {
      R.curve([[2, 50], [16, 30], [34, 16], [50, 14], [66, 22], [78, 34]], { seed: s, strokeWidth: 0.9 });
      R.ell(44, 17, 36, 10, { stroke: th.water, fill: tint(th.water, 0.6), hachureAngle: 0, hachureGap: 2.2, seed: s + 1 });
      R.line(38, 21, 34, 56, { seed: s + 2 }); R.line(42, 21, 38, 56, { seed: s + 3 });
      box(R, 26, 54, 18, 10, 3, th, { seed: s + 5 });
      water(R, 6, 74, 66, th, s + 10, 1);
    },
    wind(R, c, th, s, m) {
      ground(R, th, s);
      const T = [[16, 64, 26], [40, 60, 18], [64, 64, 26]];
      for (const [x, yb, yt] of T) { R.poly([[x - 1.6, yb], [x - 0.6, yt], [x + 0.6, yt], [x + 1.6, yb]], { seed: s + x }); R.rect(x - 2.5, yt - 2.2, 6, 3, { seed: s + x + 1, strokeWidth: 0.8 }); m.hubs.push([x - 1, yt - 0.8, 14]); }
    },
    wind_offshore(R, c, th, s, m) {
      water(R, 2, 78, 62, th, s, 2);
      const T = [[16, 60, 22], [40, 58, 16], [64, 60, 22]];
      for (const [x, yb, yt] of T) { R.rect(x - 2.4, yb - 3, 4.8, 3, { stroke: th.yellow, fill: tint(th.yellow, 0.8), hachureGap: 1.2, seed: s + x + 9 }); R.poly([[x - 1.5, yb - 3], [x - 0.6, yt], [x + 0.6, yt], [x + 1.5, yb - 3]], { seed: s + x }); R.rect(x - 2.5, yt - 2.2, 6, 3, { seed: s + x + 1, strokeWidth: 0.8 }); m.hubs.push([x - 1, yt - 0.8, 14]); }
    },
    solar(R, c, th, s, m) {
      for (let r = 0; r < 3; r++) {
        const y0 = 36 + r * 10, dx = r * 3;
        R.poly([[6 + dx, y0 + 7], [12 + dx, y0], [72 + dx, y0], [66 + dx, y0 + 7]], { stroke: th.ink, fill: tint(th.water, 0.75), hachureAngle: 62, hachureGap: 1.7, fillWeight: 0.6, seed: s + r });
        for (let k = 1; k < 6; k++) R.line(6 + dx + k * 10 + 6, y0, 6 + dx + k * 10, y0 + 7, { strokeWidth: 0.5, seed: s + r * 10 + k });
        R.line(10 + dx, y0 + 7, 10 + dx, y0 + 9, { strokeWidth: 0.6, seed: s + 40 + r }); R.line(64 + dx, y0 + 7, 64 + dx, y0 + 9, { strokeWidth: 0.6, seed: s + 50 + r });
      }
    },
    csp(R, c, th, s, m) {
      ground(R, th, s);
      R.rect(38, 14, 5, 50, { seed: s }); R.rect(36, 10, 9, 6, { stroke: th.orange, fill: tint(th.yellow, 0.9), hachureGap: 1, seed: s + 1 });
      for (let ring = 0; ring < 2; ring++) for (let k = 0; k < 7; k++) {
        const a = Math.PI * (0.1 + 0.8 * (k / 6)), rx = 24 + ring * 10, ry = 7 + ring * 3;
        const x = 40.5 - Math.cos(a) * rx, y = 54 + Math.sin(a) * ry - 2;
        R.poly([[x - 3, y + 1.5], [x - 1.5, y - 1.5], [x + 3, y - 1.5], [x + 1.5, y + 1.5]], { fill: tint(th.water, 0.6), hachureGap: 1.3, strokeWidth: 0.6, seed: s + ring * 10 + k });
      }
      m.glow = [40.5, 12, 6, 6];
    },
    geothermal(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 44, 46, 22, 18, 4, th, { seed: s });
      R.path([[4, 56], [20, 56], [20, 50], [26, 50], [26, 56], [44, 56]], { seed: s + 2, strokeWidth: 1.4 });
      R.path([[4, 60], [44, 60]], { seed: s + 3, strokeWidth: 1.4 });
      R.rect(8, 40, 6, 16, { seed: s + 4 }); m.steam.push([11, 38]);
      R.rect(30, 44, 5, 12, { seed: s + 5 }); m.steam.push([32.5, 42]);
    },
    biomass(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 30, 44, 30, 20, 5, th, { seed: s });
      chimney(R, 63, 16, 64, 5, th, false, s + 10);
      R.poly([[2, 64], [14, 46], [28, 64]], { stroke: th.ink, fill: tint(th.field, 0.85), hachureGap: 1.8, seed: s + 20 });
      m.smoke.push([65.5, 15]);
    },
    battery(R, c, th, s, m) {
      ground(R, th, s);
      for (let k = 0; k < 4; k++) { R.rect(4 + k * 15, 48, 13, 15, { seed: s + k }); for (let j = 1; j < 4; j++) R.line(4 + k * 15 + j * 3.2, 50, 4 + k * 15 + j * 3.2, 61, { strokeWidth: 0.45, seed: s + k * 9 + j }); }
      R.circle(70, 52, 7, { seed: s + 20 }); R.line(70, 45, 70, 34, { seed: s + 21 }); R.line(66, 36, 74, 36, { seed: s + 22 });
      m.leds.push([10, 46], [25, 46], [40, 46], [55, 46]);
    },
    fusion(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 4, 50, 66, 14, 5, th, { seed: s, front: hat(th, 0.08) });
      R.ell(38, 36, 50, 20, { seed: s + 2, strokeWidth: 1.4 });
      R.ell(38, 36, 24, 8, { seed: s + 3, fill: th.night ? '#23262c' : '#eeece5', fillStyle: 'solid' });
      R.ell(38, 36, 50, 20, { seed: s + 4, stroke: hat(th, 0.6), strokeWidth: 0.5 });
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; R.line(38 + Math.cos(a) * 21, 36 + Math.sin(a) * 8.5, 38 + Math.cos(a) * 26, 36 + Math.sin(a) * 10.5, { strokeWidth: 1.6, seed: s + 10 + k }); }
      tank(R, 66, 34, 8, 16, th, s + 30);
      m.glow = [38, 36, 19, 7];
    },
    substation(R, c, th, s, m) {
      for (let x = 10; x <= 70; x += 4) R.line(x, 62, x, 58, { strokeWidth: 0.45, seed: s + x });
      R.rect(10, 34, 60, 28, { strokeWidth: 0.6, stroke: hat(th, 0.7), seed: s + 1 });
      R.circle(30, 50, 12, { seed: s + 2 }); R.circle(34, 50, 12, { seed: s + 3 });
      R.circle(52, 50, 10, { seed: s + 4 }); R.circle(55, 50, 10, { seed: s + 5 });
      R.line(18, 28, 18, 44, { seed: s + 6 }); R.line(62, 28, 62, 44, { seed: s + 7 }); R.line(16, 30, 64, 30, { seed: s + 8 });
      for (let k = 0; k < 3; k++) R.line(26 + k * 14, 30, 26 + k * 14, 36, { strokeWidth: 0.6, seed: s + 9 + k });
    },
    coal_mine(R, c, th, s, m) {
      ground(R, th, s);
      R.poly([[2, 64], [12, 40], [26, 64]], { fill: hat(th, 0.8), hachureGap: 1.4, seed: s });
      R.line(32, 64, 42, 18, { seed: s + 1, strokeWidth: 1.3 }); R.line(54, 64, 42, 18, { seed: s + 2, strokeWidth: 1.3 });
      R.line(36, 46, 50, 46, { seed: s + 3 }); R.line(38, 34, 47, 34, { seed: s + 4 });
      R.line(34, 58, 50, 46, { seed: s + 5, strokeWidth: 0.6 }); R.line(52, 58, 36, 46, { seed: s + 6, strokeWidth: 0.6 });
      R.circle(42, 17, 12, { seed: s + 7 }); for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI; R.line(42 - Math.cos(a) * 6, 17 - Math.sin(a) * 6, 42 + Math.cos(a) * 6, 17 + Math.sin(a) * 6, { strokeWidth: 0.5, seed: s + 10 + k }); }
      box(R, 58, 48, 16, 16, 3, th, { seed: s + 20 });
    },
    lignite_mine(R, c, th, s, m) {
      R.ell(40, 48, 72, 30, { seed: s, fill: tint(th.field, 0.5), hachureGap: 3, hachureAngle: 10 });
      R.ell(40, 49, 50, 19, { seed: s + 1, fill: tint('#8a6a48', 0.7), hachureGap: 2.2, hachureAngle: -20 });
      R.ell(40, 50, 28, 9, { seed: s + 2, fill: hat(th, 0.7), hachureGap: 1.5 });
      R.circle(62, 26, 12, { seed: s + 3 }); R.line(62, 26, 48, 38, { seed: s + 4, strokeWidth: 1.3 }); R.rect(44, 36, 10, 6, { seed: s + 5 });
      for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; R.line(62, 26, 62 + Math.cos(a) * 6, 26 + Math.sin(a) * 6, { strokeWidth: 0.5, seed: s + 10 + k }); }
    },
    gas_well(R, c, th, s, m) {
      ground(R, th, s);
      R.line(40, 10, 28, 64, { seed: s, strokeWidth: 1.2 }); R.line(40, 10, 52, 64, { seed: s + 1, strokeWidth: 1.2 });
      for (let k = 0; k < 4; k++) { const y = 22 + k * 11, w = 3 + k * 2.6; R.line(40 - w, y, 40 + w, y + 9, { strokeWidth: 0.5, seed: s + 5 + k }); R.line(40 + w, y, 40 - w, y + 9, { strokeWidth: 0.5, seed: s + 9 + k }); }
      tank(R, 58, 50, 12, 14, th, s + 20);
      R.line(4, 64, 26, 60, { seed: s + 30, strokeWidth: 0.6 });
    },
    industry(R, c, th, s, m) {
      ground(R, th, s);
      R.rect(6, 44, 50, 20, { seed: s });
      const pts = [[6, 44]]; for (let k = 0; k < 5; k++) { pts.push([6 + k * 10, 36], [16 + k * 10, 44]); } R.path(pts, { seed: s + 1 });
      for (let k = 0; k < 5; k++) R.line(6 + k * 10, 37, 6 + k * 10, 44, { strokeWidth: 0.5, seed: s + 3 + k });
      chimney(R, 60, 14, 64, 6, th, false, s + 10);
      m.smoke.push([63, 13]);
    },
    datacenter(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 4, 42, 66, 22, 6, th, { seed: s, front: hat(th, 0.1) });
      for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) R.circle(12 + k * 10 + r * 3, 36 - r * 3.2, 4.5, { strokeWidth: 0.55, seed: s + r * 10 + k });
      for (let k = 0; k < 8; k++) m.leds.push([9 + k * 8, 52 + (k % 2) * 5]);
      R.line(4, 50, 70, 50, { strokeWidth: 0.4, seed: s + 40 });
    },
    tram(R, c, th, s, m) {
      R.line(2, 64, 78, 64, { seed: s, strokeWidth: 0.8 }); R.line(2, 66, 78, 66, { seed: s + 1, strokeWidth: 0.6 });
      R.line(2, 22, 78, 22, { seed: s + 2, strokeWidth: 0.6 });
      R.rect(12, 38, 54, 22, { seed: s + 3, fill: tint(th.red, 0.5), hachureGap: 3.5 });
      for (let k = 0; k < 5; k++) R.rect(16 + k * 10, 42, 7, 7, { seed: s + 10 + k, strokeWidth: 0.6 });
      R.line(30, 38, 40, 22, { seed: s + 20 }); R.line(50, 38, 40, 22, { seed: s + 21 });
      R.circle(22, 62, 5, { seed: s + 22 }); R.circle(56, 62, 5, { seed: s + 23 });
    },
    military(R, c, th, s, m) {
      ground(R, th, s);
      box(R, 10, 46, 46, 18, 5, th, { seed: s, front: hat(th, 0.25) });
      R.line(66, 64, 66, 18, { seed: s + 1 }); R.line(60, 26, 72, 26, { seed: s + 2 }); R.line(62, 20, 70, 20, { seed: s + 3 });
      m.leds.push([66, 17]);
    },
    border(R, c, th, s, m) {
      ground(R, th, s);
      R.rect(34, 26, 8, 38, { seed: s });
      for (let k = 0; k < 4; k++) R.poly([[34, 30 + k * 9], [42, 26 + k * 9], [42, 31 + k * 9], [34, 35 + k * 9]], { stroke: th.red, fill: tint(th.red, 0.85), hachureGap: 1, seed: s + 10 + k });
      R.path([[48, 30], [70, 30], [64, 25]], { seed: s + 20 }); R.path([[70, 38], [48, 38], [54, 43]], { seed: s + 21 });
    },
    construction(R, c, th, s, m) {
      R.line(62, 64, 62, 8, { seed: s, strokeWidth: 1.1 }); R.line(64, 64, 64, 8, { seed: s + 1, strokeWidth: 0.6 });
      for (let y = 12; y < 62; y += 7) R.line(62, y, 64, y + 7, { seed: s + y, strokeWidth: 0.4 });
      R.line(30, 10, 76, 10, { seed: s + 2, strokeWidth: 1.1 }); R.line(42, 10, 63, 4, { seed: s + 3, strokeWidth: 0.6 });
      R.line(38, 10, 38, 34, { seed: s + 4, strokeWidth: 0.5 }); R.rect(35, 34, 6, 4, { seed: s + 5, strokeWidth: 0.6 });
    },
    damaged(R, c, th, s, m) {
      R.path([[12, 20], [24, 32], [18, 40], [34, 50], [28, 58]], { stroke: th.red, strokeWidth: 1.6, seed: s });
      R.path([[60, 18], [52, 30], [62, 38], [50, 52]], { stroke: th.red, strokeWidth: 1.6, seed: s + 1 });
    },
  };
  PN.SPRITE_KEYS = Object.keys(DRAW);

  PN.Sprites = {
    cache: {}, theme: null,
    build(th) {
      this.cache = {}; this.theme = th.name;
      const prev = S.th; S.th = th;
      let k = 1;
      for (const key of Object.keys(DRAW)) { this.cache[key] = make(DRAW[key], th, 11 + 17 * k++); }
      S.th = prev;
    },
    get(key) { return this.cache[key] || this.cache.industry; },
    keyFor(n) {
      if (n.type === 'plant' || n.type === 'mine') return n.tech;
      if (n.type === 'sub') return 'substation';
      if (n.type === 'border') return 'border';
      if (n.type === 'load') return n.kind === 'datacenter' ? 'datacenter' : n.kind === 'tram' || n.kind === 'rail' ? 'tram' : n.kind === 'military' ? 'military' : 'industry';
      return 'industry';
    },
    icon(key, size) { // small canvas for UI buttons
      const src = this.get(key), c = S.canvas(size, size), x = c.getContext('2d');
      x.drawImage(src, 0, 0, src.width, src.height, 0, 0, size, size); return c;
    },
  };
})();
