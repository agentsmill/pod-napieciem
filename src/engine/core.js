'use strict';
/* Pod Napięciem — core utilities: math, RNG, noise, projection, formatting. */
const PN = (window.PN = window.PN || {});

PN.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
PN.lerp = (a, b, t) => a + (b - a) * t;
PN.smooth = (t) => t * t * (3 - 2 * t);

/* Piecewise-linear lookup in a table [[x,y],...] or {x:y}. */
PN._tab = new WeakMap();
PN.curve = function (tab, x) {
  if (typeof tab === 'number') return tab;
  if (!Array.isArray(tab)) {
    let t = PN._tab.get(tab);
    if (!t) {
      t = Object.keys(tab).map((k) => [+k, tab[k]]).sort((a, b) => a[0] - b[0]);
      PN._tab.set(tab, t);
    }
    tab = t;
  }
  if (x <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++) {
    if (x <= tab[i][0]) {
      const a = tab[i - 1], b = tab[i];
      return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
  }
  return tab[tab.length - 1][1];
};

/* ---------- deterministic randomness ---------- */
PN.rng = function (seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
PN.hash = function (x, y, s) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};
PN.vnoise = function (x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const u = PN.smooth(x - xi), v = PN.smooth(y - yi);
  const a = PN.hash(xi, yi, s), b = PN.hash(xi + 1, yi, s), c = PN.hash(xi, yi + 1, s), d = PN.hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
PN.fbm = function (x, y, s, oct) {
  oct = oct || 4;
  let f = 0, amp = 0.5, fr = 1, n = 0;
  for (let i = 0; i < oct; i++) {
    f += amp * PN.vnoise(x * fr, y * fr, s + i * 131);
    n += amp; amp *= 0.5; fr *= 2.03;
  }
  return f / n;
};
/* Gaussian bump on an (optionally rotated) ellipse, in degrees. */
PN.bump = function (lon, lat, e) {
  const k = Math.cos((e.lat * Math.PI) / 180);
  let dx = (lon - e.lon) * k, dy = lat - e.lat;
  if (e.rot) {
    const r = (e.rot * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    const x2 = dx * c + dy * s, y2 = -dx * s + dy * c; dx = x2; dy = y2;
  }
  const q = (dx * dx) / (e.rx * e.rx) + (dy * dy) / (e.ry * e.ry);
  return Math.exp(-q * (e.sharp || 1));
};

/* ---------- Albers equal-area conic projection (km) ---------- */
PN.Albers = function (lon0, lat0, lat1, lat2) {
  const R = 6371, d = Math.PI / 180;
  const n = (Math.sin(lat1 * d) + Math.sin(lat2 * d)) / 2;
  const C = Math.cos(lat1 * d) ** 2 + 2 * n * Math.sin(lat1 * d);
  const rho0 = (R * Math.sqrt(C - 2 * n * Math.sin(lat0 * d))) / n;
  return {
    fwd(lon, lat) {
      const th = n * (lon - lon0) * d;
      const rho = (R * Math.sqrt(Math.max(0, C - 2 * n * Math.sin(lat * d)))) / n;
      return [rho * Math.sin(th), -(rho0 - rho * Math.cos(th))];
    },
    inv(x, y) {
      y = -y;
      const dy = rho0 - y;
      let rho = Math.sqrt(x * x + dy * dy);
      if (n < 0) rho = -rho;
      const th = Math.atan2(x * Math.sign(n), dy * Math.sign(n));
      const s = (C - ((rho * n) / R) ** 2) / (2 * n);
      return [lon0 + th / n / d, Math.asin(PN.clamp(s, -1, 1)) / d];
    },
  };
};

/* point in polygon (flat [x0,y0,x1,y1,...]) */
PN.pip = function (x, y, p) {
  let inside = false;
  for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
    const xi = p[i], yi = p[i + 1], xj = p[j], yj = p[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

/* ---------- formatting (Polish conventions) ---------- */
PN.nf = (v, d) => {
  d = d || 0;
  if (!isFinite(v)) return '–';
  return v.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d });
};
PN.money = function (usd, opts) {
  const sc = PN.G && PN.G.sc;
  const fx = sc ? sc.fx : 1, sym = sc ? sc.cur : '$';
  const v = usd * fx, a = Math.abs(v);
  let s;
  if (a >= 1e9) s = PN.nf(v / 1e9, a >= 1e11 ? 0 : a >= 1e10 ? 1 : 2) + ' mld';
  else if (a >= 1e6) s = PN.nf(v / 1e6, a >= 1e8 ? 0 : a >= 1e7 ? 1 : 2) + ' mln';
  else if (a >= 1e3) s = PN.nf(v / 1e3, 0) + ' tys.';
  else s = PN.nf(v, 0);
  if (opts && opts.sign && v > 0) s = '+' + s;
  return s + ' ' + sym;
};
PN.price = function (usdPerMWh) {
  const sc = PN.G && PN.G.sc;
  return PN.nf(usdPerMWh * (sc ? sc.fx : 1), 0) + ' ' + (sc ? sc.cur : '$') + '/MWh';
};
PN.mw = function (v) {
  const a = Math.abs(v);
  if (a >= 1000) return PN.nf(v / 1000, a >= 10000 ? 1 : 2) + ' GW';
  if (a >= 10) return PN.nf(v, 0) + ' MW';
  if (a >= 1) return PN.nf(v, 1) + ' MW';
  return PN.nf(v * 1000, 0) + ' kW';
};
PN.mwh = function (v) {
  const a = Math.abs(v);
  if (a >= 1e6) return PN.nf(v / 1e6, 2) + ' TWh';
  if (a >= 1e3) return PN.nf(v / 1e3, a >= 1e5 ? 0 : 1) + ' GWh';
  return PN.nf(v, 0) + ' MWh';
};
PN.pct = (v, d) => PN.nf(v * 100, d || 0) + '%';
PN.MONTHS = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
PN.MONTHS_GEN = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
PN.MONTHS_SHORT = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
PN.DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
PN.months = (n) => {
  n = Math.round(n);
  if (n < 12) return n + (n === 1 ? ' miesiąc' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? ' miesiące' : ' miesięcy');
  const y = n / 12;
  return PN.nf(y, Number.isInteger(y) ? 0 : 1) + (y === 1 ? ' rok' : y < 5 && Number.isInteger(y) ? ' lata' : ' lat');
};
/* Polish plural: plural(5, 'obiekt', 'obiekty', 'obiektów') */
PN.plural = (n, one, few, many) => { n = Math.abs(Math.round(n)); if (n === 1) return one; const d = n % 10, h = n % 100; return d >= 2 && d <= 4 && (h < 10 || h >= 20) ? few : many; };
PN.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Tiny event bus between engine and UI. */
PN.bus = {
  h: {},
  on(ev, fn) { (this.h[ev] = this.h[ev] || []).push(fn); },
  emit(ev, a) { (this.h[ev] || []).forEach((f) => { try { f(a); } catch (e) { console.error(e); } }); },
};
