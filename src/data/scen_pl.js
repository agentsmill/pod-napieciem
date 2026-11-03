'use strict';
/* Scenario: Poland (present-day territory). Internal money unit: USD 2020; shown as PLN (fx 4). */
(function () {
  const PN = window.PN;
  PN.SCEN = PN.SCEN || {};

  PN.SCEN.PL = {
    code: 'PL', name: 'Polska', title: 'Polska 1888–2050',
    blurb: 'Od pierwszych lamp łukowych w zaborach, przez Powiśle, elektryfikację wsi i Bełchatów, po morskie farmy wiatrowe, atom, centra danych i fuzję.',
    cur: 'zł', fx: 4.0,
    proj: { lon0: 19.2, lat0: 52.0, lat1: 50.0, lat2: 54.0 }, tileKm: 8, mapBox: [13.4, 48.7, 24.9, 55.85],
    start: { year: 1888, month: 1 }, end: 2060, money: 9e6,
    view: { lon: 21.0, lat: 52.23, zoom: 1.6 },
    homeCode: 'POL',
    seaLabels: [{ name: 'Morze Bałtyckie', lon: 17.2, lat: 55.42, size: 1.5 }, { name: 'Zalew Szczeciński', lon: 14.25, lat: 53.76, size: 0.6 }],
    neighborNames: { DEU: 'Niemcy', CZE: 'Czechy', SVK: 'Słowacja', UKR: 'Ukraina', BLR: 'Białoruś', LTU: 'Litwa', RUS: 'Rosja', DNK: 'Dania', AUT: 'Austria', SWE: 'Szwecja' },

    /* ---- economy curves (USD 2020) ---- */
    price: [[1880, 2200], [1890, 1900], [1900, 1300], [1910, 850], [1920, 640], [1930, 420], [1938, 350], [1946, 300], [1950, 230], [1960, 165], [1970, 125], [1975, 120], [1985, 112], [1990, 100], [2000, 108], [2010, 140], [2020, 160], [2022, 230], [2024, 180], [2030, 165], [2050, 145]],
    dcost: [[1880, 600], [1890, 520], [1900, 420], [1910, 330], [1920, 260], [1930, 190], [1940, 140], [1950, 90], [1960, 60], [1980, 42], [2000, 42], [2020, 52], [2050, 46]],
    neighborPrice: [[1950, 60], [1990, 40], [2000, 35], [2008, 75], [2010, 55], [2016, 32], [2020, 38], [2021, 110], [2022, 250], [2023, 105], [2024, 82], [2025, 88], [2030, 78], [2050, 66]],
    dpc: [[1880, 100], [1913, 110], [1925, 120], [1938, 140], [1950, 200], [1960, 270], [1970, 420], [1980, 575], [1990, 590], [2000, 615], [2010, 660], [2020, 700], [2030, 790], [2040, 900], [2050, 1000]],
    satUrban: [[1880, 0], [1886, 0.002], [1895, 0.01], [1900, 0.02], [1905, 0.04], [1913, 0.09], [1920, 0.13], [1930, 0.30], [1938, 0.45], [1946, 0.50], [1950, 0.70], [1960, 0.92], [1970, 0.985], [1980, 1]],
    satRural: [[1880, 0], [1920, 0.0], [1930, 0.02], [1938, 0.04], [1946, 0.05], [1950, 0.10], [1955, 0.30], [1960, 0.52], [1965, 0.75], [1970, 0.90], [1975, 0.96], [1980, 0.99]],
    fuel: {
      coal: [[1880, 3.4], [1913, 2.9], [1930, 2.6], [1950, 2.1], [1970, 2.0], [1980, 2.5], [1990, 2.3], [2000, 1.9], [2008, 3.6], [2010, 2.9], [2016, 2.2], [2020, 2.7], [2022, 6.5], [2023, 4.6], [2025, 3.5], [2030, 3.3], [2050, 3.1]],
      gas: [[1925, 2.5], [1960, 3.0], [1975, 3.0], [1990, 4.0], [2000, 5.0], [2008, 9.0], [2010, 8.0], [2015, 7.0], [2020, 4.5], [2021, 14], [2022, 32], [2023, 11], [2024, 9.5], [2025, 10.5], [2030, 8.5], [2050, 8.0]],
      oil: [[1950, 3.5], [1970, 2.6], [1974, 9.5], [1980, 17], [1986, 6], [1999, 4.5], [2008, 16], [2014, 15], [2016, 7], [2020, 6], [2022, 15], [2025, 10], [2050, 11]],
      biomass: [[1985, 6.0], [2020, 7.5], [2050, 8.5]],
      uranium: [[1957, 9], [1980, 12], [2000, 5], [2020, 6.5], [2050, 7]],
      fusion: [[2040, 4], [2060, 3]],
    },
    co2: [[2004, 0], [2005, 25], [2006, 22], [2007, 1], [2008, 26], [2010, 18], [2012, 9], [2013, 5], [2017, 7], [2018, 18], [2019, 28], [2020, 28], [2021, 60], [2022, 90], [2023, 92], [2024, 72], [2025, 80], [2030, 120], [2040, 160], [2050, 200]],
    interest: [[1880, 0.06], [1946, 0.04], [1989, 0.04], [1991, 0.12], [2000, 0.08], [2010, 0.05], [2020, 0.03], [2023, 0.06], [2030, 0.05]],
    distCost: [[1880, 2000], [1900, 1300], [1920, 800], [1950, 550], [1980, 450], [2000, 450], [2020, 550], [2050, 550]],
    ruralCost: [[1900, 400], [1950, 230], [1970, 210], [2020, 300]],
    rail: [[1880, 0.07], [1920, 0.05], [1960, 0.035], [2000, 0.03]],
    gasReach: [[1925, 60], [1960, 60], [1965, 150], [1975, 2000]],
    coalImport: { from: 1992, lon: 18.65, lat: 54.4, premium: 0.12 },
    loadProfile: 'winter',

    /* ---- terrain hints (degrees) ---- */
    mountains: [
      { lon: 19.95, lat: 49.23, rx: 0.22, ry: 0.07, h: 1.0 },
      { lon: 19.4, lat: 49.62, rx: 0.7, ry: 0.15, h: 0.62, rot: -5 },
      { lon: 20.9, lat: 49.5, rx: 0.7, ry: 0.13, h: 0.52, rot: 8 },
      { lon: 22.45, lat: 49.2, rx: 0.4, ry: 0.15, h: 0.6, rot: -28 },
      { lon: 16.15, lat: 50.6, rx: 0.95, ry: 0.15, h: 0.62, rot: -28 },
      { lon: 15.7, lat: 50.78, rx: 0.28, ry: 0.06, h: 0.85, rot: -15 },
      { lon: 20.9, lat: 50.88, rx: 0.33, ry: 0.07, h: 0.45, rot: -18 },
      { lon: 19.55, lat: 50.55, rx: 0.1, ry: 0.42, h: 0.34, rot: 28 },
      { lon: 23.1, lat: 50.5, rx: 0.45, ry: 0.1, h: 0.32, rot: -35 },
      { lon: 20.9, lat: 49.85, rx: 2.4, ry: 0.22, h: 0.36 },
      { lon: 18.1, lat: 54.25, rx: 0.4, ry: 0.18, h: 0.3 },
      { lon: 21.6, lat: 53.8, rx: 1.0, ry: 0.25, h: 0.2 },
      { lon: 20.2, lat: 48.95, rx: 1.6, ry: 0.32, h: 0.8 },
      { lon: 13.4, lat: 50.55, rx: 0.6, ry: 0.13, h: 0.6, rot: -30 },
      { lon: 23.7, lat: 48.85, rx: 0.9, ry: 0.3, h: 0.7, rot: -32 },
      { lon: 15.2, lat: 49.6, rx: 1.0, ry: 0.4, h: 0.4 },
    ],
    forests: [
      { lon: 23.85, lat: 52.72, rx: 0.25, ry: 0.18, f: 0.9 }, { lon: 17.9, lat: 53.65, rx: 0.45, ry: 0.28, f: 0.8 },
      { lon: 16.0, lat: 52.7, rx: 0.35, ry: 0.14, f: 0.8 }, { lon: 15.4, lat: 51.45, rx: 0.55, ry: 0.22, f: 0.75 },
      { lon: 20.55, lat: 52.33, rx: 0.15, ry: 0.06, f: 0.7 }, { lon: 23.2, lat: 53.85, rx: 0.3, ry: 0.15, f: 0.85 },
      { lon: 21.6, lat: 53.6, rx: 0.35, ry: 0.15, f: 0.75 }, { lon: 22.0, lat: 50.4, rx: 0.6, ry: 0.28, f: 0.55 },
      { lon: 22.8, lat: 50.55, rx: 0.4, ry: 0.18, f: 0.5 }, { lon: 21.5, lat: 51.6, rx: 0.2, ry: 0.12, f: 0.55 },
      { lon: 20.0, lat: 51.4, rx: 0.3, ry: 0.2, f: 0.45 }, { lon: 18.7, lat: 50.7, rx: 0.3, ry: 0.2, f: 0.55 },
      { lon: 15.6, lat: 53.5, rx: 1.0, ry: 0.4, f: 0.4 }, { lon: 23.4, lat: 53.25, rx: 0.25, ry: 0.15, f: 0.7 },
      { lon: 14.9, lat: 52.3, rx: 0.4, ry: 0.3, f: 0.5 }, { lon: 18.3, lat: 54.6, rx: 0.25, ry: 0.1, f: 0.5 },
      { lon: 17.0, lat: 52.2, rx: 1.0, ry: 0.5, f: -0.45 }, { lon: 18.6, lat: 52.7, rx: 0.6, ry: 0.3, f: -0.4 },
      { lon: 22.6, lat: 51.0, rx: 0.8, ry: 0.4, f: -0.35 }, { lon: 20.5, lat: 52.0, rx: 0.9, ry: 0.5, f: -0.25 },
      { lon: 17.5, lat: 50.6, rx: 0.6, ry: 0.4, f: -0.35 },
    ],
    marsh: [{ lon: 22.6, lat: 53.5, rx: 0.35, ry: 0.11 }, { lon: 23.25, lat: 51.4, rx: 0.32, ry: 0.13 }, { lon: 21.5, lat: 53.15, rx: 0.2, ry: 0.08 }],
    deserts: [],

    wind(lon, lat, t) {
      let v = 5.55 + 1.75 * Math.exp(-t.distSea / 42) + 0.4 * PN.bump(lon, lat, { lon: 17.5, lat: 54.2, rx: 2.0, ry: 0.5 })
        + 0.5 * PN.bump(lon, lat, { lon: 22.9, lat: 54.1, rx: 0.6, ry: 0.4 }) - 0.75 * PN.smooth(PN.clamp((51.6 - lat) / 1.6, 0, 1))
        + t.elev * 1.3 - (t.forest ? 0.25 : 0);
      return v;
    },
    windSea(lon, lat, t) { return 8.7 + 0.9 * Math.min(1, t.distLand / 45); },
    solar(lon, lat, t) {
      return 1020 + (51.5 - lat) * 22 + (lon - 19) * 7 + (t.distSea < 20 ? 25 : 0) - t.elev * 45;
    },
    hydroFlow: [0.85, 0.85, 1.15, 1.45, 1.25, 1.0, 0.95, 0.8, 0.7, 0.75, 0.85, 0.9],
  };

  /* ---- missions (H = helper API from the simulation) ---- */
  PN.SCEN.PL.missions = [
    { id: 'first_light', title: 'Pierwsze światło', text: 'Uruchom elektrownię miejską (najlepiej w Warszawie, Łodzi lub Krakowie) i dostarcz miastu co najmniej 0,1 MW.', from: 1888, deadline: 1897, reward: { money: 1.2e6, rep: 5 }, check: (H) => H.citiesServed(0.1) },
    { id: 'three_cities', title: 'Trzy miasta pod napięciem', text: 'Zasil co najmniej trzy miasta, każde mocą 0,5 MW.', from: 1890, deadline: 1910, reward: { money: 3e6, rep: 5 }, check: (H) => H.citiesServed(0.5) / 3 },
    { id: 'powisle', title: 'Warszawa – Powiśle', text: 'W 1904 r. ruszyła miejska elektrownia na Powiślu. Dostarcz Warszawie 3 MW.', from: 1900, deadline: 1910, reward: { money: 5e6, rep: 5 }, check: (H) => H.servedMW('Warszawa') / 3 },
    { id: 'lodz', title: 'Fabryczna Łódź', text: 'Łódzkie fabryki i tramwaje potrzebują prądu: dostarcz Łodzi 3 MW.', from: 1898, deadline: 1912, reward: { money: 4e6, rep: 4 }, check: (H) => H.servedMW('Łódź') / 3 },
    { id: 'big_station', title: 'Elektrownia na miarę miasta', text: 'Zainstaluj łącznie 25 MW mocy wytwórczych.', from: 1900, deadline: 1915, reward: { money: 6e6, rep: 4 }, check: (H) => H.totalCap() / 25 },
    { id: 'hv_line', title: 'Wysokie napięcie', text: 'Zbuduj co najmniej 150 km linii 60 kV lub 110 kV.', from: 1912, deadline: 1935, reward: { money: 8e6, rep: 5 }, check: (H) => H.linesKm(['line_60', 'line_110', 'line_220', 'line_400']) / 150 },
    { id: 'interwar_hydro', title: 'Biały węgiel', text: 'Uruchom elektrownię wodną z zaporą o mocy co najmniej 20 MW.', from: 1920, deadline: 1942, reward: { money: 10e6, rep: 6 }, check: (H) => H.capMW(['hydro_dam']) / 20 },
    { id: 'rebuild', title: 'Odbudowa', text: 'Przywróć zasilanie Warszawy: co najmniej 95% zapotrzebowania stolicy pokryte.', from: 1945, deadline: 1950, reward: { money: 25e6, rep: 8 }, check: (H) => H.servedShare('Warszawa') / 0.95 },
    { id: 'six_year', title: 'Plan sześcioletni', text: 'Osiągnij 3 GW mocy zainstalowanej.', from: 1950, deadline: 1957, reward: { money: 120e6, rep: 6 }, check: (H) => H.totalCap() / 3000 },
    { id: 'rural', title: 'Elektryfikacja wsi', text: 'Doprowadź prąd do 80% mieszkańców wsi.', from: 1950, deadline: 1972, reward: { money: 300e6, rep: 10 }, check: (H) => H.ruralShare() / 0.8 },
    { id: 'kse400', title: 'Krajowy system 400 kV', text: 'Zbuduj 1000 km linii 400 kV lub wyższych.', from: 1964, deadline: 1982, reward: { money: 400e6, rep: 6 }, check: (H) => H.linesKm(['line_400', 'line_750']) / 1000 },
    { id: 'lignite_giant', title: 'Gigant z Bełchatowa', text: 'Zainstaluj 4 GW w elektrowniach na węgiel brunatny.', from: 1975, deadline: 1992, reward: { money: 600e6, rep: 4 }, check: (H) => H.capMW(['lignite']) / 4000 },
    { id: 'ucte', title: 'Do sieci zachodniej', text: 'Połącz system z granicą niemiecką linią 220 kV lub wyższą.', from: 1990, deadline: 1997, reward: { money: 300e6, rep: 8 }, check: (H) => (H.borderLinked('DE', 220) ? 1 : 0) },
    { id: 'res15', title: 'Cel 15% OZE', text: 'Odnawialne źródła mają dać 15% energii (średnia z 12 miesięcy).', from: 2005, deadline: 2021, reward: { money: 900e6, rep: 8 }, check: (H) => H.resShare() / 0.15 },
    { id: 'offshore', title: 'Wiatr znad Bałtyku', text: 'Uruchom 3 GW morskich farm wiatrowych.', from: 2024, deadline: 2036, reward: { money: 2e9, rep: 8 }, check: (H) => H.capMW(['wind_offshore']) / 3000 },
    { id: 'nuclear', title: 'Pierwszy polski atom', text: 'Uruchom co najmniej 1 GW w elektrowniach jądrowych lub SMR.', from: 2024, deadline: 2041, reward: { money: 3e9, rep: 10 }, check: (H) => H.capMW(['nuclear', 'smr']) / 1000 },
    { id: 'ai', title: 'AI nad Wisłą', text: 'Zasilaj centra danych łączną mocą 1 GW.', from: 2025, deadline: 2041, reward: { money: 2e9, rep: 6 }, check: (H) => H.dcMW() / 1000 },
    { id: 'lowco2', title: 'System niskoemisyjny', text: 'Zejdź poniżej 150 g CO₂ na kWh (średnia roczna).', from: 2030, deadline: 2051, reward: { money: 4e9, rep: 10 }, check: (H) => (H.energy12() > 0 ? PN.clamp(1 - (H.co2g() - 150) / 650, 0, 1) : 0) },
    { id: 'fusion', title: 'Słońce na Ziemi', text: 'Uruchom elektrownię termojądrową.', from: 2045, deadline: 2061, reward: { money: 5e9, rep: 12 }, check: (H) => H.capMW(['fusion']) / 400 },
  ];
})();
