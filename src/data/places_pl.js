/* Pod Napięciem – dane miejsc: Polska (granice współczesne).
   Populacje podawane w tysiącach i przeliczane przez P() na liczby osób.
   Wartości przybliżone (±10–15%) tam, gdzie brak dokładnych danych. */
(function () {
  var Y = [1880, 1890, 1900, 1910, 1920, 1930, 1940, 1946, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030, 2050];
  function P(a) { var o = {}; for (var i = 0; i < Y.length; i++) o[Y[i]] = Math.round(a[i] * 1000); return o; }
  function U(a) { var o = {}; for (var i = 0; i < Y.length; i++) o[Y[i]] = a[i]; return o; }

  window.PN_PLACES_PL = {
    country: {
      // ludność w granicach współczesnej Polski (tys.)
      pop: P([20500, 22500, 25000, 28500, 27200, 30800, 32000, 23900, 25000, 29800, 32600, 35600, 38100, 38250, 38500, 38300, 37000, 34000]),
      urban: U([0.24, 0.27, 0.30, 0.33, 0.33, 0.35, 0.37, 0.34, 0.39, 0.48, 0.52, 0.58, 0.61, 0.62, 0.61, 0.60, 0.60, 0.62])
    },

    cities: [
      { id: 'waw', name: 'Warszawa', lat: 52.23, lon: 21.01, pop: P([420, 520, 740, 900, 960, 1200, 1300, 480, 800, 1140, 1315, 1600, 1655, 1672, 1700, 1790, 1830, 1850]), tags: ['capital', 'industry'], note: 'Elektrownia Powiśle (1904) zasilała tramwaje; dziś miasto grzeją EC Żerań i Siekierki.' },
      { id: 'krk', name: 'Kraków', lat: 50.06, lon: 19.94, pop: P([110, 130, 150, 180, 200, 250, 280, 299, 344, 481, 583, 716, 751, 758, 757, 780, 790, 780]), tags: ['industry'], note: 'Elektrownia miejska na Dajworze od 1905; Nowa Huta (1954) to gigantyczny odbiorca prądu.' },
      { id: 'lod', name: 'Łódź', lat: 51.76, lon: 19.46, pop: P([77, 140, 320, 410, 452, 605, 670, 497, 620, 709, 762, 832, 848, 790, 728, 680, 630, 540]), tags: ['industry'], note: 'Fabryki włókiennicze miały własne siłownie; elektrownia miejska EC1 ruszyła w 1907 r.' },
      { id: 'wro', name: 'Wrocław', lat: 51.11, lon: 17.03, names: [{ until: 1945, name: 'Breslau' }], pop: P([300, 360, 460, 560, 570, 630, 640, 171, 309, 430, 523, 618, 643, 634, 632, 642, 650, 640]), tags: ['industry'], note: 'Dwie elektrownie wodne na Odrze (Wrocław I i II, lata 20.) pracują w centrum do dziś.' },
      { id: 'poz', name: 'Poznań', lat: 52.41, lon: 16.93, names: [{ until: 1919, name: 'Posen' }], pop: P([90, 100, 135, 175, 185, 250, 272, 268, 321, 408, 470, 553, 590, 578, 552, 533, 515, 480]), tags: ['industry'], note: 'Elektrownia miejska „Grobla” ruszyła 31 X 1904 r. i zasilała miasto przez pół wieku.' },
      { id: 'gda', name: 'Gdańsk', lat: 54.35, lon: 18.65, names: [{ until: 1945, name: 'Danzig' }], pop: P([140, 155, 170, 190, 210, 245, 260, 118, 194, 286, 365, 456, 465, 458, 456, 470, 475, 465]), tags: ['port', 'industry'], note: 'Elektrownia wodna Straszyn na Raduni (1910) dostarczała prąd do Gdańska.' },
      { id: 'szc', name: 'Szczecin', lat: 53.43, lon: 14.55, names: [{ until: 1945, name: 'Stettin' }], pop: P([115, 145, 225, 250, 250, 275, 380, 73, 179, 269, 337, 388, 413, 416, 406, 396, 380, 350]), tags: ['port', 'industry'], note: 'Pobliska Elektrownia Dolna Odra (od 1974) zasila Pomorze Zachodnie.' },
      { id: 'byd', name: 'Bydgoszcz', lat: 53.12, lon: 18.01, names: [{ until: 1920, name: 'Bromberg' }], pop: P([45, 55, 75, 90, 95, 120, 145, 134, 163, 231, 280, 357, 382, 386, 363, 340, 315, 280]), tags: ['industry'], note: 'Zapora w Koronowie na Brdzie (1961) dała regionowi prąd i zbiornik retencyjny.' },
      { id: 'tor', name: 'Toruń', lat: 53.01, lon: 18.60, names: [{ until: 1920, name: 'Thorn' }], pop: P([26, 33, 40, 52, 45, 60, 80, 68, 81, 105, 129, 179, 201, 206, 205, 199, 192, 175]), tags: ['industry'], note: 'Zakłady Elana (od 1959) produkowały włókna syntetyczne i zużywały mnóstwo energii.' },
      { id: 'lub', name: 'Lublin', lat: 51.25, lon: 22.57, pop: P([36, 45, 50, 65, 94, 113, 122, 100, 117, 181, 236, 307, 349, 357, 348, 339, 330, 300]), note: 'Lubelskie Zagłębie Węglowe z kopalnią Bogdanka (od 1982) leży ok. 40 km na wschód.' },
      { id: 'bia', name: 'Białystok', lat: 53.13, lon: 23.16, pop: P([34, 50, 63, 80, 77, 91, 107, 56, 69, 121, 167, 219, 268, 285, 295, 297, 292, 270]), tags: ['industry'], note: 'Dawne miasto włókiennicze; dziś ciepło i prąd daje EC Białystok, także z biomasy.' },
      { id: 'kat', name: 'Katowice', lat: 50.26, lon: 19.02, names: [{ until: 1922, name: 'Kattowitz' }], pop: P([50, 70, 95, 120, 130, 165, 175, 165, 200, 280, 330, 361, 367, 327, 309, 290, 270, 230]), tags: ['mining', 'industry'], note: 'Stolica GOP: kopalnie węgla (m.in. Wujek) zasilały huty i elektrownie regionu.' },
      { id: 'gli', name: 'Gliwice', lat: 50.29, lon: 18.67, names: [{ until: 1945, name: 'Gleiwitz' }], pop: P([22, 28, 55, 70, 75, 112, 120, 110, 120, 134, 171, 197, 214, 205, 196, 177, 165, 140]), tags: ['mining', 'industry'], note: 'Tu w 1796 r. uruchomiono pierwszy na kontynencie wielki piec opalany koksem.' },
      { id: 'sos', name: 'Sosnowiec', lat: 50.29, lon: 19.10, pop: P([25, 40, 75, 110, 105, 130, 145, 140, 160, 205, 230, 254, 259, 236, 215, 197, 180, 150]), tags: ['mining', 'industry'], note: 'Zagłębie Dąbrowskie: kopalnie i huty zaboru rosyjskiego, obok EC Będzin.' },
      { id: 'ryb', name: 'Rybnik', lat: 50.10, lon: 18.54, pop: P([25, 30, 38, 45, 48, 55, 60, 55, 60, 80, 105, 135, 143, 143, 141, 138, 132, 118]), tags: ['mining'], note: 'Elektrownia Rybnik (od 1972, ok. 1,8 GW) to jedna z największych na Śląsku.' },
      { id: 'bbi', name: 'Bielsko-Biała', lat: 49.82, lon: 19.04, names: [{ until: 1919, name: 'Bielitz' }, { until: 1951, name: 'Bielsko' }], pop: P([30, 35, 45, 55, 55, 65, 70, 60, 70, 85, 105, 165, 181, 178, 174, 169, 160, 140]), tags: ['industry'], note: 'Miasto sukiennicze; elektryczny tramwaj kursował tu w latach 1895–1971.' },
      { id: 'cze', name: 'Częstochowa', lat: 50.81, lon: 19.12, pop: P([17, 25, 45, 70, 80, 117, 138, 101, 112, 163, 187, 244, 258, 253, 236, 214, 195, 160]), tags: ['industry'], note: 'Huta Częstochowa (od 1896) to duży odbiorca prądu; tramwaje kursują od 1959 r.' },
      { id: 'opo', name: 'Opole', lat: 50.67, lon: 17.93, names: [{ until: 1945, name: 'Oppeln' }], pop: P([20, 25, 35, 40, 42, 52, 58, 35, 45, 66, 87, 115, 128, 130, 125, 127, 123, 110]), note: 'Elektrownia Opole (od 1993; bloki 5 i 6 w 2019 r.) stoi w Brzeziu pod miastem.' },
      { id: 'kie', name: 'Kielce', lat: 50.87, lon: 20.63, pop: P([11, 15, 24, 30, 41, 58, 70, 50, 63, 91, 126, 190, 214, 210, 201, 192, 180, 155]), note: 'Region wapienia: cementownie i zakłady wapiennicze to duzi odbiorcy energii.' },
      { id: 'rze', name: 'Rzeszów', lat: 50.04, lon: 22.00, pop: P([18, 20, 25, 32, 35, 40, 45, 38, 45, 70, 95, 140, 165, 175, 182, 197, 205, 205]), tags: ['industry'], note: 'COP przyniósł tu w 1937 r. wytwórnię silników lotniczych (dziś Pratt & Whitney).' },
      { id: 'ols', name: 'Olsztyn', lat: 53.78, lon: 20.48, names: [{ until: 1945, name: 'Allenstein' }], pop: P([9, 20, 25, 34, 38, 45, 50, 29, 50, 68, 94, 136, 162, 172, 176, 171, 165, 150]), note: 'Tramwaje elektryczne kursowały tu w latach 1907–1965 i wróciły w 2015 r.' },
      { id: 'zgo', name: 'Zielona Góra', lat: 51.94, lon: 15.51, names: [{ until: 1945, name: 'Grünberg' }], pop: P([25, 28, 33, 36, 37, 40, 42, 30, 40, 66, 86, 117, 130, 136, 138, 141, 140, 130]), note: 'Miasto winnic i włókiennictwa; elektrociepłownia gazowo-parowa działa od 2004 r.' },
      { id: 'gor', name: 'Gorzów Wielkopolski', lat: 52.73, lon: 15.24, names: [{ until: 1945, name: 'Landsberg' }], pop: P([23, 28, 33, 40, 43, 45, 48, 22, 32, 58, 75, 107, 124, 126, 125, 120, 112, 98]), tags: ['industry'], note: 'EC Gorzów (1999) spala zaazotowany gaz z pobliskich złóż Niżu Polskiego.' },
      { id: 'bel', name: 'Bełchatów', lat: 51.37, lon: 19.36, pop: P([5, 6, 7, 8, 7, 8, 8, 6, 7, 9, 12, 46, 63, 61, 59, 56, 50, 40]), tags: ['mining'], note: 'Elektrownia Bełchatów (od 1981, ok. 5 GW) – największa elektrownia węglowa w Europie.' },
      { id: 'kon', name: 'Konin', lat: 52.22, lon: 18.26, pop: P([8, 9, 10, 12, 12, 13, 14, 12, 14, 25, 50, 70, 81, 82, 78, 73, 66, 55]), tags: ['mining', 'industry'], note: 'Zagłębie węgla brunatnego: elektrownie Konin (1958), Adamów (1964), Pątnów (1967).' },
      { id: 'koz', name: 'Kozienice', lat: 51.58, lon: 21.55, pop: P([5, 5, 6, 7, 7, 8, 8, 6, 7, 9, 12, 18, 22, 21, 18, 17, 16, 14]), note: 'Elektrownia Kozienice (od 1972, ok. 4 GW) – największa na węgiel kamienny w Polsce.' },
      { id: 'pol', name: 'Połaniec', lat: 50.43, lon: 21.28, pop: P([2, 2, 2, 2.2, 2.2, 2.3, 2.4, 2, 2.5, 2.8, 3, 5, 8, 8.5, 8.3, 7.8, 7.4, 6.5]), note: 'Elektrownia Połaniec (od 1979); Zielony Blok (2012) spala wyłącznie biomasę.' },
      { id: 'tur', name: 'Turek', lat: 52.02, lon: 18.50, pop: P([6, 7, 8, 9, 8, 9, 10, 8, 9, 15, 20, 26, 31, 30, 28, 26, 24, 20]), tags: ['mining'], note: 'Elektrownia Adamów (1964–2017) spalała węgiel brunatny z odkrywek pod Turkiem.' },
      { id: 'bog', name: 'Bogatynia', lat: 50.91, lon: 14.96, names: [{ until: 1945, name: 'Reichenau' }], pop: P([6, 7, 8, 8, 8, 8, 8, 5, 6, 9, 15, 18, 20, 19, 18, 17, 15, 12]), tags: ['mining'], note: 'Elektrownia i odkrywka Turów (od 1962) tuż przy granicy z Niemcami i Czechami.' },
      { id: 'ost', name: 'Ostrołęka', lat: 53.08, lon: 21.57, pop: P([5, 6, 7, 9, 9, 12, 13, 8, 10, 14, 21, 40, 51, 54, 53, 51, 48, 42]), note: 'Ostrołęka B (1972) na węgiel; blok C porzucono w 2020 r. na rzecz gazowego.' },
      { id: 'stw', name: 'Stalowa Wola', lat: 50.58, lon: 22.05, founded: 1937, pop: P([0, 0, 0, 0, 0, 0, 10, 15, 20, 30, 41, 63, 71, 69, 64, 60, 55, 45]), tags: ['industry'], note: 'Miasto COP zbudowane od 1937 r. przy hucie; blok gazowo-parowy 450 MW działa od 2020 r.' },
      { id: 'plo', name: 'Płock', lat: 52.55, lon: 19.70, pop: P([20, 22, 27, 30, 25, 33, 35, 34, 34, 46, 72, 105, 123, 128, 124, 118, 110, 95]), tags: ['industry'], note: 'Rafineria od 1964 r.; Orlen uruchomił tu w 2018 r. blok gazowo-parowy ok. 600 MW.' },
      { id: 'pul', name: 'Puławy', lat: 51.42, lon: 21.97, pop: P([6, 7, 8, 10, 8, 10, 11, 9, 11, 16, 32, 45, 53, 53, 49, 47, 43, 37]), tags: ['industry'], note: 'Zakłady Azotowe Puławy (od 1966) – nawozy i amoniak pochłaniają ogrom energii.' },
      { id: 'pli', name: 'Police', lat: 53.55, lon: 14.57, names: [{ until: 1945, name: 'Pölitz' }], pop: P([4, 4, 5, 5, 5, 5, 6, 3, 4, 7, 21, 30, 35, 35, 34, 32, 30, 26]), tags: ['industry', 'port'], note: 'Hydrierwerke Pölitz (1940) robiły benzynę z węgla; dziś Grupa Azoty Police.' },
      { id: 'lbn', name: 'Lubin', lat: 51.40, lon: 16.20, names: [{ until: 1945, name: 'Lüben' }], pop: P([7, 7, 8, 8, 9, 10, 11, 2, 4, 5, 25, 70, 82, 79, 74, 72, 68, 60]), tags: ['mining'], note: 'Miedź odkryta w 1957 r. (J. Wyżykowski); kopalnie KGHM pracują od 1968 r.' },
      { id: 'glo', name: 'Głogów', lat: 51.66, lon: 16.08, names: [{ until: 1945, name: 'Glogau' }], pop: P([21, 22, 24, 25, 25, 26, 33, 1, 4, 9, 24, 65, 74, 74, 69, 66, 61, 52]), tags: ['industry'], note: 'Huta Miedzi Głogów (od 1971) – jeden z największych odbiorców prądu w kraju.' },
      { id: 'gdy', name: 'Gdynia', lat: 54.52, lon: 18.53, founded: 1926, pop: P([0, 0, 0, 0, 0, 50, 120, 77, 103, 147, 191, 236, 251, 253, 248, 245, 235, 210]), tags: ['port', 'industry'], note: 'Port budowany od 1921 r.; trolejbusy kursują tu nieprzerwanie od 1943 r.' },
      { id: 'elb', name: 'Elbląg', lat: 54.16, lon: 19.40, names: [{ until: 1945, name: 'Elbing' }], pop: P([35, 41, 52, 58, 68, 72, 86, 21, 49, 76, 89, 111, 125, 129, 124, 119, 110, 95]), tags: ['industry'], note: 'Zakłady Zamech (dziś GE) budowały turbiny parowe dla polskich elektrowni.' },
      { id: 'wlo', name: 'Włocławek', lat: 52.65, lon: 19.07, pop: P([20, 25, 30, 40, 41, 56, 66, 50, 52, 68, 78, 107, 121, 123, 116, 107, 98, 82]), tags: ['industry'], note: 'Zapora na Wiśle (1970) – największa przepływowa elektrownia wodna w Polsce.' },
      { id: 'tar', name: 'Tarnów', lat: 50.01, lon: 20.99, pop: P([24, 28, 31, 36, 35, 45, 55, 36, 41, 72, 86, 111, 121, 120, 113, 108, 100, 85]), tags: ['industry'], note: 'Zakłady Azotowe w Mościcach (1927–29) – jeden z największych odbiorców prądu II RP.' },
      { id: 'prz', name: 'Przemyśl', lat: 49.78, lon: 22.77, pop: P([23, 35, 47, 54, 48, 51, 60, 33, 41, 48, 53, 64, 68, 68, 66, 60, 54, 44]), note: 'Pod miastem leży złoże gazu Przemyśl (odkryte 1958) – jedno z największych w kraju.' },
      { id: 'zam', name: 'Zamość', lat: 50.72, lon: 23.25, pop: P([8, 10, 12, 15, 19, 25, 26, 17, 21, 29, 37, 53, 62, 68, 66, 62, 57, 48]), note: 'Do Zamościa dochodzi linia 220 kV z ukraińskiej elektrowni Dobrotwór.' },
      { id: 'suw', name: 'Suwałki', lat: 54.10, lon: 22.93, pop: P([15, 18, 22, 25, 16, 22, 25, 15, 16, 19, 25, 47, 61, 68, 70, 69, 66, 58]), note: 'Okolice Suwałk to farmy wiatrowe; nieopodal biegnie linia LitPol Link (2015).' },
      { id: 'kos', name: 'Koszalin', lat: 54.19, lon: 16.18, names: [{ until: 1945, name: 'Köslin' }], pop: P([17, 18, 20, 23, 26, 31, 33, 12, 18, 41, 64, 90, 108, 110, 109, 106, 100, 88]), note: 'Kopań pod Koszalinem badano jako lokalizację elektrowni jądrowej.' },
      { id: 'slu', name: 'Słupsk', lat: 54.46, lon: 17.03, names: [{ until: 1945, name: 'Stolp' }], pop: P([23, 24, 27, 34, 38, 43, 50, 30, 37, 55, 69, 90, 102, 100, 96, 90, 83, 70]), note: 'W pobliskim Wierzbięcinie kończy się podmorski kabel SwePol do Szwecji (2000).' },
      { id: 'leg', name: 'Legnica', lat: 51.21, lon: 16.16, names: [{ until: 1945, name: 'Liegnitz' }], pop: P([37, 46, 54, 66, 72, 73, 83, 34, 46, 64, 75, 94, 105, 108, 103, 99, 93, 80]), tags: ['industry'], note: 'Ośrodek Zagłębia Miedziowego; Huta Miedzi Legnica działa od 1953 r.' },
      { id: 'wal', name: 'Wałbrzych', lat: 50.77, lon: 16.28, names: [{ until: 1945, name: 'Waldenburg' }], pop: P([50, 60, 75, 85, 90, 95, 100, 85, 95, 115, 125, 136, 141, 134, 120, 111, 100, 80]), tags: ['mining'], note: 'Zagłębie węglowe od XVI w.; ostatnie kopalnie zamknięto w latach 1996–98.' },
      { id: 'jgo', name: 'Jelenia Góra', lat: 50.90, lon: 15.73, names: [{ until: 1945, name: 'Hirschberg' }], pop: P([25, 30, 35, 40, 42, 45, 50, 40, 45, 50, 56, 85, 93, 92, 84, 79, 73, 62]), note: 'Kolej sudecka miała trakcję elektryczną od 1914 r.; Sowieci rozebrali ją w 1945 r.' },
      { id: 'kal', name: 'Kalisz', lat: 51.76, lon: 18.09, pop: P([18, 21, 25, 44, 44, 55, 81, 41, 50, 70, 81, 99, 106, 109, 104, 99, 92, 78]), tags: ['industry'], note: 'Spalony przez Niemców w 1914 r.; odbudowa w latach 20. przyniosła elektryfikację.' },
      { id: 'pio', name: 'Piotrków Trybunalski', lat: 51.40, lon: 19.70, pop: P([23, 26, 31, 40, 41, 51, 52, 41, 45, 58, 60, 76, 81, 80, 77, 72, 67, 58]), note: 'Węzeł Kolei Warszawsko-Wiedeńskiej (1846); pobliski Bełchatów zmienił region.' },
      { id: 'rad', name: 'Radom', lat: 51.40, lon: 21.15, pop: P([15, 18, 28, 40, 61, 78, 90, 70, 70, 128, 158, 199, 226, 230, 222, 210, 195, 168]), tags: ['industry'], note: 'Fabryka Broni (1925) i garbarnie; obok wielka Elektrownia Kozienice.' },
      { id: 'kkz', name: 'Kędzierzyn-Koźle', lat: 50.35, lon: 18.21, names: [{ until: 1945, name: 'Cosel' }, { until: 1975, name: 'Kędzierzyn' }], pop: P([15, 16, 18, 20, 22, 25, 30, 20, 25, 40, 55, 70, 72, 66, 64, 59, 54, 45]), tags: ['industry'], note: 'W Heydebreck III Rzesza robiła benzynę syntetyczną; dziś Grupa Azoty ZAK.' }
    ],

    hydro: [
      { id: 'solina', name: 'Solina', river: 'San', lat: 49.396, lon: 22.457, mw: 200, type: 'dam', year: 1968, note: 'Najwyższa zapora w Polsce (82 m); elektrownia może też pompować wodę z Myczkowiec.' },
      { id: 'myczkowce', name: 'Myczkowce', river: 'San', lat: 49.437, lon: 22.418, mw: 8.3, type: 'dam', year: 1961, note: 'Zbiornik wyrównawczy poniżej Soliny; dolny zbiornik dla jej pomp.' },
      { id: 'roznow', name: 'Rożnów', river: 'Dunajec', lat: 49.765, lon: 20.698, mw: 56, type: 'dam', year: 1941, note: 'Budowę rozpoczęto w 1935 r. w ramach COP; pierwsze turbiny ruszyły w czasie wojny.' },
      { id: 'czchow', name: 'Czchów', river: 'Dunajec', lat: 49.835, lon: 20.676, mw: 8, type: 'dam', year: 1949, note: 'Zbiornik wyrównawczy dla Rożnowa, ukończony po wojnie.' },
      { id: 'niedzica', name: 'Niedzica (Czorsztyn)', river: 'Dunajec', lat: 49.418, lon: 20.316, mw: 92.75, type: 'dam', year: 1997, note: 'Zespół Czorsztyn–Niedzica–Sromowce chroni przed powodzią; turbiny mogą pompować.' },
      { id: 'porabka', name: 'Porąbka', river: 'Soła', lat: 49.807, lon: 19.207, mw: 12.6, type: 'dam', year: 1936, note: 'Zapora z lat 1928–36 – jedna z pierwszych dużych zapór II RP.' },
      { id: 'tresna', name: 'Tresna', river: 'Soła', lat: 49.743, lon: 19.207, mw: 21, type: 'dam', year: 1967, note: 'Górny stopień kaskady Soły; Jezioro Żywieckie zalało dawne wsie.' },
      { id: 'zar', name: 'Porąbka-Żar', river: 'Soła', lat: 49.795, lon: 19.215, mw: 500, type: 'pumped', year: 1979, note: 'Górny zbiornik na szczycie góry Żar, elektrownia ukryta we wnętrzu masywu.' },
      { id: 'zarnowiec', name: 'Żarnowiec', river: 'Jezioro Żarnowieckie', lat: 54.75, lon: 18.08, mw: 716, type: 'pumped', year: 1983, note: 'Największa elektrownia szczytowo-pompowa w Polsce; miała współpracować z EJ Żarnowiec.' },
      { id: 'zydowo', name: 'Żydowo', river: 'Radew', lat: 54.03, lon: 16.73, mw: 167, type: 'pumped', year: 1971, note: 'Pierwsza duża polska elektrownia szczytowo-pompowa, między jeziorami Kwiecko i Kamienne.' },
      { id: 'dychow', name: 'Dychów', river: 'Bóbr', lat: 51.99, lon: 15.10, mw: 90, type: 'pumped', year: 1936, note: 'Niemiecka elektrownia szczytowo-pompowa z 1936 r.; po wojnie odbudowana.' },
      { id: 'wloclawek', name: 'Włocławek', river: 'Wisła', lat: 52.637, lon: 19.143, mw: 162, type: 'ror', year: 1970, note: 'Jedyny zrealizowany stopień Kaskady Dolnej Wisły; największa elektrownia przepływowa.' },
      { id: 'grodek', name: 'Gródek', river: 'Wda', lat: 53.53, lon: 18.40, mw: 3.9, type: 'ror', year: 1923, note: 'Jedna z pierwszych elektrowni wodnych odrodzonej Polski, pracuje od 1923 r.' },
      { id: 'zur', name: 'Żur', river: 'Wda', lat: 53.43, lon: 18.28, mw: 8, type: 'dam', year: 1930, note: 'Elektrownia z 1930 r. zasilała Pomorze i rozwijającą się Gdynię.' },
      { id: 'koronowo', name: 'Koronowo', river: 'Brda', lat: 53.31, lon: 17.96, mw: 26, type: 'dam', year: 1961, note: 'Zalew Koronowski na Brdzie – największa elektrownia wodna regionu bydgoskiego.' },
      { id: 'debe', name: 'Dębe', river: 'Narew', lat: 52.50, lon: 20.93, mw: 20, type: 'ror', year: 1963, note: 'Zapora tworzy Zalew Zegrzyński – rezerwuar wody i rekreacji dla Warszawy.' },
      { id: 'otmuchow', name: 'Otmuchów', river: 'Nysa Kłodzka', lat: 50.47, lon: 17.15, mw: 4.8, type: 'dam', year: 1933, note: 'Niemiecka zapora przeciwpowodziowa (Ottmachau) z małą elektrownią.' },
      { id: 'jeziorsko', name: 'Jeziorsko', river: 'Warta', lat: 51.77, lon: 18.67, mw: 4.9, type: 'dam', year: 1986, note: 'Największy zbiornik na Warcie; chroni przed powodzią i jest ostoją ptaków wodnych.' },
      { id: 'pilchowice', name: 'Pilchowice', river: 'Bóbr', lat: 50.95, lon: 15.64, mw: 7.6, type: 'dam', year: 1912, note: 'Zapora Mauer (1912) – jedna z najwyższych w ówczesnych Niemczech; pracuje do dziś.' },
      { id: 'straszyn', name: 'Straszyn', river: 'Radunia', lat: 54.28, lon: 18.58, mw: 4.3, type: 'dam', year: 1910, note: 'Elektrownia z 1910 r. dostarczała prąd do Gdańska; pracuje do dziś.' },
      { id: 'siarzewo', name: 'Siarzewo', river: 'Wisła', lat: 52.80, lon: 18.98, mw: 80, type: 'ror', year: null, note: 'Planowany stopień poniżej Włocławka (ok. 350 GWh/rok); spór z ekologami trwa od lat.' },
      { id: 'kaskada_chelmno', name: 'Chełmno (Kaskada Dolnej Wisły)', river: 'Wisła', lat: 53.35, lon: 18.43, mw: 100, type: 'ror', year: null, note: 'Jeden z 10 stopni Kaskady Dolnej Wisły z lat 60.; nigdy nie zbudowany.' },
      { id: 'mloty', name: 'Młoty', river: 'Bystrzyca Dusznicka', lat: 50.33, lon: 16.53, mw: 750, type: 'pumped', year: null, note: 'Budowę elektrowni szczytowo-pompowej przerwano w 1981 r.; wraca jako projekt.' }
    ],

    deposits: [
      { kind: 'coal', name: 'Górnośląskie Zagłębie Węglowe', poly: [[18.20, 50.10], [18.30, 50.35], [18.55, 50.45], [18.85, 50.48], [19.15, 50.40], [19.45, 50.30], [19.62, 50.15], [19.55, 49.98], [19.30, 49.92], [19.05, 49.88], [18.75, 49.85], [18.55, 49.88], [18.35, 49.93], [18.25, 50.00]], richness: 1.0, from: 1800, note: 'Największe zagłębie węgla kamiennego w UE; wydobycie przemysłowe od końca XVIII w.' },
      { kind: 'coal', name: 'Lubelskie Zagłębie Węglowe (Bogdanka)', poly: [[22.70, 51.55], [23.05, 51.50], [23.45, 51.30], [23.60, 51.10], [23.35, 51.05], [23.05, 51.15], [22.80, 51.25], [22.65, 51.40]], richness: 0.6, from: 1982, note: 'Odkryte w latach 60.; kopalnia Bogdanka wydobywa węgiel od 1982 r.' },
      { kind: 'coal', name: 'Dolnośląskie Zagłębie Węglowe', poly: [[16.10, 50.85], [16.40, 50.85], [16.60, 50.65], [16.55, 50.52], [16.35, 50.55], [16.15, 50.70]], richness: 0.25, from: 1800, note: 'Wałbrzych i Nowa Ruda: trudne, metanowe złoża; kopalnie zamknięto do 2000 r.' },
      { kind: 'lignite', name: 'Bełchatów', circle: { lat: 51.25, lon: 19.32, radiusKm: 8 }, richness: 0.9, from: 1980, note: 'Złoże odkryte w 1960 r.; odkrywka od 1977, węgiel od 1980 r.' },
      { kind: 'lignite', name: 'Szczerców', circle: { lat: 51.22, lon: 19.10, radiusKm: 7 }, richness: 0.7, from: 2009, note: 'Drugie pole odkrywki Bełchatów, węgiel wydobywany od 2009 r.' },
      { kind: 'lignite', name: 'Turów', circle: { lat: 50.92, lon: 14.92, radiusKm: 6 }, richness: 0.6, from: 1904, note: 'Odkrywka od 1904 r.; spór z Czechami przed TSUE w 2021 r.' },
      { kind: 'lignite', name: 'Konin – Adamów – Pątnów', poly: [[18.05, 52.45], [18.45, 52.45], [18.65, 52.30], [18.65, 52.05], [18.45, 51.95], [18.25, 52.05], [18.05, 52.20]], richness: 0.5, from: 1942, note: 'Wydobycie przemysłowe od czasu wojny; po 1945 r. zagłębie elektrowni ZE PAK.' },
      { kind: 'lignite', name: 'Sieniawa', circle: { lat: 52.33, lon: 15.42, radiusKm: 3 }, richness: 0.1, from: 1873, note: 'Najstarsza czynna kopalnia węgla brunatnego w Polsce (od 1873 r.).' },
      { kind: 'lignite', name: 'Złoczew', circle: { lat: 51.40, lon: 18.60, radiusKm: 6 }, richness: 0.5, from: 2025, note: 'Złoże ok. 500 mln t – następca Bełchatowa; w 2020 r. odstąpiono od budowy kopalni.' },
      { kind: 'lignite', name: 'Gubin – Brody', circle: { lat: 51.95, lon: 14.80, radiusKm: 10 }, richness: 0.6, from: 2025, note: 'Jedno z największych niezagospodarowanych złóż; protesty mieszkańców.' },
      { kind: 'gas', name: 'Gaz Podkarpacia', poly: [[20.70, 50.15], [21.30, 50.40], [22.00, 50.55], [22.80, 50.45], [23.20, 50.25], [23.00, 49.95], [22.80, 49.75], [22.30, 49.85], [21.60, 49.90], [21.00, 49.95]], richness: 0.5, from: 1950, note: 'Złoża Przemyśl (1958), Lubaczów i Jarosław – trzon krajowego wydobycia gazu.' },
      { kind: 'gas', name: 'Gaz Niżu Polskiego', poly: [[15.00, 52.95], [15.80, 52.95], [16.60, 52.60], [17.30, 52.20], [17.20, 51.85], [16.50, 51.75], [15.60, 52.00], [14.90, 52.40]], richness: 0.6, from: 1970, note: 'Gaz zaazotowany Wielkopolski i Ziemi Lubuskiej, eksploatowany od lat 70.' },
      { kind: 'oil', name: 'Bóbrka – Krosno', circle: { lat: 49.62, lon: 21.72, radiusKm: 20 }, richness: 0.15, from: 1854, note: 'Ignacy Łukasiewicz otworzył tu w 1854 r. jedną z pierwszych kopalń ropy na świecie.' },
      { kind: 'oil', name: 'Barnówko–Mostno–Buszewo (BMB)', circle: { lat: 52.80, lon: 14.80, radiusKm: 8 }, richness: 0.3, from: 2001, note: 'Największe krajowe złoże ropy, odkryte w 1993 r.' },
      { kind: 'oil', name: 'Lubiatów–Międzychód–Grotów (LMG)', circle: { lat: 52.62, lon: 15.85, radiusKm: 8 }, richness: 0.2, from: 2013, note: 'Ropa i gaz eksploatowane przez PGNiG od 2013 r.' },
      { kind: 'geothermal', name: 'Podhale', circle: { lat: 49.35, lon: 19.95, radiusKm: 20 }, richness: 0.4, from: 1993, note: 'Wody 80–90°C; geotermia z Bańskiej Niżnej grzeje Zakopane od lat 90.' },
      { kind: 'uranium', name: 'Kowary (Sudety)', circle: { lat: 50.79, lon: 15.83, radiusKm: 10 }, richness: 0.05, from: 1948, note: 'W latach 1948–1973 wydobywano tu uran dla ZSRR.' }
    ],

    protected: [
      { name: 'Białowieski PN', lat: 52.75, lon: 23.85, radiusKm: 12, from: 1932 },
      { name: 'Pieniński PN', lat: 49.42, lon: 20.40, radiusKm: 5, from: 1932 },
      { name: 'Świętokrzyski PN', lat: 50.88, lon: 21.02, radiusKm: 6, from: 1950 },
      { name: 'Tatrzański PN', lat: 49.23, lon: 20.00, radiusKm: 12, from: 1954 },
      { name: 'Babiogórski PN', lat: 49.58, lon: 19.53, radiusKm: 5, from: 1954 },
      { name: 'Ojcowski PN', lat: 50.21, lon: 19.83, radiusKm: 3, from: 1956 },
      { name: 'Wielkopolski PN', lat: 52.27, lon: 16.80, radiusKm: 5, from: 1957 },
      { name: 'Kampinoski PN', lat: 52.32, lon: 20.60, radiusKm: 12, from: 1959 },
      { name: 'Karkonoski PN', lat: 50.78, lon: 15.65, radiusKm: 8, from: 1959 },
      { name: 'Woliński PN', lat: 53.95, lon: 14.50, radiusKm: 6, from: 1960 },
      { name: 'Słowiński PN', lat: 54.73, lon: 17.30, radiusKm: 10, from: 1967 },
      { name: 'Bieszczadzki PN', lat: 49.10, lon: 22.60, radiusKm: 13, from: 1973 },
      { name: 'Roztoczański PN', lat: 50.60, lon: 23.00, radiusKm: 6, from: 1974 },
      { name: 'Gorczański PN', lat: 49.57, lon: 20.13, radiusKm: 5, from: 1981 },
      { name: 'Wigierski PN', lat: 54.05, lon: 23.08, radiusKm: 9, from: 1989 },
      { name: 'Poleski PN', lat: 51.45, lon: 23.17, radiusKm: 7, from: 1990 },
      { name: 'Drawieński PN', lat: 53.10, lon: 15.95, radiusKm: 9, from: 1990 },
      { name: 'PN Gór Stołowych', lat: 50.47, lon: 16.35, radiusKm: 5, from: 1993 },
      { name: 'Biebrzański PN', lat: 53.50, lon: 22.60, radiusKm: 22, from: 1993 },
      { name: 'Magurski PN', lat: 49.52, lon: 21.45, radiusKm: 8, from: 1995 },
      { name: 'Narwiański PN', lat: 53.05, lon: 22.90, radiusKm: 6, from: 1996 },
      { name: 'PN Bory Tucholskie', lat: 53.82, lon: 17.60, radiusKm: 5, from: 1996 },
      { name: 'PN Ujście Warty', lat: 52.60, lon: 14.75, radiusKm: 6, from: 2001 }
    ],

    borders: [
      { id: 'de_krajnik', name: 'Krajnik – Vierraden (Niemcy)', lat: 53.07, lon: 14.38, from: 1967, mw: 1000, note: 'Dawna linia 220 kV do NRD; po 2020 r. przebudowana na 400 kV z przesuwnikami fazowymi.' },
      { id: 'de_mikulowa', name: 'Mikułowa – Hagenwerder (Niemcy)', lat: 51.08, lon: 14.97, from: 1965, mw: 1500, note: 'Linie 220/400 kV pod Zgorzelcem; tędy płyną niemieckie przepływy kołowe.' },
      { id: 'de_gerpol', name: 'Gubin – Eisenhüttenstadt (Niemcy, plan)', lat: 51.95, lon: 14.72, from: 2035, mw: 1500, note: 'Planowane trzecie połączenie 400 kV z Niemcami (GerPol), odkładane od lat.' },
      { id: 'cz_cieszyn', name: 'Wielopole/Dobrzeń – Nošovice/Albrechtice (Czechy)', lat: 49.90, lon: 18.55, from: 1960, mw: 1600, note: 'Linie 220/400 kV pod Cieszynem; od 1962 r. część wspólnego systemu „Mir”.' },
      { id: 'sk_krosno', name: 'Krosno Iskrzynia – Lemešany (Słowacja)', lat: 49.43, lon: 21.70, from: 1998, mw: 1200, note: 'Dwutorowa linia 400 kV przez Przełęcz Dukielską, oddana w 1998 r.' },
      { id: 'ua_750', name: 'Rzeszów – Chmielnicka EJ (Ukraina, 750 kV)', lat: 50.22, lon: 23.50, from: 1985, mw: 2000, note: 'Jedyna polska linia 750 kV, z EJ Chmielnicki; nieczynna od 1993 r.' },
      { id: 'ua_dobrotwor', name: 'Zamość – Dobrotwór (Ukraina)', lat: 50.55, lon: 24.05, from: 1964, mw: 220, note: 'Linia 220 kV z „wyspy” Elektrowni Dobrotwór; import prądu z Ukrainy.' },
      { id: 'by_ros', name: 'Białystok – Roś (Białoruś)', lat: 53.13, lon: 23.93, from: 1964, mw: 300, note: 'Linia 220 kV do Białorusi; od lat praktycznie nieużywana.' },
      { id: 'lt_litpol', name: 'LitPol Link (Litwa)', lat: 54.15, lon: 23.45, from: 2015, mw: 500, note: 'Most energetyczny Ełk–Olita (2015); od lutego 2025 r. Bałtyk pracuje synchronicznie z UE.' },
      { id: 'se_swepol', name: 'SwePol Link (Szwecja)', lat: 54.58, lon: 16.85, from: 2000, mw: 600, note: 'Podmorski kabel HVDC 450 kV do Szwecji; stacja przekształtnikowa w Wierzbięcinie.' }
    ],

    industry: [
      { id: 'nowa_huta', name: 'Huta im. Lenina (Nowa Huta)', lat: 50.07, lon: 20.10, kind: 'steel', from: 1954, to: null, mw: [[1954, 30], [1960, 150], [1975, 450], [1990, 350], [2005, 200], [2020, 120]], note: 'Kombinat z 1954 r. – symbol industrializacji PRL; wielki piec wygaszono w 2020 r.' },
      { id: 'huta_katowice', name: 'Huta Katowice (Dąbrowa Górnicza)', lat: 50.34, lon: 19.27, kind: 'steel', from: 1976, to: null, mw: [[1976, 100], [1980, 450], [1990, 400], [2005, 300], [2020, 250]], note: 'Największa huta PRL (1976), połączona z ZSRR szerokim torem LHS.' },
      { id: 'huta_czestochowa', name: 'Huta Częstochowa', lat: 50.79, lon: 19.13, kind: 'steel', from: 1896, to: null, mw: [[1896, 2], [1913, 10], [1938, 25], [1975, 120], [2000, 60], [2020, 50]], note: 'Huta Hantkego z 1896 r.; specjalizuje się w blachach grubych.' },
      { id: 'huta_warszawa', name: 'Huta Warszawa (Bielany)', lat: 52.30, lon: 20.93, kind: 'steel', from: 1957, to: null, mw: [[1957, 40], [1975, 150], [2000, 120], [2020, 150]], note: 'Stalownia z piecami łukowymi przetapiającymi złom – prąd to główny surowiec.' },
      { id: 'kopalnie_gzw', name: 'Kopalnie Górnego Śląska', lat: 50.25, lon: 19.00, kind: 'mine', from: 1880, to: null, mw: [[1880, 5], [1910, 60], [1938, 150], [1970, 700], [1990, 900], [2020, 400]], note: 'Pompy, wentylatory i wyciągi kopalń węgla to stały, ogromny pobór mocy.' },
      { id: 'kghm', name: 'Kopalnie KGHM (Lubin–Rudna–Polkowice)', lat: 51.45, lon: 16.10, kind: 'mine', from: 1968, to: null, mw: [[1968, 20], [1975, 150], [1990, 280], [2020, 330]], note: 'Kopalnie miedzi sięgają ok. 1300 m w głąb – klimatyzacja i odwadnianie pochłaniają moc.' },
      { id: 'hm_glogow', name: 'Huta Miedzi Głogów', lat: 51.68, lon: 16.04, kind: 'copper', from: 1971, to: null, mw: [[1971, 40], [1980, 120], [2020, 150]], note: 'Przerabia koncentrat z kopalń KGHM; Polska to czołowy producent srebra.' },
      { id: 'hm_legnica', name: 'Huta Miedzi Legnica', lat: 51.22, lon: 16.13, kind: 'copper', from: 1953, to: null, mw: [[1953, 15], [1970, 40], [2020, 50]], note: 'Pierwsza powojenna huta miedzi, początkowo na starych złożach dolnośląskich.' },
      { id: 'azoty_tarnow', name: 'Azoty Tarnów (Mościce)', lat: 50.01, lon: 20.93, kind: 'chem', from: 1929, to: null, mw: [[1929, 20], [1938, 40], [1970, 100], [2020, 120]], note: 'Państwowa Fabryka Związków Azotowych (1927–29) – duma przemysłu II RP.' },
      { id: 'azoty_pulawy', name: 'Azoty Puławy', lat: 51.45, lon: 21.98, kind: 'chem', from: 1966, to: null, mw: [[1966, 60], [1980, 150], [2020, 180]], note: 'Jeden z największych producentów nawozów azotowych w Europie.' },
      { id: 'politz', name: 'Hydrierwerke Pölitz', lat: 53.57, lon: 14.55, kind: 'chem', from: 1940, to: 1945, mw: [[1940, 100], [1944, 200], [1945, 0]], note: 'Benzyna syntetyczna z węgla dla Wehrmachtu; zbombardowana, potem zdemontowana.' },
      { id: 'azoty_police', name: 'Azoty Police', lat: 53.57, lon: 14.55, kind: 'chem', from: 1969, to: null, mw: [[1969, 40], [1980, 100], [2020, 120]], note: 'Zakłady Chemiczne Police (1969) – nawozy fosforowe i azotowe, własny port.' },
      { id: 'azoty_zak', name: 'Azoty Kędzierzyn (ZAK)', lat: 50.35, lon: 18.25, kind: 'chem', from: 1948, to: null, mw: [[1948, 30], [1970, 100], [2020, 100]], note: 'Powstały na ruinach niemieckich zakładów IG Farben w Heydebreck.' },
      { id: 'anwil', name: 'Anwil Włocławek', lat: 52.64, lon: 19.12, kind: 'chem', from: 1971, to: null, mw: [[1971, 30], [1990, 60], [2020, 80]], note: 'Nawozy i PCW; chlor z elektrolizy solanki wymaga dużo prądu.' },
      { id: 'orlen_plock', name: 'Rafineria Orlen Płock', lat: 52.58, lon: 19.65, kind: 'refinery', from: 1964, to: null, mw: [[1964, 30], [1975, 150], [2000, 250], [2020, 350]], note: 'Największa rafineria w Polsce; ropa płynęła rurociągiem Przyjaźń z ZSRR.' },
      { id: 'rafineria_gdansk', name: 'Rafineria Gdańska', lat: 54.36, lon: 18.71, kind: 'refinery', from: 1975, to: null, mw: [[1975, 40], [2000, 80], [2020, 120]], note: 'Rafineria Gdańska (1975), później Lotos, od 2022 r. w grupie Orlen.' },
      { id: 'al_skawina', name: 'Huta Aluminium Skawina', lat: 49.97, lon: 19.83, kind: 'aluminium', from: 1954, to: 1981, mw: [[1954, 40], [1970, 60], [1981, 0]], note: 'Elektrolizę zamknięto w 1981 r. po protestach przeciw skażeniu fluorem.' },
      { id: 'al_konin', name: 'Huta Aluminium Konin', lat: 52.24, lon: 18.24, kind: 'aluminium', from: 1966, to: null, mw: [[1966, 50], [1975, 90], [1990, 90], [2008, 85], [2010, 15], [2020, 15]], note: 'Elektrolizę aluminium wygaszono ok. 2009 r. przez wysokie ceny prądu.' },
      { id: 'hsw', name: 'Huta Stalowa Wola', lat: 50.57, lon: 22.06, kind: 'military', from: 1938, to: null, mw: [[1938, 10], [1960, 40], [1990, 60], [2020, 30]], note: 'Zakłady Południowe (1938) w COP; dziś HSW produkuje m.in. haubice Krab.' },
      { id: 'tram_waw', name: 'Tramwaje Warszawskie', lat: 52.23, lon: 21.01, kind: 'tram', from: 1908, to: null, mw: [[1908, 3], [1930, 15], [1960, 30], [2020, 40]], note: 'Tramwaje elektryczne od 1908 r. (konne od 1866 r.).' },
      { id: 'tram_slask', name: 'Tramwaje Śląskie', lat: 50.30, lon: 18.95, kind: 'tram', from: 1898, to: null, mw: [[1898, 1], [1930, 8], [1970, 20], [2020, 15]], note: 'Elektryczna sieć tramwajowa łącząca miasta Górnego Śląska od 1898 r.' },
      { id: 'kolej_sudecka', name: 'Śląska Kolej Górska', lat: 50.90, lon: 15.73, kind: 'rail', from: 1914, to: 1945, mw: [[1914, 5], [1930, 15], [1945, 0]], note: 'Trakcja 15 kV AC od 1914 r.; w 1945 r. Sowieci wywieźli całą sieć trakcyjną.' },
      { id: 'pkp_3kv', name: 'Trakcja PKP 3 kV (węzeł warszawski)', lat: 52.22, lon: 20.98, kind: 'rail', from: 1936, to: null, mw: [[1936, 10], [1960, 60], [1990, 250], [2020, 350]], note: 'Elektryfikacja węzła warszawskiego (1936) zapoczątkowała sieć 3 kV PKP.' },
      { id: 'metro_waw', name: 'Metro warszawskie', lat: 52.23, lon: 21.01, kind: 'rail', from: 1995, to: null, mw: [[1995, 5], [2010, 20], [2020, 35], [2030, 50]], note: 'Budowane od 1983 r.; pierwszy odcinek linii M1 otwarto w 1995 r.' },
      { id: 'dc_warszawa', name: 'Centra danych pod Warszawą', lat: 52.20, lon: 20.85, kind: 'datacenter', from: 2015, to: null, mw: [[2015, 20], [2020, 60], [2025, 200], [2030, 500], [2050, 1200]], note: 'Regiony chmury Google (2021) i Microsoft (2023) oraz kampusy pod Ożarowem.' }
    ],

    historicPlants: [
      { name: 'Elektrownia Powiśle', lat: 52.239, lon: 21.035, tech: 'coal', year: 1904, mw: 10, note: 'Miejska elektrownia stolicy; dziś zabytkowy kompleks usługowy.' },
      { name: 'Elektrownia Grobla (Poznań)', lat: 52.408, lon: 16.940, tech: 'coal', year: 1904, mw: 2, note: 'Pierwsza miejska elektrownia Poznania, uruchomiona 31 X 1904 r.' },
      { name: 'EC1 Łódź', lat: 51.768, lon: 19.468, tech: 'coal', year: 1907, mw: 10, note: 'Elektrownia Łódzka z 1907 r.; dziś centrum nauki i kultury EC1.' },
      { name: 'Elektrownia Chorzów', lat: 50.30, lon: 18.95, tech: 'coal', year: 1915, mw: 60, note: 'Zbudowana dla wytwórni azotu; spór o zakłady rozstrzygał trybunał w Hadze (1928).' },
      { name: 'Elektrownia Szombierki', lat: 50.35, lon: 18.88, tech: 'coal', year: 1920, mw: 100, note: 'Ceglana „katedra energetyki” w Bytomiu, jedna z najnowocześniejszych w Europie.' },
      { name: 'Elektrownia Stalowa Wola (COP)', lat: 50.57, lon: 22.04, tech: 'coal', year: 1938, mw: 50, note: 'Elektrownia Centralnego Okręgu Przemysłowego, zasilała hutę i region.' },
      { name: 'Elektrownia Rożnów', lat: 49.765, lon: 20.698, tech: 'hydro_dam', year: 1941, mw: 56, note: 'Zapora zaczęta w II RP, dokończona w czasie okupacji.' },
      { name: 'EC Żerań', lat: 52.29, lon: 21.00, tech: 'coal', year: 1954, mw: 300, note: 'Pierwsza duża powojenna elektrociepłownia Warszawy; od 2020 r. blok gazowy.' },
      { name: 'Elektrownia Konin', lat: 52.24, lon: 18.25, tech: 'lignite', year: 1958, mw: 600, note: 'Pierwsza duża elektrownia na węgiel brunatny w PRL.' },
      { name: 'EC Siekierki', lat: 52.18, lon: 21.10, tech: 'coal', year: 1961, mw: 620, note: 'Największa elektrociepłownia w Polsce – ogrzewa dużą część Warszawy.' },
      { name: 'Elektrownia Turów', lat: 50.93, lon: 14.91, tech: 'lignite', year: 1962, mw: 2000, note: 'Dziesięć bloków po 200 MW; blok 7 (496 MW) dodano w 2021 r.' },
      { name: 'Elektrownia Adamów', lat: 52.01, lon: 18.47, tech: 'lignite', year: 1964, mw: 600, note: 'Pięć bloków po 120 MW; wyłączona w 2017 r.' },
      { name: 'Elektrownia Pątnów', lat: 52.29, lon: 18.24, tech: 'lignite', year: 1967, mw: 1200, note: 'Sześć bloków po 200 MW; Pątnów II (464 MW) dołączył w 2008 r.' },
      { name: 'Elektrownia Solina', lat: 49.396, lon: 22.457, tech: 'hydro_dam', year: 1968, mw: 200, note: 'Największa zapora w Polsce, symbol Bieszczadów.' },
      { name: 'Elektrownia Kozienice', lat: 51.66, lon: 21.47, tech: 'coal', year: 1972, mw: 2600, note: 'W 2017 r. dołączono nadkrytyczny blok 1075 MW.' },
      { name: 'Elektrownia Rybnik', lat: 50.13, lon: 18.51, tech: 'coal', year: 1972, mw: 1775, note: 'Osiem bloków ok. 225 MW na węgiel ze śląskich kopalń.' },
      { name: 'Elektrownia Ostrołęka B', lat: 53.10, lon: 21.60, tech: 'coal', year: 1972, mw: 600, note: 'Trzy bloki 200 MW; obok miał stanąć blok C 1000 MW.' },
      { name: 'Elektrownia Dolna Odra', lat: 53.21, lon: 14.47, tech: 'coal', year: 1974, mw: 1772, note: 'Pod Gryfinem; uzupełniana nowymi blokami gazowymi.' },
      { name: 'Elektrownia Jaworzno III', lat: 50.21, lon: 19.22, tech: 'coal', year: 1977, mw: 1345, note: 'W 2020 r. dołączył blok 910 MW o wysokiej sprawności.' },
      { name: 'Elektrownia Połaniec', lat: 50.44, lon: 21.33, tech: 'coal', year: 1979, mw: 1800, note: 'Osiem bloków po 225 MW nad Wisłą.' },
      { name: 'Elektrownia Porąbka-Żar', lat: 49.795, lon: 19.215, tech: 'pumped', year: 1979, mw: 500, note: 'Elektrownia szczytowo-pompowa ukryta w górze Żar.' },
      { name: 'Elektrownia Bełchatów', lat: 51.27, lon: 19.33, tech: 'lignite', year: 1981, mw: 4320, note: 'Dwanaście bloków po 360 MW; blok 858 MW dodano w 2011 r.' },
      { name: 'Elektrownia Żarnowiec', lat: 54.75, lon: 18.08, tech: 'pumped', year: 1983, mw: 716, note: 'Obok w latach 80. budowano elektrownię jądrową – przerwaną w 1990 r.' },
      { name: 'Elektrownia Opole', lat: 50.75, lon: 17.88, tech: 'coal', year: 1993, mw: 1492, note: 'W 2019 r. dołączono bloki 5 i 6 po ok. 900 MW.' },
      { name: 'Farma wiatrowa Barzowice', lat: 54.43, lon: 16.55, tech: 'wind', year: 2001, mw: 5, note: 'Pierwsza zawodowa farma wiatrowa w Polsce (6 turbin) pod Darłowem.' },
      { name: 'Zielony Blok Połaniec', lat: 50.44, lon: 21.33, tech: 'biomass', year: 2012, mw: 205, note: 'Jeden z największych bloków na czystą biomasę na świecie.' },
      { name: 'Blok gazowo-parowy Płock', lat: 52.58, lon: 19.65, tech: 'gas_ccgt', year: 2018, mw: 596, note: 'Blok Orlenu zasilający rafinerię i krajową sieć.' },
      { name: 'Elektrociepłownia Stalowa Wola', lat: 50.575, lon: 22.045, tech: 'gas_ccgt', year: 2020, mw: 450, note: 'Blok gazowo-parowy Tauronu i PGNiG.' },
      { name: 'Farma wiatrowa Potęgowo', lat: 54.48, lon: 17.48, tech: 'wind', year: 2020, mw: 220, note: 'Jedna z największych lądowych farm wiatrowych w Polsce.' },
      { name: 'Farma fotowoltaiczna Witnica', lat: 52.67, lon: 14.90, tech: 'solar', year: 2021, mw: 64, note: 'W chwili otwarcia największa farma PV w Polsce, zbudowana bez dopłat.' },
      { name: 'Baltic Power', lat: 54.95, lon: 17.65, tech: 'wind_offshore', year: 2026, mw: 1140, note: 'Pierwsza polska morska farma wiatrowa (Orlen i Northland), 76 turbin po 15 MW.' },
      { name: 'Elektrownia jądrowa Lubiatowo-Kopalino (plan)', lat: 54.81, lon: 17.83, tech: 'nuclear', year: 2036, mw: 3750, note: 'Planowana: trzy reaktory AP1000; pierwszy blok ok. 2036 r.' }
    ],

    // Przybliżone wielokąty ([lon, lat]) części współczesnej Polski.
    regions: {
      // ziemie pruskie przyłączone do Polski w latach 1919–1920 (Wielkopolska, Pomorze Gdańskie z Gdynią, ziemia chełmińska, Działdowo; bez Gdańska)
      prussian1919: [
        [[17.95, 54.82], [18.40, 54.80], [18.56, 54.47], [18.40, 54.40], [18.35, 54.30], [18.50, 54.18], [18.78, 54.10], [18.85, 53.85], [18.78, 53.50], [19.10, 53.45], [19.50, 53.55], [19.80, 53.48], [20.05, 53.32], [20.40, 53.20], [19.90, 53.15], [19.45, 53.22], [19.05, 53.10], [18.72, 52.92], [18.55, 52.75], [18.35, 52.58], [17.85, 52.30], [17.70, 52.15], [18.08, 51.75], [18.15, 51.30], [17.85, 51.25], [17.40, 51.45], [16.90, 51.57], [16.45, 51.75], [16.05, 52.05], [15.85, 52.25], [15.90, 52.60], [16.05, 52.85], [16.60, 53.08], [17.00, 53.25], [17.30, 53.55], [17.50, 53.75], [17.60, 54.10], [17.75, 54.40]]
      ],
      // wschodnia część Górnego Śląska przyznana Polsce w 1922 r. (Katowice, Chorzów, Rybnik, Pszczyna, Tarnowskie Góry, Lubliniec)
      silesia1922: [
        [[18.35, 49.92], [18.40, 50.05], [18.55, 50.15], [18.70, 50.22], [18.82, 50.30], [18.92, 50.32], [18.97, 50.36], [18.88, 50.42], [18.80, 50.48], [18.70, 50.55], [18.55, 50.65], [18.60, 50.85], [18.88, 50.75], [19.10, 50.58], [19.00, 50.42], [19.04, 50.33], [19.08, 50.28], [19.13, 50.255], [19.18, 50.24], [19.22, 50.03], [19.05, 49.98], [18.77, 49.92], [18.52, 49.86]]
      ],
      // ziemie niemieckie (oraz Wolne Miasto Gdańsk) do 1945 r.
      german1945: [
        // Pomorze Zachodnie, ziemia słupska i lęborska, północna część Ziemi Lubuskiej
        [[14.20, 53.92], [14.80, 54.03], [15.58, 54.18], [16.40, 54.43], [16.85, 54.59], [17.55, 54.77], [17.95, 54.82], [17.75, 54.40], [17.60, 54.10], [17.50, 53.75], [17.30, 53.55], [17.00, 53.25], [16.60, 53.08], [16.05, 52.85], [15.90, 52.60], [14.62, 52.59], [14.20, 52.88], [14.45, 53.25], [14.40, 53.45], [14.25, 53.70]],
        // Dolny Śląsk, Śląsk Opolski, zachodnia część Górnego Śląska, południe Ziemi Lubuskiej
        [[14.62, 52.59], [15.90, 52.60], [15.85, 52.25], [16.05, 52.05], [16.45, 51.75], [16.90, 51.57], [17.40, 51.45], [17.85, 51.25], [18.15, 51.30], [18.42, 51.08], [18.60, 50.85], [18.55, 50.65], [18.70, 50.55], [18.80, 50.48], [18.88, 50.42], [18.97, 50.36], [18.92, 50.32], [18.82, 50.30], [18.70, 50.22], [18.55, 50.15], [18.40, 50.05], [18.35, 49.92], [18.05, 50.05], [17.58, 50.32], [17.38, 50.30], [16.88, 50.45], [16.67, 50.15], [16.25, 50.43], [16.25, 50.65], [16.00, 50.70], [15.70, 50.75], [15.30, 50.90], [14.82, 50.87], [14.99, 51.15], [14.72, 51.55], [14.65, 51.73], [14.72, 51.95], [14.75, 52.07], [14.55, 52.35]],
        // Prusy Wschodnie (Warmia i Mazury, Powiśle z Elblągiem i Malborkiem) oraz Wolne Miasto Gdańsk
        [[19.62, 54.45], [20.30, 54.40], [21.00, 54.36], [21.40, 54.33], [22.00, 54.35], [22.79, 54.36], [22.70, 54.10], [22.62, 53.90], [22.48, 53.70], [21.90, 53.48], [21.35, 53.40], [20.90, 53.27], [20.40, 53.20], [20.05, 53.32], [19.80, 53.48], [19.50, 53.55], [19.10, 53.45], [18.78, 53.50], [18.85, 53.85], [18.78, 54.10], [18.50, 54.18], [18.35, 54.30], [18.40, 54.40], [18.56, 54.47], [18.70, 54.40], [19.00, 54.35], [19.40, 54.40]]
      ],
      // zabór rosyjski: Królestwo Polskie i obwód białostocki (w granicach współczesnej Polski)
      russian: [
        [[23.51, 53.95], [23.45, 54.15], [23.00, 54.38], [22.79, 54.36], [22.70, 54.10], [22.48, 53.70], [21.90, 53.48], [20.90, 53.27], [20.40, 53.20], [19.90, 53.15], [19.45, 53.22], [19.05, 53.10], [18.72, 52.92], [18.35, 52.58], [17.85, 52.30], [17.70, 52.15], [18.08, 51.75], [18.15, 51.30], [18.42, 51.08], [18.88, 50.75], [19.10, 50.58], [19.00, 50.42], [19.04, 50.33], [19.08, 50.28], [19.13, 50.255], [19.18, 50.24], [19.45, 50.22], [19.80, 50.18], [20.40, 50.14], [20.80, 50.27], [21.83, 50.68], [22.10, 50.57], [23.00, 50.40], [23.55, 50.30], [24.05, 50.60], [24.10, 50.85], [23.70, 51.40], [23.62, 52.07], [23.90, 52.70], [23.65, 53.50]]
      ],
      // zabór austriacki: Galicja Zachodnia, polska część Śląska Cieszyńskiego, Spisz i Orawa
      austrian: [
        [[18.52, 49.86], [18.77, 49.92], [19.05, 49.98], [19.22, 50.03], [19.18, 50.24], [19.45, 50.22], [19.80, 50.18], [20.10, 50.20], [20.40, 50.14], [20.80, 50.27], [21.20, 50.33], [21.55, 50.45], [21.83, 50.68], [22.10, 50.57], [22.50, 50.46], [23.00, 50.40], [23.55, 50.30], [23.25, 50.05], [23.00, 49.82], [22.75, 49.60], [22.68, 49.45], [22.90, 49.25], [22.88, 49.02], [22.57, 49.08], [22.20, 49.18], [21.68, 49.42], [21.30, 49.45], [20.95, 49.38], [20.40, 49.40], [20.12, 49.27], [20.00, 49.18], [19.80, 49.20], [19.65, 49.40], [19.53, 49.57], [19.25, 49.52], [19.00, 49.50], [18.85, 49.52], [18.63, 49.73]]
      ]
    }
  };
})();
