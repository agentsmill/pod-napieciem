'use strict';
/* Pod Napięciem — simulation: game state, building rules, monthly dispatch & economy. */
(function () {
  const PN = window.PN;
  const K = 20000;              // flow cost offset (> any value of lost load)
  const SAMPLES = [1, 4, 7, 10, 13, 16, 19, 22]; // hours; each sample stands for 3 h
  const VOLL = { city: 10000, dc: 12000, industry: 8000, mine: 8000, rail: 9000, military: 9000, tram: 9000 };
  PN.SAMPLES = SAMPLES;

  const ym = (G) => G.y + G.m / 12;
  PN.ym = ym;
  const thermal = (t) => PN.TECH[t] && PN.TECH[t].dispatch === 'thermal';

  /* ------------------------------------------------------------------ setup */
  PN.newGame = function (code) {
    const sc = PN.SCEN[code];
    const geo = window['PN_GEO_' + code];
    const places = window['PN_PLACES_' + code] || PN.FALLBACK_PLACES[code];
    const map = PN.buildMap(sc, geo, places);
    const G = {
      code, sc, map, places,
      y: sc.start.year, m: sc.start.month - 1, months: 0,
      money: sc.money, debt: 0, rep: 60,
      nodes: [], lines: [], byId: {}, nextId: 1,
      cities: [], borders: [], offers: [], ippOffers: [], ippScope: null, ippStats: { offered: 0, accepted: 0, declined: 0 },
      unlocked: {}, rules: {}, terr: {}, regime: code === 'PL' ? 'concession' : 'private',
      fx: { fuel: {}, derate: {}, subsidy: {}, demand: [], freezeUntil: 0, hydro: null, windLull: null },
      lambda: 0.03, prosumerMW: 0, prosumer: null,
      fired: {}, missions: {}, news: [], hist: [], months12: [], stats: null, wx: null,
      settings: { autoDist: true, pauseOnEvents: true },
      seed: (Math.random() * 1e9) | 0, over: false, capexYear: 0, capexPrev: 0,
    };
    PN.G = G;
    G.rnd = PN.rng(G.seed);
    // cities
    (places.cities || []).forEach((c, k) => {
      const t = map.toTile(c.lon, c.lat);
      if (t[0] < 0 || t[1] < 0 || t[0] >= map.W || t[1] >= map.H) return;
      let ti = map.idx(Math.floor(t[0]), Math.floor(t[1]));
      if (ti < 0 || map.country[ti] !== map.homeIdx || map.terr[ti] === PN.TERR.SEA || map.terr[ti] === PN.TERR.LAKE) {
        // coastal city on a water tile: move it onto the nearest home land tile, so the player can click and build in it
        let best = -1, bd = 9, bx = 0, by = 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          const x0 = Math.floor(t[0]) + dx, y0 = Math.floor(t[1]) + dy, j = map.idx(x0, y0);
          if (j < 0 || map.country[j] !== map.homeIdx || map.terr[j] === PN.TERR.SEA || map.terr[j] === PN.TERR.LAKE) continue;
          const d = Math.hypot(PN.clamp(t[0], x0, x0 + 1) - t[0], PN.clamp(t[1], y0, y0 + 1) - t[1]);
          if (d < bd) { bd = d; best = j; bx = x0; by = y0; }
        }
        if (best < 0) return; ti = best;
        t[0] = PN.clamp(t[0], bx + 0.2, bx + 0.8); t[1] = PN.clamp(t[1], by + 0.2, by + 0.8);
      }
      const n = addNode(G, { type: 'city', x: t[0], y: t[1], name: c.name, ci: k });
      Object.assign(n, { src: c, region: map.region[ti], eU: 0, eR: 0, distCap: 0, ruralLvl: 0, built: true, pop: 0, popU: 0, popR: 0, dU: 0, dR: 0, served: 1, servedPk: 0, demPk: 0 });
      G.cities.push(n);
    });
    PN.assignDistricts(map, G.cities, code === 'PL' ? 70 : 260);
    G.cities.forEach((c) => { c.ruralShare = c.ruralShare || 0; });
    G.events = (window['PN_EVENTS_' + code] || []).slice().sort((a, b) => (a.date < b.date ? -1 : 1));
    updateCities(G, true);
    syncBorders(G);
    G.wx = weather(G);
    G.stats = emptyStats();
    return G;
  };

  function addNode(G, o) {
    const n = Object.assign({ id: G.nextId++, links: [] }, o);
    G.nodes.push(n); G.byId[n.id] = n; return n;
  }
  function addLine(G, o) {
    const l = Object.assign({ id: G.nextId++, flow: 0, load: 0, avg: 0, out: 0 }, o);
    G.lines.push(l); G.byId[l.id] = l;
    G.byId[l.a].links.push(l.id); G.byId[l.b].links.push(l.id);
    return l;
  }
  PN.addNode = addNode;

  PN.news = function (G, text, kind, extra) {
    G.news.unshift(Object.assign({ y: G.y, m: G.m, text, kind: kind || 'info' }, extra || {}));
    if (G.news.length > 120) G.news.length = 120;
    PN.bus.emit('news', G.news[0]);
  };

  /* --------------------------------------------------------------- queries */
  PN.cityName = function (c, year) {
    const names = c.src && c.src.names;
    if (names) for (const nm of names.slice().sort((a, b) => a.until - b.until)) if (year < nm.until) return nm.name;
    return c.name;
  };
  PN.cityRadius = (pop, T) => Math.max(0.5, (3 + 11 * Math.sqrt(Math.max(0, pop) / 1e6)) / T);
  PN.regionOpen = function (G, region) {
    if (!region) return true;
    if (region === 1) return !!G.terr.pl_1920 || ym(G) >= 1920.1;
    if (region === 2) return !!G.terr.pl_1922_silesia || ym(G) >= 1922.5;
    if (region === 3) return !!G.terr.pl_1945 || ym(G) >= 1945.4;
    return true;
  };
  PN.cityOwned = (G, c) => c.pop > 0 && PN.regionOpen(G, c.region);

  PN.techAvail = function (G, id) {
    const t = PN.TECH[id]; if (!t) return false;
    const y = ym(G), w = PN.techWindows(t, G.code);
    for (const [a, b] of w) if (y >= a && (b == null || y < b)) return true;
    if (G.unlocked[id] && w.length) { const last = w[w.length - 1]; if (last[1] == null || y < last[1]) return true; }
    return false;
  };
  PN.techSoon = function (G, id) { const t = PN.TECH[id]; const w = PN.techWindows(t, G.code); const y = ym(G); for (const [a] of w) if (a > y) return a; return null; };
  /* technologies arrive with history: the player sees them only once they exist */
  PN.TECH_ALL = () => PN.GEN_ORDER.concat(PN.STORE_ORDER, PN.LINE_ORDER, ['substation'], PN.RES_ORDER);
  function discoverTech(G) {
    const first = !G.techSeen; if (first) { G.techSeen = {}; G.techGone = {}; }
    const fresh = [], y = ym(G);
    for (const id of PN.TECH_ALL()) {
      if (!PN.TECH[id]) continue;
      const av = PN.techAvail(G, id), seen = G.techSeen[id] != null;
      if (av && (!seen || G.techGone[id])) { G.techSeen[id] = first ? 0 : y; delete G.techGone[id]; if (!first) fresh.push(id); }
      else if (!av && seen) G.techGone[id] = true;
    }
    if (fresh.length) { for (const id of fresh) PN.news(G, 'Nowa technologia: ' + PN.TECH[id].name + '.', 'tech', { tech: id }); PN.bus.emit('tech', fresh); }
    return fresh;
  }
  PN.discoverTech = discoverTech;
  PN.techIsNew = (G, id) => !!(G.techSeen && G.techSeen[id] > 0 && ym(G) - G.techSeen[id] < 3);
  /* only events that change the rules of the game stop the clock; the rest arrive as clippings */
  PN.eventImportant = (ev) => ev.major === true || (ev.effects || []).some((e) => ['damage', 'territory', 'regime', 'freeze', 'outage', 'ipp'].indexOf(e.type) >= 0) || ['war', 'crisis', 'blackout'].indexOf(ev.icon) >= 0;
  /* can a mine be sunk on this deposit today? */
  const DEP_TECH = { coal: 'coal_mine', lignite: 'lignite_mine', gas: 'gas_well' };
  PN.depositState = function (G, d) {
    const tech = DEP_TECH[d.kind];
    if (!tech) return { ok: false, info: true };
    if (!PN.techAvail(G, tech)) return { ok: false, why: 'tech' };
    if (d.from && ym(G) < d.from - 15) return { ok: false, why: 'unknown', year: d.from };
    return { ok: true, tech };
  };
  /* map layers show up together with the technology that needs them */
  PN.layerAvail = function (G, kind) {
    const seen = (id) => PN.techAvail(G, id) || !!(G.techSeen && G.techSeen[id] != null);
    if (kind === 'wind') return seen('wind') || seen('wind_offshore');
    if (kind === 'solar') return seen('solar') || seen('csp');
    if (kind === 'res') return PN.RES_ORDER.some(seen) || seen('hydro_dam');
    return true;
  };

  function subsidy(G, target) { const s = G.fx.subsidy[target]; return s && s.until > ym(G) ? s.mult : 1; }
  function catOf(id) {
    if (id === 'wind' || id === 'wind_offshore') return 'wind';
    if (id === 'solar' || id === 'csp') return 'solar';
    if (id === 'nuclear' || id === 'smr') return 'nuclear';
    if (id === 'battery' || id === 'pumped') return 'storage';
    if (PN.TECH[id] && PN.TECH[id].cat === 'line') return 'grid';
    if (id === 'substation') return 'grid';
    return null;
  }

  PN.nodeAt = function (G, tx, ty, r) {
    r = r || 0.62; let best = null, bd = r;
    for (const n of G.nodes) {
      if (n.type === 'city' && !(n.pop > 0)) continue;
      const d = Math.hypot(n.x - tx, n.y - ty);
      const rr = n.type === 'city' ? Math.max(r, Math.min(1.1, n.rad * 0.6)) : r;
      if (d < rr && (!best || d < bd)) { best = n; bd = d; }
    }
    return best;
  };
  function occupied(G, tx, ty) {
    for (const n of G.nodes) {
      if (n.type === 'city') continue;
      if (Math.floor(n.x) === tx && Math.floor(n.y) === ty) return n;
    }
    return null;
  }
  function nearestCity(G, x, y, maxD, ownedOnly) {
    let best = null, bd = maxD == null ? 1e9 : maxD;
    for (const c of G.cities) {
      if (!(c.pop > 0)) continue; if (ownedOnly && !PN.cityOwned(G, c)) continue;
      const d = Math.hypot(c.x - x, c.y - y); if (d < bd) { bd = d; best = c; }
    }
    return best;
  }
  PN.nearestCity = nearestCity;
  /* the city whose built-up edge is closest: a big city claims the tiles around it before a hamlet next door does */
  function cityAtTile(G, x, y) {
    let best = null, bd = 1e9;
    for (const c of G.cities) {
      if (!(c.pop > 0)) continue;
      const d = Math.hypot(c.x - x, c.y - y) - (c.rad || 0.5); if (d < bd) { bd = d; best = c; }
    }
    return best;
  }
  PN.cityAtTile = cityAtTile;
  function nearestDeposit(G, x, y, kind) {
    const M = G.map; let best = null, bd = 1e9;
    for (const d of M.deposits) {
      if (d.kind !== kind || (d.from && d.from > ym(G) + 0.01 && kind !== 'coal')) continue;
      const dd = Math.hypot(d.x - x, d.y - y) - (d.r || 0); if (dd < bd) { bd = dd; best = d; }
    }
    return best ? { d: best, km: Math.max(0, bd) * M.T } : null;
  }
  PN.nearestDeposit = nearestDeposit;
  function depDistKm(G, tx, ty, bit) { // distance (km) from tile to nearest tile with resource bit
    const M = G.map; let bd = 1e9;
    const R = Math.ceil(60 / M.T) + 2;
    for (let y = ty - R; y <= ty + R; y++) for (let x = tx - R; x <= tx + R; x++) {
      const i = M.idx(x, y); if (i < 0 || !(M.res[i] & bit)) continue;
      const d = Math.hypot(x - tx, y - ty); if (d < bd) bd = d;
    }
    return bd * M.T;
  }

  /* ------------------------------------------------------------- placement */
  PN.canPlace = function (G, id, tx, ty, opts) {
    const M = G.map, t = PN.TECH[id], y = ym(G);
    const r = { ok: false, why: '', info: [], id };
    const i = M.idx(tx, ty);
    if (i < 0) { r.why = 'Poza mapą.'; return r; }
    if (!PN.techAvail(G, id)) { const s = PN.techSoon(G, id); r.why = s ? 'Technologia dostępna od ' + Math.floor(s) + ' r.' : 'Technologia niedostępna w tej epoce.'; return r; }
    if (G.fx.freezeUntil > y) { r.why = 'Wstrzymane inwestycje (wojna lub okupacja).'; return r; }
    const terr = M.terr[i];
    const sea = terr === PN.TERR.SEA, lakeT = terr === PN.TERR.LAKE;
    if (id === 'wind_offshore') {
      if (!sea) { r.why = 'Morska farma wymaga akwenu morskiego.'; return r; }
      if (M.nearLand[i] !== M.homeIdx || M.distLand[i] * M.T > 95) { r.why = 'Poza własną strefą ekonomiczną (maks. ok. 90 km od brzegu).'; return r; }
    } else {
      if (sea || lakeT) { r.why = 'Nie da się budować na wodzie.'; return r; }
      if (M.country[i] !== M.homeIdx) { r.why = 'To terytorium innego państwa.'; return r; }
      if (!PN.regionOpen(G, M.region[i])) { r.why = M.region[i] === 3 ? 'Do 1945 r. te ziemie należą do Niemiec.' : 'Ten obszar jeszcze nie należy do Polski.'; return r; }
      if (M.prot[i] && M.prot[i] <= y && id !== 'substation') { r.why = 'Park narodowy – budowa zabroniona.'; return r; }
    }
    const occ = occupied(G, tx, ty);
    if (occ) { r.why = 'Pole zajęte: ' + occ.name + '.'; return r; }
    const city = cityAtTile(G, tx + 0.5, ty + 0.5);
    const cityD = city ? Math.hypot(city.x - tx - 0.5, city.y - ty - 0.5) : 1e9;
    if (city && cityD < 0.5 && id !== 'steam_dc') { r.why = 'W centrum miasta ' + city.name + ' brak miejsca.'; return r; }
    const inCity = city && cityD <= Math.max(city.rad + 0.35, M.T >= 20 && city.pop > 150000 ? 0.85 : 0); // US tiles are 26 km: metro areas span neighbouring tiles
    r.city = inCity ? city : null;
    let units = 1, unitMW = PN.unitMW(t, y, G.code) || 0;
    let mult = 1;
    if (terr === PN.TERR.MOUNT) mult *= 1.3; else if (terr === PN.TERR.MARSH) mult *= 1.2; else if (terr === PN.TERR.HILL) mult *= 1.08;
    if (inCity && t.cat !== 'node') mult *= 1.25;

    const waterKm = (big) => (big ? M.distBig[i] : M.distWater[i]) * M.T;
    switch (t.place || (t.cat === 'node' ? 'land' : 'land')) {
      case 'city':
        if (!city || !PN.cityOwned(G, city) || cityD > city.rad + 0.6) { r.why = 'Elektrownia parowa DC musi stać w mieście (sieć 110 V sięga ok. 1,5 km).'; return r; }
        r.city = city; break;
      case 'river': {
        const cls = M.river[i]; const site = M.site[i] >= 0 ? M.hydro[M.site[i]] : null;
        if (!cls && !(site && site.type === 'ror')) { r.why = 'Mała elektrownia wodna musi stać na rzece.'; return r; }
        r.maxUnits = Math.max(1, (cls || 2) * 2); r.info.push('Rzeka: ' + ['', 'mała', 'średnia', 'duża'][cls || 2]);
        unitMW *= cls === 3 ? 1.5 : cls === 1 ? 0.6 : 1;
        break;
      }
      case 'site_dam': case 'site_pumped': {
        const s = M.site[i] >= 0 ? M.hydro[M.site[i]] : null;
        const want = t.place === 'site_dam' ? ['dam', 'ror'] : ['pumped'];
        if (!s || want.indexOf(s.type) < 0) { r.why = t.place === 'site_dam' ? 'Zaporę zbudujesz tylko w dogodnym miejscu (punkty z falą na mapie).' : 'Elektrownię szczytowo-pompową zbudujesz tylko przy odpowiednim spadku terenu (zaznaczone miejsca).'; return r; }
        r.site = s; r.info.push('Lokalizacja: ' + s.name + (s.river ? ' (' + s.river + ')' : '') + ', potencjał ' + PN.mw(s.mw));
        r.maxUnits = Math.max(1, Math.round(s.mw / Math.max(unitMW, 1)));
        if (s.mw < unitMW) unitMW = s.mw;
        if (t.place === 'site_dam' && ym(G) < 1930) r.maxUnits = Math.max(1, Math.ceil(r.maxUnits * 0.35));
        break;
      }
      case 'lignite': {
        const km = depDistKm(G, tx, ty, PN.RES_BIT.lignite);
        if (km > 26) { r.why = 'Węgiel brunatny trzeba spalać przy odkrywce (do ok. 25 km od złoża).'; return r; }
        r.info.push('Złoże węgla brunatnego: ' + PN.nf(km, 0) + ' km');
        const mine = G.nodes.some((n) => n.type === 'mine' && n.tech === 'lignite_mine' && Math.hypot(n.x - tx - 0.5, n.y - ty - 0.5) * M.T <= 32);
        if (!mine) r.info.push('Uwaga: bez odkrywki obok elektrownia nie ruszy (Zasoby → Kopalnia odkrywkowa)');
        break;
      }
      case 'land_gas': {
        const reach = PN.curve(G.sc.gasReach, y);
        const gd = nearestDeposit(G, tx + 0.5, ty + 0.5, 'gas');
        if (reach < 1500 && (!gd || gd.km > reach)) { r.why = 'Brak gazociągu: w tej epoce gaz jest dostępny tylko do ' + PN.nf(reach, 0) + ' km od złóż.'; return r; }
        break;
      }
      case 'wind': {
        if (terr === PN.TERR.MOUNT && M.elev[i] > 0.8) { r.why = 'Zbyt strome szczyty.'; return r; }
        const rule = G.rules.wind_distance_km || 0;
        if (rule >= 1) { // 10H: ten times the turbine height from any house – almost nothing qualifies
          const cd = city ? cityD * M.T - city.rad * M.T : 1e9;
          if (M.ruralW[i] > 0.5 || cd < 6) { r.why = 'Ustawa odległościowa (10H): za blisko zabudowań.'; return r; }
        } else if (rule > 0) { // relaxed rule (700 m)
          if (M.ruralW[i] > 1.3) { r.why = 'Za blisko gęstej zabudowy wsi (min. ' + PN.nf(rule * 1000, 0) + ' m).'; return r; }
        }
        if (inCity) { r.why = 'Za blisko miasta.'; return r; }
        break;
      }
      case 'sea': break;
      case 'solar': if (terr === PN.TERR.MOUNT) { r.why = 'Teren zbyt górzysty.'; return r; } break;
      case 'desert': if (M.solar[i] < 2000) { r.why = 'CSP wymaga nasłonecznienia powyżej 2000 kWh/m² (pustynie Południowego Zachodu).'; return r; } break;
      case 'geothermal': if (!(M.res[i] & PN.RES_BIT.geothermal)) { r.why = 'Elektrownia geotermalna tylko na polu geotermalnym.'; return r; } break;
      case 'deposit_coal': if (!(M.res[i] & PN.RES_BIT.coal)) { r.why = 'Kopalnię węgla kamiennego zbudujesz tylko na złożu (warstwa Zasoby).'; return r; } break;
      case 'deposit_lignite': if (!(M.res[i] & PN.RES_BIT.lignite)) { r.why = 'Odkrywkę zbudujesz tylko na złożu węgla brunatnego.'; return r; } break;
      case 'deposit_gas': if (!(M.res[i] & PN.RES_BIT.gas)) { r.why = 'Odwierty tylko na złożu gazu.'; return r; } break;
      default: break;
    }
    if (t.cat === 'res' && M.dep[i] >= 0) {
      const d = M.deposits[M.dep[i]];
      if (d && d.from && y < d.from - 15) { r.why = 'Złoże ' + d.name + ' nie jest jeszcze rozpoznane (wydobycie ruszyło historycznie w ' + d.from + ' r.).'; return r; }
    }
    if (t.water) {
      const lim = t.waterBig ? 20 : 30;
      const km = waterKm(!!t.waterBig);
      if (km > lim) { r.why = t.waterBig ? 'Elektrownia jądrowa potrzebuje dużej rzeki, jeziora lub morza (do ' + lim + ' km).' : 'Brak wody do chłodzenia (rzeka, jezioro lub morze do ' + lim + ' km).'; return r; }
    }
    if (id === 'nuclear' && inCity) { r.why = 'Za blisko miasta – wybierz miejsce poza zabudową.'; return r; }

    // site quality
    if (t.dispatch === 'wind') {
      const v = M.wind[i]; r.wind = v; r.cf = PN.windCF(v, y) * (id === 'wind_offshore' ? 1.05 : 1);
      r.info.push('Wiatr: ' + PN.nf(v, 1) + ' m/s → współczynnik wykorzystania ' + PN.pct(r.cf));
    }
    if (t.dispatch === 'solar') {
      const s = M.solar[i]; r.sun = s; r.cf = PN.solarCF(s, y, id === 'csp');
      r.info.push('Nasłonecznienie: ' + PN.nf(s, 0) + ' kWh/m² rocznie → wsp. wykorzystania ' + PN.pct(r.cf));
    }
    if (t.fuel === 'coal') {
      const fp = coalPriceAt(G, tx + 0.5, ty + 0.5);
      r.info.push('Węgiel z rynku: ' + PN.nf(fp.km, 0) + ' km transportu (+' + PN.pct(fp.extra / Math.max(0.01, fp.base)) + ' do ceny)');
    }
    if (t.cat === 'gen' || t.cat === 'store') {
      units = 1;
      const capex = PN.tv(t.capex, y, G.code) * subsidy(G, catOf(id) || '') * mult;
      r.unitMW = unitMW; r.units = units; r.capMW = unitMW * units;
      r.cost = capex * unitMW * 1000 * units;
      r.buildM = Math.round(PN.tv(t.build, y, G.code) * (G.rep < 30 ? 1.4 : 1));
      r.maxUnits = r.maxUnits || t.maxUnits || 4;
    } else if (t.cat === 'res') {
      const out = t.outputMt ? PN.tv(t.outputMt, y) * 1e6 : PN.tv(t.outputGJ, y);
      r.output = out; r.cost = out * PN.tv(t.capexPerT || t.capexPerGJ, y, G.code) * mult; r.buildM = t.build;
      const d = M.dep[i] >= 0 ? M.deposits[M.dep[i]] : null; if (d) { r.dep = d; r.info.push('Złoże: ' + d.name); }
    } else if (id === 'substation') {
      r.cost = PN.tv(t.cost, y) * subsidy(G, 'grid'); r.buildM = 0;
    }
    if (inCity && t.cat !== 'node') r.info.push('Podłączenie do sieci miejskiej (' + PN.cityName(city, y) + ') bez budowy linii');
    if (!(opts && opts.free) && G.money < r.cost) { r.why = 'Brakuje pieniędzy: potrzeba ' + PN.money(r.cost) + '.'; r.ok = false; r.poor = true; return r; }
    r.ok = true; return r;
  };

  PN.windCF = function (v, year) {
    const base = PN.curve([[3.5, 0.06], [4.5, 0.14], [5, 0.18], [5.5, 0.215], [6, 0.25], [6.5, 0.29], [7, 0.33], [7.5, 0.365], [8, 0.40], [8.5, 0.43], [9, 0.46], [9.5, 0.49], [10, 0.51], [11, 0.54]], v);
    return base * PN.curve([[1981, 0.55], [1990, 0.7], [2000, 0.8], [2010, 0.9], [2020, 1.0], [2030, 1.08], [2050, 1.12]], year);
  };
  PN.solarCF = function (ghi, year, csp) {
    if (csp) return PN.clamp((ghi - 1700) / 2000, 0.12, 0.42) * PN.curve([[1984, 0.75], [2010, 1.0]], year);
    return (ghi * 0.9 / 8760) * PN.curve([[1982, 0.75], [2000, 0.85], [2012, 0.95], [2018, 1.08], [2030, 1.15]], year);
  };

  function coalPriceAt(G, x, y) {
    const sc = G.sc, yr = ym(G), base = PN.curve(sc.fuel.coal, yr) * fuelMult(G, 'coal');
    const dep = nearestDeposit(G, x, y, 'coal');
    let km = dep ? dep.km : 600;
    let extra = (km * PN.curve(sc.rail, yr)) / PN.FUELS.coal.gj;
    if (sc.coalImport && yr >= sc.coalImport.from) {
      const p = G.map.toTile(sc.coalImport.lon, sc.coalImport.lat);
      const kmI = Math.hypot(p[0] - x, p[1] - y) * G.map.T;
      const exI = (kmI * PN.curve(sc.rail, yr)) / PN.FUELS.coal.gj + base * sc.coalImport.premium;
      if (exI < extra) { extra = exI; km = kmI; }
    }
    return { base, extra, price: base + extra, km };
  }
  function fuelMult(G, f) { const e = G.fx.fuel[f]; return e && e.until > ym(G) ? e.mult : 1; }

  function autoName(G, id, x, y, site, dep) {
    const t = PN.TECH[id];
    if (site) return (id === 'pumped' ? 'ESP ' : 'EW ') + site.name.replace(/^(EW|ESP|Elektrownia( wodna)?)\s+/i, '');
    if (dep && t.cat === 'res') { const b = { coal_mine: 'KWK ', lignite_mine: 'KWB ', gas_well: 'Odwierty ' }[id] + dep.name.replace(/^(Zagłębie|Złoże|Basen|Zagłębia)\s+/i, '').split(/[,(]/)[0].trim(); let n = b, k = 2; while (G.nodes.some((q) => q.name === n)) n = b + ' ' + k++; return n; }
    const c = cityAtTile(G, x, y);
    const pre = { steam_dc: 'Elektrownia miejska', coal: 'Elektrownia', lignite: 'Elektrownia', oil: 'Elektrownia olejowa', gas_ocgt: 'Turbiny gazowe', gas_ccgt: 'Elektrociepłownia gazowa', nuclear: 'Elektrownia jądrowa', smr: 'SMR', wind: 'Farma wiatrowa', wind_offshore: 'Morska farma', solar: 'Farma PV', csp: 'Elektrownia słoneczna', geothermal: 'Geotermia', biomass: 'Elektrownia na biomasę', battery: 'Magazyn energii', fusion: 'Elektrownia termojądrowa', hydro_small: 'MEW', substation: 'Stacja', coal_mine: 'Kopalnia', lignite_mine: 'Odkrywka', gas_well: 'Odwierty' }[id] || t.short;
    const base = pre + ' ' + (c ? PN.cityName(c, G.y) : '');
    let n = base, k = 2; const roman = ['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
    while (G.nodes.some((q) => q.name === n)) { n = base + ' ' + (roman[k] || k); k++; }
    return n;
  }

  PN.build = function (G, id, tx, ty) {
    const r = PN.canPlace(G, id, tx, ty); if (!r.ok) return { ok: false, why: r.why };
    const t = PN.TECH[id], y = ym(G);
    G.money -= r.cost; G.capexYear += r.cost;
    let n;
    const x = tx + 0.5, yy = ty + 0.5;
    if (id === 'substation') {
      n = addNode(G, { type: 'sub', tech: id, x, y: yy, name: autoName(G, id, x, yy), built: true, prog: 1, cost: r.cost, since: y });
    } else if (t.cat === 'res') {
      n = addNode(G, { type: 'mine', tech: id, x, y: yy, name: autoName(G, id, x, yy, null, r.dep), built: false, prog: 0, buildM: r.buildM, cost: r.cost, out: r.output, dep: r.dep ? r.dep.k : -1, since: y, powered: 1 });
    } else {
      n = addNode(G, {
        type: 'plant', tech: id, x, y: yy, name: autoName(G, id, x, yy, r.site), built: false, prog: 0, buildM: r.buildM,
        units: 1, unitMW: r.unitMW, cap: r.capMW, maxUnits: r.maxUnits, cost: r.cost, since: y, age: 0,
        eff: t.eff ? PN.tv(t.eff, y, G.code) : 1, cf: r.cf || 0, site: r.site ? r.site.k : -1, on: true,
        fgd: G.code === 'PL' ? y >= 1995 : y >= 1978, soc: 0, fuelOK: 1, fuelPrice: 0, mc: 0,
        hours: t.hours ? PN.tv(t.hours, y) : 0,
      });
    }
    if (r.city && n.type !== 'sub') linkLocal(G, n, r.city);
    PN.bus.emit('built', n);
    return { ok: true, node: n, cost: r.cost };
  };
  function linkLocal(G, n, city) {
    if (!PN.cityOwned(G, city)) return;
    addLine(G, { a: n.id, b: city.id, type: 'local', cap: 1e6, km: Math.hypot(n.x - city.x, n.y - city.y) * G.map.T, lossK: 0, built: true, prog: 1, local: true, cost: 0 });
  }

  /* expand an existing plant by one unit */
  PN.unitCost = function (G, n) {
    const t = PN.TECH[n.tech], y = ym(G);
    return PN.tv(t.capex, y, G.code) * subsidy(G, catOf(n.tech) || '') * n.unitMW * 1000 * 1.05;
  };
  PN.addUnit = function (G, n) {
    if (n.owner === 'ipp') return false;
    if (!n.built || n.pending || n.units >= n.maxUnits) return false;
    const c = PN.unitCost(G, n); if (G.money < c) return false;
    if (G.fx.freezeUntil > ym(G)) return false;
    G.money -= c; G.capexYear += c; n.cost += c;
    n.pending = { prog: 0, buildM: Math.max(6, Math.round(PN.tv(PN.TECH[n.tech].build, ym(G), G.code) * 0.7)) };
    return true;
  };
  PN.retrofitCost = (G, n) => n.cap * 1000 * (n.tech === 'lignite' ? 170 : 150);
  PN.retrofit = function (G, n) { const c = PN.retrofitCost(G, n); if (n.owner === 'ipp' || n.fgd || G.money < c) return false; G.money -= c; G.capexYear += c; n.fgd = true; return true; };
  PN.lifeExtCost = (G, n) => n.cost * 0.3;
  PN.extendLife = function (G, n) { const c = PN.lifeExtCost(G, n); if (n.owner === 'ipp' || G.money < c) return false; G.money -= c; G.capexYear += c; n.age = Math.max(0, n.age - 20); n.eff = Math.max(n.eff, (PN.TECH[n.tech].eff ? PN.tv(PN.TECH[n.tech].eff, ym(G) - 10, G.code) : 1)); return true; };
  PN.repairCost = (G, o) => (o.cost || 0) * (o.a ? 0.25 : 0.3);
  PN.repair = function (G, o) { const c = PN.repairCost(G, o); if (!o.dmg || G.money < c) return false; G.money -= c; o.dmg = false; return true; };

  /* ------------------------------------------------------------------ lines */
  PN.lineCheck = function (G, type, a, b) {
    const t = PN.TECH[type], M = G.map, y = ym(G);
    const r = { ok: false, why: '' };
    if (!PN.techAvail(G, type)) { const s = PN.techSoon(G, type); r.why = s ? 'Dostępna od ' + Math.floor(s) + ' r.' : 'Niedostępna w tej epoce.'; return r; }
    if (G.fx.freezeUntil > y) { r.why = 'Wstrzymane inwestycje (wojna lub okupacja).'; return r; }
    if (!a || !b || a === b) { r.why = 'Wybierz dwa różne punkty.'; return r; }
    for (const n of [a, b]) {
      if (n.type === 'city' && !PN.cityOwned(G, n)) { r.why = PN.cityName(n, G.y) + ' nie należy jeszcze do Twojego obszaru.'; return r; }
      if (n.type !== 'city' && n.type !== 'border') { const i = M.idx(Math.floor(n.x), Math.floor(n.y)); if (i >= 0 && M.country[i] === M.homeIdx && !PN.regionOpen(G, M.region[i])) { r.why = 'Ten obiekt leży na ziemiach, które nie należą jeszcze do Polski.'; return r; } }
    }
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    const km = d * M.T * 1.08;
    const steps = Math.max(2, Math.ceil(d * 4));
    let seaN = 0, foreignN = 0, mult = 0, protN = 0;
    for (let s = 0; s <= steps; s++) {
      const x = a.x + (dx * s) / steps, yy = a.y + (dy * s) / steps;
      const i = M.idx(Math.floor(x), Math.floor(yy)); if (i < 0) { foreignN++; continue; }
      const tr = M.terr[i];
      let f = 1;
      if (tr === PN.TERR.SEA) { seaN++; f = t.seaMult || 1.6; }
      else if (tr === PN.TERR.LAKE) f = 1.5;
      else if (M.country[i] !== M.homeIdx) foreignN++;
      else if (tr === PN.TERR.MOUNT) f = 1.8; else if (tr === PN.TERR.HILL) f = 1.2; else if (tr === PN.TERR.MARSH) f = 1.4;
      if (tr !== PN.TERR.SEA && M.forest[i]) f *= 1.12;
      if (M.prot[i] && M.prot[i] <= y) { protN++; f *= 1.6; }
      mult += f;
    }
    mult /= steps + 1;
    const seaFrac = seaN / (steps + 1);
    if (!t.sea && seaN > 1) { r.why = 'Linia napowietrzna nie przejdzie przez morze. Użyj kabla morskiego lub HVDC.'; return r; }
    if (foreignN > 2 && a.type !== 'border' && b.type !== 'border') { r.why = 'Trasa biegnie przez obce terytorium.'; return r; }
    if (foreignN > 6) { r.why = 'Trasa biegnie przez obce terytorium.'; return r; }
    const parallel = G.lines.filter((l) => !l.local && ((l.a === a.id && l.b === b.id) || (l.a === b.id && l.b === a.id))).length;
    if (parallel >= 4) { r.why = 'Na tej trasie są już cztery linie.'; return r; }
    const cap = PN.tv(t.cap, y), lossK = PN.tv(t.loss, y);
    const cost = (km * PN.tv(t.cost, y) * mult + (t.fixed ? PN.tv(t.fixed, y) : 0)) * subsidy(G, 'grid');
    const buildM = Math.round(PN.clamp(3 + (km / 30) * (1 + (cap > 500 ? 1 : 0)), 3, 54) * (G.rep < 30 ? 1.3 : 1));
    Object.assign(r, { km, cap, lossK, cost, buildM, seaFrac, protN, fullLoss: lossK * km + (t.convLoss || 0) });
    if (km > t.maxKm * 1.6) { r.why = 'Za długa dla tego napięcia (maks. ok. ' + Math.round(t.maxKm * 1.6) + ' km, rozsądnie do ' + t.maxKm + ' km). Wybierz wyższe napięcie.'; return r; }
    if (G.money < cost) { r.why = 'Brakuje pieniędzy: potrzeba ' + PN.money(cost) + '.'; r.poor = true; return r; }
    r.ok = true; return r;
  };
  PN.buildLine = function (G, type, a, b) {
    const r = PN.lineCheck(G, type, a, b); if (!r.ok) return r;
    G.money -= r.cost; G.capexYear += r.cost;
    if (r.protN) G.rep = Math.max(0, G.rep - 1);
    const l = addLine(G, { a: a.id, b: b.id, type, cap: r.cap, km: r.km, lossK: r.lossK, built: false, prog: 0, buildM: r.buildM, cost: r.cost, sea: r.seaFrac > 0.2, since: ym(G) });
    PN.bus.emit('built', l);
    return { ok: true, line: l, cost: r.cost };
  };
  /* node under cursor or a new substation */
  PN.nodeOrSub = function (G, tx, ty, wx, wy) {
    const n = PN.nodeAt(G, wx, wy, 0.7); if (n) return { node: n };
    const r = PN.canPlace(G, 'substation', tx, ty);
    return { node: null, can: r };
  };

  PN.demolish = function (G, o) {
    if (!o) return;
    if (o.a) { // line
      G.lines = G.lines.filter((l) => l !== o);
      for (const id of [o.a, o.b]) { const n = G.byId[id]; if (n) n.links = n.links.filter((x) => x !== o.id); }
      delete G.byId[o.id];
    } else {
      if (o.type === 'city') return;
      if (o.built && G.y - (o.since | 0) < 5 && o.cost) G.money += o.cost * 0.15;
      for (const lid of o.links.slice()) { const l = G.byId[lid]; if (l) PN.demolish(G, l); }
      G.nodes = G.nodes.filter((n) => n !== o); delete G.byId[o.id];
      if (o.type === 'border') o.removed = true;
    }
    PN.bus.emit('demolished', o);
  };

  /* -------------------------------------------------------- city upgrades */
  PN.distStepMW = (c) => Math.max(0.05, Math.max(c.potU || 0, c.distCap) * 0.35);
  PN.distCostFor = (G, mw) => mw * 1000 * PN.curve(G.sc.distCost, ym(G));
  PN.upgradeDist = function (G, c, mw) {
    mw = mw || PN.distStepMW(c); const cost = PN.distCostFor(G, mw);
    if (G.money < cost) return false; G.money -= cost; G.capexYear += cost; c.distCap += mw; return true;
  };
  PN.ruralCostFor = (G, c) => c.popR * 0.25 * PN.curve(G.sc.ruralCost, ym(G)) * subsidy(G, 'rural');
  /* national programme: one more stage in every energised district */
  PN.ruralAllCost = function (G) { let s = 0; for (const c of G.cities) if (PN.cityOwned(G, c) && c.energized && c.ruralLvl < 4 && c.popR > 0) s += PN.ruralCostFor(G, c); return s; };
  PN.ruralAll = function (G) {
    const cost = PN.ruralAllCost(G); if (cost <= 0 || G.money < cost) return false;
    for (const c of G.cities) if (PN.cityOwned(G, c) && c.energized && c.ruralLvl < 4 && c.popR > 0) { const k = PN.ruralCostFor(G, c); G.money -= k; G.capexYear += k; c.ruralLvl++; }
    return true;
  };
  PN.ruralUp = function (G, c) {
    if (c.ruralLvl >= 4) return false; const cost = PN.ruralCostFor(G, c);
    if (G.money < cost) return false; G.money -= cost; G.capexYear += cost; c.ruralLvl++; return true;
  };

  /* --------------------------------------------------------------- finance */
  PN.creditLimit = function (G) {
    const rev = G.months12.reduce((s, m) => s + m.rev, 0);
    return Math.max(G.sc.money * 2.5, rev * 3, assetValue(G) * 0.5);
  };
  function assetValue(G) { let v = 0; for (const n of G.nodes) if (n.built && n.cost) v += n.cost * Math.max(0.2, 1 - (n.age || 0) / 60); for (const l of G.lines) if (l.built && l.cost) v += l.cost * 0.7; return v; }
  PN.assetValue = assetValue;
  const activeFx = (list, y) => (Array.isArray(list) ? list : list ? [list] : []).filter((e) => e && e.until > y);
  PN.carbonAdder = (G) => activeFx(G.fx.carbon, ym(G)).reduce((a, e) => a + (e.price || 0), 0);
  PN.co2Price = (G) => PN.curve(G.sc.co2, ym(G)) + PN.carbonAdder(G);
  /* ESG: lenders price in climate risk – the more of the energy comes from fossil fuels, the dearer the credit */
  PN.esgPremium = (G) => { const e = activeFx(G.fx.esg, ym(G)).pop(); return e ? Math.max(0, e.premium || 0) * (1 - PN.helpers(G).cleanShare()) : 0; };
  PN.loanRate = (G) => PN.curve(G.sc.interest, ym(G)) * (G.regime === 'state' ? 0.6 : 1) + 0.015 + PN.esgPremium(G);
  PN.takeLoan = function (G, amt) { const room = PN.creditLimit(G) - G.debt; amt = Math.min(amt, room); if (amt <= 0) return 0; G.debt += amt; G.money += amt; return amt; };
  PN.repay = function (G, amt) { amt = Math.min(amt, G.debt, G.money); if (amt <= 0) return 0; G.debt -= amt; G.money -= amt; return amt; };

  /* ---------------------------------------------------------------- cities */
  function updateCities(G, init) {
    const sc = G.sc, y = ym(G), places = G.places;
    const cpop = places.country && places.country.pop;
    let sumCities = 0;
    for (const c of G.cities) {
      c.pop = PN.curve(c.src.pop, y) * (c.src.founded && y < c.src.founded ? 0 : 1);
      c.rad = PN.cityRadius(c.pop, G.map.T);
      if (PN.regionOpen(G, c.region) || true) sumCities += c.pop;
    }
    const total = cpop ? PN.curve(cpop, y) : sumCities * 2;
    const rural = Math.max(total * 0.15, total - sumCities);
    G.ruralTotal = rural;
    const dpc = PN.curve(sc.dpc, y), sU = PN.curve(sc.satUrban, y), sR = PN.curve(sc.satRural, y);
    G.dpc = dpc; G.satU = sU; G.satR = sR;
    for (const c of G.cities) {
      c.popU = c.pop; c.popR = rural * c.ruralShare;
      c.potU = (c.popU * sU * dpc) / 1e6; c.potR = (c.popR * Math.min(sR, c.ruralLvl * 0.25) * dpc) / 1e6;
      c.dU = (c.popU * c.eU * dpc) / 1e6; c.dR = (c.popR * c.eR * dpc) / 1e6;
    }
  }

  /* ----------------------------------------------------------------- borders */
  function syncBorders(G) {
    const y = ym(G);
    for (const b of G.places.borders || []) {
      if (G.borders.some((x) => x.bid === b.id)) continue;
      if ((b.from || 9999) > y) continue;
      addBorder(G, b.name, b.lat, b.lon, b.mw || 500, b.id, b.note);
    }
  }
  /* big historical consumers from the places file (steelworks, smelters, data centres...) */
  const KIND = { steel: 'industry', chem: 'industry', aluminium: 'industry', copper: 'industry', refinery: 'industry', mine: 'industry', rail: 'rail', tram: 'tram', datacenter: 'datacenter', military: 'military' };
  function syncIndustry(G) {
    const y = ym(G); G.indDone = G.indDone || {};
    for (const it of G.places.industry || []) {
      const key = it.id || it.name;
      if (G.indDone[key]) { if (it.to && y >= it.to) { const n = G.nodes.find((q) => q.indKey === key); if (n && !n.closed) { n.closed = true; n.mwTab = [[0, 0]]; PN.news(G, 'Zamknięto: ' + n.name + '.', 'info'); } } continue; }
      if ((it.from || 9999) > y) continue;
      if (it.to && y >= it.to) { G.indDone[key] = true; continue; }
      const t = G.map.toTile(it.lon, it.lat);
      const ti = G.map.idx(Math.floor(t[0]), Math.floor(t[1]));
      if (ti >= 0 && G.map.country[ti] === G.map.homeIdx && !PN.regionOpen(G, G.map.region[ti])) continue; // wait until the land is ours
      G.indDone[key] = true;
      if (G.nodes.some((q) => q.type === 'load' && Math.hypot(q.x - t[0], q.y - t[1]) * G.map.T < 25 && (q.kind === (KIND[it.kind] || 'industry')))) continue; // already added by an event
      const tab = (it.mw || []).length ? it.mw.map(([yy, mw]) => [yy, mw]) : [[y, 50]];
      const n = addLoadNode(G, { name: it.name, lat: it.lat, lon: it.lon, mw: PN.curve(tab, y), kind: KIND[it.kind] || 'industry', premium: it.kind === 'datacenter' ? 0.2 : 0.05 });
      n.mwTab = tab; n.indKey = key; n.note = it.note;
      PN.news(G, 'Nowy duży odbiorca: ' + it.name + ' (' + PN.mw(PN.curve(tab, y)) + ').', 'deal', { node: n.id });
    }
  }
  function addBorder(G, name, lat, lon, mw, bid, note) {
    const t = G.map.toTile(lon, lat);
    if (t[0] < 0 || t[1] < 0 || t[0] >= G.map.W || t[1] >= G.map.H) return null;
    if (G.borders.some((x) => !x.removed && (x.bid === bid || Math.hypot(x.x - t[0], x.y - t[1]) * G.map.T < 30))) return null;
    const n = addNode(G, { type: 'border', x: t[0], y: t[1], name, mw, bid: bid || name, note, built: true, since: ym(G) });
    G.borders.push(n);
    PN.news(G, 'Nowy punkt wymiany z zagranicą: ' + name + ' (do ' + PN.mw(mw) + ').', 'grid');
    return n;
  }

  /* ---------------------------------------------------------------- weather */
  function weather(G) {
    const r = PN.rng(G.seed + G.months * 7919), mo = G.m;
    const g = () => { let s = 0; for (let k = 0; k < 6; k++) s += r(); return (s - 3) / Math.sqrt(0.5); };
    const season = G.code === 'PL' ? [1.25, 1.2, 1.15, 1.0, 0.85, 0.75, 0.72, 0.75, 0.9, 1.05, 1.2, 1.25][mo] : [1.15, 1.15, 1.2, 1.15, 1.0, 0.85, 0.75, 0.75, 0.85, 1.0, 1.1, 1.1][mo];
    let wind = season * Math.exp(g() * 0.3 - 0.045);
    if (G.fx.windLull && G.fx.windLull > ym(G)) wind *= 0.35;
    const windS = []; let w = 1; for (let s = 0; s < 8; s++) { w = 0.6 * w + 0.4 * Math.exp(g() * 0.35); windS.push(w); }
    const clear = PN.clamp(1 + g() * 0.18, 0.55, 1.4);
    const hydro = G.fx.hydro && G.fx.hydro.until > ym(G) ? G.fx.hydro.mult : 1;
    return { wind, windS, clear, hydro, seed: r() * 1000 };
  }
  function solarShape(G, s, lat) {
    const mo = G.m, h = SAMPLES[s];
    const decl = 23.44 * Math.sin((2 * Math.PI * (mo * 30.4 + 15 - 81)) / 365);
    const latR = (lat * Math.PI) / 180, dR = (decl * Math.PI) / 180;
    const ha = ((h - 12) * 15 * Math.PI) / 180;
    const el = Math.sin(latR) * Math.sin(dR) + Math.cos(latR) * Math.cos(dR) * Math.cos(ha);
    return Math.max(0, el);
  }
  PN.solarShape = solarShape;
  function solarNorm(G, lat) { // daily mean of shape for normalisation at this month/lat & annual mean
    let m = 0; for (let s = 0; s < 8; s++) m += solarShape(G, s, lat); m /= 8;
    let ann = 0; const mo0 = G.m;
    for (let mo = 0; mo < 12; mo++) { G.m = mo; let q = 0; for (let s = 0; s < 8; s++) q += solarShape(G, s, lat); ann += q / 8; }
    G.m = mo0; ann /= 12;
    return { day: m, ann };
  }

  /* demand shape */
  const PROF = {
    L: [0.10, 0.08, 0.20, 0.10, 0.12, 0.32, 1.0, 0.55],
    I: [0.45, 0.42, 0.80, 0.92, 0.88, 0.90, 1.0, 0.75],
    W: [0.62, 0.58, 0.82, 0.90, 0.88, 0.90, 1.0, 0.80],
    S: [0.62, 0.58, 0.75, 0.88, 0.97, 1.0, 0.95, 0.78],
  };
  const SEAS_W = [1.0, 0.98, 0.93, 0.86, 0.82, 0.81, 0.82, 0.82, 0.85, 0.9, 0.96, 1.0];
  const SEAS_S = [0.9, 0.86, 0.8, 0.76, 0.82, 0.93, 1.0, 0.99, 0.9, 0.8, 0.8, 0.88];
  function profile(G) {
    const y = ym(G);
    const wL = PN.clamp((1920 - y) / 15, 0, 1), wM = PN.clamp((y - 1945) / 25, 0, 1), wI = Math.max(0, 1 - wL - wM);
    const M = G.sc.loadProfile === 'summer' && y > 1960 ? PROF.S : PROF.W;
    const wS = G.sc.loadProfile === 'summer' ? PN.clamp((y - 1955) / 30, 0, 1) : 0;
    const seas = SEAS_W[G.m] * (1 - wS) + SEAS_S[G.m] * wS;
    const seasL = Math.pow(seas, 1 + wL * 1.5);
    return SAMPLES.map((_, s) => (PROF.L[s] * wL + PROF.I[s] * wI + M[s] * wM) * seasL);
  }
  PN.profile = profile;
  function demandMult(G, c) {
    let m = 1; const y = ym(G);
    for (const e of G.fx.demand) {
      if (e.until <= y) continue;
      if (!e.region) m *= e.mult;
      else { const d = Math.hypot(c.x - e.region.x, c.y - e.region.y); if (d <= e.region.r) m *= e.mult; }
    }
    return m;
  }

  /* ---------------------------------------------------------- fuel logistics */
  function fuelLogistics(G) {
    const y = ym(G), sc = G.sc, M = G.map;
    const plants = G.nodes.filter((n) => n.type === 'plant' && n.built && !n.dmg && thermal(n.tech));
    const mines = G.nodes.filter((n) => n.type === 'mine' && n.built && !n.dmg);
    for (const m of mines) { m.left = (m.out / 12) * (m.powered >= 0.7 ? 1 : 0.55); m.sold = 0; m.used = 0; }
    let mineCost = 0, mineRev = 0;
    for (const p of plants) {
      const t = PN.TECH[p.tech], f = t.fuel;
      const needGJ = (p.cap * 730 * Math.max(0.25, p.lastCF || 0.6) * 3.6) / Math.max(0.03, p.eff);
      let got = 0, cost = 0;
      const unitGJ = PN.FUELS[f] ? PN.FUELS[f].gj : 1;
      const mineTech = f === 'coal' ? 'coal_mine' : f === 'lignite' ? 'lignite_mine' : f === 'gas' ? 'gas_well' : null;
      if (mineTech) {
        const own = mines.filter((m) => m.tech === mineTech && m.left > 0).map((m) => ({ m, d: Math.hypot(m.x - p.x, m.y - p.y) * M.T })).sort((a, b) => a.d - b.d);
        for (const { m, d } of own) {
          if (f === 'lignite' && d > 32) continue;
          if (f === 'gas' && d > Math.max(80, PN.curve(sc.gasReach, y))) continue;
          const availGJ = mineTech === 'gas_well' ? m.left : m.left * unitGJ;
          const take = Math.min(needGJ - got, availGJ); if (take <= 0) continue;
          const tr = f === 'gas' ? 0.15 : (d * PN.curve(sc.rail, y)) / unitGJ;
          const ext = PN.tv(PN.TECH[mineTech].cost, y, G.code) / (mineTech === 'gas_well' ? 1 : unitGJ);
          cost += take * (ext + tr); got += take;
          m.left -= mineTech === 'gas_well' ? take : take / unitGJ; m.used += mineTech === 'gas_well' ? take : take / unitGJ;
          if (got >= needGJ - 1e-6) break;
        }
      }
      let fuelOK = 1, mp = 0;
      if (f === 'coal') mp = coalPriceAt(G, p.x, p.y).price;
      else if (f === 'lignite') mp = 0;
      else if (f === 'gas') mp = PN.curve(sc.fuel.gas, y) * fuelMult(G, 'gas') + (G.code === 'PL' && y < 1975 ? 0.3 : 0);
      else if (f === 'oil') mp = PN.curve(sc.fuel.oil, y) * fuelMult(G, 'oil');
      else if (f === 'biomass') mp = PN.curve(sc.fuel.biomass, y);
      if (got < needGJ) {
        if (f === 'lignite') fuelOK = needGJ > 0 ? got / needGJ : 0;
        else { cost += (needGJ - got) * mp; got = needGJ; }
      }
      p.fuelOK = fuelOK; p.fuelPrice = got > 0 ? cost / got : mp; p.fuelMarket = mp;
    }
    // surplus mine output is sold
    for (const m of mines) {
      const t = PN.TECH[m.tech], unitGJ = m.tech === 'gas_well' ? 1 : PN.FUELS[t.fuel].gj;
      const produced = m.used + (m.tech === 'lignite_mine' ? 0 : m.left);
      const ext = PN.tv(t.cost, y, G.code);
      mineCost += produced * ext * (m.tech === 'gas_well' ? 1 : 1);
      if (m.tech !== 'lignite_mine' && m.left > 0) {
        const mkt = m.tech === 'coal_mine' ? PN.curve(sc.fuel.coal, y) * fuelMult(G, 'coal') * unitGJ : PN.curve(sc.fuel.gas, y) * fuelMult(G, 'gas');
        m.sold = m.left; mineRev += m.left * mkt * 0.85;
      }
      m.lastOut = produced;
      // own fuel was already charged to plants at extraction cost; avoid double counting
      mineCost -= m.used * ext;
    }
    return { mineCost, mineRev };
  }

  /* ---------------------------------------------- where does the power go? */
  /* Proportional sharing (Bialek): power arriving at a node is a mix of everything that flowed in,
     and leaves (to consumers and onward lines) in the same proportions. The optimal flow has no
     cycles because every line has a positive cost, so a topological pass is enough. */
  function traceSample(G, act, idx, lines, lf, inj, outW, w) {
    const N = act.length, P = new Float64Array(N), deg = new Int32Array(N), inE = new Array(N), outE = new Array(N), edges = [];
    for (let k = 0; k < N; k++) P[k] = inj[k];
    for (let q = 0; q < lines.length; q++) {
      const f = lf[q]; if (!(Math.abs(f) > 1e-6)) continue;
      const a = idx.get(lines[q].a), b = idx.get(lines[q].b), from = f > 0 ? a : b, to = f > 0 ? b : a;
      edges.push([from, to, Math.abs(f)]); P[to] += Math.abs(f); deg[to]++;
      (inE[to] || (inE[to] = [])).push(edges.length - 1); (outE[from] || (outE[from] = [])).push(edges.length - 1);
    }
    const order = [], stack = []; for (let k = 0; k < N; k++) if (!deg[k]) stack.push(k);
    while (stack.length) { const k = stack.pop(); order.push(k); for (const ei of outE[k] || []) { const t = edges[ei][1]; if (--deg[t] === 0) stack.push(t); } }
    if (order.length < N) return;
    const comp = new Array(N);
    for (const k of order) {
      const c = new Map(), n = act[k];
      if (inj[k] > 1e-6) c.set(n.id, inj[k]);
      for (const ei of inE[k] || []) {
        const [from, , fw] = edges[ei], cf = comp[from]; if (!cf || !(P[from] > 0)) continue;
        const sh = fw / P[from]; for (const [src, mw] of cf) { const v = mw * sh; if (v > 1e-5) c.set(src, (c.get(src) || 0) + v); }
      }
      comp[k] = c;
      if (outW[k] > 1e-6 && P[k] > 0) {
        const sh = Math.min(1, outW[k] / P[k]); n._src = n._src || {};
        for (const [src, mw] of c) {
          const e = mw * sh * w; if (e <= 0) continue;
          n._src[src] = (n._src[src] || 0) + e;
          const sn = G.byId[src]; if (sn) { sn._dst = sn._dst || {}; sn._dst[n.id] = (sn._dst[n.id] || 0) + e; }
        }
      }
    }
  }
  function finishTrace(G) {
    const top = (o) => { if (!o) return null; const a = Object.keys(o).map((k) => [+k, o[k]]).filter((x) => x[1] > 0).sort((p, q) => q[1] - p[1]); const tot = a.reduce((s, x) => s + x[1], 0); return tot > 0 ? { tot, list: a.slice(0, 8) } : null; };
    for (const n of G.nodes) { n.srcTop = top(n._src); n.dstTop = top(n._dst); n._src = null; n._dst = null; }
  }
  /* lines that carry power towards (up) or away from (down) a node in the peak hour */
  PN.traceLines = function (G, node, dir) {
    const res = new Set(), seen = new Set([node.id]), q = [node.id];
    while (q.length) {
      const id = q.shift(), n = G.byId[id]; if (!n || !n.links) continue;
      for (const lid of n.links) {
        const l = G.byId[lid]; if (!l || !l.built || !(Math.abs(l.flow) > 1e-4)) continue;
        const into = (l.b === id && l.flow > 0) || (l.a === id && l.flow < 0);
        if ((dir === 'up') !== into) continue;
        res.add(l.id); const other = l.a === id ? l.b : l.a; if (!seen.has(other)) { seen.add(other); q.push(other); }
      }
    }
    return res;
  };

  /* ------------------------------------------------------------- dispatch */
  const mcf = new PN.MCF();
  function dispatch(G) {
    const y = ym(G), sc = G.sc, M = G.map, days = PN.DAYS[G.m], W8 = 3 * days;
    const co2p = PN.co2Price(G), np = PN.curve(sc.neighborPrice, y) * fuelMult(G, 'gas') ** 0.5;
    const prof = profile(G);
    for (const n of G.nodes) { n.gen = 0; n.servedE = 0; n.demE = 0; n.peakGen = 0; n.chg = 0; n.dis = 0; n.imp = 0; n.exp = 0; n.co2 = 0; n.servedPk = 0; n.demPk = 0; n.genS = null; n._src = null; n._dst = null; }
    const act = G.nodes.filter((n) => n.built && !n.dmg && (n.type !== 'city' || PN.cityOwned(G, n)) && n.on !== false);
    const idx = new Map(); act.forEach((n, k) => idx.set(n.id, k));
    const N = act.length, S = N, T = N + 1;
    const lines = G.lines.filter((l) => l.built && !l.dmg && !(l.out > y) && idx.has(l.a) && idx.has(l.b));
    const lat0 = (M.toLL(M.W / 2, M.H / 2))[1];
    const sn = solarNorm(G, lat0);
    const wx = G.wx;
    // per-node monthly prep
    let renewAvail = new Array(8).fill(0), demTot = new Array(8).fill(0);
    for (const n of act) {
      n.gen = 0; n.servedE = 0; n.demE = 0; n.peakGen = 0; n.chg = 0; n.dis = 0;
      if (n.type === 'plant') {
        const t = PN.TECH[n.tech];
        const units = n.units;
        // forced outages / refuelling
        let up = units;
        const rr = PN.rng(n.id * 977 + G.months * 13);
        if (t.dispatch === 'thermal' || t.dispatch === 'nuclear') {
          const pf = 0.035 + 0.0012 * n.age + (n.age > t.life ? 0.03 : 0);
          for (let u = 0; u < units; u++) if (rr() < pf) up--;
          if (t.dispatch === 'nuclear' && n.tech !== 'fusion') for (let u = 0; u < units; u++) if ((G.months + u * 6 + n.id) % 18 === 0) up--;
        }
        up = Math.max(0, up);
        const der = G.fx.derate[n.tech] && G.fx.derate[n.tech].until > y ? G.fx.derate[n.tech].mult : 1;
        n.availBase = n.unitMW * up * der * (t.dispatch === 'thermal' ? n.fuelOK : 1) * (n.age > t.life + 15 ? 0.85 : 1);
        if (t.dispatch === 'thermal') {
          const f = PN.FUELS[t.fuel];
          n.mc = (n.fuelPrice * 3.6) / n.eff + PN.tv(t.vom, y) + (co2p * f.co2 * 3.6) / n.eff;
        } else if (t.dispatch === 'nuclear') n.mc = PN.curve(sc.fuel[t.fuel === 'fusion' ? 'fusion' : 'uranium'], y) + PN.tv(t.vom, y);
        else n.mc = 0.5 + (PN.tv(t.vom, y) || 0);
        if (n.owner === 'ipp' && (t.dispatch === 'thermal' || t.dispatch === 'nuclear')) n.mc = n.ppa;
        for (let s = 0; s < 8; s++) {
          if (t.dispatch === 'wind') {
            const loc = 1 + 0.35 * (PN.vnoise(n.x / 12 + wx.seed, n.y / 12, 5) - 0.5);
            renewAvail[s] += Math.min(n.cap * 0.97, n.cap * n.cf * wx.wind * wx.windS[s] * loc);
          } else if (t.dispatch === 'solar') {
            const sh = solarShape(G, s, M.lat[M.idx(Math.floor(n.x), Math.floor(n.y))] || lat0);
            renewAvail[s] += Math.min(n.cap, (n.cap * n.cf * wx.clear * sh) / Math.max(0.05, sn.ann));
          }
        }
      }
    }
    // demand by sample
    for (const c of G.cities) {
      c.demS = new Array(8).fill(0);
      if (!idx.has(c.id)) continue;
      const mult = demandMult(G, c);
      const prosC = G.prosumerMW * (c.pop / Math.max(1, G.urbanPop || 1));
      for (let s = 0; s < 8; s++) {
        const pv = prosC * (solarShape(G, s, lat0) / Math.max(0.05, sn.ann)) * 0.11 * wx.clear;
        const u = Math.max(0, c.dU * prof[s] * mult - pv * 0.8), r = Math.max(0, c.dR * prof[s] * mult - pv * 0.2);
        c.demS[s] = u + r; c.capS = c.capS || []; c.capS[s] = Math.min(u, c.distCap) + r;
        demTot[s] += u + r;
      }
    }
    for (const n of act) if (n.type === 'load' || n.type === 'mine') {
      n.demS = [];
      const base = n.type === 'mine' ? (n.out * (n.tech === 'gas_well' ? PN.TECH.gas_well.kwhPerGJ : PN.tv(PN.TECH[n.tech].kwhPerT, y))) / 8760 / 1000 : loadMW(G, n);
      const shape = n.kind === 'datacenter' ? [0.92, 0.9, 0.92, 0.95, 0.97, 0.97, 0.95, 0.93] : n.kind === 'tram' ? [0.15, 0.2, 0.9, 0.8, 0.8, 0.9, 1.0, 0.6] : [0.75, 0.75, 0.95, 1.0, 1.0, 0.95, 0.9, 0.8];
      for (let s = 0; s < 8; s++) { n.demS[s] = base * shape[s]; if (n.energized) demTot[s] += n.demS[s]; }
    }
    // storage roles: discharge at the 3 highest net-load samples, charge at the 3 lowest
    const net = demTot.map((d, s) => d - renewAvail[s]);
    const order = net.map((v, s) => [v, s]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    const role = new Array(8).fill('idle'); order.slice(0, 3).forEach((s) => (role[s] = 'chg')); order.slice(5).forEach((s) => (role[s] = 'dis'));
    const flowF = sc.hydroFlow[G.m] * wx.hydro;
    for (const n of act) if (n.type === 'plant' && PN.TECH[n.tech].dispatch === 'storage') { n.E = n.cap * n.hours; if (n.soc == null || n.soc > n.E) n.soc = n.E * 0.5; }

    // per-line accumulators
    for (const l of lines) { l.fMax = 0; l.fPk = 0; l.fSum = 0; l.lossE = 0; }
    let lossE = 0, unservedE = 0, servedE = 0, demandE = 0, impE = 0, expE = 0, impCost = 0, expRev = 0, chgE = 0, cityServedE = 0, cityDemE = 0;
    const pkS = prof.indexOf(Math.max(...prof));
    const lam = G.lambda;
    for (let s = 0; s < 8; s++) {
      mcf.reset(N + 2);
      const le = [];
      for (const l of lines) {
        const a = idx.get(l.a), b = idx.get(l.b);
        const c = l.local ? 0.2 : 1 + l.km * l.lossK * 40 + (PN.TECH[l.type] && PN.TECH[l.type].convLoss ? 0.6 : 0);
        le.push([mcf.add(a, b, l.cap, c), mcf.add(b, a, l.cap, c)]);
      }
      const ge = [], de = [];
      for (let k = 0; k < N; k++) {
        const n = act[k];
        if (n.type === 'plant') {
          const t = PN.TECH[n.tech]; let av = 0, cost = n.mc;
          if (t.dispatch === 'thermal' || t.dispatch === 'nuclear') av = n.availBase;
          else if (t.dispatch === 'wind') { const loc = 1 + 0.35 * (PN.vnoise(n.x / 12 + wx.seed, n.y / 12, 5) - 0.5); av = Math.min(n.availBase * 0.97, n.availBase * n.cf * wx.wind * wx.windS[s] * loc); }
          else if (t.dispatch === 'solar') { const sh = solarShape(G, s, M.lat[M.idx(Math.floor(n.x), Math.floor(n.y))] || lat0); av = Math.min(n.availBase, (n.availBase * n.cf * wx.clear * sh) / Math.max(0.05, sn.ann)); }
          else if (t.dispatch === 'hydro') av = n.availBase * Math.min(1, 0.62 * flowF);
          else if (t.dispatch === 'dam') { av = n.availBase * Math.min(1, flowF * (role[s] === 'dis' ? 1.45 : 0.7) * (n.cf || 0.5) / 0.5); cost = 1; }
          else if (t.dispatch === 'flat') av = n.availBase * (t.cf || 0.9);
          else if (t.dispatch === 'storage') {
            const rte = t.rte || 0.85;
            if (role[s] === 'dis') { av = Math.min(n.availBase, n.soc / 3); cost = 2; }
            else if (role[s] === 'chg') { const room = Math.min(n.availBase, (n.E - n.soc) / (3 * rte)); if (room > 0.001) de.push([k, mcf.add(k, T, room, K - 45), 'chg']); av = 0; }
          }
          if (av > 0.0005) ge.push([k, mcf.add(S, k, av, Math.max(0, cost)), av]);
        } else if (n.type === 'city') {
          const cap = n.capS ? n.capS[s] * (1 + lam) : 0;
          if (cap > 0.0001) de.push([k, mcf.add(k, T, cap, K - VOLL.city), 'city']);
        } else if (n.type === 'load' || n.type === 'mine') {
          if (!n.energized) continue;
          const cap = n.demS[s] * (1 + lam);
          if (cap > 0.0001) de.push([k, mcf.add(k, T, cap, K - (VOLL[n.kind] || VOLL.industry)), 'load']);
        } else if (n.type === 'border') {
          if (n.links.some((id) => { const l = G.byId[id]; return l && l.built && !l.dmg; })) {
            ge.push([k, mcf.add(S, k, n.mw, np * 1.08 + 3), n.mw, 'imp']);
            de.push([k, mcf.add(k, T, n.mw, K - np * 0.92), 'exp']);
          }
        }
      }
      mcf.solve(S, T, K);
      const inj = new Float64Array(N), outW = new Float64Array(N), lf = new Float64Array(lines.length);
      // read results
      for (const [k, e, , kind] of ge) {
        const f = mcf.flow(e); const n = act[k]; inj[k] += f;
        if (kind === 'imp') { n.imp = (n.imp || 0) + f * W8; impE += f * W8; impCost += f * W8 * (np * 1.08); continue; }
        n.gen += f * W8; n.peakGen = Math.max(n.peakGen, f); n.genS = n.genS || []; n.genS[s] = f;
        if (PN.TECH[n.tech].dispatch === 'storage') { n.soc = Math.max(0, n.soc - f * 3); n.dis += f * W8; }
      }
      for (const [k, e, kind] of de) {
        const f = mcf.flow(e); const n = act[k]; outW[k] += f;
        if (kind === 'chg') { n.soc += f * 3 * (PN.TECH[n.tech].rte || 0.85); n.chg += f * W8; chgE += f * W8; continue; }
        if (kind === 'exp') { n.exp = (n.exp || 0) + f * W8; expE += f * W8; expRev += f * W8 * np * 0.92; continue; }
        const served = f / (1 + lam);
        n.servedE += served * W8; servedE += served * W8; if (n.type === 'city') cityServedE += served * W8;
        if (s === pkS) n.servedPk = served;
      }
      for (let q = 0; q < lines.length; q++) {
        const l = lines[q]; const f = mcf.flow(le[q][0]) - mcf.flow(le[q][1]); lf[q] = f;
        const af = Math.abs(f); if (af > l.fMax) l.fMax = af; l.fSum += af;
        if (s === pkS) l.fPk = f;
        if (!l.local) { const loss = (l.lossK * l.km * af * af) / l.cap + (PN.TECH[l.type].convLoss || 0) * af; l.lossE += loss * W8; lossE += loss * W8; }
      }
      if (PN.traceOn !== false) traceSample(G, act, idx, lines, lf, inj, outW, W8);
      // genS for plants not dispatched in this sample
      for (const n of act) if (n.type === 'plant') { n.genS = n.genS || []; if (n.genS[s] == null) n.genS[s] = 0; }
      // demand accounting
      for (const c of G.cities) if (idx.has(c.id)) { c.demE += c.demS[s] * W8; demandE += c.demS[s] * W8; cityDemE += c.demS[s] * W8; if (s === pkS) c.demPk = c.demS[s]; }
      for (const n of act) if ((n.type === 'load' || n.type === 'mine') && n.energized) { n.demE += n.demS[s] * W8; demandE += n.demS[s] * W8; if (s === pkS) n.demPk = n.demS[s]; }
      G._sampleGen = G._sampleGen || [];
    }
    for (const n of act) if (n.genS) { for (let s = 0; s < 8; s++) if (n.genS[s] == null) n.genS[s] = 0; }
    finishTrace(G);
    unservedE = Math.max(0, demandE - servedE);
    for (const n of act) if (n.type === 'mine') n.powered = n.demE > 0 ? n.servedE / n.demE : 0;
    for (const l of lines) { l.load = l.fMax / l.cap; l.avg = l.fSum / 8; l.flow = l.fPk; }
    for (const l of G.lines) if (lines.indexOf(l) < 0) { l.load = 0; l.flow = 0; l.avg = 0; }
    const genTot = act.reduce((s, n) => s + (n.type === 'plant' ? n.gen : 0), 0);
    G.lambda = PN.clamp(lossE / Math.max(1, servedE + chgE + expE), 0, 0.25);
    // load curve snapshot for the UI (MW per sample per tech)
    const curve = { dem: demTot.slice(), served: new Array(8).fill(0), tech: {}, imp: new Array(8).fill(0), role };
    for (const n of act) if (n.type === 'plant' && n.genS) { const a = (curve.tech[n.tech] = curve.tech[n.tech] || new Array(8).fill(0)); for (let s = 0; s < 8; s++) a[s] += n.genS[s]; }
    return { servedE, demandE, unservedE, lossE, genTot, impE, expE, impCost, expRev, chgE, curve, co2p, cityServedE, cityDemE };
  }
  function loadMW(G, n) {
    const y = ym(G);
    if (n.mwTab) return PN.curve(n.mwTab, y);
    const k = PN.clamp((y - n.since) / Math.max(0.5, n.years || 1), 0, 1);
    return n.mw + (n.growTo ? (n.growTo - n.mw) * k : 0);
  }
  PN.loadMW = loadMW;

  /* -------------------------------------------------------- monthly step */
  PN.step = function (G) {
    if (G.over) return;
    G.m++; if (G.m > 11) { G.m = 0; G.y++; }
    G.months++;
    const y = ym(G);
    if (G.m === 0) yearly(G);
    fireEvents(G);
    discoverTech(G);
    randomEvents(G);
    syncBorders(G);
    syncIndustry(G);
    G.wx = weather(G);
    construction(G);
    energize(G);
    ippMonthly(G);
    updateCities(G);
    G.urbanPop = G.cities.reduce((s, c) => s + (PN.cityOwned(G, c) ? c.pop : 0), 0);
    if (G.prosumer && G.prosumer.until > y) G.prosumerMW += G.prosumer.mwPerYear / 12;
    autoDistribution(G);
    const fl = fuelLogistics(G);
    const D = dispatch(G);
    electrify(G);
    const F = finance(G, D, fl);
    reputation(G, D);
    checkMissions(G);
    offers(G);
    ippOffers(G);
    record(G, D, F);
    bankruptcy(G);
    PN.bus.emit('month', G);
  };

  function yearly(G) {
    for (const n of G.nodes) if (n.built && (n.type === 'plant' || n.type === 'mine')) {
      n.age = (n.age || 0) + 1;
      const t = PN.TECH[n.tech];
      if (n.type === 'plant' && t.eff && n.age > t.life) n.eff *= 0.99;
      if (n.type === 'plant' && n.age === t.life) PN.news(G, n.name + ' osiąga projektowy wiek ' + t.life + ' lat. Rozważ remont lub wyłączenie.', 'warn', { node: n.id });
    }
    G.capexPrev = G.capexYear; G.capexYear = 0;
    if (G.regime === 'state' && G.capexPrev > 0) {
      const grant = G.capexPrev * 0.35 + G.cities.reduce((s, c) => s + (c.potU || 0), 0) * 0;
      G.money += grant; PN.news(G, 'Dotacja z budżetu państwa na inwestycje planu: ' + PN.money(grant) + '.', 'money');
    }
  }

  function construction(G) {
    const y = ym(G);
    if (G.fx.freezeUntil > y) return;
    for (const n of G.nodes) {
      if (!n.built && n.buildM) {
        n.prog += 1 / n.buildM;
        if (n.prog >= 1) { n.built = true; n.prog = 1; PN.news(G, (n.type === 'mine' ? 'Uruchomiono ' : 'Oddano do użytku: ') + n.name + (n.cap ? ' (' + PN.mw(n.cap) + ')' : '') + '.', 'build', { node: n.id }); PN.bus.emit('completed', n); }
      }
      if (n.pending) {
        n.pending.prog += 1 / n.pending.buildM;
        if (n.pending.prog >= 1) { n.units++; n.cap = n.units * n.unitMW; n.pending = null; PN.news(G, n.name + ': nowy blok, moc ' + PN.mw(n.cap) + '.', 'build', { node: n.id }); }
      }
    }
    for (const l of G.lines) if (!l.built) { l.prog += 1 / l.buildM; if (l.prog >= 1) { l.built = true; l.prog = 1; PN.news(G, 'Linia ' + PN.TECH[l.type].short + ' ' + G.byId[l.a].name + ' – ' + G.byId[l.b].name + ' pod napięciem (' + PN.nf(l.km, 0) + ' km).', 'build', { line: l.id }); PN.bus.emit('completed', l); } }
  }

  /* which nodes are in an island that contains generation */
  function energize(G) {
    const parent = new Map();
    const find = (a) => { while (parent.get(a) !== a) { parent.set(a, parent.get(parent.get(a))); a = parent.get(a); } return a; };
    for (const n of G.nodes) parent.set(n.id, n.id);
    for (const l of G.lines) if (l.built && !l.dmg) { const ra = find(l.a), rb = find(l.b); if (ra !== rb) parent.set(ra, rb); }
    const live = new Set();
    for (const n of G.nodes) if (n.built && !n.dmg && ((n.type === 'plant' && PN.TECH[n.tech].cat === 'gen') || (n.type === 'border' && n.links.length))) live.add(find(n.id));
    for (const n of G.nodes) { n.energized = live.has(find(n.id)); n.comp = find(n.id); }
  }
  PN.energize = energize;

  function autoDistribution(G) {
    if (!G.settings.autoDist) return;
    for (const c of G.cities) {
      if (!PN.cityOwned(G, c) || !c.energized) continue;
      const want = Math.max(c.potU, c.dU) * 1.08;
      if (want > c.distCap * 0.92) {
        const add = Math.max(want - c.distCap, PN.distStepMW(c) * 0.5);
        const cost = PN.distCostFor(G, add);
        if (G.money > cost * 1.5 || (c.distCap === 0 && G.money > cost)) { G.money -= cost; G.capexYear += cost; c.distCap += add; c.distSpent = (c.distSpent || 0) + cost; }
      }
    }
  }

  function electrify(G) {
    for (const c of G.cities) {
      if (!PN.cityOwned(G, c)) { c.served = 0; continue; }
      const r = c.demE > 0 ? c.servedE / c.demE : 0;
      const connected = c.servedE > 0;
      c.served = c.demE > 0 ? r : connected ? 1 : 0;
      const tU = G.satU * (c.distCap > 0 ? Math.min(1, (c.distCap * 1.02) / Math.max(1e-6, c.potU)) : 0);
      const tR = Math.min(G.satR, c.ruralLvl * 0.25);
      if (connected && r > 0.965) {
        c.eU += (tU - c.eU) * (c.eU < tU ? 0.07 : 0.02);
        c.eR += (tR - c.eR) * (c.eR < tR ? 0.06 : 0.02);
      } else if (connected && r > 0.8) {
        if (c.eU > tU) c.eU += (tU - c.eU) * 0.02; // hold new connections until supply catches up
        if (c.eR > tR) c.eR += (tR - c.eR) * 0.02;
      } else if (c.eU > 0) { c.eU *= 0.99; c.eR *= 0.99; }
      if (c.energized && c.eU === 0 && c.eR === 0 && tU > 0) c.eU = Math.min(tU, Math.max(0.15 * tU, 0.0004));
      c.eU = PN.clamp(c.eU, 0, 1); c.eR = PN.clamp(c.eR, 0, 1);
    }
  }

  function finance(G, D, fl) {
    const y = ym(G), sc = G.sc;
    const price = PN.curve(sc.price, y), dcost = PN.curve(sc.dcost, y), co2p = D.co2p;
    let rev = 0, fuel = 0, co2 = 0, co2t = 0, om = 0, grid = 0, dist = 0, retail = 0, interest = 0, penalty = 0, ipp = 0;
    for (const c of G.cities) if (PN.cityOwned(G, c)) { rev += c.servedE * price; retail += c.servedE * dcost; }
    for (const n of G.nodes) {
      if (n.type === 'load' && n.built) {
        rev += n.servedE * price * (1 + (n.premium || 0)) * (n.kind === 'datacenter' ? 0.75 : 0.85);
        if (n.contract && n.demE > 0 && n.servedE < n.demE * 0.9) { penalty += (n.demE - n.servedE) * price * 0.5; }
      }
      if (n.type === 'plant' && n.built && n.owner === 'ipp') {
        const t = PN.TECH[n.tech];
        ipp += (n.gen || 0) * (n.ppa || 0);
        if (t.dispatch === 'thermal') { const t2 = ((n.gen * 3.6) / n.eff) * PN.FUELS[t.fuel].co2; co2t += t2; n.co2 = t2; }
        n.lastCF = n.cap > 0 ? n.gen / (n.cap * 24 * PN.DAYS[G.m]) : 0;
        continue;
      }
      if (n.type === 'plant' && n.built) {
        const t = PN.TECH[n.tech];
        om += (n.cap * 1000 * PN.tv(t.fom, y)) / 12 * (n.age > t.life ? 1 + 0.03 * (n.age - t.life) : 1) * (n.on === false ? 0.3 : 1) + (n.gen || 0) * (PN.tv(t.vom, y) || 0);
        if (t.dispatch === 'thermal') {
          const gj = (n.gen * 3.6) / n.eff; fuel += gj * n.fuelPrice;
          const t2 = gj * PN.FUELS[t.fuel].co2; co2t += t2; co2 += t2 * co2p;
          n.co2 = t2;
        } else if (t.dispatch === 'nuclear') fuel += n.gen * PN.curve(sc.fuel[t.fuel === 'fusion' ? 'fusion' : 'uranium'], y);
        n.lastCF = n.cap > 0 ? n.gen / (n.cap * 24 * PN.DAYS[G.m]) : 0;
      }
      if (n.type === 'mine' && n.built) om += (n.cost * 0.02) / 12;
      if (n.type === 'sub' && n.built) grid += (n.cost * 0.015) / 12;
    }
    for (const l of G.lines) if (l.built && !l.local) grid += (l.cost * 0.012) / 12;
    for (const c of G.cities) dist += (c.distCap * 1000 * PN.curve(sc.distCost, y) * 0.02) / 12;
    interest = (G.debt * PN.loanRate(G)) / 12;
    rev += D.expRev;
    const cost = fuel + co2 + om + grid + dist + retail + interest + D.impCost + fl.mineCost + penalty + ipp;
    const profit = rev + fl.mineRev - cost;
    G.money += profit;
    return { rev: rev + fl.mineRev, fuel, co2, co2t, om, grid, dist, retail, interest, imp: D.impCost, mine: fl.mineCost - fl.mineRev, penalty, ipp, profit, price };
  }

  function reputation(G, D) {
    const y = ym(G);
    const q = D.cityDemE > 0 ? D.cityServedE / D.cityDemE : 1;
    let dr = 0;
    if (D.cityDemE > 0) { if (q >= 0.985) dr += 0.12 * (G.rep < 75 ? 1 : 0.2); else if (q < 0.96) dr -= Math.min(2.5, (0.96 - q) * 12); }
    // pollution near cities
    const eco = PN.curve([[1950, 0], [1970, 0.25], [1990, 0.7], [2005, 1], [2030, 1.2]], y);
    if (eco > 0) {
      let p = 0;
      for (const n of G.nodes) {
        if (n.type !== 'plant' || !n.built) continue; const t = PN.TECH[n.tech]; if (!t.pollution) continue;
        const c = nearestCity(G, n.x, n.y, 3.2, true); if (!c || c.pop < 40000) continue;
        p += (t.pollution * n.cap * (n.fgd ? 0.25 : 1)) / 1000 * (c.pop > 500000 ? 1.5 : 1);
      }
      dr -= Math.min(1.2, p * 0.12 * eco);
    }
    // state era: everyone expects electricity
    if (G.regime === 'state') {
      let pot = 0, got = 0; for (const c of G.cities) if (PN.cityOwned(G, c)) { pot += c.potU + (c.popR * G.satR * G.dpc) / 1e6; got += c.dU + c.dR; }
      if (pot > 0 && got / pot < 0.8) dr -= (0.8 - got / pot) * 0.6;
    }
    G.rep = PN.clamp(G.rep + dr, 0, 100);
    G.lastQ = q;
  }

  /* --------------------------------------------------------- stats & history */
  function emptyStats() { return { y: 0, m: 0, rev: 0, profit: 0, servedE: 0, demandE: 0, unservedE: 0, co2t: 0, gen: {}, cap: {}, peak: 0, capTot: 0, price: 0 }; }
  function record(G, D, F) {
    const gen = {}, cap = {};
    let capTot = 0, resE = 0, cleanE = 0, genE = 0;
    for (const n of G.nodes) if (n.type === 'plant' && n.built) {
      gen[n.tech] = (gen[n.tech] || 0) + n.gen; cap[n.tech] = (cap[n.tech] || 0) + n.cap;
      const t = PN.TECH[n.tech]; if (t.cat === 'gen') capTot += n.cap;
      if (t.cat === 'gen') {
        genE += n.gen;
        if (!t.fuel || t.fuel === 'biomass') resE += n.gen;
        if (!t.fuel || t.fuel === 'biomass' || t.fuel === 'uranium' || t.fuel === 'fusion') cleanE += n.gen;
      }
    }
    let dc = 0; for (const n of G.nodes) if (n.type === 'load' && n.kind === 'datacenter' && n.built) dc += n.servedPk || 0;
    let peak = 0; for (const c of G.cities) peak += c.demPk || 0; for (const n of G.nodes) if ((n.type === 'load' || n.type === 'mine') && n.energized) peak += n.demPk || 0;
    const st = { y: G.y, m: G.m, rev: F.rev, profit: F.profit, F, servedE: D.servedE, demandE: D.demandE, unservedE: D.unservedE, lossE: D.lossE, co2t: F.co2t, gen, cap, capTot, peak, price: F.price, money: G.money, rep: G.rep, resE, cleanE, genE, dcMW: dc, impE: D.impE, expE: D.expE, curve: D.curve };
    G.stats = st;
    G.months12.push({ rev: F.rev, profit: F.profit, resE, cleanE, genE, co2t: F.co2t, servedE: D.servedE, demandE: D.demandE });
    if (G.months12.length > 12) G.months12.shift();
    if (G.m === 11 || !G.hist.length) {
      const yr = G.months12.reduce((a, m) => { for (const k in m) a[k] = (a[k] || 0) + m[k]; return a; }, {});
      const h = { y: G.y, rev: yr.rev, profit: yr.profit, servedE: yr.servedE, demandE: yr.demandE, co2t: yr.co2t, genE: yr.genE, resE: yr.resE, cleanE: yr.cleanE, capTot, peak, money: G.money, rep: G.rep, cap: Object.assign({}, cap), gen: Object.assign({}, gen) };
      if (G.hist.length && G.hist[G.hist.length - 1].y === G.y) G.hist[G.hist.length - 1] = h; else G.hist.push(h);
    }
  }

  /* -------------------------------------------------------------- missions */
  PN.helpers = function (G) {
    const byName = (nm) => { for (const n of String(nm).split('|')) { const c = G.cities.find((q) => q.name === n || (q.src && q.src.names && q.src.names.some((x) => x.name === n))); if (c) return c; } return null; };
    return {
      servedMW: (nm) => { const c = byName(nm); return c ? c.servedPk || 0 : 0; },
      servedShare: (nm) => { const c = byName(nm); return c && c.demE > 0 ? c.servedE / c.demE : 0; },
      citiesServed: (mw) => G.cities.filter((c) => (c.servedPk || 0) >= mw).length,
      capMW: (techs) => G.nodes.reduce((s, n) => s + (n.type === 'plant' && n.built && techs.indexOf(n.tech) >= 0 ? n.cap : 0), 0),
      totalCap: () => G.nodes.reduce((s, n) => s + (n.type === 'plant' && n.built && PN.TECH[n.tech].cat === 'gen' ? n.cap : 0), 0),
      linesKm: (types) => G.lines.reduce((s, l) => s + (l.built && types.indexOf(l.type) >= 0 ? l.km : 0), 0),
      longestLine: () => G.lines.reduce((s, l) => Math.max(s, l.built && !l.local ? l.km : 0), 0),
      ruralShare: () => { let a = 0, b = 0; for (const c of G.cities) { b += c.popR; if (PN.cityOwned(G, c)) a += c.popR * c.eR; } return b > 0 ? a / b : 0; },
      resShare: () => { const s = G.months12.reduce((a, m) => [a[0] + m.resE, a[1] + m.genE], [0, 0]); return s[1] > 0 ? s[0] / s[1] : 0; },
      cleanShare: () => { const s = G.months12.reduce((a, m) => [a[0] + m.cleanE, a[1] + m.genE], [0, 0]); return s[1] > 0 ? s[0] / s[1] : 0; },
      co2g: () => { const s = G.months12.reduce((a, m) => [a[0] + m.co2t, a[1] + m.genE], [0, 0]); return s[1] > 0 ? (s[0] * 1e6) / (s[1] * 1000) : 0; },
      energy12: () => G.months12.reduce((a, m) => a + m.genE, 0),
      dcMW: () => G.stats ? G.stats.dcMW || 0 : 0,
      nodeDegree: (nm) => { const c = byName(nm); return c ? c.links.filter((id) => { const l = G.byId[id]; return l && l.built && !l.local; }).length : 0; },
      borderLinked: (pref, kv) => G.borders.some((b) => (String(b.bid).toUpperCase().indexOf(pref) === 0 || /niem/i.test(b.name)) && b.links.some((id) => { const l = G.byId[id]; return l && l.built && kvOf(l.type) >= kv; })),
    };
  };
  function kvOf(type) { return { line_sn: 15, line_60: 60, line_110: 110, line_220: 220, line_345: 345, line_400: 400, line_500: 500, line_750: 750, hvdc: 500, cable_sea: 220 }[type] || 0; }
  function checkMissions(G) {
    const H = PN.helpers(G), y = ym(G);
    for (const ms of G.sc.missions) {
      const st = (G.missions[ms.id] = G.missions[ms.id] || { state: 'hidden', p: 0 });
      if (st.state === 'done' || st.state === 'failed') continue;
      if (y < ms.from) continue;
      if (st.state === 'hidden') { st.state = 'active'; PN.news(G, 'Nowe zadanie: ' + ms.title + '. ' + ms.text, 'mission', { mission: ms.id }); PN.bus.emit('mission', { ms, st }); }
      let p = 0; try { p = PN.clamp(ms.check(H) || 0, 0, 1); } catch (e) { p = 0; }
      st.p = p;
      if (p >= 0.999) {
        st.state = 'done'; st.when = y; G.money += ms.reward.money || 0; G.rep = PN.clamp(G.rep + (ms.reward.rep || 0), 0, 100);
        PN.news(G, 'Zadanie wykonane: ' + ms.title + '! Nagroda ' + PN.money(ms.reward.money || 0) + '.', 'done', { mission: ms.id });
        PN.bus.emit('missionDone', { ms, st });
      } else if (y >= ms.deadline) { st.state = 'failed'; PN.news(G, 'Termin minął: ' + ms.title + '.', 'warn', { mission: ms.id }); }
    }
  }

  /* --------------------------------------------------------------- events */
  function fireEvents(G) {
    const key = G.y + '-' + String(G.m + 1).padStart(2, '0');
    for (const ev of G.events) {
      if (G.fired[ev.id]) continue;
      if (ev.date > key) break;
      G.fired[ev.id] = true;
      applyEffects(G, ev);
      PN.news(G, ev.title, 'event', { ev: ev.id });
      PN.bus.emit('event', ev);
      if (G._trans) { PN.bus.emit('transformation', G._trans); G._trans = null; } // explained right after the newspaper
    }
  }
  PN.regionToTiles = function (G, r) { const t = G.map.toTile(r.lon, r.lat); return { x: t[0], y: t[1], r: (r.radiusKm || 100) / G.map.T }; };
  function applyEffects(G, ev) {
    const y = ym(G);
    for (const e of ev.effects || []) {
      try {
        switch (e.type) {
          case 'unlock': G.unlocked[e.tech] = y; break;
          case 'demand': G.fx.demand.push({ mult: e.mult, until: y + (e.months || 12) / 12, region: e.region ? PN.regionToTiles(G, e.region) : null }); break;
          case 'fuel': G.fx.fuel[e.fuel] = { mult: e.mult, until: y + (e.months || 12) / 12 }; break;
          case 'damage': damage(G, e.region ? PN.regionToTiles(G, e.region) : null, e.target || 'all', e.share || 0.3, ev.id); break;
          case 'outage': outage(G, e.region ? PN.regionToTiles(G, e.region) : null, e.months || 1); break;
          case 'derate': for (const t of e.techs || []) G.fx.derate[t] = { mult: e.mult, until: y + (e.months || 2) / 12 }; break;
          case 'freeze': G.fx.freezeUntil = Math.max(G.fx.freezeUntil, y + (e.months || 12) / 12); break;
          case 'money': G.money += e.amount / (G.sc.fx || 1) * (G.code === 'PL' ? 1 : 1); break;
          case 'reputation': G.rep = PN.clamp(G.rep + e.delta, 0, 100); break;
          case 'subsidy': G.fx.subsidy[e.target] = { mult: e.costMult, until: y + (e.months || 60) / 12 }; break;
          case 'rule': G.rules[e.rule] = e.value; break;
          case 'load': addLoadNode(G, e); break;
          case 'border': addBorder(G, e.name, e.lat, e.lon, e.mw || 500, e.name); break;
          case 'regime': G.regime = e.regime; break;
          case 'prosumer': G.prosumer = { mwPerYear: e.mwPerYear, until: y + (e.years || 5) }; break;
          case 'territory': G.terr[e.change] = true; break;
          case 'carbon': G.fx.carbon = activeFx(G.fx.carbon, y).concat([{ price: e.price || 0, until: y + (e.months || 120) / 12, ev: ev.id }]); break;
          case 'esg': G.fx.esg = [{ premium: e.premium || 0, until: y + (e.months || 120) / 12, ev: ev.id }]; break;
          case 'ipp': if (G.ippScope !== 'all') { G.ippScope = e.scope || 'all'; G._trans = { scope: G.ippScope, ev: ev.id }; } break;
          default: break;
        }
      } catch (err) { console.warn('effect failed', e, err); }
    }
  }
  PN.applyEffects = applyEffects;
  function addLoadNode(G, e) {
    const t = G.map.toTile(e.lon, e.lat);
    let x = t[0], yy = t[1];
    const c = nearestCity(G, x, yy, 4, false);
    if (c && Math.hypot(c.x - x, c.y - yy) < 0.6) { const a = (e.name.length * 1.7) % (2 * Math.PI); x = c.x + Math.cos(a) * (c.rad * 0.8 + 0.4); yy = c.y + Math.sin(a) * (c.rad * 0.8 + 0.4); }
    const n = addNode(G, { type: 'load', kind: e.kind || 'industry', x, y: yy, name: e.name, mw: e.mw, growTo: e.growToMw || e.mw, years: e.years || 1, since: ym(G), built: true, premium: e.premium || (e.kind === 'datacenter' ? 0.25 : 0.1) });
    if (c && Math.hypot(c.x - x, c.y - yy) <= c.rad + 0.9 && PN.cityOwned(G, c)) linkLocal(G, n, c);
    return n;
  }
  PN.addLoadNode = addLoadNode;
  function damage(G, reg, target, share, seedKey) {
    const r = PN.rng(G.seed + G.months * 31 + (seedKey ? seedKey.length * 7 : 0));
    const inR = (x, y) => !reg || Math.hypot(x - reg.x, y - reg.y) <= reg.r;
    let n1 = 0;
    if (target !== 'lines') for (const n of G.nodes) if ((n.type === 'plant' || n.type === 'mine' || n.type === 'sub') && n.built && inR(n.x, n.y) && r() < share) { n.dmg = true; n1++; }
    if (target !== 'plants') for (const l of G.lines) if (l.built && !l.local) { const a = G.byId[l.a], b = G.byId[l.b]; if (inR((a.x + b.x) / 2, (a.y + b.y) / 2) && r() < share) { l.dmg = true; n1++; } }
    if (n1) PN.news(G, 'Zniszczenia: ' + n1 + ' ' + PN.plural(n1, 'obiekt wymaga', 'obiekty wymagają', 'obiektów wymaga') + ' odbudowy.', 'warn');
  }
  function outage(G, reg, months) {
    const y = ym(G); let k = 0;
    for (const l of G.lines) if (l.built && !l.local) { const a = G.byId[l.a], b = G.byId[l.b]; const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; if (!reg || Math.hypot(mx - reg.x, my - reg.y) <= reg.r) { if (PN.hash(l.id, G.months, 3) < 0.55) { l.out = y + months / 12 - 0.001; k++; } } }
    if (k) PN.news(G, 'Awarie sieci: ' + k + ' ' + PN.plural(k, 'linia wyłączona', 'linie wyłączone', 'linii wyłączonych') + '.', 'warn');
  }
  PN.repairAll = function (G) {
    let c = 0; for (const o of G.nodes.concat(G.lines)) if (o.dmg && o.owner !== 'ipp') c += PN.repairCost(G, o);
    if (G.money < c) return false;
    for (const o of G.nodes.concat(G.lines)) if (o.dmg && o.owner !== 'ipp') { G.money -= PN.repairCost(G, o); o.dmg = false; }
    return true;
  };
  PN.repairAllCost = (G) => G.nodes.concat(G.lines).reduce((s, o) => s + (o.dmg && o.owner !== 'ipp' ? PN.repairCost(G, o) : 0), 0);

  /* random weather & incidents (on top of the historical calendar) */
  function randomEvents(G) {
    const r = G.rnd, y = ym(G), mo = G.m, M = G.map;
    const lineCount = G.lines.filter((l) => l.built && !l.local).length;
    const pick = () => { const c = G.cities[Math.floor(r() * G.cities.length)]; return c ? { x: c.x + (r() - 0.5) * 6, y: c.y + (r() - 0.5) * 6 } : { x: M.W / 2, y: M.H / 2 }; };
    if (lineCount > 2 && (mo >= 5 && mo <= 7) && r() < 0.045) {
      const p = pick(); const reg = { x: p.x, y: p.y, r: (90 + r() * 80) / M.T };
      outage(G, reg, 1); PN.bus.emit('incident', { kind: 'storm', title: 'Nawałnica łamie słupy', text: 'Burza z wichurą przeszła przez region – część linii wyłączona na miesiąc. Sieć z obejściami (N-1) przetrwa takie zdarzenia.', reg });
    }
    if (lineCount > 2 && (mo === 0 || mo === 1 || mo === 11) && r() < 0.02) {
      const p = pick(); const reg = { x: p.x, y: p.y, r: (80 + r() * 60) / M.T };
      outage(G, reg, 1); PN.bus.emit('incident', { kind: 'cold', title: 'Szadź i oblodzenie przewodów', text: 'Lód obciążył przewody i zerwał kilka linii. Ekipy pracują w mrozie.', reg });
    }
    if ((mo === 6 || mo === 7) && y > 1960 && r() < (y > 2000 ? 0.12 : 0.06)) {
      G.fx.derate.coal = { mult: 0.9, until: y + 1 / 12 }; G.fx.derate.lignite = { mult: 0.9, until: y + 1 / 12 }; G.fx.derate.nuclear = { mult: 0.93, until: y + 1 / 12 };
      G.fx.demand.push({ mult: G.code === 'US' ? 1.07 : 1.03, until: y + 1 / 12 });
      PN.bus.emit('incident', { kind: 'heat', title: 'Upał i niskie stany rzek', text: 'Ciepła woda w rzekach ogranicza chłodzenie elektrowni cieplnych, a klimatyzacja podbija popyt.' });
    }
    if ((mo === 11 || mo === 0 || mo === 1) && y > 1990 && G.nodes.some((n) => n.tech === 'wind' || n.tech === 'solar') && r() < 0.06) {
      G.fx.windLull = y + 1 / 12;
      PN.bus.emit('incident', { kind: 'lull', title: 'Flauta i zachmurzenie', text: 'Wyż nad kontynentem: wiatraki stoją, słońca prawie brak. Potrzebna moc sterowalna lub magazyny.' });
    }
    if (mo >= 6 && mo <= 8 && r() < 0.03) { G.fx.hydro = { mult: 0.6, until: y + 3 / 12 }; if (G.nodes.some((n) => n.tech === 'hydro_dam' || n.tech === 'hydro_small')) PN.bus.emit('incident', { kind: 'drought', title: 'Susza', text: 'Niski stan wód: elektrownie wodne pracują na 60% przez trzy miesiące.' }); }
    if (G.code === 'US' && mo >= 7 && mo <= 9 && lineCount > 2 && r() < 0.05) {
      const gulf = r() < 0.6; const p = gulf ? M.toTile(-90 - r() * 8, 29.8) : M.toTile(-77 + r() * 4, 35 + r() * 6);
      const reg = { x: p[0], y: p[1], r: 250 / M.T }; outage(G, reg, 1);
      PN.bus.emit('incident', { kind: 'storm', title: 'Huragan nad wybrzeżem', text: 'Huragan uderzył w wybrzeże – linie i stacje w pasie 250 km wyłączone.', reg });
    }
  }

  /* ------------------------------------------------------ data-centre offers */
  const DC_NAMES = ['NovaCompute', 'Chmura Północ', 'AtlasAI', 'Hyperion Data', 'Polaris Cloud', 'Cumulus', 'Nimbus Compute', 'Orbita AI', 'Kepler Labs', 'Borealis'];
  function offers(G) {
    const y = ym(G), r = G.rnd;
    G.offers = G.offers.filter((o) => o.expires > y);
    const start = G.code === 'PL' ? 2014 : 2005;
    if (y < start) return;
    const p = y < 2023 ? 0.025 : 0.07;
    if (r() > p || G.offers.length >= 2) return;
    const boom = y >= 2023;
    const weights = G.cities.filter((c) => PN.cityOwned(G, c) && c.pop > 60000).map((c) => {
      let w = Math.sqrt(c.pop / 1e5);
      const hot = { Warszawa: 5, 'Poznań': 2, 'Kraków': 2, 'Wrocław': 2, 'Gdańsk': 1.5, 'Łódź': 1.5, Katowice: 1.5, Ashburn: 6, Waszyngton: 4, Washington: 4, Dallas: 3, 'Dallas–Fort Worth': 3, Phoenix: 3, Chicago: 2, Atlanta: 2, Columbus: 2, 'The Dalles': 2.5, 'Council Bluffs': 2, Abilene: y >= 2024 ? 3 : 0.3, Memphis: y >= 2024 ? 2 : 0.5, Reno: 1.2 };
      const key = Object.keys(hot).find((k) => c.name === k || c.name.indexOf(k) === 0);
      w *= key ? hot[key] : 0.5; return [c, w];
    });
    const tot = weights.reduce((s, x) => s + x[1], 0); if (!tot) return;
    let q = r() * tot, city = weights[0][0]; for (const [c, w] of weights) { q -= w; if (q <= 0) { city = c; break; } }
    const mw = Math.round(G.code === 'PL' ? (boom ? 60 + r() * (y > 2030 ? 900 : 400) : 15 + r() * 60) : (boom ? 200 + r() * (y > 2030 ? 3000 : 1500) : 40 + r() * 250));
    const o = { id: 'o' + G.months, company: DC_NAMES[Math.floor(r() * DC_NAMES.length)], city: city.id, mw, premium: Math.round((0.15 + r() * 0.3) * 100) / 100, years: 2 + Math.floor(r() * 3), expires: y + 0.5, ai: boom };
    G.offers.push(o);
    PN.bus.emit('offer', o);
  }
  PN.acceptOffer = function (G, o) {
    const c = G.byId[o.city]; if (!c) return null;
    const a = (o.mw * 13.7) % (2 * Math.PI);
    const t = { lat: 0, lon: 0 };
    const x = c.x + Math.cos(a) * (c.rad + 0.6), y = c.y + Math.sin(a) * (c.rad + 0.6);
    const ll = G.map.toLL(x, y); t.lon = ll[0]; t.lat = ll[1];
    const n = addLoadNode(G, { name: (o.ai ? 'Centrum AI ' : 'Centrum danych ') + o.company, lat: t.lat, lon: t.lon, mw: o.mw * 0.15, growToMw: o.mw, years: o.years, kind: 'datacenter', premium: o.premium });
    n.contract = true;
    if (!n.links.length) linkLocal(G, n, c);
    G.offers = G.offers.filter((x) => x !== o);
    PN.news(G, 'Umowa podpisana: ' + n.name + ' (' + PN.cityName(c, G.y) + '), docelowo ' + PN.mw(o.mw) + '.', 'deal', { node: n.id });
    return n;
  };
  PN.declineOffer = function (G, o) { G.offers = G.offers.filter((x) => x !== o); };

  /* ------------------------------------------- independent power producers */
  /* After the market opens (USA: PURPA 1978 for small producers, FERC Order 888 in 1996 for everyone;
     Poland: Energy Law 1997) private investors bring their own projects. The player, as the grid
     company, decides whether to connect them and then buys their energy at the contract price. */
  const IPP_NAMES = {
    PL: ['EkoMoc', 'Zielony Most Energia', 'Karpacka Moc', 'Nadwiślańska Energia', 'Bałtycki Horyzont', 'Polna Iskra', 'Jantar Power', 'Grot Energia', 'Kaszubska Energia', 'Mazowiecka Moc', 'Iskra Inwestycje', 'Warta Energia Nowa'],
    US: ['Blue Heron Power', 'Copper Mesa Energy', 'Cascade Current', 'Lone Pine Energy', 'Red Rock Generation', 'Silver Creek Power', 'Prairie Star Energy', 'Harbor Light Power', 'Juniper Ridge Energy', 'Bluebonnet Power', 'Maple Hollow Energy', 'Sandstone Power Co.'],
  };
  function ippMenu(G, y) {
    const w = {}, add = (id, v) => { if (v > 0 && PN.TECH[id] && PN.techAvail(G, id)) w[id] = (w[id] || 0) + v; };
    if (G.ippScope === 'small') { add('gas_ccgt', 2); add('gas_ocgt', 1); add('wind', 3); add('hydro_small', 1.5); add('biomass', 1.5); add('geothermal', 1); add('solar', 0.4); add('csp', 0.4); return w; }
    add('wind', G.rules.wind_distance_km >= 1 ? 0.3 : 3);
    add('solar', y < 2010 ? 0.3 : y < 2018 ? 2 : 4);
    add('gas_ccgt', y < 2015 ? 2.5 : 1);
    add('biomass', 0.8); add('battery', y < 2020 ? 0.5 : 2.5); add('wind_offshore', 1.2);
    add('smr', y < 2035 ? 0.4 : 1); add('geothermal', 0.6); add('hydro_small', 0.4); add('csp', 0.5);
    return w;
  }
  function ippTargetMW(G, id, y, r) {
    const k = PN.clamp((y - 1995) / 30, 0, 1.4), us = G.code === 'US' ? 1.6 : 1;
    const mw = { wind: 20 + r() * (40 + 120 * k), wind_offshore: 400 + r() * 800, solar: 5 + r() * (20 + 200 * k), gas_ccgt: 150 + r() * 350, gas_ocgt: 40 + r() * 120,
      battery: 20 + r() * (40 + 160 * k), smr: 300, biomass: 15 + r() * 40, geothermal: 20 + r() * 60, hydro_small: 2 + r() * 8, csp: 50 + r() * 200 }[id] || 50;
    return mw * (id === 'smr' || id === 'wind_offshore' ? 1 : us);
  }
  function ippSite(G, id, r) {
    const M = G.map, offshore = id === 'wind_offshore';
    // investors look for the grid and for demand: anything powered, plus every big town
    const anchors = G.nodes.filter((n) => n.built && !n.dmg && (n.type === 'city' ? PN.cityOwned(G, n) && (n.energized || n.pop > 100000) : (n.type === 'sub' || n.type === 'plant') && n.energized));
    const pool = offshore ? anchors.filter((n) => M.distSea[M.idx(Math.floor(n.x), Math.floor(n.y))] * M.T < 60) : anchors;
    if (!pool.length) return null;
    let best = null, bs = -1e9;
    for (let k = 0; k < 80; k++) {
      const base = pool[Math.floor(r() * pool.length)];
      const radT = (id === 'battery' ? 6 : offshore ? 40 + r() * 60 : 15 + r() * 55) / M.T, a = r() * 6.2832, d = radT * Math.sqrt(r());
      const tx = Math.floor(base.x + Math.cos(a) * d), ty = Math.floor(base.y + Math.sin(a) * d);
      const c = PN.canPlace(G, id, tx, ty, { free: true }); if (!c.ok) continue;
      const km = Math.hypot(tx + 0.5 - base.x, ty + 0.5 - base.y) * M.T;
      const sc = (c.cf || 0.3) * 4 - km / 120 + (id === 'battery' && c.city ? 1 : 0) + r() * 0.3;
      if (sc > bs) { bs = sc; best = { tx, ty, c, km }; }
    }
    return best;
  }
  PN.ippNet = (G) => { const y = ym(G); return Math.max(1, PN.curve(G.sc.price, y) - PN.curve(G.sc.dcost, y)); };
  function ippOffers(G) {
    const y = ym(G), r = G.rnd;
    G.ippOffers = (G.ippOffers || []).filter((o) => o.expires > y);
    G.ippStats = G.ippStats || { offered: 0, accepted: 0, declined: 0 };
    if (!G.ippScope || G.fx.freezeUntil > y) return;
    const p = G.ippScope === 'small' ? 0.035 : y < 2010 ? 0.05 : y < 2020 ? 0.08 : 0.1;
    if (G.ippOffers.length >= 2 || r() > p) return;
    const menu = ippMenu(G, y), ids = Object.keys(menu); if (!ids.length) return;
    let q = r() * ids.reduce((s, k) => s + menu[k], 0), id = ids[0];
    for (const k of ids) { q -= menu[k]; if (q <= 0) { id = k; break; } }
    const site = ippSite(G, id, r); if (!site) return;
    const c = site.c, units = PN.clamp(Math.round(ippTargetMW(G, id, y, r) / Math.max(0.1, c.unitMW)), 1, Math.max(1, c.maxUnits || 4));
    const kp = { wind: PN.curve([[1981, 1.05], [2005, 0.85], [2015, 0.7], [2025, 0.55], [2040, 0.45]], y), wind_offshore: PN.curve([[2016, 1.0], [2025, 0.8], [2040, 0.6]], y),
      solar: PN.curve([[1982, 1.6], [2010, 1.1], [2018, 0.7], [2025, 0.5], [2040, 0.38]], y), csp: 1.1, gas_ccgt: 0.85, gas_ocgt: 1.05, battery: 0.9, smr: 0.95, biomass: 0.95, geothermal: 0.8, hydro_small: 0.75 }[id] || 0.9;
    const names = IPP_NAMES[G.code] || IPP_NAMES.PL;
    const near = nearestCity(G, site.tx + 0.5, site.ty + 0.5, null, true);
    const o = { id: 'ipp' + G.months + '_' + Math.floor(r() * 1e4), company: names[Math.floor(r() * names.length)], tech: id, tx: site.tx, ty: site.ty, units, unitMW: c.unitMW, cap: c.unitMW * units,
      capex: c.cost * units, buildM: c.buildM, cf: c.cf || 0, ppa: PN.ippNet(G) * kp * (0.92 + r() * 0.16), years: id === 'battery' ? 12 : 15 + Math.floor(r() * 3) * 5,
      gridKm: site.km, inCity: !!c.city, near: near ? near.id : null, expires: y + 0.75 };
    G.ippOffers.push(o); G.ippStats.offered++;
    PN.bus.emit('ipp', o);
  }
  PN.acceptIpp = function (G, o) {
    const y = ym(G);
    G.ippOffers = (G.ippOffers || []).filter((x) => x !== o);
    const c = PN.canPlace(G, o.tech, o.tx, o.ty, { free: true });
    if (!c.ok) { PN.news(G, o.company + ' wycofuje projekt: ' + c.why, 'warn'); return null; }
    const t = PN.TECH[o.tech], x = o.tx + 0.5, yy = o.ty + 0.5;
    const n = addNode(G, {
      type: 'plant', tech: o.tech, x, y: yy, name: autoName(G, o.tech, x, yy, c.site), built: false, prog: 0, buildM: c.buildM,
      units: o.units, unitMW: c.unitMW, cap: c.unitMW * o.units, maxUnits: o.units, cost: 0, since: y, age: 0,
      eff: t.eff ? PN.tv(t.eff, y, G.code) : 1, cf: c.cf || 0, site: c.site ? c.site.k : -1, on: true, fgd: true, soc: 0, fuelOK: 1, fuelPrice: 0, mc: 0,
      hours: t.hours ? PN.tv(t.hours, y) : 0, owner: 'ipp', company: o.company, ppa: o.ppa, until: y + o.years, capex: o.capex,
    });
    if (c.city) linkLocal(G, n, c.city);
    G.ippStats.accepted++;
    PN.news(G, 'Umowa przyłączeniowa: ' + n.name + ' (' + PN.mw(n.cap) + ', inwestor ' + o.company + '). Gdy stanie, poprowadź do niej linię.', 'deal', { node: n.id });
    PN.bus.emit('built', n);
    return n;
  };
  PN.declineIpp = function (G, o) {
    G.ippOffers = (G.ippOffers || []).filter((x) => x !== o); G.ippStats.declined++;
    if (G.ippStats.declined % 4 === 0) { G.rep = Math.max(0, G.rep - 2); PN.news(G, 'Inwestorzy skarżą się na odmowy przyłączenia. Reputacja spada.', 'warn'); }
  };
  function ippMonthly(G) {
    const y = ym(G);
    for (const n of G.nodes.slice()) {
      if (n.owner !== 'ipp') continue;
      if (n.dmg) { n.dmgM = (n.dmgM || 0) + 1; if (n.dmgM > 12) { n.dmg = false; n.dmgM = 0; PN.news(G, n.company + ' odbudował ' + n.name + '.', 'build', { node: n.id }); } }
      if (!n.built) continue;
      if (n.until && y >= n.until) { n.ppa *= 0.8; n.until = y + 10; PN.news(G, 'Nowa umowa z ' + n.company + ' (' + n.name + '): energia tańsza o 20%.', 'deal', { node: n.id }); }
      const linked = n.links.some((id) => { const l = G.byId[id]; return l && l.built && !l.dmg; });
      if (linked) { if (n.waiting) { n.waiting = 0; PN.news(G, n.name + ' przyłączona do sieci.', 'build', { node: n.id }); } continue; }
      n.waiting = (n.waiting || 0) + 1;
      if (n.waiting === 1) PN.news(G, n.name + ' (' + n.company + ') czeka na przyłączenie. Masz rok na linię do sieci.', 'warn', { node: n.id });
      if (n.waiting > 12) G.rep = Math.max(0, G.rep - 0.25);
      if (n.waiting === 13) PN.news(G, n.company + ' skarży się na brak przyłączenia (' + n.name + '). Reputacja spada co miesiąc.', 'warn', { node: n.id });
      if (n.waiting > 36) { PN.news(G, n.company + ' rezygnuje z ' + n.name + ' po trzech latach bez przyłączenia.', 'warn'); PN.demolish(G, n); }
    }
  }

  function bankruptcy(G) {
    if (G.money < 0) {
      const need = -G.money * 1.1 + 1;
      const got = PN.takeLoan(G, need);
      if (got > 0) PN.news(G, 'Kredyt awaryjny: ' + PN.money(got) + '.', 'warn');
      if (G.money < 0) {
        if (G.regime === 'state') { G.money = G.sc.money; G.debt *= 0.5; G.rep = Math.max(0, G.rep - 15); PN.news(G, 'Państwo przejmuje długi przedsiębiorstwa. Reputacja spada.', 'warn'); }
        else { G.bankruptMonths = (G.bankruptMonths || 0) + 1; if (G.bankruptMonths > 6) { G.over = 'bankrupt'; PN.bus.emit('gameover', 'bankrupt'); } }
      } else G.bankruptMonths = 0;
    }
    if (G.y >= G.sc.end) { G.over = 'end'; PN.bus.emit('gameover', 'end'); }
  }

  /* -------------------------------------------------------------- save/load */
  PN.serialize = function (G) {
    const strip = (o) => { const c = Object.assign({}, o); delete c.src; delete c.demS; delete c.capS; delete c.genS; delete c.srcTop; delete c.dstTop; delete c._src; delete c._dst; return c; };
    return JSON.stringify({ v: 1, code: G.code, y: G.y, m: G.m, months: G.months, money: G.money, debt: G.debt, rep: G.rep, nodes: G.nodes.map(strip), lines: G.lines, nextId: G.nextId,
      unlocked: G.unlocked, rules: G.rules, terr: G.terr, regime: G.regime, fx: G.fx, lambda: G.lambda, prosumerMW: G.prosumerMW, prosumer: G.prosumer, fired: G.fired, missions: G.missions,
      news: G.news.slice(0, 40), hist: G.hist, months12: G.months12, settings: G.settings, seed: G.seed, offers: G.offers, capexYear: G.capexYear, capexPrev: G.capexPrev, indDone: G.indDone, techSeen: G.techSeen, techGone: G.techGone, ippScope: G.ippScope, ippOffers: G.ippOffers, ippStats: G.ippStats });
  };
  PN.deserialize = function (str) {
    const S = JSON.parse(str); const G = PN.newGame(S.code);
    const keep = ['y', 'm', 'months', 'money', 'debt', 'rep', 'nextId', 'unlocked', 'rules', 'terr', 'regime', 'fx', 'lambda', 'prosumerMW', 'prosumer', 'fired', 'missions', 'news', 'hist', 'months12', 'settings', 'seed', 'offers', 'capexYear', 'capexPrev', 'indDone', 'techSeen', 'techGone', 'ippScope', 'ippOffers', 'ippStats'];
    for (const k of keep) if (S[k] !== undefined) G[k] = S[k];
    G.rnd = PN.rng(G.seed + G.months);
    const cityByCi = {}; G.cities.forEach((c) => (cityByCi[c.ci] = c));
    G.nodes = []; G.byId = {}; G.borders = []; const keepCities = [];
    for (const n of S.nodes) {
      if (n.type === 'city') { const c = cityByCi[n.ci]; if (!c) continue; Object.assign(c, n, { src: c.src, links: [] }); G.nodes.push(c); G.byId[c.id] = c; keepCities.push(c); }
      else { n.links = []; G.nodes.push(n); G.byId[n.id] = n; if (n.type === 'border') G.borders.push(n); }
    }
    G.cities = keepCities;
    G.lines = [];
    for (const l of S.lines) { if (!G.byId[l.a] || !G.byId[l.b]) continue; G.lines.push(l); G.byId[l.id] = l; G.byId[l.a].links.push(l.id); G.byId[l.b].links.push(l.id); }
    PN.assignDistricts(G.map, G.cities, G.code === 'PL' ? 70 : 260);
    updateCities(G); G.wx = weather(G);
    return G;
  };

  /* Minimal fallback data if the places file is missing. */
  PN.FALLBACK_PLACES = {
    PL: { country: { pop: { 1880: 23e6, 1939: 32e6, 1946: 24e6, 1990: 38e6, 2050: 33e6 } }, cities: [
      { name: 'Warszawa', lat: 52.23, lon: 21.01, pop: { 1880: 380e3, 1939: 1.29e6, 1946: 0.48e6, 1990: 1.65e6, 2050: 1.8e6 } },
      { name: 'Łódź', lat: 51.76, lon: 19.46, pop: { 1880: 77e3, 1939: 0.67e6, 1990: 0.85e6, 2050: 0.6e6 } },
      { name: 'Kraków', lat: 50.06, lon: 19.94, pop: { 1880: 66e3, 1939: 0.26e6, 1990: 0.75e6, 2050: 0.8e6 } }], hydro: [], deposits: [], protected: [], borders: [], industry: [], historicPlants: [], regions: {} },
    US: { country: { pop: { 1880: 50e6, 2020: 331e6 } }, cities: [{ name: 'Nowy Jork', lat: 40.71, lon: -74.0, pop: { 1880: 2.5e6, 2020: 20e6 } }], hydro: [], deposits: [], protected: [], borders: [], industry: [], historicPlants: [] },
  };
})();
