#!/usr/bin/env node
/* Headless engine harness: loads the simulation in Node and lets a simple bot play.
   Usage: node test/headless.js PL [years] [seed] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = path.join(__dirname, '..', 'src');
const files = ['engine/core.js', 'data/tech.js', 'data/scen_pl.js', 'data/scen_us.js', 'data/geo_pl.js', 'data/geo_us.js', 'data/places_pl.js', 'data/places_us.js', 'data/events_pl.js', 'data/events_us.js', 'engine/map.js', 'engine/flow.js', 'engine/sim.js'];
const ctx = { console, Math, JSON, Date, performance: { now: () => Date.now() } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of files) { const p = path.join(SRC, f); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f }); }
const PN = ctx.PN;
const code = process.argv[2] || 'PL', years = +(process.argv[3] || 60);
const G = PN.newGame(code);
G.seed = +(process.argv[4] || 1); G.rnd = PN.rng(G.seed);
const startKey = G.y + '-' + String(G.m + 1).padStart(2, '0');
for (const e of G.events) if (e.date < startKey) { G.fired[e.id] = true; PN.applyEffects(G, e); }
PN.bus.on('gameover', (k) => console.log('GAME OVER', k, G.y));
require('./bot.js')(PN, G, years);
