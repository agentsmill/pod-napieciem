/* A deliberately simple greedy player used to smoke-test the simulation across eras. */
'use strict';
module.exports = function (PN, G, years) {
  const avail = (t) => PN.techAvail(G, t);
  const lineType = () => ['line_750', 'line_500', 'line_400', 'line_345', 'line_220', 'line_110', 'line_60', 'line_sn'].find(avail);
  const owned = () => G.cities.filter((c) => PN.cityOwned(G, c) && c.pop > 0);
  function ringBuild(tech, cx, cy, R) {
    for (let r = 0; r <= R; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const tx = Math.floor(cx) + dx, ty = Math.floor(cy) + dy;
      const c = PN.canPlace(G, tech, tx, ty);
      if (c.ok || (c.poor && afford(tech, tx, ty))) return PN.build(G, tech, tx, ty).node;
    }
    return null;
  }
  function nearestEnergized(c, maxKm) {
    let best = null, bd = maxKm / G.map.T;
    for (const n of G.nodes) { if (n === c || !n.energized || !n.built) continue; if (n.type === 'border') continue; const d = Math.hypot(n.x - c.x, n.y - c.y); if (d < bd) { bd = d; best = n; } }
    return best;
  }
  const log = [];
  function afford(id, tx, ty) { // borrow if a planned build is out of reach
    const c = PN.canPlace(G, id, tx, ty); if (c.ok) return true;
    if (!c.poor || c.cost == null) return false;
    const room = PN.creditLimit(G) - G.debt; if (room < c.cost - G.money) return false;
    PN.takeLoan(G, c.cost - G.money + G.sc.money * 0.2); return PN.canPlace(G, id, tx, ty).ok;
  }
  function act() {
    const y = PN.ym(G);
    // finance: keep a buffer
    if (G.money < G.sc.money * 0.15 && G.debt < PN.creditLimit(G) * 0.5) PN.takeLoan(G, G.sc.money * 0.5);
    if (G.money > G.sc.money * 3 && G.debt > 0) PN.repay(G, Math.min(G.debt, G.money - G.sc.money * 2));
    PN.energize(G);
    const peak = G.stats.peak || 0;
    let cap = 0, building = 0;
    for (const n of G.nodes) if (n.type === 'plant' && PN.TECH[n.tech].cat === 'gen') { if (n.built) cap += n.cap * (['wind', 'solar', 'wind_offshore'].includes(n.tech) ? 0.25 : 1); else building += n.cap; }
    // connect cities
    const lt = lineType();
    const cs = owned().sort((a, b) => b.pop - a.pop);
    let newCities = 0;
    for (const c of cs.slice(0, 40)) {
      if (c.energized || c.links.length) continue;
      if (newCities >= 2 || G.money < G.sc.money * 0.4) break;
      newCities++;
      if (lt) { const n = nearestEnergized(c, PN.TECH[lt].maxKm * 0.9); if (n) { const r = PN.buildLine(G, lt, n, c); if (r.ok) { log.push(y.toFixed(1) + ' line ' + lt + ' ' + n.name + '→' + c.name); continue; } } }
      if (avail('steam_dc') && c.pop > 30000) { const p = ringBuild('steam_dc', c.x, c.y, 1); if (p) { log.push(y.toFixed(1) + ' steam ' + c.name); continue; } }
      if (avail('coal') && G.money > 20e6) { const p = ringBuild('coal', c.x, c.y, 2); if (p) { log.push(y.toFixed(1) + ' coal ' + c.name); if (!p.links.length && lt) PN.buildLine(G, lt, p, c); } }
    }
    // capacity
    if (peak > 0 && cap + building < peak * 1.3) {
      const tgt = cs.find((c) => c.energized) || cs[0];
      let tech = null;
      for (const t of ['nuclear', 'lignite', 'coal', 'steam_dc']) if (avail(t)) { tech = t; break; }
      if (y > 2010 && avail('wind') && G.rnd() < 0.5) tech = 'wind';
      if (y > 2015 && avail('solar') && G.rnd() < 0.3) tech = 'solar';
      if (y > 1995 && avail('gas_ccgt') && G.rnd() < 0.3) tech = 'gas_ccgt';
      if (tech === 'nuclear' && G.money < 3e9) tech = avail('coal') ? 'coal' : null;
      // expand existing plant first
      const ex = G.nodes.find((n) => n.type === 'plant' && n.tech === tech && n.built && !n.pending && n.units < n.maxUnits && G.money > PN.unitCost(G, n) * 1.2);
      if (!ex) { const ex2 = G.nodes.find((n) => n.type === 'plant' && n.tech === tech && n.built && !n.pending && n.units < n.maxUnits); if (ex2) { const c = PN.unitCost(G, ex2); if (PN.creditLimit(G) - G.debt > c) PN.takeLoan(G, c * 1.2 - G.money); } }
      const ex3 = ex || G.nodes.find((n) => n.type === 'plant' && n.tech === tech && n.built && !n.pending && n.units < n.maxUnits && G.money > PN.unitCost(G, n));
      if (ex3) { PN.addUnit(G, ex3); log.push(y.toFixed(1) + ' +unit ' + ex3.name); }
      const order = [tech].concat(['coal', 'gas_ccgt', 'lignite', 'steam_dc'].filter((t) => t !== tech && avail(t)));
      for (const tq of (!ex3 && tgt ? order : [])) { tech = tq; const before = G.nodes.length;
        let p = null;
        if (tech === 'lignite') {
          for (const d of G.map.deposits.filter((q) => q.kind === 'lignite')) {
            let m = G.nodes.find((n) => n.type === 'mine' && n.tech === 'lignite_mine' && Math.hypot(n.x - d.x, n.y - d.y) < 3);
            if (!m) m = ringBuild('lignite_mine', d.x, d.y, 2);
            if (!m) continue;
            p = ringBuild('lignite', m.x, m.y, 3);
            if (p) { if (lt) PN.buildLine(G, lt, m, p); break; }
          }
        }
        if (!p) p = ringBuild(tech, tgt.x, tgt.y, tech === 'wind' || tech === 'solar' ? 6 : 2);
        if (!p && tech !== 'wind' && tech !== 'solar') p = ringBuild(tech, tgt.x, tgt.y, 5);
        if (p) { log.push(y.toFixed(1) + ' build ' + tech + ' ' + p.name + ' ' + PN.nf(p.cap, 1)); if (!p.links.length && lt) { const n = nearestEnergized(p, PN.TECH[lt].maxKm) || tgt; const r = PN.buildLine(G, lt, p, n); if (!r.ok) PN.buildLine(G, lt, p, tgt); } }
        if (G.nodes.length > before) break;
      }
    }
    // relieve congested lines
    for (const l of G.lines.slice()) if (l.built && !l.local && l.load > 0.98 && lt && G.money > l.cost * 1.5) { const r = PN.buildLine(G, lt, G.byId[l.a], G.byId[l.b]); if (r.ok) log.push(y.toFixed(1) + ' parallel ' + lt); }
    // rural electrification
    if (G.satR > 0.05) for (const c of cs.slice(0, 30)) if (c.energized && c.ruralLvl < 4 && G.money > PN.ruralCostFor(G, c) * 4) PN.ruralUp(G, c);
    // offers
    for (const o of G.offers.slice()) PN.acceptOffer(G, o);
    for (const o of G.nodes) if (o.dmg && G.money > PN.repairCost(G, o) * 2) PN.repair(G, o);
    for (const l of G.lines) if (l.dmg && G.money > PN.repairCost(G, l) * 2) PN.repair(G, l);
  }
  const t0 = Date.now();
  let lastY = G.y;
  for (let m = 0; m < years * 12 && !G.over; m++) {
    if (m % 3 === 0) act();
    const s0 = Date.now(); PN.step(G); const dt = Date.now() - s0;
    if (G.y !== lastY && G.y % 5 === 0) {
      lastY = G.y; const st = G.stats, H = PN.helpers(G);
      console.log([G.y, 'money', PN.money(G.money), 'debt', PN.money(G.debt), 'profit/mo', PN.money(st.profit), 'peak', PN.mw(st.peak), 'cap', PN.mw(st.capTot), 'q', PN.pct(G.lastQ || 0, 1), 'rep', G.rep.toFixed(0), 'nodes', G.nodes.length, 'lines', G.lines.length, 'rural', PN.pct(H.ruralShare()), 'co2', H.co2g().toFixed(0), 'ms/step', dt].join(' '));
    }
  }
  console.log('done in', ((Date.now() - t0) / 1000).toFixed(1), 's; missions:', Object.entries(G.missions).filter(([, v]) => v.state === 'done').map(([k]) => k).join(','));
  console.log(log.slice(0, 12).join('\n'));
  return G;
};
