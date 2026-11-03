# Research notes – historical events data (Pod Napięciem)

Files: `events_pl.js` (70 events, 7 speculative), `events_us.js` (70 events, 6 speculative).
Every event lists 1–2 URLs used for verification. `certainty: "medium"` = month not known (date set to `-06`
or best season estimate) or sources disagree. Effect magnitudes (loads, subsidies, prosumer growth) are
gameplay estimates scaled from the cited facts, not measured values.

## (a) Earliest electricity on present-day Polish territory

| Date | Fact | Source |
|---|---|---|
| 1878 (month unknown) | First generators on Polish lands: "Król" coal mine (Chorzów) and the Königshütte/Królewska Huta ironworks, Upper Silesia (Prussia). Arc lamps lit the works' railway stop. | Łukasiewicz 1974 [L]; Pilżys 2016 [P] |
| 1879 | First generators in the Kingdom of Poland: Warsaw, B. Hantke metalworks; 5 arc lamps fed straight from a dynamo, removed after ~3 weeks (lamps kept failing). | [L], [P] |
| 1882/1883 | 10 HP electric mine locomotive, Hohenzollern (later Szombierki) mine, Bytom – sources disagree on year. | [L], [P] |
| 1894 / Mar 1895 | First three-phase AC: Biskupice ironworks (U. Silesia) 1894; Żyrardów bleachery March 1895 (first AC in the Kingdom). | [L] |
| **15 Dec 1889** | **First public (utility) power station within today's Poland: Szczecin/Stettin**, DC, served 16:00–01:00, built under the city's contract with Ernst Kuhlo. A German company handbook dates Stettiner Electricitätswerke AG to 19 Aug 1890 (contract from 1 Jan 1890), so 1889/1890 is possible. | Przegląd Zachodniopomorski 2016/3 (doi 10.18276/pz.2016.3-04); [P] |
| 1890 or 1893 | Wrocław municipal plant (1890 per [P], 1893 per [L]); electric trams in Wrocław 1893 (Wikipedia list) or 1891 ([L]). | [L], [P] |
| 1893–1899 | Municipal plants: Bielsko 1893, Kraków 1894 (type unclear), Grudziądz 1894, Elbląg 1895, Bydgoszcz & Gdańsk 1896, Przemyśl 1896, Chorzów (OEW) & Toruń 1898, Tczew 1899; Poznań district plants from 1895. | [L] |
| 1901 / 1904 / 1907 | Radom 1901 (first municipal plant in the Kingdom); Poznań "Grobla" 31 Oct 1904; Warsaw Powiśle 7 Nov 1904 (3×0.55 MW, 5.5 kV); Łódź (EC1) 18 Sep 1907; Kraków municipal plant (Kazimierz) 1905–06. | [L]; Filinger PDF; Enea history; EC1 |

[L] https://bazhum.muzhp.pl/media/texts/kwartalnik-historii-nauki-i-techniki/1974-tom-19-numer-1/kwartalnik_historii_nauki_i_techniki-r1974-t19-n1-s29-44.pdf
[P] https://www.dbc.wroc.pl//Content/36908/PDF/Pilzys_Poczatki_Polskiej_Elektroenergetyki_Na_Przykladzie_Elektrowni_2016.pdf

**Recommended Poland campaign start: 1878.** It is the first documented use of generators and arc lighting on
today's territory and matches the US start (Brush, April 1879). 1878–1889 is an "industrial DC" decade:
factory, mine and sugar-mill plants only (the Kingdom had 40 industrial plants by 1895), then public utilities
from Dec 1889 (Szczecin). If the campaign should open with public supply only, start in **1889**.
Electric trams: Wrocław 1893, Elbląg 23 Nov 1895, Łódź 23 Dec 1898, Kraków 1901, Warsaw 26 Mar 1908.

## (b) First practical availability per tech ID

