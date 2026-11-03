# Pod Napięciem

**Zagraj w przeglądarce: https://agentsmill.github.io/pod-napieciem/**

Ekonomiczna gra o budowie i utrzymaniu sieci elektroenergetycznej, z widokiem mapy z góry i grafiką rysowaną ołówkiem. Dwie kampanie: **Polska 1888–2050** i **USA 1882–2050**. Technologie, ceny, popyt i wydarzenia idą za prawdziwą historią, a po 2026 r. za ogłoszonymi planami (atom, morski wiatr, centra danych AI, fuzja).

## Uruchomienie

```bash
node build.js
```

Powstają trzy pliki:

- `dist/pod-napieciem.html` – cała gra w jednym pliku; otwórz w przeglądarce (potrzebny internet tylko dla czcionek Google i biblioteki Rough.js z jsDelivr),
- `index.html` – kopia powyższego w katalogu głównym, którą serwuje GitHub Pages,
- `dist/artifact.html` – ta sama gra bez znaczników `<html>/<head>/<body>`, do publikacji jako artefakt.

Przy pierwszym uruchomieniu gra proponuje **samouczek**: notatka na marginesie prowadzi przez pierwszą elektrownię, upływ czasu, panel miasta, zadania, linie i warstwy mapy, a sama przechodzi dalej, gdy wykonasz polecenie. Można go powtórzyć z menu ☰.

## Świat zmienia się sam

- **Technologie przychodzą z historią.** Nie ma drzewka badań: w menu budowy widać tylko to, co już wynaleziono. Nowość ogłasza karta „Nowa technologia” z opisem, co zmienia; pierwsza linia przesyłowa ma własny krótki samouczek.
- **Wycinki zamiast przestojów.** Zwykłe wydarzenia przychodzą jako wycinki z gazety po lewej stronie i nie zatrzymują gry. Czas staje tylko przy wojnach, zmianach granic i ustroju, wielkich awariach i kryzysach (w Polsce 14 takich chwil, w USA 13). Przy prędkości 1× do współczesności dochodzi się w ok. 40 minut gry bez pauz.
- **Transformacja.** Po otwarciu rynku (Polska: Prawo energetyczne 1997; USA: PURPA 1978 dla małych źródeł, Order 888 w 1996 dla wszystkich) prywatni inwestorzy zgłaszają własne elektrownie: gaz, wiatr, słońce, magazyny, morski wiatr, SMR. Gracz decyduje o przyłączeniu, buduje do nich linie (rok na przyłączenie) i kupuje ich energię po cenie z umowy. Im później, tym projektów więcej i są większe.
- **Warstwy mapy** pojawiają się razem z technologią: Wiatr i Słońce dopiero, gdy istnieją elektrownie wiatrowe i słoneczne. Na warstwie Zasoby złoża dostępne dziś są wyraźne, a przyszłe – blade, z rokiem historycznego wydobycia.

## Czytanie mapy

- **Zasięg**: przy stawianiu elektrowni przerywane kręgi pokazują, dokąd sięgnie jej prąd (w mieście siecią nN, dalej liniami dostępnych napięć); przy linii – jej rozsądny i maksymalny zasięg.
- **Napięcia** są podpisane na liniach po przybliżeniu; kropkowana kreska `nN` to sieć niskiego napięcia miasta, gdy elektrownia stoi w jego obrębie.
- **Skąd płynie prąd**: po kliknięciu miasta panel pokazuje udziały elektrowni w jego energii, a mapa – drogę prądu (żółta poświata). Po kliknięciu elektrowni – dokąd trafia jej energia. Udziały liczy metoda proporcjonalnego podziału przepływów (Bialek).
- **Legenda** (przycisk w prawym dolnym rogu) objaśnia wszystkie linie i znaczki.

## GitHub Pages

Repozytorium jest gotowe do publikacji bez żadnego kroku budowania po stronie GitHuba: w *Settings → Pages* wybierz *Deploy from a branch*, gałąź `main` i katalog `/ (root)`. Po każdej zmianie w `src/` uruchom `node build.js` i zatwierdź nowy `index.html`.

## Jak to działa

| Warstwa | Pliki | Co robi |
|---|---|---|
| Dane | `src/data/` | technologie (`tech.js`), scenariusze z krzywymi cen i popytu (`scen_pl.js`, `scen_us.js`), kontury z Natural Earth (`geo_*.js`), miasta, zapory, złoża, parki, połączenia z sąsiadami (`places_*.js`), wydarzenia historyczne ze źródłami (`events_*.js`, notatki w `RESEARCH_NOTES.md`) |
| Silnik | `src/engine/` | mapa na siatce kafli (8 km w Polsce, 26 km w USA), rozpływ mocy jako przepływ o minimalnym koszcie z limitami linii (`flow.js`), miesięczna symulacja: 8 godzin doby, pogoda, magazyny, paliwa i kopalnie, finanse, reputacja, misje (`sim.js`) |
| Grafika | `src/render/` | papier, grafit i kreskowanie (`sketch.js`), szkice budynków przez Rough.js (`sprites.js`), mapa renderowana kawałkami w trzech poziomach szczegółowości (`terrain.js`), kamera, linie z płynącym prądem, miasta zapalające światła (`view.js`) |
| Interfejs | `src/ui/ui.js`, `src/ui/cards.js`, `src/ui/tutorial.js`, `src/main.js` | pasek stanu, budowa, panel, wykresy doby i historii, karty z wycinkami, nowościami i ofertami inwestorów, legenda, samouczki, zapis gry w przeglądarce |

## Test bez przeglądarki

```bash
node test/headless.js PL 60
```

Prosty bot gra przez 60 lat i wypisuje co 5 lat stan kasy, popytu, mocy i misji – do wyłapywania błędów i strojenia ekonomii.

## Źródła

Kontury: [Natural Earth](https://www.naturalearthdata.com/) (domena publiczna), granice stanów: `us-atlas`. Rysowanie: [Rough.js](https://roughjs.com/) (MIT). Źródła wydarzeń są podane przy każdym wydarzeniu w grze i w `src/data/RESEARCH_NOTES.md`.
