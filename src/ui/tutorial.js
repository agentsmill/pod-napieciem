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
  const phone = () => window.innerWidth <= 820;
  const visible = (el) => !!el && el.offsetParent !== null && !el.closest('[hidden]');

  T.build = function () {
    const G = PN.G, pl = G.code === 'PL', city = homeCity(), cn = PN.cityName(city, G.y);
    const lineYear = Math.max(G.y, Math.floor(PN.techFirstYear(PN.TECH.line_sn, G.code) || G.y));
    return [
      { title: 'Witaj w kronice sieci', next: true,
        text: pl ? 'Jest ' + G.y + ' rok i prąd elektryczny to nowinka – miasta świecą gazem i naftą. Zbudujesz pierwszą elektrownię, puścisz czas i zobaczysz, jak ' + cn + ' zapala światła. To zajmie kilka minut.'
          : 'Jest ' + G.y + ' rok. Thomas Edison szykuje elektrownię przy Pearl Street, a Manhattan świeci gazem. Zbudujesz własną elektrownię, puścisz czas i zobaczysz, jak miasto zapala światła. To zajmie kilka minut.' },
      { title: 'Mapa', next: true, map: () => city, enter: () => UI.V.centerOn(city.x, city.y, Math.max(1.6, UI.V.cam.z)),
        text: 'Przeciągnij mapę myszą lub palcem, a kółkiem albo dwoma palcami przybliżaj. ' + (pl ? 'Kreskowane obszary to ziemie poza Twoim zasięgiem w tej epoce – zabór pruski i Cesarstwo Niemieckie.' : 'Kanada i Meksyk leżą poza Twoim zasięgiem, ale później połączysz się z nimi liniami.') },
      { title: 'Elektrownie', el: '#tools button[data-cat="gen"]', text: 'Otwórz menu elektrowni na lewym pasku.',
        done: () => UI.flyCat === 'gen' || !!UI.tool || !!firstPlant() },
      { title: 'Pierwsza elektrownia', el: '#fly [data-tech="steam_dc"]',
        text: 'Wybierz „Elektrownia parowa prądu stałego”. Na razie prądnice stoją w środku miasta – sieć niskiego napięcia sięga ledwie półtora kilometra.',
        done: () => (UI.tool && UI.tool.id === 'steam_dc') || !!firstPlant(), back: () => !UI.flyCat && !UI.tool },
      { title: 'Postaw ją w ' + (LOC[cn] || cn), map: () => city,
        text: 'Najedź na pole w obrębie miasta: zielona ramka i podpowiedź pokażą koszt i czas budowy. Kliknij, żeby zacząć budowę.',
        done: () => !!firstPlant(), back: () => !UI.tool },
      { title: 'Puść czas', el: '#speed button[data-s="4"]', enter: () => UI.setTool(null),
        text: 'Budowa potrwa kilka miesięcy – postęp widać na pasku pod rysunkiem. Kliknij 4×, żeby czas płynął szybciej (spacja to pauza, klawisze 1–4 zmieniają tempo).',
        done: () => UI.speed > 0 || (firstPlant() && firstPlant().built) },
      { title: 'Budowa trwa', el: '#ticker', text: 'Czekamy, aż elektrownia ruszy. W lewym dolnym rogu jest kronika – trafiają tam wszystkie wiadomości.',
        done: () => firstPlant() && firstPlant().built },
      { title: 'Jest prąd!', map: servedCity, enter: () => { const c = servedCity(); UI.V.centerOn(c.x, c.y, Math.max(1.8, UI.V.cam.z)); },
        text: 'Elektrownia pracuje, a w mieście zapalają się pierwsze okna. Kliknij miasto, żeby zobaczyć, ilu mieszkańców ma już elektryczność.',
        done: () => UI.sel === servedCity() },
      { title: 'Panel miasta', el: '#info', next: true,
        text: 'Tu widzisz elektryfikację miasta i wsi, sieć niskiego napięcia (nN) i zapotrzebowanie w szczycie. Sieć miejska rozbudowuje się sama, a wsie elektryfikujesz przyciskiem, gdy pojawią się chętni.' },
      { title: 'Przegląd i doradca', el: '#tabs button[data-tab="overview"]',
        text: 'W „Przeglądzie” jest wykres doby – kto pokrywa zapotrzebowanie o każdej porze – i Doradca, który wskazuje problemy. Kliknij zakładkę Przegląd.',
        done: () => !UI.sel && UI.tab === 'overview' },
      { title: 'Zadania', el: '#tabs button[data-tab="goals"]', text: 'Historia stawia cele, a za ich wykonanie dostajesz pieniądze i reputację. Zajrzyj do zakładki Zadania.',
        done: () => UI.tab === 'goals' },
      { title: 'Linie przesyłowe', el: '#tools button[data-cat="grid"]', next: true, enter: () => { if (phone()) UI.showPanel(false); },
        text: (lineYear > G.y ? 'Od ' + lineYear + ' r.' : 'Już teraz') + ' w menu Sieć znajdziesz linie. Wybierasz napięcie i klikasz dwa punkty: elektrownię, miasto albo puste pole (tam powstanie stacja). Wyższe napięcie to większa moc i mniejsze straty – z czasem dojdziesz do 400 kV i kabli stałoprądowych.' },
      { title: 'Gdzie wieje i świeci', el: '#layers', next: true,
        text: 'Warstwy mapy: Wiatr i Słońce pokażą, gdzie stawiać farmy, Zasoby – złoża węgla i gazu oraz miejsca na zapory, Popyt – głód prądu w miastach.' },
      { title: 'Historia puka do drzwi', next: true,
        text: 'Wycinki z gazet przyniosą nowe technologie, wojny, kryzysy i ustawy. Stare elektrownie z czasem przestaną się opłacać – zastępuj je nowszymi, a kopalnie i odkrywki zapewnią tańsze paliwo.' },
      { title: 'Do dzieła', next: true, last: true,
        text: 'Dobudowuj bloki, gdy rośnie popyt, elektryfikuj kolejne miasta i pilnuj rezerwy mocy. Samouczek powtórzysz z menu ☰.' },
    ];
  };

  T.start = function () {
    if (!PN.G || !UI.V) return;
    T.steps = T.build(); T.i = 0; T.active = true; T.t0 = performance.now();
    if (!T.card) {
      T.card = document.createElement('div'); T.card.className = 'tut-card'; T.card.setAttribute('role', 'dialog'); T.card.setAttribute('aria-live', 'polite');
      T.ring = document.createElement('div'); T.ring.className = 'tut-ring';
      document.getElementById('app').append(T.ring, T.card);
      T.card.addEventListener('click', (e) => {
        const b = e.target.closest('[data-t]'); if (!b) return;
        if (b.dataset.t === 'skip') T.stop();
        if (b.dataset.t === 'next') T.go(T.i + 1);
      });
    }
    T.go(0);
  };
  T.go = function (i) {
    if (i >= T.steps.length) { T.stop(); return; }
    T.i = Math.max(0, i); const s = T.steps[T.i];
    if (s.enter) try { s.enter(); } catch (e) { /* ignore */ }
    T.render(); T.t0 = performance.now();
  };
  T.stop = function () {
    T.active = false; if (T.card) T.card.hidden = true; if (T.ring) T.ring.hidden = true;
    try { localStorage.setItem('pn_tut_done', '1'); } catch (e) { /* storage unavailable */ }
  };
  T.cancel = function () { T.active = false; if (T.card) T.card.hidden = true; if (T.ring) T.ring.hidden = true; };
  T.done = function () { try { return localStorage.getItem('pn_tut_done') === '1'; } catch (e) { return false; } };
  T.render = function () {
    const s = T.steps[T.i];
    T.card.innerHTML = '<div class="tut-k">Samouczek · krok ' + (T.i + 1) + ' z ' + T.steps.length + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p><div class="row end">' +
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
    const cw = T.card.offsetWidth, ch = T.card.offsetHeight, m = 16, top = 76;
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
