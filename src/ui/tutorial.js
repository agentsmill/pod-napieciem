'use strict';
/* Interactive tutorial: a pencil note that points at the next thing to do and waits for the player. */
(function () {
  const PN = window.PN, UI = PN.UI, esc = PN.esc;
  const T = (PN.Tutorial = { active: false, i: 0, steps: [], card: null, ring: null, t0: 0 });
  const LOC = { Warszawa: 'Warszawie', 'Nowy Jork': 'Nowym Jorku' };

  const homeCity = () => { const G = PN.G, nm = G.code === 'PL' ? 'Warszawa' : 'Nowy Jork'; return G.cities.find((c) => c.name === nm) || G.cities[0]; };
  const firstPlant = () => PN.G.nodes.find((n) => n.type === 'plant');
  // the city the first plant actually feeds (a click near the home city can land in a neighbouring town)
  const servedCity = () => {
    const G = PN.G, p = firstPlant(); if (!p) return homeCity();
    const l = G.lines.find((q) => q.local && (q.a === p.id || q.b === p.id)), id = l && (l.a === p.id ? l.b : l.a);
    return (id != null && G.cities.find((c) => c.id === id)) || homeCity();
  };
  const phone = () => window.innerWidth <= 820 && window.innerHeight > 520; // phone held upright; sideways uses the side placement
  const nm = (n) => (n.type === 'city' ? PN.cityName(n, PN.G.y) : n.name);
  // on an upright phone the note sits at the bottom: show the target in the upper part of the map
  const focus = (c, z) => { const V = UI.V; V.centerOn(c.x, c.y, z); if (phone()) { V.cam.y += (window.innerHeight * 0.18) / V.scale(); V.clampCam(); } };
  const visible = (el) => !!el && el.offsetParent !== null && !el.closest('[hidden]');

  T.build = function () {
    const G = PN.G, pl = G.code === 'PL', city = homeCity(), cn = PN.cityName(city, G.y);
    const lineYear = Math.max(G.y, Math.floor(PN.techFirstYear(PN.TECH.line_sn, G.code) || G.y));
    return [
      { title: 'Witaj w kronice sieci', next: true,
        text: pl ? 'Jest ' + G.y + ' rok i prąd elektryczny to nowinka – miasta świecą gazem i naftą. Zbudujesz pierwszą elektrownię, puścisz czas i zobaczysz, jak ' + cn + ' zapala światła. To zajmie kilka minut.'
          : 'Jest ' + G.y + ' rok. Thomas Edison szykuje elektrownię przy Pearl Street, a Manhattan świeci gazem. Zbudujesz własną elektrownię, puścisz czas i zobaczysz, jak miasto zapala światła. To zajmie kilka minut.' },
      { title: 'Mapa', next: true, map: () => city, enter: () => focus(city, Math.max(1.6, UI.V.cam.z)),
        text: 'Przeciągnij mapę myszą lub palcem, a kółkiem albo dwoma palcami przybliżaj. ' + (pl ? 'Kreskowane obszary to ziemie poza Twoim zasięgiem w tej epoce – zabór pruski i Cesarstwo Niemieckie.' : 'Kanada i Meksyk leżą poza Twoim zasięgiem, ale później połączysz się z nimi liniami.') },
      { title: 'Elektrownie', el: '#tools button[data-cat="gen"]', text: 'Otwórz menu elektrowni na lewym pasku.',
        done: () => UI.flyCat === 'gen' || !!UI.tool || !!firstPlant() },
      { title: 'Pierwsza elektrownia', el: '#fly [data-tech="steam_dc"]',
        text: 'Wybierz „Elektrownia parowa prądu stałego”. Na razie prądnice stoją w środku miasta – sieć niskiego napięcia sięga ledwie półtora kilometra.',
        done: () => (UI.tool && UI.tool.id === 'steam_dc') || !!firstPlant(), back: () => !UI.flyCat && !UI.tool },
      { title: 'Postaw ją w ' + (LOC[cn] || cn), map: () => city, enter: () => focus(city, Math.max(1.6, UI.V.cam.z)),
        text: () => (UI.touch ? 'Dotknij pola w obrębie miasta: zielona ramka i podpowiedź pokażą koszt i czas budowy. Potem naciśnij „Zbuduj” albo dotknij tego samego pola jeszcze raz.' : 'Najedź na pole w obrębie miasta: zielona ramka i podpowiedź pokażą koszt i czas budowy. Kliknij, żeby zacząć budowę.'),
        done: () => !!firstPlant(), back: () => !UI.tool },
      { title: 'Puść czas', el: '#speed button[data-s="4"]', enter: () => UI.setTool(null),
        text: 'Budowa potrwa kilka miesięcy – postęp widać na pasku pod rysunkiem. Kliknij 4×, żeby czas płynął szybciej (spacja to pauza, klawisze 1–4 zmieniają tempo).',
        done: () => UI.speed > 0 || (firstPlant() && firstPlant().built) },
      { title: 'Budowa trwa', el: '#ticker', text: 'Czekamy, aż elektrownia ruszy. W lewym dolnym rogu jest kronika – trafiają tam wszystkie wiadomości.',
        done: () => firstPlant() && firstPlant().built },
      { title: 'Jest prąd!', map: servedCity, enter: () => focus(servedCity(), Math.max(1.8, UI.V.cam.z)),
        text: 'Elektrownia pracuje, a w mieście zapalają się pierwsze okna. Kliknij miasto, żeby zobaczyć, ilu mieszkańców ma już elektryczność.',
        done: () => UI.sel === servedCity() },
      { title: 'Panel miasta', el: '#info', next: true,
        text: 'Tu widzisz elektryfikację miasta i wsi, sieć niskiego napięcia (nN) i zapotrzebowanie w szczycie. Sieć miejska rozbudowuje się sama, a wsie elektryfikujesz przyciskiem, gdy pojawią się chętni.' },
      { title: 'Przegląd i doradca', el: '#tabs button[data-tab="overview"]',
        text: 'Na górze Przeglądu jest cel gry: cztery wskaźniki rozdziału – dostęp, niezawodność, koszt i klimat – z oceną w gwiazdkach. Niżej Doradca wskazuje problemy, a wykres doby pokazuje, kto pokrywa zapotrzebowanie. Kliknij zakładkę Przegląd.',
        done: () => !UI.sel && UI.tab === 'overview' },
      { title: 'Zadania', el: '#tabs button[data-tab="goals"]', text: 'Tu są rozdziały historii z ocenami oraz zadania – za ich wykonanie dostajesz pieniądze i reputację. Zajrzyj do zakładki Zadania.',
        done: () => UI.tab === 'goals' },
      { title: 'Linie przesyłowe', el: '#tools button[data-cat="grid"]', next: true, enter: () => { if (phone()) UI.showPanel(false); },
        text: (lineYear > G.y ? 'Linii jeszcze nie wynaleziono – na razie każda elektrownia zasila tylko swoje miasto. Gdy się pojawią, gazeta da znać i pokaże, jak postawić pierwszą.' : 'W menu Sieć są linie.') + ' Linię stawiasz, wybierając napięcie i klikając dwa punkty: elektrownię, miasto albo puste pole (tam powstanie stacja). Wyższe napięcie to większa moc, dalszy zasięg i mniejsze straty.' },
      { title: 'Warstwy mapy', el: '#layers', next: true,
        text: 'Zasoby pokazują złoża: wyraźne można zagospodarować już dziś, blade – dopiero w przyszłości. Popyt pokazuje głód prądu w miastach, a Legenda tłumaczy znaczki i linie. Warstwy Wiatr i Słońce pojawią się razem z elektrowniami wiatrowymi i słonecznymi.' },
      { title: 'Historia puka do drzwi', next: true,
        text: 'Wynalazki przychodzą same, razem z historią: w menu widzisz tylko to, co już istnieje. Wycinki z gazet pojawią się po lewej i nie zatrzymują gry; czas staje tylko przy wojnach, kryzysach i zmianach ustroju. Stare elektrownie z czasem przestaną się opłacać – zastępuj je nowszymi.' },
      { title: 'Do dzieła', next: true, last: true,
        text: 'Dobudowuj bloki, gdy rośnie popyt, elektryfikuj kolejne miasta i pilnuj rezerwy mocy. Samouczek powtórzysz z menu ☰.' },
    ];
  };

  /* a short follow-up when the first transmission lines appear */
  T.buildLines = function () {
    const G = PN.G, V = UI.V, lid = PN.LINE_ORDER.find((id) => PN.techAvail(G, id)) || 'line_sn', lt = PN.TECH[lid];
    const hard = (lt.maxKm * 1.6) / (1.08 * G.map.T);
    // the closest pair: something that already has power, and a town that has none
    const pair = () => {
      const src = G.nodes.filter((n) => n.built && n.energized && !n.dmg && ((n.type === 'plant' && n.owner !== 'ipp') || (n.type === 'city' && PN.cityOwned(G, n)) || n.type === 'sub'));
      const dst = G.cities.filter((c) => PN.cityOwned(G, c) && !c.energized && c.pop > 0);
      const pairs = [];
      for (const a of src) for (const b of dst) pairs.push({ a, b, d: Math.hypot(a.x - b.x, a.y - b.y) });
      pairs.sort((p, q) => p.d - q.d);
      // the nearest pair a line can actually join: no sea or foreign land on the way (distance alone can be bridged with stations)
      for (const pr of pairs.slice(0, 40)) { const c = PN.lineCheck(G, lid, pr.a, pr.b); if (c.ok || c.poor || (c.km && c.km > lt.maxKm * 1.6)) return pr; }
      return pairs[0] || null;
    };
    let P = pair();
    const start = () => (P && P.a) || homeCity(), end = () => (P && P.b) || homeCity();
    const reached = () => P && P.b.links.some((id) => { const l = G.byId[id]; return l && !l.local; });
    const km = () => (P ? P.d * G.map.T * 1.08 : 0);
    const frame = () => { if (!P) return; const mx = (P.a.x + P.b.x) / 2, my = (P.a.y + P.b.y) / 2, base = V.scale() / V.cam.z; V.centerOn(mx, my, PN.clamp((0.42 * Math.min(V.W, V.H)) / (Math.max(1, P.d) * base), 0.45, 1.8)); };
    return [
      { title: 'Pierwsza linia', next: true, enter: () => { P = pair(); },
        text: 'Linia zanosi prąd z elektrowni do miast, które nie mają własnej. ' + (P ? 'Połączymy ' + nm(P.a) + ' z miastem ' + nm(P.b) + '.' : 'Zbudujesz ją w kilku kliknięciach.') },
      { title: 'Menu Sieć', el: '#tools button[data-cat="grid"]', text: 'Otwórz menu Sieć na lewym pasku.', done: () => UI.flyCat === 'grid' || (UI.tool && UI.tool.kind === 'line') },
      { title: 'Wybierz napięcie', el: '#fly [data-tech="' + lid + '"]', text: 'Kliknij „' + lt.name + '”. Wyższe napięcie przesyła więcej i dalej, ale kosztuje więcej.', done: () => UI.tool && UI.tool.kind === 'line', back: () => !UI.flyCat && !UI.tool },
      { title: 'Kliknij początek', map: start, enter: frame,
        text: () => 'Kliknij ' + nm(start()) + ' – stąd poprowadzisz linię. Niebieski krąg pokaże, dokąd sięga.', done: () => !!V.lineStart, back: () => !UI.tool },
      { title: 'Kliknij koniec', map: end,
        text: () => (!P ? 'Kliknij miasto w zasięgu kręgu. Podpowiedź pokaże koszt, straty i czas budowy.'
          : P.d > hard * 0.97 ? 'Do miasta ' + nm(P.b) + ' jest ok. ' + PN.nf(km(), 0) + ' km – dalej, niż sięga jedna linia ' + lt.short + '. Kliknij puste pole w stronę miasta, w zasięgu kręgu: powstanie tam stacja, a linia pobiegnie dalej od niej. Powtarzaj, aż dojdziesz do miasta ' + nm(P.b) + '.'
            : 'Teraz kliknij ' + nm(P.b) + ' (ok. ' + PN.nf(km(), 0) + ' km). Podpowiedź pokaże koszt, straty i czas budowy' + (UI.touch ? ', a przycisk „Zbuduj linię” zatwierdzi budowę.' : '.')),
        done: () => reached(), back: () => !UI.tool },
      { title: 'Linia w budowie', next: true, last: true, enter: () => UI.setTool(null),
        text: 'Budowa potrwa kilka miesięcy. Gdy linia ruszy, żółte kreski pokażą kierunek przepływu, a panel miasta – skąd płynie prąd. Kolejne linie stawiasz tak samo.' },
    ];
  };
  T.startLines = function () {
    if (!PN.G || !UI.V) return;
    T.steps = T.buildLines(); T.i = 0; T.active = true; T.t0 = performance.now(); ensure(); T.go(0);
  };
  function ensure() {
    if (T.card) return;
    T.card = document.createElement('div'); T.card.className = 'tut-card'; T.card.setAttribute('role', 'dialog'); T.card.setAttribute('aria-live', 'polite');
    T.ring = document.createElement('div'); T.ring.className = 'tut-ring';
    document.getElementById('app').append(T.ring, T.card);
    T.card.addEventListener('click', (e) => {
      const b = e.target.closest('[data-t]'); if (!b) return;
      if (b.dataset.t === 'skip') T.stop();
      if (b.dataset.t === 'next') T.go(T.i + 1);
    });
  }
  T.start = function () {
    if (!PN.G || !UI.V) return;
    T.steps = T.build(); T.i = 0; T.active = true; T.t0 = performance.now();
    ensure();
    T.go(0);
  };
  T.go = function (i) {
    if (i >= T.steps.length) { T.stop(); return; }
    T.i = Math.max(0, i); const s = T.steps[T.i];
    document.body.classList.add('tut-on');
    if (s.enter) try { s.enter(); } catch (e) { /* ignore */ }
    T.render(); T.t0 = performance.now();
  };
  T.stop = function () {
    T.active = false; document.body.classList.remove('tut-on'); if (T.card) T.card.hidden = true; if (T.ring) T.ring.hidden = true;
    try { localStorage.setItem('pn_tut_done', '1'); } catch (e) { /* storage unavailable */ }
  };
  T.cancel = function () { T.active = false; document.body.classList.remove('tut-on'); if (T.card) T.card.hidden = true; if (T.ring) T.ring.hidden = true; };
  T.done = function () { try { return localStorage.getItem('pn_tut_done') === '1'; } catch (e) { return false; } };
  T.render = function () {
    const s = T.steps[T.i];
    T.card.innerHTML = '<div class="tut-k">Samouczek · krok ' + (T.i + 1) + ' z ' + T.steps.length + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(typeof s.text === 'function' ? s.text() : s.text) + '</p><div class="row end">' +
      (s.last ? '' : '<button class="act" data-t="skip">Pomiń samouczek</button>') +
      (s.next ? '<button class="act prim" data-t="next">' + (s.last ? 'Zakończ' : 'Dalej') + '</button>' : '<span class="tut-wait">czekam na Twój ruch…</span>') + '</div>';
    T.card.hidden = false;
  };

  /* called every frame from the game loop */
  T.tick = function () {
    if (!T.active || !T.card) return;
    const s = T.steps[T.i]; if (!s) return;
    if (UI.modalOpen || document.getElementById('start').hidden === false) { T.card.hidden = true; T.ring.hidden = true; return; }
    T.card.hidden = false;
    if (s.done && performance.now() - T.t0 > 350) { let ok = false; try { ok = !!s.done(); } catch (e) { ok = false; } if (ok) { T.go(T.i + 1); return; } }
    if (s.back && performance.now() - T.t0 > 600) { let b = false; try { b = !!s.back(); } catch (e) { b = false; } if (b) { T.go(T.i - 1); return; } }
    // target rectangle
    let r = null, round = false;
    if (s.el) { const el = document.querySelector(s.el); if (visible(el)) r = el.getBoundingClientRect(); }
    else if (s.map) {
      const c = s.map(); const V = UI.V, cv = document.getElementById('map').getBoundingClientRect();
      const [x, y] = V.toScreen(c.x, c.y), rad = Math.max(26, (c.rad || 0.6) * V.scale() + 12);
      r = { left: cv.left + x - rad, top: cv.top + y - rad, width: 2 * rad, height: 2 * rad, right: cv.left + x + rad, bottom: cv.top + y + rad }; round = true;
    }
    const W = window.innerWidth, H = window.innerHeight;
    if (r) {
      const pad = round ? 0 : 6;
      Object.assign(T.ring.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + 2 * pad + 'px', height: r.height + 2 * pad + 'px', borderRadius: round ? '50%' : '14px' });
      T.ring.hidden = false;
    } else T.ring.hidden = true;
    // place the note next to the target, inside the viewport
    const hud = document.getElementById('hud'), top = hud ? Math.round(hud.getBoundingClientRect().bottom) + 8 : 76;
    const cw = T.card.offsetWidth, ch = T.card.offsetHeight, m = window.innerHeight < 520 ? 8 : 16;
    const fitX = (v) => PN.clamp(v, m, Math.max(m, W - cw - m)), fitY = (v) => PN.clamp(v, top, Math.max(top, H - ch - m));
    // how much of the target (plus a small margin) a note placed at x,y would cover
    const cover = (x, y) => { if (!r) return 0; const g = 10, ox = Math.min(x + cw, r.right + g) - Math.max(x, r.left - g), oy = Math.min(y + ch, r.bottom + g) - Math.max(y, r.top - g); return ox > 0 && oy > 0 ? ox * oy : 0; };
    let cands;
    if (phone()) cands = [[(W - cw) / 2, H - ch - 110], [(W - cw) / 2, 150], [(W - cw) / 2, top]];
    else if (!r) cands = [[(W - cw) / 2, H * 0.32]];
    else cands = [[r.right + 18, r.top + r.height / 2 - ch / 2], [r.left - cw - 18, r.top + r.height / 2 - ch / 2], [r.left + r.width / 2 - cw / 2, r.bottom + 18], [r.left + r.width / 2 - cw / 2, r.top - ch - 18]];
    // first spot that stays on screen without hiding the target; otherwise the one hiding the least
    let best = null, bestCover = Infinity;
    for (const [cx, cy] of cands) { const x = fitX(cx), y = fitY(cy), c = cover(x, y); if (c < bestCover) { best = [x, y]; bestCover = c; } if (c === 0) break; }
    T.card.style.left = best[0] + 'px'; T.card.style.top = best[1] + 'px';
  };
})();