| Tech | Poland | USA |
|---|---|---|
| steam_dc | 1878 – DC dynamos/arc lamps, Królewska Huta; first public DC plant Szczecin 1889 | 1879 – Brush arc dynamo, Cleveland; Pearl Street central station 4 Sep 1882 |
| hydro_small | 1910 – Straszyn on the Radunia (Oct 1910); water turbines in factory plants from c. 1900 [L] | 1882 – Vulcan Street, Appleton WI (30 Sep 1882) |
| hydro_dam | 1912 – Pilchowice dam on the Bóbr (16 Nov 1912); Leśna/Kwisa 1907 mentioned by one source, unverified | 1913 – Keokuk dam, Iowa (Niagara's Adams plant 1895 was large diversion hydro) |
| pumped | 1971 – Żydowo 156 MW (game unlock); Porąbka-Żar 1979, Żarnowiec 1983 | 1929 – Rocky River, Connecticut (CL&P) |
| coal (AC/turbine steam) | 1904 – Warsaw Powiśle AC 5.5 kV; first municipal turbine Warsaw 1907; Łódź turbine set 1907 | 1903 – Fisk Street, 5 MW Curtis turbine |
| lignite | 1958 – Konin (game unlock); German-era lignite plants not researched | Not researched – suggest available from start |
| oil | No oil-fired utility generation found – suggest never/uneconomic | Not researched (early California oil firing) – suggest from start; 1973 embargo event triples price |
| gas_ocgt | 1999 – unlocked with Gorzów (no earlier utility gas turbine verified) | 1949 – Belle Isle, OG&E, 3.5 MW GE (29 Jul 1949) |
| gas_ccgt | 1999 – Gorzów CHP, first Polish CCGT (GT8C) | 1987 – game unlock at Fuel Use Act repeal; Belle Isle 1949 already had exhaust-heat recovery |
| nuclear | 1983 – game unlock while Żarnowiec NPP was under construction (resolution 18 Jan 1982; cancelled 1990); first real unit planned 2036 | 1957 – Shippingport 60 MW (EBR-I 1951 experimental) |
| smr | ~2035 – OSGE BWRX-300 Włocławek, "mid-2030s" (speculative) | ~2030 – Kairos Hermes 2, 50 MW for Google/TVA (speculative) |
| wind | 2001 – Barzowice farm 5 MW (single 150 kW Nordtank at Lisewo/Żarnowiec 1991) | 1980/81 – Crotched Mountain NH (Dec 1980), Altamont 1981; Brush 1888 & Smith–Putnam 1941 experimental |
| wind_offshore | 2026 – Baltic Power first power to grid 10 Jul 2026 (verified, not speculative) | 2016 – Block Island 30 MW |
| solar | 2011 – Wierzchosławice 1 MW, first ground-mounted PV | 1982 – ARCO Solar Lugo 1 MW (Bell Labs cell 1954) |
| csp | Not applicable (no CSP in Poland) | 1984 – SEGS I 13.8 MW, Daggett |
| geothermal | Not applicable for power (heat only; no power plant found) | 1960 – The Geysers 11 MW (PG&E) |
| biomass | 2012 – Połaniec "Zielony Blok" 205 MW (co-firing earlier, undated) | 1978 – PURPA qualifying facilities (no single first plant verified) |
| battery | 2023 – capacity-market contracts for BESS (Greenvolt alone 1.2 GW, Dec 2023); first BESS contracts Dec 2022 (~165 MW, one source) | 2020 – Moss Landing 300 MW/1200 MWh (earlier pilots not researched) |
| fusion | ~2050 speculative (ITER research 2034, D-T 2039 per 2024 baseline) | ~2045 speculative (NIF ignition 2022; Helion target 2028; CFS ARC early 2030s) |
| line_sn | 1904 – Powiśle 5.5 kV AC (1896 Warsaw exhibition: 1.2 km transformer transmission [L]) | 1896 – Niagara–Buffalo 11 kV (Great Barrington AC with transformers 1886) |
| line_60 | 1927 – Gródek–Toruń 60 kV, 70 km (Gródek–Gdynia 140 km 1927–28) | 1901 – Colgate–Oakland, designed for 60 kV (some sources: 40 kV operation) |
| line_110 | 1937 – 150 kV Mościce–Starachowice mapped to this class (no 150 kV tech); Warsaw's first 110 kV 1951 | 1907 – Croton–Grand Rapids 110 kV (Big Creek 150 kV 1913) |
| line_220 | 1948 – Łagisza–Janów (Silesia–Łódź) built for 220 kV, first run at 110 kV; SEP chronology says 1947 | 1923 – Pit River–Cottonwood–Vaca-Dixon (PG&E) |
| line_345 | Not used in Poland | 1953 – AEP Sporn–Kanawha River ("330/345 kV") |
| line_400 | 1964 – Mikułowa–Joachimów switched to 400 kV (built 1960, ran at 220 kV) | Not used in the US (345/500 kV instead) |
| line_500 | Not used in Poland | 1965 – TVA 500 kV in service 15 May 1965; VEPCO Mount Storm–Doubs also claims "first" (exact date unverified) |
| line_750 | 1985 – Rzeszów (Widełka)–Khmelnytskyi NPP; idle from mid-1990s, 400 kV since 2023 | 1969 – AEP 765 kV Baker–Don Marquis |
| hvdc | 2000 – SwePol 600 MW, 450 kV | 1970 – Pacific DC Intertie ±400 kV, 1440 MW |
| cable_sea | 2000 – SwePol (~239 km subsea) | 2003 – Cross-Sound Cable 330 MW, energised by DOE order 14 Aug 2003 (earlier small cables not researched) |
| coal_mine | From start (Upper Silesian mines; generators at "Król" mine 1878) | From start |
| lignite_mine | 1958 game unlock with Konin; older German-era mining not researched | From start (not verified) |
| gas_well | Not researched (Sub-Carpathian gas) – suggest available from start or 1920s | From start (not verified) |

Techs never unlocked by events: PL – oil, csp, geothermal, line_345, line_500, coal_mine, gas_well;
US – lignite, oil, line_400, coal_mine, lignite_mine, gas_well. The engine should grant the "from start" ones
at campaign start. Each tech is unlocked at most once per file (checked by script).

## (c) First line of each voltage level

| Voltage | Poland | USA |
|---|---|---|
| MV / distribution | 5.5 kV generation, Warsaw Powiśle 1904; 3 kV, Łódź 1907 | 4 kV DC Willamette Falls–Portland 1889; 11 kV Niagara–Buffalo 1896 |
| 60 kV | 1927 Gródek–Toruń | 1901 Colgate–Oakland (design voltage) |
| 110 kV | 1948 (220 kV line run at 110 kV); Warsaw 1951; 150 kV class lines converted to 110/220 kV from 1956 | 1907 Croton–Grand Rapids |
| 150 kV | Dec 1937 Mościce–Starachowice | 1913 Big Creek–Los Angeles |
| 220 kV | 1948 Łagisza–Janów (1947 per SEP chronology) | 1923 Pit River–Vaca-Dixon |
| 345 kV | – | 1953 AEP |
| 400 kV | 1960 built / 1964 energised, Mikułowa–Joachimów | – |
| 500 kV | – | 1965 (TVA; VEPCO Mount Storm–Doubs in the 1960s) |
| 750/765 kV | 1985 Rzeszów–Khmelnytskyi | 1969 AEP |
| HVDC | 2000 SwePol 450 kV | 1970 Pacific DC Intertie ±400 kV |

Key sources: SEP chronology 1960–1990 https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf ;
https://en.wikipedia.org/wiki/History_of_electric_power_transmission ; AEP https://www.aep.com/news/stories/view/882

## (d) Consumption and price pointers
- Poland 1929: generation just over 3 TWh (peak); 1932 slightly above 2 TWh (yearly drops ~5%, 14%, 12%);
  ~730 of the 780 GWh lost 1929–32 came from Silesia (Przegląd Elektrotechniczny 1933 no. 17 and 1935 no. 16:
  https://bcpw.bg.pw.edu.pl/Content/7134/download , https://bcpw.bg.pw.edu.pl/Content/7169/download).
- Poland 1946: 361 plants, 2,553 MW, 5.8 TWh/yr, 244 kWh per capita (SEP chronology above).
- Polish villages with electricity: 3,512 (<10%) at end of 1945; ~12,500 (27%) by 1949; rural electrification law 28 Jun 1950.
- Polish capacity market: 240.32 zł/kW/yr (first auction, Nov 2018); 244.90 zł/kW/yr, 17-year BESS contracts (Dec 2023).
- 2022 coal (CIF ARA): 135–432 USD/t (Grudziński, IGSMiE PAN).
- US farms with electricity: ~3% in the early 1930s, ~11% of rural homes 1932–38, ~90% by 1959 (Wikipedia, Rural Electrification Act).
- US: Oak Ridge peak load 298.8 MW on 1 Sep 1945 (OSTI Manhattan Project history).
- US gas: Henry Hub monthly average $1.95/MMBtu in April 2012 (EIA). PJM capacity price $329.17/MW-day for 2026/27 (record, July 2025).
- US data centres: 4.4% of electricity in 2023 (176 TWh) → 6.7–12% by 2028 (LBNL, Dec 2024).
  Interconnection queues: ~2,600 GW at end-2023, ~2,290 GW at end-2024 (LBNL "Queued Up").
- Long-run US price/consumption series: EIA Monthly Energy Review, ch. 7 (electricity) and ch. 9 (prices).

## Not verified / caveats
- Szczecin "15 Dec 1889" comes from one journal article seen only through its abstract and search excerpts (certainty medium).
- Wrocław dates (1890/1891/1893), Kraków municipal plant (1905 vs 1906), Gródek capacity (3.5 vs 4 MW),
  Rożnów commissioning (1941/1942, only mentioned in text), first Polish 220 kV (1947/1948), Konin start month.
- Exact months unknown for many 1958–1985 Polish milestones (SEP chronology gives years only) → `-06`, medium.
- US: first 500 kV date, Colgate–Oakland voltage, 110 kV year (1907 vs 1908), Keokuk and Rocky River months,
  xAI Colossus start month, Shippingport 60 MW (Wikipedia only).
- "Stopnie zasilania" (rationing) were routine from the late 1970s to 1989 (CIRE history; PSE 2015: first
  use since 1989). No dated 1980s rationing event was found, so they are covered inside the 1979 and 2015 events.
- Palisades (Michigan) restart is left out: as of July 2026 reports it had not restarted.
- Nuclear in Poland is unlocked in 1983 (Żarnowiec under construction), which allows an alternative history;
  a stricter design would unlock it with the Dec 2025 EU state-aid approval instead.
- The US IRA wind/solar subsidies run for 65 months (to end-2027), matching the 2025 OBBBA phase-out.
- Paper names are only set where the title existed at that date and place; omitted where unsure.
