'use strict';
/* Map generation: projects Natural Earth vectors onto a tile grid and derives terrain,
   wind, sun, water, deposits and districts. 1 tile = sc.tileKm km. */
(function () {
  const PN = window.PN;
  const T_SEA = 0, T_LAKE = 1, T_PLAIN = 2, T_HILL = 4, T_MOUNT = 5, T_MARSH = 6, T_DESERT = 7;
  PN.TERR = { SEA: T_SEA, LAKE: T_LAKE, PLAIN: T_PLAIN, HILL: T_HILL, MOUNT: T_MOUNT, MARSH: T_MARSH, DESERT: T_DESERT };
  PN.RES_BIT = { coal: 1, lignite: 2, gas: 4, oil: 8, uranium: 16, geothermal: 32 };

  /* chamfer distance transform (in tiles); optional label propagation */
  function dt(W, H, src, lab0) {
    const N = W * H, INF = 1e9, d = new Float32Array(N), lab = lab0 ? new Int16Array(N).fill(-1) : null;
    for (let i = 0; i < N; i++) { d[i] = src[i] ? 0 : INF; if (lab && src[i]) lab[i] = lab0[i]; }
    const S = Math.SQRT2;
    const relax = (i, j, w) => { const v = d[j] + w; if (v < d[i]) { d[i] = v; if (lab) lab[i] = lab[j]; } };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (d[i] === 0) continue;
      if (x > 0) relax(i, i - 1, 1);
      if (y > 0) { relax(i, i - W, 1); if (x > 0) relax(i, i - W - 1, S); if (x < W - 1) relax(i, i - W + 1, S); }
    }
    for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
      const i = y * W + x; if (d[i] === 0) continue;
      if (x < W - 1) relax(i, i + 1, 1);
      if (y < H - 1) { relax(i, i + W, 1); if (x < W - 1) relax(i, i + W + 1, S); if (x > 0) relax(i, i + W - 1, S); }
    }
    return { d, lab };
  }
  PN.dt = dt;

  /* even-odd scanline fill of rings (arrays of tile-space flat coords) */
  function scanFill(W, H, rings, cb) {
    const rows = new Array(H);
    for (const r of rings) {
      const n = r.length / 2;
      for (let k = 0; k < n; k++) {
        const x1 = r[2 * k], y1 = r[2 * k + 1], x2 = r[(2 * k + 2) % r.length], y2 = r[(2 * k + 3) % r.length];
        if (y1 === y2) continue;
        const ya = Math.min(y1, y2), yb = Math.max(y1, y2);
        let j0 = Math.ceil(ya - 0.5), j1 = Math.floor(yb - 0.5);
        if (j0 < 0) j0 = 0; if (j1 > H - 1) j1 = H - 1;
        for (let j = j0; j <= j1; j++) {
          const yc = j + 0.5; if (yc < ya || yc >= yb) continue;
          const x = x1 + ((yc - y1) * (x2 - x1)) / (y2 - y1);
          (rows[j] = rows[j] || []).push(x);
        }
      }
    }
    for (let j = 0; j < H; j++) {
      const xs = rows[j]; if (!xs) continue;
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        let i0 = Math.ceil(xs[k] - 0.5), i1 = Math.floor(xs[k + 1] - 0.5);
        if (i0 < 0) i0 = 0; if (i1 > W - 1) i1 = W - 1;
        for (let i = i0; i <= i1; i++) cb(j * W + i);
      }
    }
  }

  PN.buildMap = function (sc, geo, places) {
    const P = PN.Albers(sc.proj.lon0, sc.proj.lat0, sc.proj.lat1, sc.proj.lat2);
    const [bl0, bt0, bl1, bt1] = sc.mapBox || geo.bbox;
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (let k = 0; k <= 40; k++) {
      const lon = bl0 + ((bl1 - bl0) * k) / 40, lat = bt0 + ((bt1 - bt0) * k) / 40;
      for (const [a, b] of [[lon, bt0], [lon, bt1], [bl0, lat], [bl1, lat]]) {
        const [x, y] = P.fwd(a, b); minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
    // keep the inner rectangle so every tile has real data around it
    const T = sc.tileKm;
    const insetX = (maxX - minX) * 0.035, insetY = (maxY - minY) * 0.02;
    minX += insetX; maxX -= insetX; minY += insetY; maxY -= insetY;
    const W = Math.ceil((maxX - minX) / T), H = Math.ceil((maxY - minY) / T), N = W * H;
    const M = {
      W, H, N, T, proj: P, x0: minX, y0: minY, sc,
      toTile(lon, lat) { const [x, y] = P.fwd(lon, lat); return [(x - minX) / T, (y - minY) / T]; },
      toLL(tx, ty) { return P.inv(minX + tx * T, minY + ty * T); },
    };
    const proj = (flat) => { const o = new Float32Array(flat.length); for (let i = 0; i < flat.length; i += 2) { const t = M.toTile(flat[i], flat[i + 1]); o[i] = t[0]; o[i + 1] = t[1]; } return o; };

    /* lon/lat of tile centres */
    M.lon = new Float32Array(N); M.lat = new Float32Array(N);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const ll = M.toLL(x + 0.5, y + 0.5); M.lon[y * W + x] = ll[0]; M.lat[y * W + x] = ll[1]; }

    /* countries */
    M.country = new Uint8Array(N); M.codes = [null];
    M.landRings = [];
    const order = geo.countries.slice().sort((a, b) => (a.code === sc.homeCode ? 1 : 0) - (b.code === sc.homeCode ? 1 : 0));
    for (const c of order) {
      const idx = M.codes.length; M.codes.push(c.code);
      const rings = c.rings.map((r) => proj(r.pts));
      c.rings.forEach((r, k) => M.landRings.push({ code: c.code, hole: r.hole, pts: rings[k], name: c.name }));
      scanFill(W, H, rings, (i) => { M.country[i] = idx; });
    }
    M.homeIdx = M.codes.indexOf(sc.homeCode);
    M.countryNames = {}; geo.countries.forEach((c) => { M.countryNames[c.code] = (sc.neighborNames && sc.neighborNames[c.code]) || c.name; });

    /* lakes */
    M.lakeRings = [];
    const lake = new Uint8Array(N);
    for (const L of geo.lakes) {
      const rings = L.rings.map(proj);
      rings.forEach((r) => M.lakeRings.push({ name: L.name, rank: L.rank, pts: r }));
      scanFill(W, H, rings, (i) => { lake[i] = 1; });
    }

    /* terrain base */
    const terr = (M.terr = new Uint8Array(N));
    for (let i = 0; i < N; i++) terr[i] = M.country[i] === 0 ? T_SEA : lake[i] ? T_LAKE : T_PLAIN;

    /* rivers */
    const rA = sc.code === 'PL' ? 5 : 3, rB = sc.code === 'PL' ? 8 : 5;
    M.river = new Uint8Array(N); M.rivers = [];
    for (const R of geo.rivers) {
      const cls = R.rank <= rA ? 3 : R.rank <= rB ? 2 : 1;
      for (const l of R.lines) {
        const p = proj(l); M.rivers.push({ name: R.name, cls, pts: p });
        for (let k = 0; k + 3 < p.length; k += 2) {
          const x1 = p[k], y1 = p[k + 1], x2 = p[k + 2], y2 = p[k + 3];
          const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 3));
          for (let s = 0; s <= steps; s++) {
            const x = Math.floor(x1 + ((x2 - x1) * s) / steps), y = Math.floor(y1 + ((y2 - y1) * s) / steps);
            if (x < 0 || y < 0 || x >= W || y >= H) continue;
            const i = y * W + x; if (terr[i] !== T_SEA && M.river[i] < cls) M.river[i] = cls;
          }
        }
      }
    }
    if (geo.stateLines) M.stateLines = geo.stateLines.map(proj);
    if (geo.states) M.states = geo.states.map((s) => { const t = M.toTile(s.lon, s.lat); return { name: s.name, x: t[0], y: t[1] }; });

    /* distances */
    const isSea = new Uint8Array(N), isLand = new Uint8Array(N), isWater = new Uint8Array(N), isBig = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      isSea[i] = terr[i] === T_SEA ? 1 : 0; isLand[i] = isSea[i] ? 0 : 1;
      isWater[i] = terr[i] === T_SEA || terr[i] === T_LAKE || M.river[i] >= 1 ? 1 : 0;
      isBig[i] = terr[i] === T_SEA || terr[i] === T_LAKE || M.river[i] >= 2 ? 1 : 0;
    }
    M.distSea = dt(W, H, isSea).d; const landDT = dt(W, H, isLand, M.country); M.distLand = landDT.d; M.nearLand = landDT.lab;
    M.distWater = dt(W, H, isWater).d; M.distBig = dt(W, H, isBig).d;

    /* elevation, forest, marsh, desert */
    const seed = sc.code === 'PL' ? 1918 : 1776;
    M.elev = new Float32Array(N); M.forest = new Uint8Array(N);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (terr[i] === T_SEA || terr[i] === T_LAKE) continue;
      const lon = M.lon[i], lat = M.lat[i];
      let e = 0;
      for (const m of sc.mountains) e = Math.max(e, m.h * PN.bump(lon, lat, m));
      const rough = PN.fbm(x / 3.2, y / 3.2, seed + 5, 3);
      e = e * (0.75 + 0.5 * rough) + (PN.fbm(x / 9, y / 9, seed + 9, 3) - 0.5) * 0.12;
      e = PN.clamp(e, 0, 1); M.elev[i] = e;
      let desert = 0; for (const d of sc.deserts || []) desert = Math.max(desert, PN.bump(lon, lat, d));
      let marsh = 0; for (const d of sc.marsh || []) marsh = Math.max(marsh, PN.bump(lon, lat, d));
      if (e > 0.6) terr[i] = T_MOUNT; else if (e > 0.34) terr[i] = T_HILL;
      else if (desert > 0.42) terr[i] = T_DESERT;
      else if (marsh * (0.6 + 0.8 * PN.fbm(x / 2, y / 2, seed + 11, 2)) > 0.45) terr[i] = T_MARSH;
      let f = PN.fbm(x / 5.5, y / 5.5, seed + 3, 4) - 0.5;
      for (const fo of sc.forests) f += fo.f * PN.bump(lon, lat, fo) * 0.75;
      f += e * 0.45 - desert * 1.2;
      if (terr[i] !== T_DESERT && terr[i] !== T_MARSH && f > 0.13 && e < 0.88) M.forest[i] = 1;
    }

    /* wind & sun */
    M.wind = new Float32Array(N); M.solar = new Float32Array(N);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, lon = M.lon[i], lat = M.lat[i];
      const t = { distSea: M.distSea[i] * T, distLand: M.distLand[i] * T, elev: M.elev[i], forest: M.forest[i] };
      const n = (PN.fbm(x / 4, y / 4, seed + 21, 3) - 0.5) * 0.6;
      M.wind[i] = terr[i] === T_SEA ? sc.windSea(lon, lat, t) + n * 0.4 : sc.wind(lon, lat, t) + n;
      M.solar[i] = sc.solar(lon, lat, t) + (PN.fbm(x / 6, y / 6, seed + 31, 2) - 0.5) * 40;
    }

    /* deposits, protected areas, hydro sites, historic regions */
    M.res = new Uint8Array(N); M.dep = new Int16Array(N).fill(-1); M.prot = new Uint16Array(N); M.site = new Int16Array(N).fill(-1);
    M.deposits = (places.deposits || []).map((d, k) => {
      const D = Object.assign({}, d, { k });
      const bit = PN.RES_BIT[d.kind] || 0;
      const mark = (i) => { M.res[i] |= bit; M.dep[i] = k; };
      if (d.poly && d.poly.length > 2) {
        const flat = []; d.poly.forEach((p) => flat.push(p[0], p[1]));
        const pr = proj(flat); D.ring = pr;
        scanFill(W, H, [pr], mark);
        let cx = 0, cy = 0; for (let q = 0; q < pr.length; q += 2) { cx += pr[q]; cy += pr[q + 1]; } D.x = cx / (pr.length / 2); D.y = cy / (pr.length / 2);
      } else if (d.circle) {
        const c = M.toTile(d.circle.lon, d.circle.lat), r = d.circle.radiusKm / T; D.x = c[0]; D.y = c[1]; D.r = r;
        for (let y = Math.max(0, Math.floor(c[1] - r - 1)); y <= Math.min(H - 1, Math.ceil(c[1] + r + 1)); y++)
          for (let x = Math.max(0, Math.floor(c[0] - r - 1)); x <= Math.min(W - 1, Math.ceil(c[0] + r + 1)); x++)
            if (Math.hypot(x + 0.5 - c[0], y + 0.5 - c[1]) <= Math.max(r, 0.75)) mark(y * W + x);
      }
      return D;
    });
    M.protected = (places.protected || []).map((p) => {
      const c = M.toTile(p.lon, p.lat), r = Math.max(0.6, p.radiusKm / T);
      for (let y = Math.max(0, Math.floor(c[1] - r)); y <= Math.min(H - 1, Math.ceil(c[1] + r)); y++)
        for (let x = Math.max(0, Math.floor(c[0] - r)); x <= Math.min(W - 1, Math.ceil(c[0] + r)); x++)
          if (Math.hypot(x + 0.5 - c[0], y + 0.5 - c[1]) <= r) { const i = y * W + x; if (!M.prot[i] || M.prot[i] > (p.from || 1)) M.prot[i] = p.from || 1; }
      return { name: p.name, x: c[0], y: c[1], r, from: p.from || 1 };
    });
    M.hydro = (places.hydro || []).map((h, k) => {
      const c = M.toTile(h.lon, h.lat); const tx = Math.floor(c[0]), ty = Math.floor(c[1]);
      const H2 = Object.assign({}, h, { k, x: c[0], y: c[1], tx, ty });
      if (tx >= 0 && ty >= 0 && tx < W && ty < H) {
        const i = ty * W + tx; M.site[i] = k;
        if (terr[i] === T_SEA) terr[i] = T_PLAIN;
      }
      return H2;
    });
    M.region = new Uint8Array(N);
    const reg = places.regions || {};
    const regIdx = { prussian1919: 1, silesia1922: 2, german1945: 3 };
    for (const key of Object.keys(regIdx)) {
      const polys = reg[key]; if (!polys || !polys.length) continue;
      const list = Array.isArray(polys[0][0]) ? polys : [polys];
      const rings = list.map((poly) => { const flat = []; poly.forEach((p) => flat.push(p[0], p[1])); return proj(flat); });
      scanFill(W, H, rings, (i) => { if (M.country[i] === M.homeIdx) M.region[i] = regIdx[key]; });
    }

    /* rural population weight */
    M.ruralW = new Float32Array(N);
    let sumW = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (M.country[i] !== M.homeIdx || terr[i] === T_LAKE) continue;
      let w = 0.55 + 0.9 * PN.fbm(x / 3, y / 3, seed + 41, 3);
      w *= { 2: 1, 4: 0.75, 5: 0.3, 6: 0.3, 7: 0.06 }[terr[i]] || 1;
      if (M.forest[i]) w *= 0.45;
      if (sc.ruralDensity) w *= sc.ruralDensity(M.lon[i], M.lat[i]);
      M.ruralW[i] = w; sumW += w;
    }
    M.ruralSum = sumW;

    /* villages for drawing (deterministic) */
    M.villages = [];
    const vr = PN.rng(seed + 99);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; const w = M.ruralW[i]; if (w <= 0) continue;
      const n = w > 1.3 ? 1 : vr() < w * 0.42 ? 1 : 0;
      for (let k = 0; k < n; k++) M.villages.push({ x: x + 0.2 + vr() * 0.6, y: y + 0.2 + vr() * 0.6, i, thr: vr(), s: (vr() * 1e9) | 0, n: 3 + Math.floor(vr() * 4 * Math.min(1.5, w)) });
    }

    M.district = new Int16Array(N).fill(-1);
    M.idx = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : y * W + x);
    return M;
  };

  /* Assign home tiles to the nearest city (district) for rural demand. */
  PN.assignDistricts = function (M, cities, maxKm) {
    const src = new Uint8Array(M.N), lab = new Int16Array(M.N).fill(-1);
    cities.forEach((c, k) => { const i = M.idx(Math.floor(c.x), Math.floor(c.y)); if (i >= 0) { src[i] = 1; lab[i] = k; } });
    const r = dt(M.W, M.H, src, lab);
    const maxT = maxKm / M.T;
    for (let i = 0; i < M.N; i++) M.district[i] = M.country[i] === M.homeIdx && r.d[i] <= maxT ? r.lab[i] : -1;
    cities.forEach((c) => (c.ruralShare = 0));
    for (let i = 0; i < M.N; i++) { const d = M.district[i]; if (d >= 0) cities[d].ruralShare += M.ruralW[i] / M.ruralSum; }
  };
})();
