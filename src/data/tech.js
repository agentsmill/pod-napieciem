'use strict';
/* Technologies: generation, storage, grid, resources. Money in USD (constant 2020 prices);
   Polish campaign displays in PLN via scenario fx. Era curves are [[year, value], ...]. */
(function () {
  const PN = window.PN;

  PN.FUELS = {
    coal: { name: 'węgiel kamienny', unit: 't', gj: 24, co2: 0.0946 },
    lignite: { name: 'węgiel brunatny', unit: 't', gj: 8.5, co2: 0.1012 },
    gas: { name: 'gaz ziemny', unit: 'tys. m³', gj: 36, co2: 0.0561 },
    oil: { name: 'olej opałowy', unit: 't', gj: 41, co2: 0.0774 },
    uranium: { name: 'paliwo jądrowe', unit: 'MWh', gj: 0, co2: 0 },
    biomass: { name: 'biomasa', unit: 't', gj: 15, co2: 0 },
    fusion: { name: 'deuter i tryt', unit: 'MWh', gj: 0, co2: 0 },
  };

  // Coal-plant unit sizes (MW) differ a lot between the countries.
  const COAL_UNIT = {
    PL: [[1900, 1], [1905, 3], [1912, 8], [1920, 15], [1930, 30], [1950, 50], [1955, 100], [1960, 125], [1966, 200], [1975, 360], [1985, 380], [2000, 460], [2010, 860], [2020, 900]],
    US: [[1900, 1.5], [1905, 5], [1912, 15], [1920, 35], [1930, 80], [1950, 150], [1960, 300], [1966, 500], [1972, 750], [1980, 800], [2000, 700], [2010, 900], [2020, 900]],
  };
  const COAL_EFF = [[1900, 0.08], [1910, 0.12], [1920, 0.17], [1930, 0.22], [1940, 0.26], [1950, 0.29], [1960, 0.33], [1970, 0.355], [1980, 0.365], [1990, 0.38], [2000, 0.40], [2010, 0.44], [2020, 0.46], [2035, 0.47]];

  PN.TECH = {
    /* ----------------------------- generation ----------------------------- */
    steam_dc: {
      cat: 'gen', name: 'Elektrownia parowa prądu stałego', short: 'Parowa (DC)', color: '#77706a', fuel: 'coal', dispatch: 'thermal',
      avail: { PL: [[1880, 1925]], US: [[1882, 1915]] },
      unitMW: [[1880, 0.1], [1888, 0.25], [1895, 0.5], [1905, 1.0], [1915, 2.0]], maxUnits: 8,
      capex: [[1880, 8500], [1890, 6500], [1900, 4800], [1915, 3800]], fom: [[1880, 260], [1910, 160]], vom: 25,
      eff: [[1880, 0.035], [1890, 0.05], [1900, 0.068], [1915, 0.085]], build: 8, life: 30, pollution: 1.2,
      place: 'city', desc: 'Pierwsze elektrownie: maszyny parowe i prądnice prądu stałego w środku miasta. Zasilają tylko swoje miasto (sieć 110 V sięga ok. 1,5 km).',
    },
    hydro_small: {
      cat: 'gen', name: 'Mała elektrownia wodna', short: 'MEW', color: '#4f86b5', fuel: null, dispatch: 'hydro',
      avail: { PL: [[1900, null]], US: [[1882, null]] },
      unitMW: [[1882, 0.0125], [1890, 0.15], [1900, 0.5], [1915, 1.5], [1930, 3], [1960, 5]], maxUnits: 4,
      capex: [[1882, 7000], [1900, 4500], [1930, 3500], [1970, 4000], [2000, 4500], [2020, 5200]], fom: 40, vom: 2,
      build: 12, life: 70, place: 'river', desc: 'Przepływowa elektrownia na rzece. Moc zależy od wielkości rzeki i pory roku (wiosną najwięcej wody).',
    },
    hydro_dam: {
      cat: 'gen', name: 'Elektrownia wodna z zaporą', short: 'Zapora', color: '#2f6ea5', fuel: null, dispatch: 'dam',
      avail: { PL: [[1920, null]], US: [[1895, null]] },
      unitMW: [[1895, 3.7], [1910, 8], [1920, 15], [1930, 40], [1936, 80], [1950, 100], [1965, 150], [1975, 300]], maxUnits: 12,
      capex: [[1895, 3800], [1930, 2600], [1960, 2500], [1990, 3500], [2020, 4500]], fom: 30, vom: 1,
      build: 42, life: 90, place: 'site_dam', desc: 'Zapora na dogodnym odcinku rzeki. Zbiornik pozwala oddawać więcej mocy w szczycie wieczornym.',
    },
    pumped: {
      cat: 'store', name: 'Elektrownia szczytowo-pompowa', short: 'Szczytowo-pompowa', color: '#6aa3c9', fuel: null, dispatch: 'storage',
      avail: { PL: [[1968, null]], US: [[1929, null]] },
      unitMW: [[1929, 30], [1960, 80], [1970, 150], [1980, 180], [2000, 250]], maxUnits: 6, hours: 7, rte: 0.75,
      capex: [[1929, 1800], [1960, 1400], [1990, 1900], [2020, 2600]], fom: 18, vom: 1,
      build: 48, life: 90, place: 'site_pumped', desc: 'Nocą pompuje wodę do górnego zbiornika, wieczorem oddaje energię. Sprawność cyklu ok. 75%.',
    },
    coal: {
      cat: 'gen', name: 'Elektrownia węglowa (turbina parowa)', short: 'Węgiel kamienny', color: '#3d3d3d', fuel: 'coal', dispatch: 'thermal',
      avail: { PL: [[1903, null]], US: [[1903, null]] },
      unitMW: COAL_UNIT, maxUnits: 8,
      capex: [[1900, 3400], [1920, 2400], [1940, 1800], [1960, 1300], [1970, 1450], [1980, 2100], [1990, 1950], [2000, 1800], [2010, 2600], [2020, 2700]],
      fom: [[1900, 120], [1950, 55], [2000, 45], [2020, 52]], vom: 5,
      eff: COAL_EFF, build: [[1900, 18], [1950, 30], [1970, 42], [2000, 48], [2020, 60]], life: 45, pollution: 1.0, water: 3,
      place: 'land', desc: 'Kocioł opalany węglem i turbina parowa. Potrzebuje wody do chłodzenia i dostaw węgla (z własnej kopalni lub z rynku – z dopłatą za transport).',
    },
    lignite: {
      cat: 'gen', name: 'Elektrownia na węgiel brunatny', short: 'Węgiel brunatny', color: '#8a6a48', fuel: 'lignite', dispatch: 'thermal',
      avail: { PL: [[1950, null]], US: [[1950, null]] },
      unitMW: { PL: [[1950, 50], [1958, 55], [1962, 120], [1966, 200], [1978, 360], [2010, 860]], US: [[1950, 100], [1970, 450], [1980, 750]] }, maxUnits: 12,
      capex: [[1950, 1600], [1970, 1600], [1980, 2300], [2000, 2100], [2010, 2900], [2020, 3000]],
      fom: [[1950, 60], [2000, 52], [2020, 58]], vom: 5,
      eff: COAL_EFF.map(([y, e]) => [y, e - 0.025]), build: [[1950, 36], [1970, 48], [2010, 60]], life: 45, pollution: 1.25, water: 3,
      place: 'lignite', desc: 'Węgla brunatnego nie opłaca się wozić: elektrownia musi stać przy odkrywce. Bez własnej kopalni nie ruszy.',
    },
    oil: {
      cat: 'gen', name: 'Elektrownia olejowa', short: 'Olej', color: '#6e4f73', fuel: 'oil', dispatch: 'thermal',
      avail: { PL: [], US: [[1905, 2000]] },
      unitMW: [[1905, 3], [1930, 30], [1950, 100], [1965, 300], [1975, 600]], maxUnits: 6,
      capex: [[1905, 2800], [1940, 1500], [1960, 1100], [1975, 1300]], fom: 35, vom: 4,
      eff: COAL_EFF, build: 30, life: 40, pollution: 0.6, water: 3,
      place: 'land', desc: 'Tańsza w budowie niż węglowa, ale zależna od cen ropy. Kryzysy naftowe potrafią ją wyłączyć z gry.',
    },
    gas_ocgt: {
      cat: 'gen', name: 'Turbina gazowa (szczytowa)', short: 'Gaz OCGT', color: '#d9823b', fuel: 'gas', dispatch: 'thermal',
      avail: { PL: [[1975, null]], US: [[1949, null]] },
      unitMW: [[1949, 3.5], [1960, 20], [1970, 50], [1990, 100], [2010, 200], [2020, 300]], maxUnits: 6,
      capex: [[1949, 1000], [1970, 650], [2000, 600], [2020, 750]], fom: 16, vom: 6,
      eff: [[1949, 0.17], [1960, 0.22], [1970, 0.25], [1990, 0.32], [2010, 0.38], [2020, 0.40]], build: 18, life: 35, pollution: 0.1,
      place: 'land_gas', desc: 'Szybki start, niska sprawność. Idealna na wieczorny szczyt i na rezerwę.',
    },
    gas_ccgt: {
      cat: 'gen', name: 'Blok gazowo-parowy (CCGT)', short: 'Gaz CCGT', color: '#e8a75a', fuel: 'gas', dispatch: 'thermal',
      avail: { PL: [[1999, null]], US: [[1975, null]] },
      unitMW: [[1975, 150], [1990, 250], [2000, 400], [2010, 450], [2020, 550], [2030, 600]], maxUnits: 6,
      capex: [[1975, 1400], [1990, 900], [2000, 700], [2010, 1000], [2020, 1050]], fom: 20, vom: 3,
      eff: [[1975, 0.42], [1990, 0.50], [2000, 0.56], [2010, 0.58], [2020, 0.61], [2030, 0.63]], build: 30, life: 35, pollution: 0.1, water: 3,
      place: 'land_gas', desc: 'Turbina gazowa plus kocioł odzysknicowy i turbina parowa. Sprawność powyżej 55%, emisja CO₂ o połowę niższa niż węgla.',
    },
    nuclear: {
      cat: 'gen', name: 'Elektrownia jądrowa', short: 'Atom', color: '#a8558a', fuel: 'uranium', dispatch: 'nuclear',
      avail: { PL: [[1980, 1990], [2024, null]], US: [[1957, null]] },
      unitMW: { PL: [[1980, 440], [2024, 1150]], US: [[1957, 60], [1960, 200], [1965, 500], [1970, 900], [1975, 1100], [1990, 1200], [2010, 1150]] }, maxUnits: 4,
      capex: [[1957, 2600], [1968, 2000], [1975, 3500], [1980, 5500], [1990, 7000], [2010, 9000], [2025, 9500], [2035, 7500], [2050, 6000]],
      fom: [[1957, 100], [2000, 125], [2020, 130]], vom: 2,
      build: [[1957, 60], [1975, 84], [1985, 120], [2010, 108], [2030, 96]], life: 60, pollution: 0, water: 2, waterBig: true,
      place: 'land', desc: 'Ogromna, stabilna moc bez CO₂. Bardzo droga i długa budowa; potrzebuje dużej rzeki, jeziora albo morza do chłodzenia.',
    },
    smr: {
      cat: 'gen', name: 'Mały reaktor modułowy (SMR)', short: 'SMR', color: '#c27aa5', fuel: 'uranium', dispatch: 'nuclear',
      avail: { PL: [[2032, null]], US: [[2029, null]] },
      unitMW: [[2029, 300]], maxUnits: 4,
      capex: [[2029, 9500], [2040, 6500], [2050, 5000]], fom: 140, vom: 3, build: 48, life: 60, pollution: 0, water: 3,
      place: 'land', desc: 'Reaktory 300 MW budowane seryjnie w fabryce. Pasują przy centrach danych i w miejscu starych bloków węglowych.',
    },
    wind: {
      cat: 'gen', name: 'Farma wiatrowa', short: 'Wiatr', color: '#5aa59a', fuel: null, dispatch: 'wind',
      avail: { PL: [[2000, null]], US: [[1981, null]] },
      turbineMW: [[1981, 0.05], [1985, 0.1], [1990, 0.3], [1995, 0.6], [2000, 1.0], [2005, 1.8], [2010, 2.0], [2015, 2.7], [2020, 3.6], [2025, 4.5], [2030, 5.5], [2050, 7]],
      perUnit: 10, maxUnits: 6,
      capex: [[1981, 4500], [1990, 2500], [2000, 1600], [2005, 1900], [2010, 2100], [2015, 1600], [2020, 1400], [2025, 1500], [2030, 1300], [2050, 1100]],
      fom: [[1981, 60], [2020, 38]], vom: 0, build: [[1981, 18], [2020, 12]], life: 25, pollution: 0,
      place: 'wind', desc: 'Stawiaj tam, gdzie wieje: wybrzeże, otwarte równiny, przełęcze. Produkcja zmienna – zależy od pogody.',
    },
    wind_offshore: {
      cat: 'gen', name: 'Morska farma wiatrowa', short: 'Wiatr na morzu', color: '#2f8a86', fuel: null, dispatch: 'wind',
      avail: { PL: [[2023, null]], US: [[2016, null]] },
      turbineMW: [[2016, 6], [2020, 8], [2024, 15], [2035, 18], [2045, 22]], perUnit: 10, maxUnits: 8,
      capex: [[2016, 6000], [2020, 4200], [2024, 4600], [2030, 3800], [2050, 2800]], fom: 95, vom: 0, build: 36, life: 30, pollution: 0,
      place: 'sea', desc: 'Na morzu wieje mocniej i równiej. Wymaga kabla morskiego do stacji na brzegu.',
    },
    solar: {
      cat: 'gen', name: 'Farma fotowoltaiczna', short: 'Fotowoltaika', color: '#e3c23d', fuel: null, dispatch: 'solar', areaScaled: true,
      avail: { PL: [[2012, null]], US: [[1982, null]] },
      unitMW: [[1982, 1], [1995, 2], [2005, 5], [2012, 10], [2020, 50], [2030, 100]], maxUnits: 6,
      capex: [[1982, 25000], [1990, 11000], [2000, 7000], [2008, 4500], [2010, 3500], [2012, 2200], [2015, 1500], [2018, 1100], [2020, 950], [2025, 750], [2030, 600], [2050, 400]],
      fom: [[1982, 30], [2020, 13]], vom: 0, build: [[1982, 12], [2020, 6]], life: 30, pollution: 0,
      place: 'solar', desc: 'Stawiaj tam, gdzie świeci: na południu i na pustyniach. Produkuje tylko w dzień, latem najwięcej.',
    },
    csp: {
      cat: 'gen', name: 'Elektrownia słoneczna termiczna (CSP)', short: 'CSP', color: '#d9a92c', fuel: null, dispatch: 'solar', areaScaled: true,
      avail: { PL: [], US: [[1984, null]] },
      unitMW: [[1984, 30], [2010, 100]], maxUnits: 4,
      capex: [[1984, 8000], [2010, 5000], [2020, 4500]], fom: 70, vom: 0, build: 30, life: 30, pollution: 0,
      place: 'desert', desc: 'Lustra skupiają słońce na wieży albo rurach z olejem. Tylko tam, gdzie nasłonecznienie przekracza 2000 kWh/m².',
    },
    geothermal: {
      cat: 'gen', name: 'Elektrownia geotermalna', short: 'Geotermia', color: '#b5653a', fuel: null, dispatch: 'flat',
      avail: { PL: [], US: [[1960, null]] },
      unitMW: [[1960, 11], [1970, 50], [1980, 100]], maxUnits: 6, cf: 0.85,
      capex: [[1960, 3200], [2000, 4000], [2020, 4500]], fom: 110, vom: 0, build: 36, life: 40, pollution: 0,
      place: 'geothermal', desc: 'Para z wnętrza Ziemi. Pracuje równo przez całą dobę, ale tylko w nielicznych miejscach.',
    },
    biomass: {
      cat: 'gen', name: 'Elektrownia na biomasę', short: 'Biomasa', color: '#6f9a4a', fuel: 'biomass', dispatch: 'thermal',
      avail: { PL: [[2010, null]], US: [[1985, null]] },
      unitMW: [[1985, 20], [2005, 50], [2012, 200]], maxUnits: 4,
      capex: [[1985, 3800], [2010, 3300], [2020, 3200]], fom: 90, vom: 5,
      eff: [[1985, 0.25], [2010, 0.33], [2020, 0.36]], build: 30, life: 30, pollution: 0.35, water: 3,
      place: 'land', desc: 'Spala zrębki i pellet. Sterowalna i formalnie bezemisyjna, ale paliwo jest drogie.',
    },
    battery: {
      cat: 'store', name: 'Magazyn energii (baterie)', short: 'Baterie', color: '#8fa3b8', fuel: null, dispatch: 'storage',
      avail: { PL: [[2022, null]], US: [[2010, null]] },
      unitMW: [[2010, 10], [2015, 20], [2020, 100], [2025, 200], [2030, 300]], maxUnits: 6,
      hours: [[2010, 1], [2015, 2], [2020, 4], [2040, 6]], rte: 0.88,
      capex: [[2010, 3200], [2015, 2200], [2020, 1400], [2025, 900], [2030, 750], [2050, 500]], fom: 25, vom: 1, build: 9, life: 15, pollution: 0,
      place: 'land', desc: 'Ładuje się, gdy prąd tani (południe, noc), oddaje w szczycie. Wygładza słońce i wiatr.',
    },
    fusion: {
      cat: 'gen', name: 'Elektrownia termojądrowa', short: 'Fuzja', color: '#9a5ad0', fuel: 'fusion', dispatch: 'nuclear',
      avail: { PL: [[2045, null]], US: [[2040, null]] },
      unitMW: [[2040, 400], [2050, 1000]], maxUnits: 4,
      capex: [[2040, 15000], [2045, 11000], [2050, 8000], [2060, 6000]], fom: 160, vom: 3, build: [[2040, 72], [2050, 60]], life: 50, pollution: 0, water: 2,
      place: 'land', desc: 'Element futurystyczny: tokamak zasilany deuterem i trytem. Bez CO₂ i bez długożyciowych odpadów – jeśli fizyka i inżynieria dowiozą.',
    },

    /* ------------------------------ grid ------------------------------ */
    line_sn: {
      cat: 'line', name: 'Linia średniego napięcia', short: 'SN', kvLabel: [[1880, '2 kV'], [1900, '6 kV'], [1925, '15 kV'], [1970, '20 kV']], color: '#6a6a6a',
      avail: { PL: [[1895, null]], US: [[1886, null]] },
      cap: [[1886, 1], [1900, 2.5], [1915, 4], [1930, 8], [1960, 10], [1990, 12], [2020, 15]],
      loss: [[1886, 0.03], [1930, 0.016], [2000, 0.012]], cost: [[1886, 45000], [1920, 40000], [1960, 35000], [2020, 55000]],
      width: 0.8, pole: 'pole', maxKm: 40, desc: 'Lokalne linie do 40 km: wsie, małe elektrownie, przedmieścia. Duże straty na dłuższych odcinkach.',
    },
    line_60: {
      cat: 'line', name: 'Linia wysokiego napięcia 30–60 kV', short: '60 kV', kvLabel: '60 kV', color: '#555',
      avail: { PL: [[1927, 1975]], US: [[1896, 1960]] },
      cap: [[1896, 8], [1910, 20], [1930, 30]], loss: 0.004, cost: [[1896, 130000], [1930, 100000]],
      width: 1.1, pole: 'h', maxKm: 120, desc: 'Pierwsze linie przesyłowe: Niagara–Buffalo, sieć śląska. Przesył kilkudziesięciu MW na sto kilometrów.',
    },
    line_110: {
      cat: 'line', name: 'Linia WN 110 kV', short: '110 kV', kvLabel: '110 kV', color: '#4a4a4a',
      avail: { PL: [[1936, null]], US: [[1908, null]] },
      cap: [[1908, 50], [1930, 80], [1960, 120], [2000, 150]], loss: 0.0012, cost: [[1908, 450000], [1950, 350000], [2020, 420000]],
      width: 1.5, pole: 'h', maxKm: 200, desc: 'Kręgosłup regionalnych sieci. Ok. 100–150 MW na linię.',
    },
    line_220: {
      cat: 'line', name: 'Linia NN 220 kV', short: '220 kV', kvLabel: '220 kV', color: '#3d3d3d',
      avail: { PL: [[1948, null]], US: [[1923, null]] },
      cap: [[1923, 150], [1950, 250], [1970, 350]], loss: 0.0004, cost: [[1923, 900000], [1960, 620000], [2020, 720000]],
      width: 2, pole: 'lattice', maxKm: 400, desc: 'Przesył setek MW między regionami.',
    },
    line_345: {
      cat: 'line', name: 'Linia NN 345 kV', short: '345 kV', kvLabel: '345 kV', color: '#333',
      avail: { PL: [], US: [[1954, null]] },
      cap: [[1954, 700], [1980, 1000]], loss: 0.00023, cost: [[1954, 1100000], [2020, 1000000]],
      width: 2.4, pole: 'lattice', maxKm: 600, desc: 'Pierwsze amerykańskie linie najwyższych napięć (AEP, 1954).',
    },
    line_400: {
      cat: 'line', name: 'Linia NN 400 kV', short: '400 kV', kvLabel: '400 kV', color: '#2b2b2b',
      avail: { PL: [[1964, null]], US: [] },
      cap: [[1964, 1000], [1980, 1500], [2020, 2000]], loss: 0.0002, cost: [[1964, 1300000], [2020, 1400000]],
      width: 2.6, pole: 'lattice', maxKm: 700, desc: 'Krajowy system przesyłowy: łączy wielkie elektrownie z aglomeracjami i z sąsiadami.',
    },
    line_500: {
      cat: 'line', name: 'Linia NN 500 kV', short: '500 kV', kvLabel: '500 kV', color: '#262626',
      avail: { PL: [], US: [[1964, null]] },
      cap: [[1964, 1500], [1990, 2500]], loss: 0.00015, cost: [[1964, 1600000], [2020, 1500000]],
      width: 2.8, pole: 'lattice', maxKm: 900, desc: 'Autostrady energii na Zachodzie USA i w PJM.',
    },
    line_750: {
      cat: 'line', name: 'Linia NN 750 kV', short: '750 kV', kvLabel: [[1960, '765 kV']], color: '#1f1f1f',
      avail: { PL: [[1985, 1995]], US: [[1969, null]] },
      cap: [[1969, 3000], [1990, 4000]], loss: 0.00007, cost: [[1969, 2600000], [2020, 2500000]],
      width: 3.2, pole: 'lattice', maxKm: 1200, desc: 'Najwyższe napięcie prądu przemiennego. W Polsce jedyna taka linia biegła do Chmielnickiej Elektrowni Jądrowej.',
    },
    hvdc: {
      cat: 'line', name: 'Linia stałoprądowa HVDC', short: 'HVDC', kvLabel: '±500 kV DC', color: '#24324a',
      avail: { PL: [[2000, null]], US: [[1970, null]] },
      cap: [[1970, 1400], [1990, 2000], [2010, 3000], [2030, 4000]], loss: 0.00004, fixed: [[1970, 600e6], [2000, 450e6], [2030, 380e6]],
      cost: [[1970, 1700000], [2020, 1500000]], seaMult: 2.2, sea: true, convLoss: 0.015,
      width: 2.6, pole: 'dc', maxKm: 3000, desc: 'Prąd stały na tysiące kilometrów i pod morzem. Drogie stacje przekształtnikowe na obu końcach.',
    },
    cable_sea: {
      cat: 'line', name: 'Kabel morski AC 220 kV', short: 'Kabel morski', kvLabel: '220 kV AC', color: '#2e5d7a',
      avail: { PL: [[2023, null]], US: [[2016, null]] },
      cap: [[2016, 400]], loss: 0.0006, cost: [[2016, 3200000]], sea: true, seaOnly: false,
      width: 1.8, pole: 'cable', maxKm: 120, desc: 'Wyprowadzenie mocy z morskiej farmy wiatrowej do stacji na lądzie (do ok. 120 km).',
    },

    /* --------------------------- nodes & resources --------------------------- */
    substation: {
      cat: 'node', name: 'Stacja elektroenergetyczna', short: 'Stacja', avail: { PL: [[1895, null]], US: [[1886, null]] },
      cost: [[1886, 600000], [1930, 1500000], [1960, 3000000], [2000, 6000000], [2020, 8000000]],
      desc: 'Węzeł sieci: rozgałęzia linie i zmienia napięcie. Linię możesz też zacząć na pustym polu – stacja powstanie sama.',
    },
    coal_mine: {
      cat: 'res', name: 'Kopalnia węgla kamiennego', short: 'Kopalnia', fuel: 'coal', avail: { PL: [[1880, null]], US: [[1880, null]] },
      outputMt: [[1880, 0.15], [1900, 0.3], [1930, 0.8], [1960, 1.5], [1980, 3], [2020, 3]],
      capexPerT: [[1880, 140], [1950, 160], [2020, 260]], cost: { PL: [[1880, 38], [1960, 34], [1990, 45], [2020, 78]], US: [[1880, 34], [1960, 30], [1990, 32], [2020, 55]] },
      kwhPerT: [[1880, 8], [1930, 20], [1970, 35], [2020, 30]], build: 30, life: 60,
      place: 'deposit_coal', desc: 'Własny węgiel jest tańszy od rynkowego i uniezależnia od kryzysów. Kopalnia sama zużywa prąd – podłącz ją do sieci. Nadwyżkę sprzedajesz.',
    },
    lignite_mine: {
      cat: 'res', name: 'Kopalnia odkrywkowa węgla brunatnego', short: 'Odkrywka', fuel: 'lignite', avail: { PL: [[1945, null]], US: [[1945, null]] },
      outputMt: [[1945, 2], [1960, 6], [1975, 15], [1985, 35], [2020, 40]],
      capexPerT: [[1945, 40], [2020, 60]], cost: [[1945, 11], [2020, 15]], kwhPerT: [[1945, 6], [2020, 10]], build: 36, life: 50,
      place: 'deposit_lignite', desc: 'Odkrywka zasila elektrownię stojącą tuż obok (do ok. 25 km). Pochłania prąd na koparki i taśmociągi.',
    },
    gas_well: {
      cat: 'res', name: 'Kopalnia gazu (odwierty)', short: 'Odwierty', fuel: 'gas', avail: { PL: [[1925, null]], US: [[1900, null]] },
      outputGJ: [[1900, 4e6], [1950, 10e6], [1980, 30e6], [2020, 40e6]],
      capexPerGJ: [[1900, 9], [2020, 7]], cost: [[1900, 1.4], [2020, 2.2]], kwhPerGJ: 1.2, build: 24, life: 35,
      place: 'deposit_gas', desc: 'Własne złoże gazu obniża koszt paliwa dla turbin gazowych w okolicy.',
    },
  };

  PN.GEN_ORDER = ['steam_dc', 'hydro_small', 'hydro_dam', 'coal', 'lignite', 'oil', 'gas_ocgt', 'gas_ccgt', 'biomass', 'nuclear', 'smr', 'wind', 'wind_offshore', 'solar', 'csp', 'geothermal', 'fusion'];
  PN.STORE_ORDER = ['battery', 'pumped'];
  PN.LINE_ORDER = ['line_sn', 'line_60', 'line_110', 'line_220', 'line_345', 'line_400', 'line_500', 'line_750', 'hvdc', 'cable_sea'];
  PN.RES_ORDER = ['coal_mine', 'lignite_mine', 'gas_well'];

  /* value of a tech parameter that may be a number, a curve, or {PL:curve, US:curve} */
  PN.tv = function (v, year, code) {
    if (v == null) return v;
    if (typeof v === 'number' || typeof v === 'string') return v;
    if (Array.isArray(v)) {
      if (v.length && typeof v[0][1] === 'string') { let r = v[0][1]; for (const [y, s] of v) if (year >= y) r = s; return r; }
      return PN.curve(v, year);
    }
    if (v.PL || v.US) return PN.tv(v[code] || v.US || v.PL, year, code);
    return v;
  };
  PN.techWindows = (t, code) => (t.avail && t.avail[code]) || [];
  PN.techFirstYear = function (t, code) { const w = PN.techWindows(t, code); return w.length ? w[0][0] : null; };
  /* wind and solar blocks scale with tile area (8 km tiles in Poland, 26 km in the USA) */
  PN.areaK = function (code) { const sc = PN.SCEN && PN.SCEN[code]; return sc ? Math.min(8, Math.max(1, (sc.tileKm / 8) ** 2)) : 1; };
  PN.unitMW = function (t, year, code) {
    if (t.turbineMW) return PN.tv(t.turbineMW, year, code) * t.perUnit * PN.areaK(code);
    if (t.areaScaled) return PN.tv(t.unitMW, year, code) * PN.areaK(code);
    return PN.tv(t.unitMW, year, code);
  };
})();
