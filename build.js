#!/usr/bin/env node
/* Bundles the game into a single HTML file (dist/pod-napieciem.html, copied to index.html for GitHub Pages) and an artifact body (dist/artifact.html). */
'use strict';
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const order = [
  'engine/core.js', 'data/tech.js', 'data/scen_pl.js', 'data/scen_us.js',
  'data/geo_pl.js', 'data/geo_us.js', 'data/places_pl.js', 'data/places_us.js', 'data/events_pl.js', 'data/events_us.js',
  'engine/map.js', 'engine/flow.js', 'engine/sim.js',
  'render/sketch.js', 'render/sprites.js', 'render/terrain.js', 'render/view.js',
  'ui/ui.js', 'ui/tutorial.js', 'main.js',
];
const tpl = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
const part = (name) => { const m = tpl.split('<!--PART:' + name + '-->')[1]; return m.split('<!--PART:')[0].trim(); };
const vm = require('vm');
let js = '';
for (const f of order) {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p)) { console.warn('missing (skipped):', f); continue; }
  const src = fs.readFileSync(p, 'utf8');
  try { new vm.Script(src, { filename: f }); } catch (e) { console.error('SYNTAX ERROR in', f, e.message); process.exit(1); }
  // each file in its own script element, so a runtime error in one data file cannot take the whole game down
  js += '<script>/* ' + f + ' */\n' + src.replace(/<\/script/gi, '<\\/script') + '\n</script>\n';
}
const scripts = part('SCRIPTS') + '\n' + js;
const head = part('HEAD'), body = part('BODY');
fs.mkdirSync(DIST, { recursive: true });
const full = '<!doctype html>\n<html lang="pl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + '\n</head>\n<body>\n' + body + '\n' + scripts + '\n</body>\n</html>\n';
const art = head + '\n' + body + '\n' + scripts + '\n';
fs.writeFileSync(path.join(DIST, 'pod-napieciem.html'), full);
fs.writeFileSync(path.join(DIST, 'artifact.html'), art);
fs.writeFileSync(path.join(__dirname, 'index.html'), full); // GitHub Pages serves the repository root
console.log('built', (full.length / 1024).toFixed(0) + ' KB');
