// Pod Napięciem – wydarzenia historyczne, kampania: USA.
// Plain script (no modules). Sorted by date. All texts in Polish.
// Effects use only the vocabulary supported by the engine (see RESEARCH_NOTES.md).
window.PN_EVENTS_US = [
  {
    id: "us_1879_cleveland",
    date: "1879-04",
    title: "Lampy Brusha rozświetlają Cleveland",
    paper: "The Plain Dealer",
    text: "29 kwietnia 1879 r. Charles Brush zapalił na placu Public Square w Cleveland 12 lamp łukowych, zasilanych szeregowo z prądnicy w pobliskiej Telegraph Supply Company. To pierwszy publiczny pokaz elektrycznego oświetlenia ulic w USA.",
    hint: "Możesz stawiać pierwsze małe elektrownie parowe prądu stałego.",
    icon: "bulb",
    effects: [{ type: "unlock", tech: "steam_dc" }],
    sources: [
      "https://en.wikipedia.org/wiki/History_of_street_lighting_in_the_United_States",
      "https://www.comsol.com/blogs/happy-birthday-charles-f-brush"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1880_wabash",
    date: "1880-03",
    title: "Wabash – pierwsze miasto oświetlone prądem",
    paper: "Chicago Tribune",
    text: "31 marca 1880 r. cztery lampy łukowe Brusha zawieszone na gmachu sądu w Wabash w stanie Indiana oświetliły centrum miasta. Wabash ogłasza się pierwszym miastem na świecie oświetlonym elektrycznie.",
    hint: "Miasta chcą światła elektrycznego – to Twoi pierwsi klienci.",
    icon: "bulb",
    effects: [],
    sources: [
      "https://indianapublicmedia.org/momentofindianahistory/lamp-light-on-the-wabash",
      "https://blogs.loc.gov/maps/2024/10/lighting-america-the-early-adoption-of-electric-light/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1882_pearl_street",
    date: "1882-09",
    title: "Pearl Street i Appleton: rodzi się energetyka",
    paper: "The Sun",
    text: "4 września 1882 r. Thomas Edison uruchomił na dolnym Manhattanie parową elektrownię Pearl Street, zasilającą odbiorców prądem stałym. 30 września w Appleton w stanie Wisconsin ruszyła pierwsza na świecie wodna elektrownia systemu Edisona, z prądnicą zdolną zasilić ok. 250 żarówek.",
    hint: "Odblokowano małe elektrownie wodne – tańsze w eksploatacji niż parowe.",
    icon: "plant",
    effects: [{ type: "unlock", tech: "hydro_small" }],
    sources: [
      "https://www.asce.org/about-civil-engineering/history-and-heritage/historic-landmarks/vulcan-street-plant",
      "https://ethw.org/Milestones:Vulcan_Street_Plant,_1882"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1886_great_barrington",
    date: "1886-03",
    title: "Prąd przemienny zasila Great Barrington",
    paper: "The New York Times",
    text: "20 marca 1886 r. William Stanley, pracujący dla George'a Westinghouse'a, zasilił sklepy i biura przy Main Street w Great Barrington prądem przemiennym. Napięcie 500 V z prądnicy firmy Siemens podwyższano transformatorami do 3000 V, a u odbiorców obniżano do 100 V.",
    hint: "Transformator pozwala przesyłać prąd przemienny dalej niż stały – to początek przewagi AC.",
    icon: "tower",
    effects: [],
    sources: [
      "https://ethw.org/Milestones:Alternating_Current_Electrification,_1886"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1888_richmond",
    date: "1888-02",
    title: "Tramwaje Sprague'a ruszają w Richmond",
    paper: "Richmond Dispatch",
    text: "2 lutego 1888 r. w Richmond w Wirginii rozpoczęła regularne kursy sieć tramwajów elektrycznych zaprojektowana przez Franka J. Sprague'a. Każdy wagon ma własne silniki pod podłogą, a układ stanie się wzorem dla większości tramwajów elektrycznych na świecie.",
    hint: "Tramwaje dają stałe obciążenie przez cały dzień – idealny klient dla elektrowni.",
    icon: "tram",
    effects: [
      { type: "load", name: "Tramwaje elektryczne w Richmond", lat: 37.54, lon: -77.44, mw: 0.5, growToMw: 3, years: 10, kind: "tram" }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Richmond_Union_Passenger_Railway",
      "https://ethw.org/Milestones:Richmond_Union_Passenger_Railway,_1888"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1888_tesla",
    date: "1888-05",
    title: "Tesla patentuje silnik prądu przemiennego",
    paper: "The New York Times",
    text: "1 maja 1888 r. Nikola Tesla otrzymał patent na silnik indukcyjny – pierwszy praktyczny silnik prądu przemiennego. W tym samym roku licencję na jego patenty kupił George Westinghouse, który buduje systemy prądu przemiennego dla amerykańskich miast.",
    hint: "Wojna prądów się zaostrza: prąd przemienny może teraz napędzać także fabryki.",
    icon: "factory",
    effects: [],
    sources: [
      "https://www.thehenryford.org/collections-and-research/digital-collections/artifact/45444",
      "https://www.erih.net/how-it-started/stories-about-people-biographies/biography/tesla"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1888_brush_wiatrak",
    date: "1888-06",
    title: "Wiatrak Brusha zasila rezydencję w Cleveland",
    paper: "The Plain Dealer",
    text: "Charles Brush uruchomił przy swoim domu w Cleveland automatyczną turbinę wiatrową o średnicy wirnika ok. 17 m i 144 łopatach. Prądnica o mocy 12 kW ładuje akumulatory w piwnicy, które zasilają ok. 350 żarówek – to pierwszy dom w Cleveland z elektrycznością.",
    hint: "Ciekawostka techniczna – na farmy wiatrowe przyjdzie poczekać prawie sto lat.",
    icon: "wind",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/Charles_F._Brush",
      "https://wind-works.org/charles-brush-and-some-notes-on-early-wind-turbine-development/"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1890_kemmler",
    date: "1890-08",
    title: "Pierwsza egzekucja na krześle elektrycznym",
    paper: "The Sun",
    text: "6 sierpnia 1890 r. w więzieniu Auburn stracono na krześle elektrycznym Williama Kemmlera; egzekucja prądem przemiennym trwała osiem minut. Obóz Edisona przedstawia prąd przemienny jako „prąd kata”, a George Westinghouse komentuje, że lepiej byłoby użyć siekiery.",
    hint: "Wojna prądów toczy się także w gazetach – ale o wyniku zdecyduje ekonomia przesyłu.",
    icon: "crisis",
    effects: [],
    sources: ["https://en.wikipedia.org/wiki/William_Kemmler"],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1893_chicago",
    date: "1893-05",
    title: "Westinghouse oświetla wystawę w Chicago",
    paper: "Chicago Tribune",
    text: "1 maja 1893 r. otwarto Światową Wystawę Kolumbijską w Chicago, oświetloną prądem przemiennym przez firmę Westinghouse'a, która wygrała przetarg na jej oświetlenie. Pokonała m.in. General Electric, powstały 15 kwietnia 1892 r. z fuzji Edison General Electric i Thomson-Houston.",
    hint: "Prąd przemienny zdobywa zaufanie – wielkie systemy AC to przyszłość.",
    icon: "bulb",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/War_of_the_currents",
      "https://en.wikipedia.org/wiki/General_Electric"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1896_niagara",
    date: "1896-11",
    title: "Prąd z Niagary płynie do Buffalo",
    paper: "The New York Times",
    text: "16 listopada 1896 r. tuż po północy prąd przemienny z elektrowni Adamsa nad Niagarą popłynął linią 11 kV do oddalonego o ponad 30 km Buffalo. Elektrownia, która od sierpnia 1895 r. zasila lokalny przemysł, przesądza o zwycięstwie prądu przemiennego.",
    hint: "Odblokowano linie średniego napięcia – prąd dotrze do miast odległych o dziesiątki kilometrów.",
    icon: "water",
    effects: [{ type: "unlock", tech: "line_sn" }],
    sources: [
      "https://edisontechcenter.org/niagara/",
      "https://niagarafallsinfo.com/niagara-falls-history/niagara-falls-power-development/the-history-of-power-development-in-niagara/powerhouse-1-2"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1901_colgate_oakland",
    date: "1901-04",
    title: "Linia 60 kV z gór Sierra do Oakland",
    paper: "San Francisco Chronicle",
    text: "Bay Counties Power Company doprowadziła prąd z elektrowni wodnej Colgate w górach Sierra Nevada do Oakland – linią o długości ponad 200 km, zaprojektowaną na 60 kV. To jedna z najdłuższych i najwyżej napiętych linii przesyłowych na świecie.",
    hint: "Odblokowano linie 60 kV.",
    icon: "tower",
    effects: [{ type: "unlock", tech: "line_60" }],
    sources: [
      "https://reference.insulators.info/publications/view/?id=1099",
      "https://www.tdworld.com/safety-and-training/article/20972444/how-san-francisco-was-electrified"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1903_fisk_street",
    date: "1903-10",
    title: "Fisk Street: turbiny parowe w Chicago",
    paper: "Chicago Tribune",
    text: "2 października 1903 r. Chicago Edison Samuela Insulla uruchomił elektrownię Fisk Street z turbozespołem Curtisa o mocy 5 MW – najpotężniejszym wówczas na świecie. Turbiny pracują z mniej więcej dwukrotnie wyższą sprawnością niż dotychczasowe maszyny tłokowe.",
    hint: "Odblokowano duże elektrownie węglowe z turbinami parowymi.",
    icon: "plant",
    effects: [{ type: "unlock", tech: "coal" }],
    sources: [
      "https://en.wikipedia.org/wiki/Fisk_Generating_Station",
      "https://asme.org/about-asme/engineering-history/landmarks/6-curtis-5000-kw-vertical-turbine"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1907_komisje_stanowe",
    date: "1907-07",
    title: "Stany biorą elektrownie pod nadzór",
    paper: "The New York Times",
    text: "Nowy Jork i Wisconsin powołują komisje regulujące przedsiębiorstwa użyteczności publicznej. Ustawa forsowana przez gubernatora Charlesa Evansa Hughesa tworzy w Nowym Jorku dwie komisje usług publicznych, a Wisconsin jako pierwszy stan obejmuje nadzorem wszystkie takie zakłady, w tym elektrownie.",
    hint: "Monopol w zamian za regulowane ceny – rządzi model koncesyjny.",
    icon: "law",
    effects: [{ type: "regime", regime: "concession" }],
    sources: [
      "https://www.wicourts.gov/courts/history/article32.htm",
      "https://www.archives.nysed.gov/node/361057"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1907_linia_110kv",
    date: "1908-07",
    title: "Michigan: pierwsza linia 110 kV",
    paper: "Chicago Tribune",
    text: "18 lipca 1908 r. Grand Rapids-Muskegon Power Company podała napięcie na liczącą ok. 80 km linię z elektrowni wodnej przy zaporze Croton na rzece Muskegon do Grand Rapids w stanie Michigan. Linia zaprojektowana na 110 kV jest najwyżej napiętą linią przesyłową świata; według części źródeł pełne 110 kV osiągnięto dopiero na początku 1909 r.",
    hint: "Odblokowano linie 110 kV.",
    icon: "tower",
    effects: [{ type: "unlock", tech: "line_110" }],
    sources: [
      "https://reference.insulators.info/publications/view/?id=10497",
      "https://en.wikipedia.org/wiki/Croton_Dam_(Michigan)"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1913_keokuk",
    date: "1913-06",
    title: "Keokuk: największa elektrownia wodna świata",
    paper: "Chicago Tribune",
    text: "Mississippi River Power Company ukończyła zaporę i elektrownię w Keokuk w stanie Iowa – po ukończeniu największą na świecie elektrownię w jednym budynku maszynowni. W Kalifornii Southern California Edison przesyła tymczasem prąd z Big Creek do Los Angeles linią 150 kV, najwyżej napiętą na świecie.",
    hint: "Odblokowano wielkie elektrownie wodne przy zaporach.",
    icon: "water",
    effects: [{ type: "unlock", tech: "hydro_dam" }],
    sources: [
      "https://www.renewableenergyworld.com/hydro-power/dams-civil-structures/keokuk-energy-center-harnessing-the-power-of-the-mississippi/",
      "https://en.wikipedia.org/wiki/Big_Creek_Hydroelectric_Project"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1923_linia_220kv",
    date: "1923-06",
    title: "Kalifornia: pierwsze linie 220 kV",
    paper: "Los Angeles Times",
    text: "W Kalifornii weszła do eksploatacji linia Pit River–Cottonwood–Vaca-Dixon, zbudowana na napięcie 220 kV. Na 220 kV przechodzi także system Big Creek, którego linia do Los Angeles pracowała pod napięciem 150 kV.",
    hint: "Odblokowano linie 220 kV.",
    icon: "tower",
    effects: [{ type: "unlock", tech: "line_220" }],
    sources: [
      "https://en.wikipedia.org/wiki/History_of_electric_power_transmission",
      "https://en.wikipedia.org/wiki/Big_Creek_Hydroelectric_Project"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1929_rocky_river",
    date: "1929-06",
    title: "Rocky River: woda pompowana pod górę",
    paper: "The New York Times",
    text: "Connecticut Light & Power uruchomiła w Rocky River pierwszą dużą w USA elektrownię szczytowo-pompową. Poza szczytem pompy tłoczą wodę z rzeki Housatonic do zbiornika Candlewood Lake, a w godzinach największego popytu woda wraca przez turbiny.",
    hint: "Odblokowano elektrownie szczytowo-pompowe – magazyn energii na skalę systemu.",
    icon: "water",
    effects: [{ type: "unlock", tech: "pumped" }],
    sources: [
      "https://ethw.org/ASME-Landmark:Rocky_River_Pumped-Storage_Hydroelectric_Plant",
      "https://www.asce.org/about-civil-engineering/history-and-heritage/historic-landmarks/rocky-river-pumped-storage-hydraulic-plant"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1929_krach",
    date: "1929-10",
    title: "Krach na Wall Street",
    paper: "The Wall Street Journal",
    text: "W czarny czwartek 24 października i czarny wtorek 29 października 1929 r. kursy akcji na Wall Street runęły. Zagrożone są zadłużone piramidy spółek holdingowych energetyki, takie jak imperium Samuela Insulla.",
    hint: "Nadchodzą chude lata: popyt na prąd spadnie, a kredyt zdrożeje.",
    icon: "crisis",
    effects: [{ type: "demand", mult: 0.85, months: 36 }],
    sources: [
      "https://en.wikipedia.org/wiki/Wall_Street_crash_of_1929",
      "https://en.wikipedia.org/wiki/Samuel_Insull"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1933_tva",
    date: "1933-05",
    title: "Kongres powołuje Tennessee Valley Authority",
    paper: "The Washington Post",
    text: "18 maja 1933 r. prezydent Franklin D. Roosevelt podpisał ustawę o Tennessee Valley Authority – federalnej agencji, która będzie budować zapory i elektrownie w jednym z najbiedniejszych regionów kraju. W dolinie Tennessee prąd ma dziś tylko 3 na 100 gospodarstw rolnych.",
    hint: "Państwo wchodzi do energetyki – publiczne zapory staną się konkurencją dla prywatnych spółek.",
    icon: "water",
    effects: [],
    sources: [
      "https://www.tva.com/about-tva/our-history/the-1930s",
      "https://en.wikipedia.org/wiki/Tennessee_Valley_Authority"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1935_rea",
    date: "1935-05",
    title: "Roosevelt tworzy agencję elektryfikacji wsi",
    paper: "The Washington Post",
    text: "11 maja 1935 r. dekretem nr 7037 prezydent Roosevelt powołał Rural Electrification Administration. Prywatne spółki nie chcą budować linii na rzadko zaludnionych terenach, więc elektryfikacja wsi od 1932 r. stoi w miejscu na poziomie ok. 11 proc. domów.",
    hint: "Tanie federalne pożyczki: przez dwie dekady linie na wsi kosztują znacznie mniej.",
    icon: "bulb",
    effects: [{ type: "subsidy", target: "rural", costMult: 0.6, months: 240 }],
    sources: [
      "https://en.wikipedia.org/wiki/Rural_Electrification_Act",
      "https://www.rd.usda.gov/media/file/download/uep-ip-100-1.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1935_puhca",
    date: "1935-08",
    title: "Kongres rozbija piramidy holdingów energetyki",
    paper: "The Wall Street Journal",
    text: "26 sierpnia 1935 r. Roosevelt podpisał Public Utility Holding Company Act, ograniczający piramidy spółek holdingowych w energetyce. To odpowiedź na upadek w 1932 r. imperium Samuela Insulla, który zrujnował ok. 600 tys. akcjonariuszy.",
    hint: "Koniec finansowej inżynierii – energetyka ma być nudna i regulowana.",
    icon: "law",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/Public_Utility_Act",
      "https://en.wikipedia.org/wiki/Samuel_Insull"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1936_boulder",
    date: "1936-10",
    title: "Zapora Boulder daje prąd Los Angeles",
    paper: "Los Angeles Times",
    text: "26 października 1936 r. pierwszy generator N-2 elektrowni przy zaporze Boulder na rzece Kolorado wszedł do pełnej eksploatacji. Energia z Czarnego Kanionu popłynie liniami przesyłowymi do odległego o kilkaset kilometrów Los Angeles.",
    hint: "Wielkie zapory na zachodzie dają tanią energię, ale wymagają długich linii.",
    icon: "water",
    effects: [],
    sources: ["https://www.usbr.gov/lc/hooverdam/history/articles/chrono.html"],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1941_grand_coulee",
    date: "1941-03",
    title: "Grand Coulee daje pierwszy prąd",
    paper: "The Spokesman-Review",
    text: "22 marca 1941 r. pierwsze generatory zapory Grand Coulee na rzece Kolumbia zaczęły wytwarzać prąd; główny generator ma ruszyć jesienią. Razem z zaporą Bonneville, produkującą energię od 1938 r., Kolumbia staje się energetycznym zapleczem północnego zachodu USA.",
    hint: "Tani prąd z Kolumbii przyciągnie energochłonny przemysł.",
    icon: "water",
    effects: [],
    sources: ["https://historylink.org/File/9798"],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1941_smith_putnam",
    date: "1941-10",
    title: "Megawatowy wiatrak na Grandpa's Knob",
    paper: "The New York Times",
    text: "19 października 1941 r. turbinę Smith–Putnam o mocy 1,25 MW, ustawioną na wzgórzu Grandpa's Knob w Vermoncie, zsynchronizowano z siecią Central Vermont Public Service. To pierwsza na świecie turbina wiatrowa o mocy ponad megawata.",
    hint: "Eksperyment, nie przełom – wojna wstrzyma rozwój wielkich wiatraków.",
    icon: "wind",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/Smith%E2%80%93Putnam_wind_turbine",
      "https://www.guinnessworldrecords.com/world-records/640987-first-megawatt-wind-turbine"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1942_produkcja_wojenna",
    date: "1942-01",
    title: "Ameryka przestawia się na wojnę",
    paper: "The New York Times",
    text: "Po ataku na Pearl Harbor 7 grudnia 1941 r. USA przystąpiły do wojny, a w styczniu 1942 r. Roosevelt powołał Zarząd Produkcji Wojennej, który rozdziela surowce i wstrzymuje zbędną produkcję cywilną. Huty aluminium, stocznie i fabryki broni pracują bez przerwy: już w 1941 r. elektrownie zawodowe wytworzyły 165 mld kWh, o 16 proc. więcej niż rok wcześniej.",
    hint: "Zbrojenia pochłaniają prąd – przez kilka lat wojny popyt będzie wyraźnie wyższy niż zwykle.",
    icon: "war",
    effects: [{ type: "demand", mult: 1.12, months: 42 }],
    sources: [
      "https://fred.stlouisfed.org/series/M0128AUSM247NNBR",
      "https://en.wikipedia.org/wiki/War_Production_Board"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1943_projekt_manhattan",
    date: "1943-06",
    title: "Tajne zakłady w Oak Ridge pożerają prąd",
    text: "W Oak Ridge w Tennessee wojsko buduje zakłady wzbogacania uranu Y-12 i K-25, zasilane z sieci TVA i z własnej elektrowni. Przydział mocy dla kompleksu ma sięgnąć ok. 310 MW, a Hanford nad Kolumbią wybrano m.in. ze względu na energię z zapory Grand Coulee.",
    hint: "Wojskowy odbiorca o ogromnym poborze – priorytet ponad wszystko.",
    icon: "war",
    effects: [
      { type: "load", name: "Oak Ridge (Projekt Manhattan)", lat: 35.93, lon: -84.31, mw: 50, growToMw: 300, years: 2, kind: "military" }
    ],
    sources: [
      "https://www.nps.gov/places/oak-ridge-wayside-powering-the-manhattan-project.htm",
      "https://www.osti.gov/opennet/manhattan-project-history/Places/OakRidge/oak-ridge.html"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1949_belle_isle",
    date: "1949-07",
    title: "Pierwsza turbina gazowa w amerykańskiej sieci",
    paper: "The New York Times",
    text: "29 lipca 1949 r. turbina gazowa GE o mocy 3,5 MW w elektrowni Belle Isle spółki Oklahoma Gas and Electric zaczęła oddawać energię do sieci – jako pierwsza w USA. Gorące spaliny podgrzewają wodę zasilającą sąsiedni blok parowy.",
    hint: "Odblokowano turbiny gazowe – szybki start, idealne na szczyt.",
    icon: "gas",
    effects: [{ type: "unlock", tech: "gas_ocgt" }],
    sources: [
      "https://www.asme.org/wwwasmeorg/media/ResourceFiles/AboutASME/Who We Are/Engineering History/Landmarks/100-Belle-Isle-Gas-Turbine.pdf",
      "https://www.ethw.org/ASME-Landmark:Belle_Isle_Gas_Turbine"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1953_linia_345kv",
    date: "1953-06",
    title: "AEP uruchamia pierwszą na świecie linię 345 kV",
    paper: "The Wall Street Journal",
    text: "American Electric Power uruchomił pierwszą na świecie linię 345 kV, łączącą elektrownie Sporn i Kanawha River w Wirginii Zachodniej; jej napięcie podawane jest jako 330–345 kV. Pierwszą linią bardzo wysokiego napięcia w ogóle była jednak szwedzka linia 380 kV z 1952 r.",
    hint: "Odblokowano linie 345 kV – kręgosłup amerykańskiej sieci przesyłowej.",
    icon: "tower",
    effects: [{ type: "unlock", tech: "line_345" }],
    sources: [
      "https://www.aep.com/news/stories/view/882",
      "https://en.wikipedia.org/wiki/History_of_electric_power_transmission"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1953_atom_dla_pokoju",
    date: "1953-12",
    title: "Eisenhower: atom dla pokoju",
    paper: "The New York Times",
    text: "8 grudnia 1953 r. prezydent Dwight Eisenhower przedstawił na forum ONZ program „Atomy dla pokoju”. Dwa lata wcześniej, 20 grudnia 1951 r., reaktor EBR-I w Idaho jako pierwszy wytworzył prąd z rozszczepienia jąder, zapalając cztery 200-watowe żarówki.",
    hint: "Energetyka jądrowa wychodzi z laboratoriów – pierwsze elektrownie są już blisko.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://ethw.org/Milestones:Experimental_Breeder_Reactor_I,_1951",
      "https://en.wikipedia.org/wiki/Atoms_for_Peace"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1954_ogniwo_slonczne",
    date: "1954-04",
    title: "Bell Labs: prąd prosto ze słońca",
    paper: "The New York Times",
    text: "25 kwietnia 1954 r. Daryl Chapin, Calvin Fuller i Gerald Pearson z Bell Labs zaprezentowali pierwsze praktyczne krzemowe ogniwo słoneczne o sprawności ok. 6 proc. Podczas pokazu ogniwa napędzały model diabelskiego młyna.",
    hint: "Na razie za drogie dla sieci – ale to zalążek fotowoltaiki.",
    icon: "solar",
    effects: [],
    sources: [
      "https://aps.org/apsnews/2009/04/bell-labs-silicon-solar-cell",
      "https://ethw.org/Milestones:First_Practical_Photovoltaic_Solar_Cell"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1957_shippingport",
    date: "1957-12",
    title: "Shippingport: pierwsza duża elektrownia jądrowa",
    paper: "The New York Times",
    text: "2 grudnia 1957 r. reaktor elektrowni Shippingport w Pensylwanii, eksploatowanej przez Duquesne Light, osiągnął stan krytyczny, a jeszcze w grudniu zaczął oddawać energię do sieci. To pierwsza pełnoskalowa elektrownia jądrowa w USA, o mocy 60 MW.",
    hint: "Odblokowano elektrownie jądrowe.",
    icon: "nuclear",
    effects: [{ type: "unlock", tech: "nuclear" }],
    sources: ["https://en.wikipedia.org/wiki/Shippingport_Atomic_Power_Station"],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1960_geysers",
    date: "1960-09",
    title: "The Geysers: prąd z wnętrza Ziemi",
    paper: "San Francisco Chronicle",
    text: "25 września 1960 r. Pacific Gas and Electric uruchomiła w The Geysers w Kalifornii pierwszą komercyjną elektrownię geotermalną w USA, o mocy 11 MW. Napędza ją przerobiona turbina GE z 1924 r., zasilana parą prosto z odwiertów.",
    hint: "Odblokowano elektrownie geotermalne – tylko tam, gdzie gorąca para jest blisko powierzchni.",
    icon: "plant",
    effects: [{ type: "unlock", tech: "geothermal" }],
    sources: [
      "https://www.asme.org/wwwasmeorg/media/ResourceFiles/AboutASME/Who We Are/Engineering History/Landmarks/109-Geysers-Unit-1.pdf",
      "https://www.thinkgeoenergy.com/historical-overview-on-geothermal-at-the-geysers-california/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1965_wielka_awaria",
    date: "1965-11",
    title: "Wielka awaria: 30 milionów ludzi bez prądu",
    paper: "The New York Times",
    text: "9 listopada 1965 r. zbyt czule nastawiony przekaźnik na linii w Ontario wywołał kaskadową awarię, która pozbawiła prądu ok. 30 mln ludzi w północno-wschodnich USA i Kanadzie; Nowy Jork był ciemny przez ponad 13 godzin. Sieci rosną szybciej niż ich koordynacja, a energetyka wchodzi już na napięcie 500 kV – pierwszą taką linię Tennessee Valley Authority włączyła 15 maja 1965 r.",
    hint: "Odblokowano linie 500 kV; połączone sieci dzielą rezerwy, ale też awarie.",
    icon: "blackout",
    effects: [{ type: "unlock", tech: "line_500" }, { type: "outage", region: { lat: 42.5, lon: -75, radiusKm: 450 }, months: 1 }],
    sources: [
      "https://www.nerc.com/globalassets/who-we-are/march-2023-nerc-timeline.pdf",
      "https://en.wikipedia.org/wiki/Tennessee_Valley_Authority"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1969_linia_765kv",
    date: "1969-06",
    title: "AEP: rekordowe 765 kV",
    paper: "The Wall Street Journal",
    text: "American Electric Power ukończył pierwszą na świecie linię 765 kV, biegnącą 68 mil (ok. 110 km) od stacji Baker przy elektrowni Big Sandy w Kentucky do stacji Don Marquis koło Piketon w Ohio. To najwyższe napięcie przemienne w amerykańskiej sieci – jedna taka linia może przesłać moc kilku dużych elektrowni.",
    hint: "Odblokowano linie 765 kV (klasa 750 kV).",
    icon: "tower",
    effects: [{ type: "unlock", tech: "line_750" }],
    sources: [
      "https://www.aep.com/news/stories/view/882",
      "https://WeCanFigureThisOut.org/ENERGY/Web_notes/Electricity/Generic_Power_Plant_and_Grid_Supporting_Files/American%20Electric%20Power%20Corp%20-%20Transmission%20Facts.pdf"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_1970_pacific_intertie",
    date: "1970-05",
    title: "Prąd stały z Oregonu do Los Angeles",
    paper: "Los Angeles Times",
    text: "21 maja 1970 r. ruszyła komercyjnie linia prądu stałego Pacific DC Intertie (±400 kV, 1440 MW) z przekształtnikowni Celilo nad Kolumbią do Sylmar pod Los Angeles. Licząca ok. 1360 km linia przesyła energię wodną z północnego zachodu do Kalifornii.",
    hint: "Odblokowano linie HVDC – najtańszy sposób przesyłu na ponad tysiąc kilometrów.",
    icon: "tower",
    effects: [{ type: "unlock", tech: "hvdc" }],
    sources: [
      "https://en.wikipedia.org/wiki/Pacific_DC_Intertie",
      "https://www.ladwp.com/sites/default/files/documents/Sylmar_Ground_Return_Initial_Study.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1970_epa",
    date: "1970-12",
    title: "Powstaje EPA, Kongres walczy o czyste powietrze",
    paper: "The Washington Post",
    text: "2 grudnia 1970 r. zaczęła działać Agencja Ochrony Środowiska (EPA), a 31 grudnia prezydent Richard Nixon podpisał nowelizację ustawy o czystym powietrzu (Clean Air Act). Elektrownie węglowe czekają normy emisji pyłów i dwutlenku siarki.",
    hint: "Spalanie węgla zdrożeje: filtry, odsiarczanie i węgiel niskosiarkowy kosztują.",
    icon: "law",
    effects: [{ type: "fuel", fuel: "coal", mult: 1.1, months: 120 }],
    sources: [
      "https://en.wikipedia.org/wiki/United_States_Environmental_Protection_Agency",
      "https://en.wikipedia.org/wiki/Clean_Air_Act_(United_States)"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1973_embargo_naftowe",
    date: "1973-10",
    title: "Arabskie embargo: ropa gwałtownie drożeje",
    paper: "The Wall Street Journal",
    text: "W październiku 1973 r. arabscy producenci zrzeszeni w OAPEC ogłosili embargo na dostawy ropy do USA. Cena baryłki gwałtownie rośnie, a elektrownie opalane olejem opałowym płacą za paliwo kilka razy więcej.",
    hint: "Elektrownie olejowe stają się nieopłacalne – czas na węgiel, atom i gaz.",
    icon: "oil",
    effects: [{ type: "fuel", fuel: "oil", mult: 1.4, months: 18 }],
    sources: [
      "https://en.wikipedia.org/wiki/1973_oil_crisis"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1977_nowy_jork",
    date: "1977-07",
    title: "Nowy Jork w ciemnościach, miasto plądrowane",
    paper: "The New York Times",
    text: "13 lipca 1977 r. wieczorem piorun uderzył w stację w Buchanan nad rzeką Hudson; kolejne uderzenia i błędy w sterowni Con Edison doprowadziły godzinę później do wyłączenia całego systemu. Nowy Jork był bez prądu przez ok. 25 godzin, a ulice opanowały grabieże.",
    hint: "Miasto zasilane kilkoma liniami z zewnątrz jest bezbronne – dbaj o rezerwę lokalnej mocy.",
    icon: "blackout",
    effects: [{ type: "outage", region: { lat: 40.71, lon: -74.0, radiusKm: 40 }, months: 1 }],
    sources: [
      "https://en.wikipedia.org/wiki/New_York_City_blackout_of_1977",
      "https://www.nrc.gov/docs/ML1005/ML100550168.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1978_purpa",
    date: "1978-11",
    title: "PURPA otwiera sieci dla niezależnych wytwórców",
    paper: "The Washington Post",
    text: "9 listopada 1978 r. prezydent Jimmy Carter podpisał pakiet ustaw energetycznych. PURPA zobowiązuje zakłady energetyczne do kupowania prądu od małych niezależnych wytwórców – m.in. elektrowni wiatrowych, na biomasę i kogeneracji – po cenie kosztów unikniętych. Ustawa o paliwach (Fuel Use Act) zakazuje zaś opalania gazem i ropą nowych elektrowni podstawowych.",
    hint: "Odblokowano biomasę; wiatr i słońce są tańsze, a gaz w nowych blokach – drogi i źle widziany.",
    icon: "law",
    effects: [
      { type: "unlock", tech: "biomass" },
      { type: "subsidy", target: "wind", costMult: 0.75, months: 96 },
      { type: "subsidy", target: "solar", costMult: 0.8, months: 96 },
      { type: "fuel", fuel: "gas", mult: 1.3, months: 102 },
      { type: "ipp", scope: "small" }
    ],
    sources: [
      "https://webarchive.library.unt.edu/eot2008/20081009071108/http://edocket.access.gpo.gov/2003/03-21401.htm",
      "https://en.wikipedia.org/wiki/Public_Utility_Regulatory_Policies_Act"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1979_iran",
    date: "1979-01",
    title: "Rewolucja w Iranie: drugi szok naftowy",
    paper: "The Wall Street Journal",
    text: "Rewolucja w Iranie sparaliżowała tamtejsze pola naftowe: do stycznia 1979 r. wydobycie spadło o 4,8 mln baryłek dziennie, czyli o ok. 7 proc. światowej produkcji. Ceny ropy znów idą w górę, a elektrownie opalane olejem, które w 1978 r. dały ok. 16 proc. prądu w USA, muszą płacić za paliwo coraz więcej.",
    hint: "Olej opałowy drożeje – zastępuj elektrownie olejowe węglem, atomem lub gazem.",
    icon: "oil",
    effects: [{ type: "fuel", fuel: "oil", mult: 1.15, months: 15 }],
    sources: [
      "https://www.federalreservehistory.org/essays/oil-shock-of-1978-79",
      "https://www.eia.gov/totalenergy/data/browser/?tbl=T07.02A"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1979_three_mile_island",
    date: "1979-03",
    title: "Awaria w Three Mile Island",
    paper: "The Philadelphia Inquirer",
    text: "28 marca 1979 r. w bloku nr 2 elektrowni Three Mile Island koło Harrisburga w Pensylwanii doszło do częściowego stopienia rdzenia reaktora. Choć do otoczenia trafiło niewiele promieniowania, wypadek wstrząsa opinią publiczną i hamuje zamówienia na nowe reaktory.",
    hint: "Nowe elektrownie jądrowe będą budowane dłużej i drożej.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/Three_Mile_Island_accident",
      "https://www.nrc.gov/reading-rm/doc-collections/fact-sheets/3mile-isle.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1981_altamont",
    date: "1981-04",
    title: "Gorączka wiatrowa na przełęczy Altamont",
    paper: "San Francisco Chronicle",
    text: "U.S. Windpower, które w grudniu 1980 r. uruchomiło w New Hampshire pierwszą farmę wiatrową (20 turbin po 30 kW), stawia 100 wiatraków na przełęczy Altamont koło Livermore w Kalifornii. Wysokie ceny kosztów unikniętych i ulgi podatkowe – 25 proc. federalnej, podwojonej przez Kalifornię – wywołują „gorączkę wiatrową”.",
    hint: "Odblokowano farmy wiatrowe – szukaj wietrznych przełęczy.",
    icon: "wind",
    effects: [{ type: "unlock", tech: "wind" }],
    sources: [
      "https://www.csmonitor.com/layout/set/amphtml/1981/0407/040731.html",
      "https://granitegeek.concordmonitor.com/2016/02/24/remembering-worlds-first-wind-farm-new-hampshire/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1982_lugo_pv",
    date: "1982-12",
    title: "Pierwszy megawat ze słońca w Hesperii",
    paper: "Los Angeles Times",
    text: "15 grudnia 1982 r. ARCO Solar rozpoczęła pełną pracę elektrowni fotowoltaicznej o mocy 1 MW obok stacji Lugo spółki Southern California Edison w Hesperii. To jedna z pierwszych na świecie elektrowni fotowoltaicznych o mocy megawata.",
    hint: "Odblokowano farmy fotowoltaiczne – na razie drogie, ale z czasem potanieją.",
    icon: "solar",
    effects: [{ type: "unlock", tech: "solar" }],
    sources: [
      "https://www.osti.gov/biblio/5049780",
      "https://ui.adsabs.harvard.edu/abs/1984pvse.conf..314A/abstract"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1984_segs",
    date: "1984-12",
    title: "Lustra na pustyni Mojave: rusza SEGS I",
    paper: "Los Angeles Times",
    text: "W Daggett na pustyni Mojave rusza SEGS I – słoneczna elektrownia cieplna firmy Luz o mocy 13,8 MW. Paraboliczne lustra skupiają promienie słońca na rurach z olejem, który wytwarza parę dla turbiny; od grudnia 1984 r. energia trafia do sieci Southern California Edison.",
    hint: "Odblokowano elektrownie słoneczne skoncentrowane – tylko na pustynnym południowym zachodzie.",
    icon: "solar",
    effects: [{ type: "unlock", tech: "csp" }],
    sources: [
      "https://en.wikipedia.org/wiki/Solar_Energy_Generating_Systems",
      "https://webarchive.library.unt.edu/eot2008/20090825130236/http:/www.eia.doe.gov/kids/history/timelines/solar.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1987_gaz_znow_dozwolony",
    date: "1987-05",
    title: "Gaz znów dozwolony w elektrowniach",
    paper: "The Wall Street Journal",
    text: "21 maja 1987 r. uchylono kluczowe przepisy ustawy Fuel Use Act z 1978 r., które zakazywały opalania gazem nowych elektrowni podstawowych. Spadające ceny gazu otwierają drogę wydajnym blokom gazowo-parowym.",
    hint: "Odblokowano bloki gazowo-parowe – wysoka sprawność i krótka budowa.",
    icon: "gas",
    effects: [{ type: "unlock", tech: "gas_ccgt" }],
    sources: [
      "https://webarchive.library.unt.edu/web/20161231152311/http:/www.eia.gov/oil_gas/natural_gas/analysis_publications/ngmajorleg/repeal.html",
      "https://usc-cdn.house.gov/statutes/pl/100/42.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1990_kuwejt",
    date: "1990-08",
    title: "Irak zajmuje Kuwejt, ropa drożeje",
    paper: "The Wall Street Journal",
    text: "2 sierpnia 1990 r. wojska irackie wkroczyły do Kuwejtu, a rynek zaczął się obawiać o dostawy z całej Zatoki Perskiej. Ropa, w lipcu średnio po 17 dolarów za baryłkę, gwałtownie drożeje. Amerykańska energetyka odczuje to jednak słabo: ropa daje już tylko ok. 5 proc. prądu w USA, wobec 17 proc. w 1973 r.",
    hint: "Skok cen ropy potrwa kilka miesięcy – dla sieci opartej na węglu, gazie i atomie to raczej ciekawostka niż kryzys.",
    icon: "oil",
    effects: [{ type: "fuel", fuel: "oil", mult: 1.6, months: 5 }],
    sources: [
      "https://en.wikipedia.org/wiki/1990_oil_price_shock",
      "https://www.eia.gov/totalenergy/data/browser/?tbl=T07.02A"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1992_epact",
    date: "1992-10",
    title: "Ustawa o polityce energetycznej: ulga za wiatr",
    paper: "The Washington Post",
    text: "24 października 1992 r. prezydent George H.W. Bush podpisał Energy Policy Act. Ustawa wprowadza ulgę produkcyjną 1,5 centa za kWh energii z wiatru i otwiera rynek hurtowy dla niezależnych wytwórców.",
    hint: "Farmy wiatrowe przez dekadę są wyraźnie tańsze.",
    icon: "law",
    effects: [{ type: "subsidy", target: "wind", costMult: 0.85, months: 120 }],
    sources: ["https://en.wikipedia.org/wiki/Energy_Policy_Act_of_1992"],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1995_kwasne_deszcze",
    date: "1995-01",
    title: "Rusza handel uprawnieniami do emisji SO₂",
    paper: "The Washington Post",
    text: "1 stycznia 1995 r. ruszyła pierwsza faza programu przeciw kwaśnym deszczom z nowelizacji ustawy o czystym powietrzu z listopada 1990 r. Odtąd 263 bloki w 110 elektrowniach, głównie węglowych, muszą mieć uprawnienie na każdą tonę dwutlenku siarki i mogą handlować nadwyżkami. Od 2000 r. limit obejmie ponad 2000 bloków i spadnie docelowo do 8,95 mln ton rocznie – połowy emisji energetyki z 1980 r.",
    hint: "Spalanie zasiarczonego węgla nieco drożeje – opłaca się odsiarczanie albo węgiel niskosiarkowy.",
    icon: "law",
    effects: [{ type: "fuel", fuel: "coal", mult: 1.05, months: 120 }],
    sources: [
      "https://www.epa.gov/acidrain/acid-rain-program",
      "https://www.epa.gov/clean-air-act-overview/1990-clean-air-act-amendment-summary"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_1996_order_888",
    date: "1996-04",
    title: "FERC otwiera sieci przesyłowe dla konkurencji",
    paper: "The Wall Street Journal",
    text: "24 kwietnia 1996 r. Federalna Komisja Regulacji Energetyki wydała Order 888, nakazujący zakładom energetycznym otwarty i niedyskryminacyjny dostęp do sieci przesyłowych. Znika największa bariera dla konkurencyjnego hurtowego rynku energii.",
    hint: "Era rynku: Twoje elektrownie konkurują o odbiorców, a sieć musi przyjąć cudzą energię.",
    icon: "law",
    effects: [{ type: "regime", regime: "market" }, { type: "ipp", scope: "all" }],
    sources: ["https://www.ferc.gov/sites/default/files/2020-05/rm95-8p1-000.txt"],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2001_kalifornia",
    date: "2001-01",
    title: "Kalifornia: rotacyjne wyłączenia prądu",
    paper: "Los Angeles Times",
    text: "17 i 18 stycznia 2001 r. operator sieci Kalifornii zarządził rotacyjne wyłączenia, bo zabrakło mocy. Nieudana deregulacja zamroziła ceny detaliczne, podczas gdy hurtowe ceny energii wzrosły wielokrotnie, a zakłady energetyczne stoją na skraju bankructwa.",
    hint: "Rynek bez rezerw mocy i z drogim gazem kończy się wyłączeniami.",
    icon: "blackout",
    effects: [
      { type: "outage", region: { lat: 36.8, lon: -119.4, radiusKm: 400 }, months: 1 },
      { type: "fuel", fuel: "gas", mult: 2, months: 6 }
    ],
    sources: ["https://en.wikipedia.org/wiki/2000%E2%80%9301_California_electricity_crisis"],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2003_irak",
    date: "2003-03",
    title: "Wojna w Iraku, a ropa tanieje",
    paper: "The Wall Street Journal",
    text: "20 marca 2003 r. wojska USA i Wielkiej Brytanii zaatakowały Irak. Ropa, która jeszcze kilka tygodni wcześniej kosztowała blisko 40 dolarów za baryłkę, w przeddzień wojny spadła poniżej 30 dolarów, bo rynek liczy na szybkie zwycięstwo bez przerw w dostawach. Dla amerykańskich elektrowni to niemal bez znaczenia – z ropy pochodzi tylko ok. 2,5 proc. prądu w USA.",
    hint: "Wojny na Bliskim Wschodzie mocniej podnoszą ceny benzyny niż prądu – sieci opartej na węglu, gazie i atomie prawie nie dotyczą.",
    icon: "oil",
    effects: [],
    sources: [
      "https://www.voanews.com/a/a-13-a-2003-03-19-47-crude/298121.html",
      "https://www.eia.gov/totalenergy/data/browser/?tbl=T07.02A"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2003_blackout",
    date: "2003-08",
    title: "Blackout: 55 milionów ludzi w ciemnościach",
    paper: "The New York Times",
    text: "14 sierpnia 2003 r. przeciążone linie FirstEnergy w Ohio zetknęły się z nieprzyciętymi drzewami, a kaskadowa awaria pozbawiła prądu ok. 55 mln mieszkańców północnego wschodu USA i Ontario. Jeszcze tego dnia Departament Energii nakazał uruchomić zablokowany przez spory podmorski kabel Cross-Sound (330 MW) między Connecticut a Long Island.",
    hint: "Przycinaj drzewa pod liniami i dbaj o połączenia z sąsiednimi systemami – w kryzysie każde łącze się liczy.",
    icon: "blackout",
    effects: [{ type: "outage", region: { lat: 41.5, lon: -80, radiusKm: 500 }, months: 1 }],
    sources: [
      "https://en.wikipedia.org/wiki/Northeast_blackout_of_2003",
      "https://www.energy.gov/node/366235"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2005_epact",
    date: "2005-08",
    title: "Energy Policy Act: wsparcie dla atomu",
    paper: "The Washington Post",
    text: "8 sierpnia 2005 r. prezydent George W. Bush podpisał Energy Policy Act. Ustawa daje nowym elektrowniom jądrowym gwarancje kredytowe i ulgi produkcyjne, a standardy niezawodności NERC – organizacji powołanej po awarii z 1965 r. – stają się obowiązkowe.",
    hint: "Nowe reaktory są tańsze w finansowaniu.",
    icon: "law",
    effects: [{ type: "subsidy", target: "nuclear", costMult: 0.85, months: 120 }],
    sources: [
      "https://en.wikipedia.org/wiki/Energy_Policy_Act_of_2005",
      "https://www.ferc.gov/sites/default/files/2020-05/E-6_37.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2005_katrina",
    date: "2005-08",
    title: "Katrina: Nowy Orlean pod wodą i bez prądu",
    paper: "The Times-Picayune",
    text: "29 sierpnia 2005 r. huragan Katrina uderzył w wybrzeże Luizjany i Missisipi; bez prądu zostało ok. 3 mln ludzi, a zalany Nowy Orlean pogrążył się w ciemności. Z pól w Zatoce Meksykańskiej przestało płynąć ponad 8 mld stóp sześciennych gazu dziennie, a cena w hubie Henry wzrosła w tydzień o 2,70 dolara, do 12,70 dolara za mln BTU.",
    hint: "Linie i stacje na nizinnym wybrzeżu Zatoki są narażone na huragany, a drogi gaz uderza w elektrownie gazowe w całym kraju.",
    icon: "storm",
    effects: [
      { type: "outage", region: { lat: 30.2, lon: -89.9, radiusKm: 250 }, months: 1 },
      { type: "damage", region: { lat: 30, lon: -89.9, radiusKm: 120 }, target: "lines", share: 0.15 },
      { type: "fuel", fuel: "gas", mult: 1.4, months: 4 }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Hurricane_Katrina",
      "https://www.eia.gov/naturalgas/weekly/archivenew_ngwu/2005/09_01/ngupdate.asp"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2009_rggi",
    date: "2009-01",
    title: "RGGI: emisja CO₂ zaczyna kosztować",
    paper: "The Boston Globe",
    text: "1 stycznia 2009 r. ruszyła Regional Greenhouse Gas Initiative (RGGI) – wspólny system handlu uprawnieniami do emisji CO₂ dziesięciu stanów od Maine po Maryland. Elektrownie na paliwa kopalne o mocy od 25 MW muszą oddać uprawnienie za każdą tonę CO₂; limit na lata 2009–2011 to 188 mln uprawnień, sprzedawanych na aukcjach.",
    hint: "Emisja CO₂ zaczyna kosztować – na razie mało i tylko w części kraju, więc w skali USA to niewielka dopłata.",
    icon: "law",
    effects: [{ type: "carbon", price: 0.3, months: 612 }],
    sources: [
      "https://www.rggi.org/program-overview-and-design/elements",
      "https://en.wikipedia.org/wiki/Regional_Greenhouse_Gas_Initiative"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2009_recesja_arra",
    date: "2009-02",
    title: "Recesja i pakiet stymulacyjny",
    paper: "The Washington Post",
    text: "Po upadku banku Lehman Brothers we wrześniu 2008 r. USA są w recesji, a fabryki ograniczają produkcję – zużycie prądu w przemyśle spada najszybciej. 17 lutego 2009 r. Barack Obama podpisał ustawę ARRA, która daje ponad 90 mld dolarów na czystą energię, m.in. dotacje gotówkowe zamiast ulg podatkowych dla farm wiatrowych i słonecznych oraz środki na inteligentne sieci.",
    hint: "Popyt na prąd przez ponad rok jest o kilka procent niższy, ale wiatr, słońce i modernizacja sieci są wyraźnie tańsze.",
    icon: "money",
    effects: [
      { type: "demand", mult: 0.96, months: 14 },
      { type: "subsidy", target: "wind", costMult: 0.8, months: 84 },
      { type: "subsidy", target: "solar", costMult: 0.8, months: 84 },
      { type: "subsidy", target: "grid", costMult: 0.9, months: 36 }
    ],
    sources: [
      "https://obamawhitehouse.archives.gov/the-press-office/2016/02/25/fact-sheet-recovery-act-made-largest-single-investment-clean-energy",
      "https://www.eia.gov/totalenergy/data/browser/?tbl=T07.06"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2012_gaz_lupkowy",
    date: "2012-04",
    title: "Gaz łupkowy najtańszy od ponad dekady",
    paper: "The Wall Street Journal",
    text: "W kwietniu 2012 r. cena gazu w hubie Henry spadła poniżej 2 dolarów za mln BTU – średnio do 1,95 dolara, najniżej od grudnia 2001 r. Łagodna zima, wysokie zapasy i szybki wzrost wydobycia z łupków Marcellus sprawiają, że elektrownie gazowe wypierają węglowe.",
    hint: "Tani gaz przez kilka lat – bloki gazowe wygrywają z węglem.",
    icon: "gas",
    effects: [{ type: "fuel", fuel: "gas", mult: 0.8, months: 36 }],
    sources: [
      "https://www.eia.gov/todayinenergy/detail.php?id=15811",
      "https://www.eia.gov/todayinEnergy/detail.php?id=7470"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2012_sandy",
    date: "2012-10",
    title: "Huragan Sandy: 8,5 mln odbiorców bez prądu",
    paper: "The New York Times",
    text: "29 października 2012 r. huragan Sandy uderzył w wybrzeże New Jersey; w szczytowym momencie prądu nie miało ok. 8,5 mln odbiorców w 21 stanach. Fala sztormowa zalała m.in. podstacje w Nowym Jorku.",
    hint: "Podstacje na nizinach nadmorskich warto podnieść lub zabezpieczyć przed zalaniem.",
    icon: "storm",
    effects: [
      { type: "outage", region: { lat: 40.5, lon: -74.3, radiusKm: 200 }, months: 1 },
      { type: "damage", region: { lat: 40.5, lon: -74.3, radiusKm: 150 }, target: "lines", share: 0.1 }
    ],
    sources: [
      "https://www.eia.gov/todayinenergy/detail.php?id=8730",
      "https://www.insurancejournal.com/news/east/2012/11/12/270208.htm"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2013_kalifornia_co2",
    date: "2013-01",
    title: "Kalifornia uruchamia handel emisjami",
    paper: "Los Angeles Times",
    text: "Od 1 stycznia 2013 r. elektrownie zasilające Kalifornię – także te spoza stanu – i duże zakłady przemysłowe muszą mieć uprawnienie na każdą tonę emitowanych gazów cieplarnianych. Na pierwszej aukcji w listopadzie 2012 r. tona kosztowała 10,09 dolara; później system obejmie też dostawców paliw, a emisje stanu mają spaść do 427 mln ton w 2020 r.",
    hint: "Kalifornijska cena CO₂ podnosi średni koszt emisji w USA – wciąż skromnie, ale węgiel znów traci na opłacalności.",
    icon: "law",
    effects: [{ type: "carbon", price: 1.2, months: 576 }],
    sources: [
      "https://www.eia.gov/todayinenergy/detail.php?id=9310"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2013_san_onofre",
    date: "2013-06",
    title: "San Onofre zamknięte na zawsze",
    paper: "Los Angeles Times",
    text: "7 czerwca 2013 r. Southern California Edison ogłosiła zamknięcie elektrowni jądrowej San Onofre (2150 MW), której bloki stoją od stycznia 2012 r. po wycieku w wytwornicy pary. Razem z Crystal River i Kewaunee to cztery reaktory skazane na zamknięcie od jesieni 2012 r. – pierwsze takie decyzje od 1998 r. Po Fukushimie NRC nakazała ponadto wszystkim 104 reaktorom dodatkowe zabezpieczenia.",
    hint: "Reaktor to inwestycja na dziesięciolecia – jedna wadliwa część i tani gaz mogą przedwcześnie zakończyć jego pracę.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://www.eia.gov/todayinenergy/detail.php?id=11931",
      "https://govexec.com/technology/2012/03/nuclear-commission-issues-first-fukushima-safety-orders/41429"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2014_crez",
    date: "2013-12",
    title: "Teksas kończy autostradę dla wiatru",
    paper: "Houston Chronicle",
    text: "Do końca 2013 r. pod napięciem znalazły się wszystkie linie programu CREZ: ok. 3600 mil (5800 km) linii, głównie 345 kV, za ok. 7 mld dolarów, łączących wietrzny zachód Teksasu z miastami. Nowa sieć może odebrać ok. 18,5 GW mocy z farm wiatrowych.",
    hint: "Wiatr bez linii przesyłowych się marnuje – rozbudowa sieci jest przez dwa lata tańsza.",
    icon: "tower",
    effects: [{ type: "subsidy", target: "grid", costMult: 0.85, months: 24 }],
    sources: [
      "https://www.cleanenergyministerial.org/policy-brief-cesc/united-states-texas-competitive-renewable-energy-zones-and-transmission-expansion-to-support-scaled-up-wind-investment/",
      "https://www.eia.gov/todayinenergy/detail.php?id=16831"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2016_paryz_cpp",
    date: "2016-02",
    title: "Paryż tak, Clean Power Plan – stop",
    paper: "The Washington Post",
    text: "W grudniu 2015 r. USA przyjęły porozumienie paryskie, a Kongres przedłużył o pięć lat, ze stopniowym wygaszaniem, ulgi podatkowe dla wiatru i słońca. Filarem zobowiązań miał być Clean Power Plan – ogłoszony w sierpniu 2015 r. plan cięcia emisji CO₂ z elektrowni o 32 proc. do 2030 r. względem 2005 r. – ale 9 lutego 2016 r. Sąd Najwyższy go wstrzymał.",
    hint: "Federalne limity CO₂ dla elektrowni utknęły w sądzie, ale ulgi dla wiatru i słońca działają jeszcze kilka lat.",
    icon: "law",
    effects: [{ type: "subsidy", target: "wind", costMult: 0.85, months: 60 }, { type: "subsidy", target: "solar", costMult: 0.8, months: 60 }],
    sources: [
      "https://en.wikipedia.org/wiki/Clean_Power_Plan",
      "https://www.eia.gov/todayinenergy/detail.php?id=26492"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2016_block_island",
    date: "2016-12",
    title: "Block Island: pierwsza morska farma wiatrowa",
    paper: "The New York Times",
    text: "W grudniu 2016 r. ruszyła farma Block Island u wybrzeży Rhode Island – pięć turbin o łącznej mocy 30 MW, pierwsza morska farma wiatrowa w USA. Wyspa, zasilana dotąd z pięciu agregatów diesla, dostaje prąd z morza.",
    hint: "Odblokowano morskie farmy wiatrowe.",
    icon: "wind",
    effects: [{ type: "unlock", tech: "wind_offshore" }],
    sources: [
      "https://en.wikipedia.org/wiki/Block_Island_Wind_Farm",
      "https://3blmedia.com/news/orsteds-us-offshore-wind-projects-block-island-wind-farm"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2017_paryz_wyjscie",
    date: "2017-06",
    title: "Trump wycofuje USA z porozumienia paryskiego",
    paper: "The New York Times",
    text: "1 czerwca 2017 r. prezydent Donald Trump ogłosił, że Stany Zjednoczone wystąpią z porozumienia paryskiego. Zgodnie z jego zasadami wyjście może nastąpić najwcześniej 4 listopada 2020 r., dzień po kolejnych wyborach prezydenckich.",
    hint: "Federalna polityka klimatyczna się cofa, ale o tym, co się buduje, wciąż decydują głównie ceny gazu, wiatru i słońca.",
    icon: "flag",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/United_States_withdrawal_from_the_Paris_Agreement"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2017_huragan_maria",
    date: "2017-09",
    title: "Huragan Maria: Portoryko bez prądu",
    paper: "The New York Times",
    text: "20 września 2017 r. huragan Maria zniszczył sieć energetyczną Portoryko – prądu pozbawieni zostali wszyscy 3,4 mln mieszkańców wyspy. Miesiąc później bez zasilania wciąż było ponad 80 proc. odbiorców.",
    hint: "Wyspiarska sieć bez połączeń z lądem odbudowuje się miesiącami.",
    icon: "storm",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/Effects_of_Hurricane_Maria_in_Puerto_Rico"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2018_camp_fire",
    date: "2018-11",
    title: "Camp Fire: pożar spod linii PG&E niszczy Paradise",
    paper: "Los Angeles Times",
    text: "8 listopada 2018 r. w rejonie Pulga w Kalifornii wybuchł pożar Camp Fire; śledczy wskazują na linię przesyłową 115 kV Caribou–Palermo spółki PG&E. Zginęło 85 osób, a miasteczko Paradise niemal doszczętnie spłonęło – zniszczonych zostało prawie 14 tys. domów.",
    hint: "W suchym i wietrznym klimacie linie napowietrzne mogą wywołać katastrofę.",
    icon: "crisis",
    effects: [
      { type: "damage", region: { lat: 39.76, lon: -121.62, radiusKm: 50 }, target: "lines", share: 0.3 }
    ],
    sources: [
      "https://www.cfo.com/news/california-faults-pge-for-deadly-wildfire/657834/",
      "https://www.power-eng.com/2019/02/28/pg-e-says-its-equipment-likely-caused-deadline-2018-camp-fire/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2019_pge",
    date: "2019-10",
    title: "PG&E wyłącza prąd, by nie wzniecić pożarów",
    paper: "San Francisco Chronicle",
    text: "29 stycznia 2019 r. Pacific Gas and Electric ogłosiła upadłość, przytłoczona roszczeniami za pożary z lat 2017–2018, szacowanymi na ok. 30 mld dolarów. 9 października, by linie nie wznieciły kolejnych pożarów podczas suchego, porywistego wiatru, spółka wyłączyła prąd ok. 800 tys. odbiorców – ok. 2,5 mln ludzi w północnej Kalifornii – a pod koniec miesiąca – kolejnym 940 tys.",
    hint: "W suchym i wietrznym klimacie bezpieczna sieć wymaga wycinki, kabli ziemnych i wyłączeń prewencyjnych – każda z tych opcji kosztuje.",
    icon: "blackout",
    effects: [{ type: "outage", region: { lat: 38.7, lon: -121.9, radiusKm: 250 }, months: 1 }],
    sources: [
      "https://abc7.com/business/pg-e-officially-files-for-chapter-11-bankruptcy/5111100/",
      "https://en.wikipedia.org/wiki/2019_California_power_shutoffs"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2020_fink",
    date: "2020-01",
    title: "BlackRock: ryzyko klimatyczne to ryzyko inwestycyjne",
    paper: "The Wall Street Journal",
    text: "14 stycznia 2020 r. Larry Fink, szef BlackRock – największego zarządzającego aktywami na świecie, z ok. 7 bln dolarów – ogłosił w liście do prezesów „fundamentalną przebudowę finansów”, bo ryzyko klimatyczne staje się ryzykiem inwestycyjnym. Do połowy 2020 r. BlackRock wycofa z aktywnie zarządzanych portfeli spółki czerpiące ponad 25 proc. przychodów z węgla energetycznego.",
    hint: "Inwestorzy zaczynają wyceniać ryzyko klimatyczne – im więcej prądu z paliw kopalnych, tym droższy kredyt.",
    icon: "money",
    effects: [{ type: "esg", premium: 0.015, months: 61 }],
    sources: [
      "https://www.blackrock.com/corporate/investor-relations/2020-larry-fink-ceo-letter",
      "https://www.aljazeera.com/ajimpact/moment-blackrock-pledges-tough-stance-climate-200114201901297.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2020_covid",
    date: "2020-04",
    title: "Pandemia: biura puste, popyt na prąd spada",
    paper: "The Wall Street Journal",
    text: "Wiosną 2020 r. stany zamykają biura, szkoły, sklepy i część fabryk, by spowolnić pandemię COVID-19. W kwietniu sprzedaż energii elektrycznej w USA była o ok. 4 proc. niższa niż przed rokiem: handel i usługi zużyły ok. 11 proc. mniej, przemysł ok. 10 proc. mniej, za to gospodarstwa domowe, w których pracuje się i uczy zdalnie, o 8 proc. więcej.",
    hint: "Spadek popytu potrwa kilka miesięcy – nie zamykaj elektrowni pochopnie, odbiorcy szybko wrócą.",
    icon: "factory",
    effects: [{ type: "demand", mult: 0.95, months: 6 }],
    sources: [
      "https://www.eia.gov/totalenergy/data/browser/?tbl=T07.06",
      "https://www.eia.gov/todayinenergy/detail.php?id=47397"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2020_moss_landing",
    date: "2020-12",
    title: "Moss Landing: największa bateria świata",
    paper: "Los Angeles Times",
    text: "11 grudnia 2020 r. Vistra przyłączyła do sieci magazyn energii Moss Landing w Kalifornii o mocy 300 MW i pojemności 1200 MWh – największy wówczas taki obiekt na świecie. Ponad 4500 szaf z ogniwami litowo-jonowymi stanęło w dawnej hali turbin elektrowni gazowej.",
    hint: "Odblokowano wielkoskalowe magazyny bateryjne – przesuwają energię słońca na wieczór.",
    icon: "plant",
    effects: [{ type: "unlock", tech: "battery" }],
    sources: [
      "https://investor.vistracorp.com/2021-01-06-Vistra-Brings-Worlds-Largest-Utility-Scale-Battery-Energy-Storage-System-Online",
      "https://www.energy-storage.news/at-300mw-1200mwh-the-worlds-largest-battery-storage-system-so-far-is-up-and-running/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2021_paryz_powrot",
    date: "2021-01",
    title: "USA wracają do porozumienia paryskiego",
    paper: "The Washington Post",
    text: "Wyjście USA z porozumienia paryskiego weszło w życie 4 listopada 2020 r., ale 20 stycznia 2021 r., w dniu zaprzysiężenia, prezydent Joe Biden zdecydował o powrocie – USA znów będą stroną porozumienia od 19 lutego. 27 stycznia nowy prezydent wyznaczył cel: energetyka wolna od emisji CO₂ do 2035 r. i gospodarka neutralna klimatycznie do 2050 r.",
    hint: "Polityka federalna znów sprzyja czystej energii – ale konkretne pieniądze przyjdą dopiero z ustaw Kongresu.",
    icon: "handshake",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/United_States_withdrawal_from_the_Paris_Agreement",
      "https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2021/01/27/fact-sheet-president-biden-takes-executive-actions-to-tackle-the-climate-crisis-at-home-and-abroad-create-jobs-and-restore-scientific-integrity-across-federal-government/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2021_zima_uri",
    date: "2021-02",
    title: "Mróz paraliżuje Teksas: 4,5 mln odbiorców bez prądu",
    paper: "Houston Chronicle",
    text: "W połowie lutego 2021 r. zima Uri zamroziła odwierty, gazociągi i elektrownie w Teksasie; prąd straciło ponad 4,5 mln domów i firm. Sieć ERCOT była 4 minuty i 37 sekund od całkowitego załamania, a hurtowa cena energii przez wiele godzin stała na limicie 9000 dolarów za MWh. Według stanowych szacunków zginęło co najmniej 246 osób.",
    hint: "Elektrownie i gazociągi bez zabezpieczeń przed mrozem zawodzą razem – planuj na najgorszą zimę.",
    icon: "cold",
    effects: [
      { type: "outage", region: { lat: 31.0, lon: -99.0, radiusKm: 600 }, months: 1 },
      { type: "fuel", fuel: "gas", mult: 2.5, months: 2 },
      { type: "derate", techs: ["gas_ocgt", "gas_ccgt", "coal", "wind", "nuclear"], mult: 0.7, months: 1 }
    ],
    sources: ["https://en.wikipedia.org/wiki/2021_Texas_power_crisis"],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2021_iija",
    date: "2021-11",
    title: "Ustawa infrastrukturalna: miliardy na sieci",
    paper: "The New York Times",
    text: "15 listopada 2021 r. prezydent Biden podpisał ustawę infrastrukturalną (Infrastructure Investment and Jobs Act) o wartości ok. 1,2 bln dolarów. Ponad 65 mld dolarów pójdzie na sieci elektroenergetyczne – według Białego Domu to największa w historii USA inwestycja w przesył czystej energii, obejmująca tysiące mil nowych linii.",
    hint: "Budowa linii przesyłowych i modernizacja sieci są przez kilka lat tańsze.",
    icon: "tower",
    effects: [{ type: "subsidy", target: "grid", costMult: 0.9, months: 60 }],
    sources: [
      "https://en.wikipedia.org/wiki/Infrastructure_Investment_and_Jobs_Act",
      "https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2021/11/06/fact-sheet-the-bipartisan-infrastructure-deal/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2022_west_virginia",
    date: "2022-06",
    title: "Sąd Najwyższy: EPA nie może wymusić zmiany miksu",
    paper: "The Washington Post",
    text: "30 czerwca 2022 r. Sąd Najwyższy w sprawie West Virginia v. EPA orzekł 6:3, że ustawa o czystym powietrzu nie pozwala EPA wymuszać przesunięcia produkcji prądu z węgla na gaz i OZE, na czym opierał się Clean Power Plan. EPA może dalej regulować emisje samych elektrowni, ale tak daleko idące zmiany wymagają wyraźnej zgody Kongresu (tzw. doktryna ważnych kwestii).",
    hint: "Federalne ograniczenia emisji będą skromniejsze – o transformacji decydują ulgi podatkowe, stany i rynek.",
    icon: "law",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/West_Virginia_v._EPA",
      "https://en.wikipedia.org/wiki/Clean_Power_Plan"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2022_loudoun",
    date: "2022-07",
    title: "Wirginia: brak mocy dla nowych centrów danych",
    paper: "The Washington Post",
    text: "Latem 2022 r. Dominion Energy wstrzymał przyłączanie nowych centrów danych we wschodniej części hrabstwa Loudoun, w sercu tzw. Data Center Alley. Wąskim gardłem nie są elektrownie, lecz linie przesyłowe.",
    hint: "Centra danych rosną szybciej niż sieć – bez nowych linii nie przyłączysz kolejnych gigawatów.",
    icon: "data",
    effects: [
      { type: "load", name: "Centra danych Północnej Wirginii", lat: 39.04, lon: -77.49, mw: 2000, growToMw: 6000, years: 8, kind: "datacenter" }
    ],
    sources: [
      "https://www.datacenterfrontier.com/energy/article/11436951/dominion-resumes-new-connections-but-loudoun-faces-lengthy-power-constraints",
      "https://datacenterdynamics.com/en/news/dominion-to-resume-connecting-new-loudoun-data-centers-but-capacity-still-limited"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2022_ira",
    date: "2022-08",
    title: "Inflation Reduction Act: miliardy na czystą energię",
    paper: "The New York Times",
    text: "16 sierpnia 2022 r. prezydent Joe Biden podpisał ustawę Inflation Reduction Act, przeznaczającą ok. 369 mld dolarów na klimat i energię, głównie w formie ulg podatkowych. Wsparcie obejmuje wiatr, słońce, magazyny energii i istniejące elektrownie jądrowe.",
    hint: "Czyste technologie są przez lata wyraźnie tańsze.",
    icon: "money",
    effects: [
      { type: "subsidy", target: "wind", costMult: 0.7, months: 65 },
      { type: "subsidy", target: "solar", costMult: 0.7, months: 65 },
      { type: "subsidy", target: "storage", costMult: 0.7, months: 120 },
      { type: "subsidy", target: "nuclear", costMult: 0.85, months: 120 }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Inflation_Reduction_Act",
      "https://www.energy.gov/ne/articles/inflation-reduction-act-keeps-momentum-building-nuclear-power"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2022_gaz_lng",
    date: "2022-08",
    title: "Wojna w Europie podbija ceny gazu w USA",
    paper: "The Wall Street Journal",
    text: "22 sierpnia 2022 r. gaz w hubie Henry kosztował 9,85 dolara za mln BTU – ok. 60 proc. więcej niż na początku roku. Po rosyjskiej inwazji na Ukrainę Europa zastępuje gaz z Rosji amerykańskim LNG i kupuje już większość ładunków z USA, a upały podbijają zużycie gazu w elektrowniach.",
    hint: "Eksport LNG wiąże amerykańskie ceny gazu ze światowymi – przez kilka miesięcy elektrownie gazowe pracują drożej.",
    icon: "gas",
    effects: [{ type: "fuel", fuel: "gas", mult: 1.5, months: 5 }],
    sources: [
      "https://www.eia.gov/todayinenergy/detail.php?id=55119",
      "https://www.eia.gov/todayinenergy/detail.php?id=55920"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2022_teksas_esg",
    date: "2022-08",
    title: "Teksas wpisuje BlackRock na czarną listę",
    paper: "The Dallas Morning News",
    text: "24 sierpnia 2022 r. kontroler stanu Teksas Glenn Hegar ogłosił listę dziesięciu instytucji finansowych – BlackRock i dziewięciu firm europejskich – oraz ok. 350 funduszy, które jego zdaniem „bojkotują” przemysł naftowy i gazowy. Na mocy ustawy SB 13 z 2021 r. stanowe agencje i samorządy muszą się z nich wycofać i nie mogą zawierać z nimi umów.",
    hint: "Presja ESG ma przeciwników – w części stanów odcinanie się od paliw kopalnych też kosztuje.",
    icon: "money",
    effects: [],
    sources: [
      "https://www.click2houston.com/news/texas/2022/08/24/texas-bans-local-state-government-entities-from-doing-business-with-firms-that-boycott-fossil-fuels/",
      "https://www.texastribune.org/2025/06/03/texas-comptroller-blackrock-boycott-energy/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2022_nif_zaplon",
    date: "2022-12",
    title: "Zapłon! Fuzja daje więcej energii niż laser",
    paper: "The New York Times",
    text: "5 grudnia 2022 r. w National Ignition Facility w Livermore 192 wiązki laserowe dostarczyły do kapsułki z paliwem 2,05 MJ energii, a reakcja syntezy wyzwoliła 3,15 MJ. Ogłoszony 13 grudnia wynik to pierwszy w historii zapłon kontrolowanej fuzji – choć do elektrowni termojądrowej wciąż daleko.",
    hint: "Przełom naukowy, nie technologia do budowy – fuzja pozostaje poza zasięgiem.",
    icon: "fusion",
    effects: [],
    sources: [
      "https://lasers.llnl.gov/science/achieving-fusion-ignition",
      "https://www.energy.gov/articles/doe-national-laboratory-makes-history-achieving-fusion-ignition"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2023_vogtle",
    date: "2023-07",
    title: "Vogtle 3: pierwszy nowy reaktor od dekad",
    paper: "The Wall Street Journal",
    text: "31 lipca 2023 r. blok nr 3 elektrowni Vogtle w Georgii rozpoczął pracę komercyjną – to pierwszy od podstaw zbudowany reaktor w USA od dziesięcioleci. Budowa dwóch bloków AP1000 trwała o siedem lat dłużej niż planowano, a koszty przekroczyły 30 mld dolarów.",
    hint: "Atom daje stabilną moc, ale pierwsze bloki nowej generacji budzą ryzyko opóźnień.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://www.clickondetroit.com/business/2023/07/31/first-american-nuclear-reactor-built-from-scratch-in-decades-enters-commercial-operation-in-georgia/",
      "https://11alive.com/article/news/state/plant-vogtle-georgia-unit-four-commercial-operation/85-77cd499a-fbc8-4704-ae3b-87cbc3706078"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2023_ferc_2023",
    date: "2023-07",
    title: "FERC porządkuje kolejki przyłączeniowe",
    paper: "The New York Times",
    text: "27 lipca 2023 r. Federalna Komisja Regulacji Energetyki jednogłośnie przyjęła reformę przyłączania elektrowni i magazynów (Order No. 2023). W kolejkach stoi ponad 2000 GW projektów, a przyłączenie trwa nawet pięć lat; operatorzy będą badać wnioski grupami według zasady „kto pierwszy gotowy, ten pierwszy obsłużony”, a za spóźnienia zapłacą kary.",
    hint: "Przyłączenie nowej elektrowni trwa latami – planuj linie i stacje z wyprzedzeniem.",
    icon: "law",
    effects: [],
    sources: [
      "https://ecoblock.berkeley.edu/2023/08/ferc-approves-critical-path-for-integrating-renewable-energy-resources-into-the-grid/",
      "https://www.theregreview.org/2023/10/03/coffey-supercharging-electric-grid-interconnection/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2023_maui",
    date: "2023-08",
    title: "Lahaina w płomieniach",
    paper: "Honolulu Star-Advertiser",
    text: "8 sierpnia 2023 r. porywisty wiatr, wzmocniony przez wyż na północy i huragan Dora na południu, rozniósł na Maui pożar, który zniszczył ponad 2000 budynków w Lahainie; zginęło ponad 100 osób. Hawaiian Electric przyznała, że poranny pożar wywołały najpewniej zerwane linie, ale twierdzi, że gdy wybuchł popołudniowy ogień, jej sieć była od sześciu godzin wyłączona.",
    hint: "Linie napowietrzne w suchym, wietrznym terenie to ryzyko pożaru – wyłączenia prewencyjne i kable ziemne kosztują, ale chronią.",
    icon: "heat",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/2023_Hawaii_wildfires",
      "https://www.kpbs.org/news/environment/2023/08/28/hawaii-power-utility-takes-responsibility-for-first-fire-on-maui-but-faults-county-firefighters"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2024_lng_morze_czerwone",
    date: "2024-01",
    title: "Ameryka największym eksporterem LNG",
    paper: "Houston Chronicle",
    text: "W 2023 r. USA wyeksportowały najwięcej LNG na świecie – średnio 11,9 mld stóp sześciennych dziennie, z czego dwie trzecie trafiły do Europy, zastępującej gaz z rosyjskich rurociągów. Ataki jemeńskich Huti na statki na Morzu Czerwonym zmuszają tymczasem tankowce LNG z Kataru do opływania Afryki, co wydłuża rejs do Wielkiej Brytanii z 18 do ok. 27 dni.",
    hint: "Gaz z łupków jest w USA wciąż tani, ale eksport LNG coraz mocniej wiąże jego cenę ze światowymi kryzysami.",
    icon: "gas",
    effects: [],
    sources: [
      "https://www.eia.gov/todayinenergy/detail.php?id=61683",
      "https://gcaptain.com/lng-carriers-divert-from-red-sea-as-qatar-warns-of-escalation"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2024_epa_co2",
    date: "2024-04",
    title: "EPA: wychwyt CO₂ albo zamknięcie",
    paper: "The Washington Post",
    text: "25 kwietnia 2024 r. EPA ogłosiła nowe normy emisji CO₂ dla elektrowni: bloki węglowe, które mają pracować po 2039 r., muszą do 2032 r. wychwytywać 90 proc. dwutlenku węgla, a ten sam wymóg obejmie nowe bloki gazowe pracujące w podstawie. Przepisy dla istniejących elektrowni gazowych odłożono na później.",
    hint: "Nowe bloki węglowe nie mają przyszłości – praca po 2039 r. wymagałaby drogiego wychwytu CO₂.",
    icon: "coal",
    effects: [],
    sources: [
      "https://www.power-eng.com/news/epa-leans-on-carbon-capture-as-it-releases-final-power-plant-pollution-rules/",
      "https://www.epa.gov/stationary-sources-air-pollution/greenhouse-gas-standards-and-guidelines-fossil-fuel-fired-power"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2024_three_mile_island_microsoft",
    date: "2024-09",
    title: "Microsoft wskrzesza Three Mile Island",
    paper: "The Wall Street Journal",
    text: "20 września 2024 r. Constellation i Microsoft podpisały 20-letnią umowę na energię z ponownie uruchomionego bloku nr 1 elektrowni Three Mile Island, przemianowanej na Crane Clean Energy Center. Wyłączony w 2019 r. reaktor ma wrócić do pracy w 2028 r.",
    hint: "Giganci technologiczni płacą za całodobową bezemisyjną energię – nawet z reaktywowanych reaktorów.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://energydigital.com/news/microsoft-constellation-restarting-a-nuclear-reactor",
      "https://www.foronuclear.org/en/?p=26541"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2024_xai_colossus",
    date: "2024-09",
    title: "xAI Colossus: 100 tys. procesorów w Memphis",
    paper: "The Commercial Appeal",
    text: "W Memphis ruszył superkomputer Colossus firmy xAI ze 100 tys. procesorów graficznych – symbol wyścigu AI, który przyspieszył po premierze ChatGPT 30 listopada 2022 r. Przyłącze sieciowe miało początkowo tylko 8 MW, więc do zasilania sprowadzono kilkanaście turbin gazowych.",
    hint: "Centra danych AI potrzebują setek megawatów niemal z dnia na dzień.",
    icon: "data",
    effects: [
      { type: "load", name: "xAI Colossus (Memphis)", lat: 35.06, lon: -90.15, mw: 150, growToMw: 300, years: 2, kind: "datacenter" }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Colossus_(supercomputer)",
      "https://www.datacenterdynamics.com/en/news/xai-colossus-memphis-power-tva/"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "us_2025_stargate",
    date: "2025-01",
    title: "Stargate: 500 mld dolarów na centra danych AI",
    paper: "The Wall Street Journal",
    text: "21 stycznia 2025 r. OpenAI, SoftBank, Oracle i MGX ogłosiły projekt Stargate – do 500 mld dolarów na centra danych AI w USA. Pierwszy kampus w Abilene w Teksasie ma potrzebować do 1,2 GW mocy, a w kolejkach przyłączeniowych czeka już ok. 2600 GW projektów wytwórczych i magazynów (dane LBNL za 2023 r.).",
    hint: "Popyt rośnie szybciej niż nowe moce – kolejki przyłączeniowe to dziś główne wąskie gardło.",
    icon: "data",
    effects: [
      { type: "load", name: "Stargate (Abilene)", lat: 32.45, lon: -99.73, mw: 200, growToMw: 1200, years: 3, kind: "datacenter" }
    ],
    sources: [
      "https://techcrunch.com/2025/01/21/openai-teams-up-with-softbank-and-oracle-on-50b-data-center-project",
      "https://emp.lbl.gov/publications/queued-2024-edition-characteristics"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2025_pozary_la",
    date: "2025-01",
    title: "Pożary pod Los Angeles, Edison pod lupą",
    paper: "Los Angeles Times",
    text: "7 stycznia 2025 r. wiatry Santa Ana, w porywach do 160 km/h, rozniosły pożary Palisades i Eaton, które zniszczyły lub uszkodziły ok. 18 tys. budynków; zginęło 31 osób. Bez prądu było ok. 414 tys. odbiorców Southern California Edison, a pierwsze pozwy zarzucają spółce, że pożar Eaton wybuchł pod jej wieżami przesyłowymi; firma odpowiada, że przyczyna wciąż jest badana.",
    hint: "Wiatr Santa Ana i linie napowietrzne to groźne połączenie – w sezonie pożarów licz się z wyłączeniami i kosztowną odbudową.",
    icon: "crisis",
    effects: [
      { type: "damage", region: { lat: 34.12, lon: -118.35, radiusKm: 40 }, target: "lines", share: 0.1 },
      { type: "outage", region: { lat: 34.1, lon: -118, radiusKm: 90 }, months: 1 }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/January_2025_Southern_California_wildfires",
      "https://abc7.com/post/california-wildfires-2-lawsuits-filed-southern-edison-eaton-fire-pasadena-altadena/15796131/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2025_odwrot_esg",
    date: "2025-03",
    title: "Wall Street wycofuje się z sojuszy klimatycznych",
    paper: "The Wall Street Journal",
    text: "Na przełomie 2024 i 2025 r. największe banki USA, w tym JPMorgan Chase, opuściły Net-Zero Banking Alliance, a BlackRock – ten od listu z 2020 r. – wystąpił z sojuszu Net Zero Asset Managers. 27 marca 2025 r. SEC przestała bronić w sądzie przepisów o ujawnianiu ryzyka klimatycznego, przyjętych w marcu 2024 r. i wkrótce potem zawieszonych.",
    hint: "Presja finansowa na paliwa kopalne słabnie – kredyt dla elektrowni węglowych i gazowych tanieje, choć ryzyko klimatyczne nie znika z rachunków.",
    icon: "money",
    effects: [{ type: "esg", premium: 0.005, months: 120 }],
    sources: [
      "https://www.ai-cio.com/news/net-zero-asset-managers-initiative-pauses-activities-following-blackrock-exit/",
      "https://www.sec.gov/newsroom/press-releases/2025-58"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2025_epa_paryz",
    date: "2025-06",
    title: "EPA chce znieść limity CO₂ dla elektrowni",
    paper: "The New York Times",
    text: "11 czerwca 2025 r. EPA zaproponowała uchylenie norm emisji gazów cieplarnianych dla elektrowni na paliwa kopalne, w tym wymogu wychwytu CO₂ z 2024 r. To kolejny krok odwrotu od polityki klimatycznej: 20 stycznia prezydent Trump po raz drugi wypowiedział porozumienie paryskie, a wyjście wejdzie w życie w styczniu 2026 r.",
    hint: "Federalne limity CO₂ prawdopodobnie znikną – emisje obciążają tylko programy stanowe, takie jak RGGI i kalifornijski.",
    icon: "law",
    effects: [],
    sources: [
      "https://www.epa.gov/stationary-sources-air-pollution/greenhouse-gas-standards-and-guidelines-fossil-fuel-fired-power",
      "https://en.wikipedia.org/wiki/Paris_Agreement"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2025_izrael_iran",
    date: "2025-06",
    title: "Wojna Izraela z Iranem, bomby USA na Fordo",
    paper: "The Wall Street Journal",
    text: "13 czerwca 2025 r. Izrael zaatakował irańskie obiekty jądrowe i wojskowe, a 22 czerwca USA zbombardowały ośrodki jądrowe w Fordo, Natanz i Isfahanie. Ropa Brent podrożała do najwyższego poziomu od pięciu miesięcy, ale po rozejmie 24 czerwca potaniała w jeden dzień o 6 proc., do 67 dolarów za baryłkę – poniżej poziomu sprzed wojny.",
    hint: "Ropa daje dziś mniej niż 1 proc. prądu w USA – tę wojnę mocniej odczują kierowcy niż elektrownie.",
    icon: "oil",
    effects: [{ type: "fuel", fuel: "oil", mult: 1.1, months: 1 }],
    sources: [
      "https://en.wikipedia.org/wiki/Twelve-Day_War",
      "https://www.thestar.com.my/business/2025/06/25/oil-falls-6-as-israel-iran-ceasefire-cuts-mideast-supply-risk"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2025_obbba",
    date: "2025-07",
    title: "Koniec ulg dla wiatru i słońca",
    paper: "The Wall Street Journal",
    text: "4 lipca 2025 r. prezydent Donald Trump podpisał ustawę One Big Beautiful Bill Act. Farmy wiatrowe i słoneczne zachowają ulgi podatkowe tylko wtedy, gdy ich budowa ruszy do 4 lipca 2026 r. albo zostaną oddane do użytku do końca 2027 r.; magazyny energii zachowują wsparcie dla projektów rozpoczętych do 2033 r.",
    hint: "Nowe farmy wiatrowe i słoneczne dostaną ulgi tylko, jeśli ich budowa ruszy do lipca 2026 r. albo zostaną oddane do końca 2027 r.; magazyny energii są nadal wspierane.",
    icon: "law",
    effects: [],
    sources: [
      "https://www.projectfinance.law/publications/2025/july/effects-of-one-big-beautiful-bill-on-projects/",
      "https://www.gibsondunn.com/focus-on-clean-energy-tax-provisions-in-the-one-big-beautiful-bill-act/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2026_wojna_iran",
    date: "2026-03",
    title: "Wojna z Iranem: Ormuz zamknięty, ropa po 120 dolarów",
    paper: "The Wall Street Journal",
    text: "Po amerykańsko-izraelskich nalotach na Iran z 28 lutego 2026 r. Iran praktycznie zamknął cieśninę Ormuz, którą płynie ok. jednej piątej światowej ropy, i uderzył w katarski kompleks LNG Ras Laffan. Baryłka Brent skoczyła z ok. 70 do 119,50 dolara 9 marca, a średnia cena benzyny w USA przekroczyła 3,5 dolara za galon. Amerykański prąd prawie nie zależy od ropy – daje ona mniej niż 1 proc. produkcji.",
    hint: "Dla Twojej sieci to głównie sygnał ostrzegawczy: przez kilka miesięcy drożeje ropa, a niezależność od importu paliw jest warta coraz więcej.",
    icon: "oil",
    effects: [{ type: "fuel", fuel: "oil", mult: 1.3, months: 3 }],
    sources: [
      "https://wisconsinexaminer.com/2026/03/09/repub/gas-prices-spike-across-us-amid-iran-war/",
      "https://www.cnbc.com/2026/03/19/iran-attack-qatar-lng-capacity.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "us_2027_crane_restart",
    date: "2027-06",
    title: "Reaktor z Three Mile Island wraca do sieci",
    paper: "The Wall Street Journal",
    text: "Według planów Constellation reaktor dawnej elektrowni Three Mile Island, dziś Crane Clean Energy Center, może wrócić do pracy już w 2027 r., rok wcześniej niż zakładała umowa z Microsoftem. Scenariusz zakłada, że ponowne uruchamianie zamkniętych reaktorów staje się szybkim sposobem na bezemisyjną moc dla centrów danych.",
    hint: "Reaktywacja istniejącego reaktora jest szybsza niż budowa nowego.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://energydigital.com/news/microsoft-constellation-restarting-a-nuclear-reactor",
      "https://www.foronuclear.org/en/?p=26541"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "us_2028_helion_orion",
    date: "2028-06",
    title: "Helion: pierwsza elektrownia termojądrowa?",
    paper: "The Wall Street Journal",
    text: "Według umowy z 2023 r. Helion ma od 2028 r. dostarczać Microsoftowi 50 MW z elektrowni termojądrowej Orion w Malaga w stanie Waszyngton, której budowę rozpoczęto w lipcu 2025 r. Nawet branża uważa ten termin za bardzo ambitny; scenariusz zakłada pierwszy prąd z fuzji w sieci, ale bez masowego wdrożenia.",
    hint: "Ciekawostka na horyzoncie – fuzja wciąż nie jest technologią do budowy.",
    icon: "fusion",
    effects: [],
    sources: [
      "https://www.helionenergy.com/blog/starting-to-build-the-worlds-first-fusion-power-plant-in-malaga-wa",
      "https://www.geekwire.com/2025/helion-lands-permit-for-reactor-building-construction-at-washington-site-that-aims-to-be-first-fusion-plant/"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "us_2028_centra_danych",
    date: "2028-12",
    title: "Centra danych biorą nawet 12 proc. prądu w USA",
    paper: "The New York Times",
    text: "Według raportu LBNL z grudnia 2024 r. centra danych, które w 2023 r. zużyły 4,4 proc. energii elektrycznej w USA, w 2028 r. mogą potrzebować od 6,7 do 12 proc. Scenariusz zakłada wartość ze środka tego przedziału – zapotrzebowanie całego kraju rośnie o kilka procent ponad dotychczasowy trend.",
    hint: "Popyt rośnie w całym kraju – potrzebujesz nowych mocy i linii.",
    icon: "data",
    effects: [{ type: "demand", mult: 1.06, months: 120 }],
    sources: [
      "https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers",
      "https://eta-publications.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "us_2030_kairos_hermes2",
    date: "2030-06",
    title: "Hermes 2: pierwszy mały reaktor dla Google",
    paper: "The Wall Street Journal",
    text: "Według planów Kairos Power reaktor Hermes 2 w Oak Ridge ma od 2030 r. oddawać do sieci TVA do 50 MW dla centrów danych Google. Umowa Google z października 2024 r. przewiduje łącznie 500 MW z małych reaktorów do 2035 r., a administracja federalna w 2025 r. postawiła cel czterokrotnego zwiększenia mocy jądrowej do 2050 r.",
    hint: "Odblokowano małe reaktory modułowe.",
    icon: "nuclear",
    effects: [{ type: "unlock", tech: "smr" }],
    sources: [
      "https://neutronbytes.com/2025/08/24/google-kairos-partner-to-help-power-tva/",
      "https://www.energytech.com/data-center-power/article/55310888/tva-hosting-proposed-kairos-smr-nuclear-plant-to-power-google-data-ai-operations"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "us_2032_cfs_arc",
    date: "2032-06",
    title: "ARC: fuzja w sieci Wirginii?",
    paper: "The Washington Post",
    text: "Commonwealth Fusion Systems planuje na początek lat 30. uruchomienie elektrowni termojądrowej ARC o mocy 400 MW w hrabstwie Chesterfield w Wirginii; połowę jej produkcji, 200 MW, zarezerwował w czerwcu 2025 r. Google. Scenariusz zakłada, że ARC jako pierwsza elektrownia z tokamakiem oddaje energię do sieci – to wciąż plan, nie gwarancja.",
    hint: "Pierwsze prototypy fuzji to pojedyncze obiekty – jeszcze nie technologia dla gracza.",
    icon: "fusion",
    effects: [],
    sources: [
      "https://datacenterfrontier.com/energy/article/55320138/fusion-energy-moves-toward-reality-strategic-investments-by-cfs-google-and-eni-signal-commercial-readiness",
      "https://www.energyconnects.com/news/renewables/2025/june/google-is-betting-on-a-fusion-future-in-power-deal-with-commonwealth"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "us_2045_fuzja_komercyjna",
    date: "2045-06",
    title: "Komercyjna fuzja wchodzi na rynek",
    text: "Czysto futurystyczny scenariusz: po zapłonie w NIF (2022) i pierwszych prototypach komercyjne elektrownie termojądrowe zaczynają powstawać seryjnie. Żaden harmonogram tego nie gwarantuje – nawet międzynarodowy ITER przesunął start badań na 2034 r., a pracę z paliwem deuter–tryt na 2039 r.",
    hint: "Odblokowano elektrownie termojądrowe – element futurystyczny, poza znaną historią.",
    icon: "fusion",
    effects: [{ type: "unlock", tech: "fusion" }],
    sources: [
      "https://lasers.llnl.gov/science/achieving-fusion-ignition",
      "https://iter.org/sites/default/files/media/2024-07/baseline_press_conference_summary_july-2024_b.pdf"
    ],
    certainty: "medium",
    speculative: true
  }
];
