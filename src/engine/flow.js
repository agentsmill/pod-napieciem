'use strict';
/* Min-cost flow (successive shortest paths, Dijkstra with potentials).
   Used as an economic dispatch with transmission limits: super-source -> generators (cost = marginal cost),
   lines (both directions), loads -> super-sink (cost = K - value of lost load). */
(function () {
  const PN = window.PN;
  function MCF() { this.reset(2); }
  MCF.prototype.reset = function (n) {
    this.n = n; this.head = new Int32Array(n).fill(-1);
    this.to = []; this.nx = []; this.cap = []; this.cost = []; this.m = 0;
  };
  MCF.prototype.add = function (u, v, cap, cost) {
    const e = this.m;
    this.to.push(v, u); this.cap.push(cap, 0); this.cost.push(cost, -cost);
    this.nx.push(this.head[u], this.head[v]); this.head[u] = e; this.head[v] = e + 1; this.m += 2;
    return e;
  };
  /* Augment while the cheapest path costs less than `limit`. Returns {flow, cost}. Flow on edge e: this.flow(e). */
  MCF.prototype.solve = function (S, T, limit) {
    const n = this.n, m = this.m;
    const to = Int32Array.from(this.to), nx = Int32Array.from(this.nx), head = this.head;
    const cap = Float64Array.from(this.cap), cost = Float64Array.from(this.cost);
    this.cap0 = Float64Array.from(this.cap); this.capR = cap;
    const pot = new Float64Array(n), dist = new Float64Array(n), pe = new Int32Array(n);
    const hk = new Float64Array(m + n + 4), hv = new Int32Array(m + n + 4);
    let flowTot = 0, costTot = 0, guard = 0;
    const EPS = 1e-7;
    while (guard++ < 20000) {
      dist.fill(Infinity); pe.fill(-1); dist[S] = 0;
      let hs = 0;
      const push = (k, v) => { let i = hs++; hk[i] = k; hv[i] = v; while (i > 0) { const p = (i - 1) >> 1; if (hk[p] <= hk[i]) break; const tk = hk[p], tv = hv[p]; hk[p] = hk[i]; hv[p] = hv[i]; hk[i] = tk; hv[i] = tv; i = p; } };
      const pop = () => { const v = hv[0]; hs--; if (hs > 0) { hk[0] = hk[hs]; hv[0] = hv[hs]; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let s = i; if (l < hs && hk[l] < hk[s]) s = l; if (r < hs && hk[r] < hk[s]) s = r; if (s === i) break; const tk = hk[s], tv = hv[s]; hk[s] = hk[i]; hv[s] = hv[i]; hk[i] = tk; hv[i] = tv; i = s; } } return v; };
      push(0, S);
      while (hs > 0) {
        const d = hk[0], u = pop();
        if (d > dist[u] + 1e-9) continue;
        for (let e = head[u]; e !== -1; e = nx[e]) {
          if (cap[e] <= EPS) continue;
          const v = to[e], nd = d + cost[e] + pot[u] - pot[v];
          if (nd < dist[v] - 1e-9) { dist[v] = nd; pe[v] = e; push(nd, v); }
        }
      }
      if (dist[T] === Infinity) break;
      for (let v = 0; v < n; v++) if (dist[v] < Infinity) pot[v] += dist[v];
      const pathCost = pot[T] - pot[S];
      if (pathCost >= limit) break;
      let f = Infinity;
      for (let v = T; v !== S; v = to[pe[v] ^ 1]) f = Math.min(f, cap[pe[v]]);
      if (!(f > EPS) || !isFinite(f)) break;
      for (let v = T; v !== S; v = to[pe[v] ^ 1]) { cap[pe[v]] -= f; cap[pe[v] ^ 1] += f; }
      flowTot += f; costTot += f * pathCost;
    }
    return { flow: flowTot, cost: costTot };
  };
  MCF.prototype.flow = function (e) { return this.cap0[e] - this.capR[e]; };
  PN.MCF = MCF;
})();
