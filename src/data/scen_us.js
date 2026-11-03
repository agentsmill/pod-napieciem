'use strict';
/* Scenario: contiguous USA. Internal money unit: USD 2020. */
(function () {
  const PN = window.PN;
  PN.SCEN = PN.SCEN || {};

  PN.SCEN.US = {
    code: 'US', name: 'Stany Zjednoczone', title: 'USA 1882–2050',
    blurb: 'Od Pearl Street i wojny prądów, przez Niagarę, zaporę Hoovera i atom, po boom centrów danych AI i pierwsze elektrownie termojądrowe.',
    cur: '$', fx: 1.0,
    proj: { lon0: -96, lat0: 37.5, lat1: 29.5, lat2: 45.5 }, tileKm: 26, mapBox: [-125.6, 23.6, -65.6, 50.2],
    start: { year: 1882, month: 1 }, end: 2060, money: 12e6,
    view: { lon: -74.0, lat: 40.71, zoom: 2.2 },
    homeCode: 'USA',
    seaLabels: [
      { name: 'Ocean Atlantycki', lon: -68.5, lat: 33.5, size: 1.6 },
      { name: 'Ocean Spokojny', lon: -122.2, lat: 34.2, size: 1.5 },
      { name: 'Zatoka Meksykańska', lon: -90.5, lat: 26.0, size: 1.3 },
    ],
    neighborNames: { CAN: 'Kanada', MEX: 'Meksyk', BHS: 'Bahamy' },

    price: [[1882, 2600], [1890, 2000], [1900, 1300], [1910, 850], [1920, 560], [1930, 400], [1940, 280], [1950, 200], [1960, 160], [1970, 120], [1980, 130], [1990, 120], [2000, 105], [2010, 110], [2020, 108], [2023, 118], [2030, 115], [2050, 110]],
    dcost: [[1882, 700], [1890, 600], [1900, 420], [1910, 300], [1920, 200], [1930, 130], [1940, 90], [1960, 45], [1980, 35], [2000, 35], [2020, 40], [2050, 40]],
    neighborPrice: [[1900, 80], [1950, 50], [2000, 45], [2020, 35], [2022, 70], [2030, 50], [2050, 50]],
    dpc: [[1882, 120], [1900, 140], [1920, 230], [1930, 280], [1940, 330], [1950, 450], [1960, 800], [1970, 1400], [1980, 1850], [1990, 2100], [2000, 2400], [2010, 2350], [2020, 2150], [2030, 2250], [2040, 2450], [2050, 2700]],
    satUrban: [[1882, 0.003], [1890, 0.02], [1900, 0.06], [1907, 0.12], [1912, 0.25], [1920, 0.65], [1925, 0.8], [1930, 0.88], [1940, 0.95], [1950, 0.99], [1960, 1]],
    satRural: [[1882, 0], [1910, 0.01], [1920, 0.02], [1930, 0.10], [1935, 0.11], [1940, 0.33], [1945, 0.48], [1950, 0.78], [1955, 0.93], [1960, 0.97], [1970, 0.99]],
    fuel: {
      coal: [[1880, 3.0], [1900, 2.3], [1920, 2.9], [1940, 2.0], [1960, 1.8], [1970, 1.6], [1980, 2.5], [1990, 1.9], [2000, 1.4], [2010, 2.3], [2020, 1.9], [2025, 2.1], [2050, 2.0]],
      gas: [[1900, 1.5], [1930, 1.5], [1950, 1.4], [1970, 1.1], [1980, 4.3], [1985, 4.2], [1990, 2.8], [2000, 5.0], [2005, 9.0], [2008, 9.5], [2009, 4.5], [2012, 3.0], [2016, 2.6], [2020, 2.1], [2022, 6.5], [2023, 2.7], [2025, 3.4], [2030, 3.8], [2050, 4.0]],
      oil: [[1900, 3.0], [1930, 2.5], [1950, 3.0], [1970, 2.3], [1974, 9.5], [1980, 17], [1986, 6], [1999, 4.5], [2008, 16], [2014, 15], [2016, 7], [2020, 6], [2022, 15], [2025, 10], [2050, 11]],
      biomass: [[1985, 4.5], [2020, 5.5], [2050, 6.5]],
      uranium: [[1957, 9], [1980, 12], [2000, 5], [2020, 6.5], [2050, 7]],
      fusion: [[2040, 4], [2060, 3]],
    },
    co2: [[1880, 0]],
    interest: [[1880, 0.06], [1930, 0.05], [1950, 0.04], [1980, 0.10], [1990, 0.08], [2010, 0.04], [2020, 0.03], [2023, 0.055], [2030, 0.045]],
    distCost: [[1882, 2000], [1900, 1300], [1920, 800], [1950, 550], [1980, 450], [2000, 450], [2020, 550], [2050, 550]],
    ruralCost: [[1900, 450], [1935, 260], [1960, 240], [2020, 330]],
    rail: [[1880, 0.06], [1920, 0.045], [1960, 0.03], [2000, 0.025]],
    gasReach: [[1900, 250], [1930, 400], [1950, 6000]],
    coalImport: null,
    loadProfile: 'summer',

    mountains: [
      { lon: -113.5, lat: 46.5, rx: 2.4, ry: 3.0, h: 0.85, rot: 30 },
      { lon: -108.8, lat: 43.6, rx: 2.0, ry: 1.4, h: 0.72 },
      { lon: -106.2, lat: 39.1, rx: 1.5, ry: 2.4, h: 0.95 },
      { lon: -105.8, lat: 35.8, rx: 0.9, ry: 1.4, h: 0.68 },
      { lon: -111.5, lat: 40.6, rx: 0.7, ry: 1.6, h: 0.75 },
      { lon: -119.3, lat: 37.8, rx: 0.55, ry: 2.6, h: 0.92, rot: -32 },
      { lon: -121.7, lat: 45.6, rx: 0.55, ry: 3.2, h: 0.8, rot: 5 },
      { lon: -123.4, lat: 41.2, rx: 0.5, ry: 3.6, h: 0.48, rot: 10 },
      { lon: -80.2, lat: 38.3, rx: 1.0, ry: 6.8, h: 0.6, rot: -38 },
      { lon: -73.4, lat: 44.0, rx: 1.4, ry: 1.4, h: 0.55 },
      { lon: -92.6, lat: 36.4, rx: 2.0, ry: 0.9, h: 0.34 },
      { lon: -103.6, lat: 44.0, rx: 0.4, ry: 0.5, h: 0.45 },
      { lon: -116.5, lat: 39.5, rx: 3.0, ry: 3.0, h: 0.45 },
      { lon: -110.5, lat: 37.0, rx: 2.4, ry: 2.0, h: 0.45 },
      { lon: -106.0, lat: 27.5, rx: 2.0, ry: 4.0, h: 0.8, rot: -30 },
      { lon: -122.5, lat: 50.0, rx: 2.5, ry: 1.0, h: 0.8 },
      { lon: -116.0, lat: 33.6, rx: 1.0, ry: 0.8, h: 0.55 },
      { lon: -112.0, lat: 33.8, rx: 1.4, ry: 0.8, h: 0.35 },
    ],
    forests: [
      { lon: -82, lat: 38, rx: 9, ry: 7, f: 0.3 }, { lon: -72, lat: 44, rx: 4, ry: 3, f: 0.35 }, { lon: -86, lat: 32, rx: 7, ry: 3, f: 0.25 },
      { lon: -122.5, lat: 45.5, rx: 2, ry: 4, f: 0.55 }, { lon: -90, lat: 46.5, rx: 5, ry: 2, f: 0.4 }, { lon: -114, lat: 46.5, rx: 2.5, ry: 2.5, f: 0.3 },
      { lon: -100, lat: 40, rx: 6, ry: 9, f: -0.7 }, { lon: -90, lat: 41, rx: 6, ry: 3, f: -0.45 }, { lon: -120.5, lat: 37, rx: 1, ry: 3, f: -0.7, rot: -30 },
      { lon: -113, lat: 37, rx: 6, ry: 5, f: -0.6 }, { lon: -98, lat: 31, rx: 4, ry: 3, f: -0.4 },
    ],
    marsh: [{ lon: -80.8, lat: 25.9, rx: 0.8, ry: 0.6 }, { lon: -91.3, lat: 29.8, rx: 2.0, ry: 0.5 }, { lon: -82.3, lat: 30.8, rx: 0.35, ry: 0.3 }, { lon: -76.5, lat: 36.6, rx: 0.4, ry: 0.3 }],
    deserts: [{ lon: -114.5, lat: 35.0, rx: 3.8, ry: 2.6 }, { lon: -111.0, lat: 32.6, rx: 2.6, ry: 1.6 }, { lon: -117.0, lat: 39.5, rx: 3.0, ry: 3.0 }, { lon: -106.0, lat: 31.8, rx: 2.0, ry: 1.8 }, { lon: -109.5, lat: 41.6, rx: 2.0, ry: 1.0 }],

    wind(lon, lat, t) {
      return 6.1 + 2.4 * PN.bump(lon, lat, { lon: -100, lat: 38.5, rx: 6.5, ry: 7 }) + 1.2 * PN.bump(lon, lat, { lon: -106.5, lat: 42.5, rx: 3, ry: 2 })
        + 0.8 * PN.bump(lon, lat, { lon: -101.5, lat: 35, rx: 2, ry: 2 }) - 1.5 * PN.bump(lon, lat, { lon: -85, lat: 33, rx: 8, ry: 5 })
        + 2.2 * PN.bump(lon, lat, { lon: -121.65, lat: 37.73, rx: 0.25, ry: 0.25 }) + 2.4 * PN.bump(lon, lat, { lon: -118.3, lat: 35.1, rx: 0.35, ry: 0.35 })
        + 2.4 * PN.bump(lon, lat, { lon: -116.6, lat: 33.9, rx: 0.25, ry: 0.25 }) - 0.9 * PN.bump(lon, lat, { lon: -118, lat: 40, rx: 5, ry: 5 })
        + 0.8 * Math.exp(-t.distSea / 60) + t.elev * 0.9 - (t.forest ? 0.3 : 0);
    },
    windSea(lon, lat, t) {
      const ne = PN.bump(lon, lat, { lon: -70.5, lat: 40.5, rx: 5, ry: 4 });
      return 7.6 + 1.9 * ne + 0.6 * Math.min(1, t.distLand / 60) + (lon < -117 ? 1.4 : 0);
    },
    solar(lon, lat, t) {
      return 2050 - (lat - 30) * 28 + 450 * PN.bump(lon, lat, { lon: -112, lat: 34, rx: 6, ry: 4 }) + 150 * PN.bump(lon, lat, { lon: -116, lat: 35, rx: 3, ry: 3 })
        - 260 * PN.bump(lon, lat, { lon: -122.5, lat: 46.5, rx: 3, ry: 3 }) - 110 * PN.bump(lon, lat, { lon: -85, lat: 33, rx: 8, ry: 5 })
        - 120 * PN.bump(lon, lat, { lon: -84, lat: 44, rx: 6, ry: 3 }) - t.elev * 30;
    },
    hydroFlow: [0.85, 0.9, 1.1, 1.3, 1.45, 1.35, 1.05, 0.85, 0.7, 0.7, 0.8, 0.85],
  };

  PN.SCEN.US.missions = [
    { id: 'pearl', title: 'Pearl Street', text: 'Zbuduj elektrownię parową na Manhattanie i dostarcz Nowemu Jorkowi 0,3 MW.', from: 1882, deadline: 1886, reward: { money: 2e6, rep: 5 }, check: (H) => H.servedMW('Nowy Jork|New York') / 0.3 },
    { id: 'vulcan', title: 'Prąd z rzeki', text: 'Uruchom pierwszą elektrownię wodną.', from: 1882, deadline: 1892, reward: { money: 1.5e6, rep: 3 }, check: (H) => (H.capMW(['hydro_small', 'hydro_dam']) > 0 ? 1 : 0) },
    { id: 'ac', title: 'Wojna prądów', text: 'Prześlij prąd przemienny na odległość: zbuduj linię dłuższą niż 25 km.', from: 1886, deadline: 1898, reward: { money: 4e6, rep: 4 }, check: (H) => H.longestLine() / 25 },
    { id: 'chicago', title: 'Imperium Insulla', text: 'Dostarcz Chicago 40 MW.', from: 1893, deadline: 1912, reward: { money: 15e6, rep: 5 }, check: (H) => H.servedMW('Chicago') / 40 },
    { id: 'niagara', title: 'Moc Niagary', text: 'Zbuduj elektrownię wodną z zaporą o mocy co najmniej 30 MW.', from: 1895, deadline: 1910, reward: { money: 10e6, rep: 5 }, check: (H) => H.capMW(['hydro_dam']) / 30 },
    { id: 'hv', title: 'Sieć regionalna', text: 'Zbuduj 500 km linii 110 kV lub wyższych.', from: 1908, deadline: 1930, reward: { money: 40e6, rep: 5 }, check: (H) => H.linesKm(['line_110', 'line_220', 'line_345', 'line_500', 'line_750', 'hvdc']) / 500 },
    { id: 'hoover', title: 'Wielkie zapory', text: 'Zainstaluj 1 GW w elektrowniach wodnych z zaporą.', from: 1931, deadline: 1945, reward: { money: 200e6, rep: 6 }, check: (H) => H.capMW(['hydro_dam']) / 1000 },
    { id: 'rea', title: 'Światło na farmach', text: 'Doprowadź prąd do 40% mieszkańców wsi w całym kraju (program w zakładce Przegląd).', from: 1935, deadline: 1956, reward: { money: 600e6, rep: 10 }, check: (H) => H.ruralShare() / 0.4 },
    { id: 'atom', title: 'Atom dla pokoju', text: 'Uruchom elektrownię jądrową.', from: 1953, deadline: 1962, reward: { money: 300e6, rep: 6 }, check: (H) => (H.capMW(['nuclear']) > 0 ? 1 : 0) },
    { id: 'n1', title: 'Lekcja z 1965 roku', text: 'Podłącz Nowy Jork co najmniej trzema liniami, żeby awaria jednej nie gasiła miasta.', from: 1966, deadline: 1976, reward: { money: 200e6, rep: 6 }, check: (H) => H.nodeDegree('Nowy Jork|New York') / 3 },
    { id: 'ehv', title: 'Autostrady energii', text: 'Zbuduj 2000 km linii 345 kV lub wyższych.', from: 1960, deadline: 1985, reward: { money: 1.2e9, rep: 5 }, check: (H) => H.linesKm(['line_345', 'line_500', 'line_750', 'hvdc']) / 2000 },
    { id: 'windrush', title: 'Gorączka wiatrowa', text: 'Zainstaluj 500 MW w farmach wiatrowych.', from: 1981, deadline: 1992, reward: { money: 300e6, rep: 5 }, check: (H) => H.capMW(['wind', 'wind_offshore']) / 500 },
    { id: 'sun', title: 'Słońce Zachodu', text: 'Zainstaluj 10 GW fotowoltaiki i CSP.', from: 2005, deadline: 2022, reward: { money: 3e9, rep: 6 }, check: (H) => H.capMW(['solar', 'csp']) / 10000 },
    { id: 'ai', title: 'Boom AI', text: 'Zasilaj centra danych łączną mocą 10 GW.', from: 2023, deadline: 2036, reward: { money: 12e9, rep: 8 }, check: (H) => H.dcMW() / 10000 },
    { id: 'clean', title: 'Czysta energia 24/7', text: '70% energii ze źródeł bezemisyjnych (średnia z 12 miesięcy).', from: 2025, deadline: 2041, reward: { money: 15e9, rep: 10 }, check: (H) => H.cleanShare() / 0.7 },
    { id: 'fusion', title: 'Fuzja w sieci', text: 'Uruchom elektrownię termojądrową.', from: 2040, deadline: 2056, reward: { money: 20e9, rep: 12 }, check: (H) => H.capMW(['fusion']) / 400 },
  ];
})();
