// Pod Napięciem – wydarzenia historyczne, kampania: Polska (obszar dzisiejszej Polski).
// Plain script (no modules). Sorted by date. All texts in Polish.
// Effects use only the vocabulary supported by the engine (see RESEARCH_NOTES.md).
window.PN_EVENTS_PL = [
  {
    id: "pl_1878_krolewska_huta",
    date: "1878-06",
    title: "Łukowe lampy rozświetlają Królewską Hutę",
    text: "Na Górnym Śląsku, w kopalni „Król” i w hucie w Królewskiej Hucie (dziś Chorzów), pracują pierwsze na ziemiach polskich prądnice. Lampy łukowe oświetlają m.in. przystanek kolei fabrycznej. Prąd stały służy na razie wyłącznie do oświetlania wielkich zakładów.",
    hint: "Możesz stawiać pierwsze małe elektrownie parowe prądu stałego – na razie dla fabryk i kopalń.",
    icon: "bulb",
    effects: [{ type: "unlock", tech: "steam_dc" }],
    sources: [
      "https://bazhum.muzhp.pl/media/texts/kwartalnik-historii-nauki-i-techniki/1974-tom-19-numer-1/kwartalnik_historii_nauki_i_techniki-r1974-t19-n1-s29-44.pdf",
      "https://www.dbc.wroc.pl//Content/36908/PDF/Pilzys_Poczatki_Polskiej_Elektroenergetyki_Na_Przykladzie_Elektrowni_2016.pdf"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1889_szczecin",
    date: "1889-12",
    title: "Szczecin uruchamia pierwszą elektrownię miejską",
    text: "15 grudnia 1889 r. w Szczecinie rusza pierwsza w granicach dzisiejszej Polski elektrownia publiczna, zbudowana na podstawie umowy miasta z inżynierem Ernstem Kuhlo. Wytwarza prąd stały i początkowo zasila odbiorców tylko wieczorem i nocą, od 16:00 do 1:00.",
    hint: "Prąd można już sprzedawać mieszkańcom miast – ale prąd stały nie zajdzie daleko od elektrowni.",
    icon: "plant",
    effects: [],
    sources: [
      "https://wnus.usz.edu.pl/pzp/en/issue/125/article/7504/",
      "https://www.dbc.wroc.pl//Content/36908/PDF/Pilzys_Poczatki_Polskiej_Elektroenergetyki_Na_Przykladzie_Elektrowni_2016.pdf"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1898_lodz_tramwaj",
    date: "1898-12",
    title: "Elektryczny tramwaj wyjeżdża na ulice Łodzi",
    paper: "Kurier Warszawski",
    text: "23 grudnia 1898 r. w Łodzi ruszają tramwaje elektryczne – pierwsze w Królestwie Polskim. Na ziemiach pod panowaniem pruskim elektryczne tramwaje kursują już m.in. we Wrocławiu (od 1893 r.), w Elblągu i Gdańsku.",
    hint: "Tramwaje to stały, całodzienny odbiorca – idealny klient dla nowej elektrowni.",
    icon: "tram",
    effects: [
      { type: "load", name: "Tramwaje elektryczne w Łodzi", lat: 51.76, lon: 19.46, mw: 0.5, growToMw: 4, years: 15, kind: "tram" }
    ],
    sources: [
      "https://nowa.mapa.lodz.pl/wp-content/uploads/pdf/atlas_miasta_Lodzi/P-34.pdf",
      "https://en.wikipedia.org/wiki/List_of_town_tramway_systems_in_Poland"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1904_powisle",
    date: "1904-11",
    title: "Powiśle daje prąd Warszawie",
    paper: "Kurier Warszawski",
    text: "7 listopada 1904 r. ruszyła miejska elektrownia na Powiślu, zbudowana przez Rosyjskie Towarzystwo Elektryczne Schuckert i S-ka. Trzy maszyny parowe z prądnicami prądu przemiennego o napięciu 5,5 kV dają łącznie ok. 1,5 MW. Tydzień wcześniej, 31 października, uruchomiono miejską elektrownię Grobla w Poznaniu.",
    hint: "Odblokowano dużą elektrownię węglową prądu przemiennego i sieć średniego napięcia – prąd dotrze dalej niż kilka ulic.",
    icon: "plant",
    effects: [
      { type: "unlock", tech: "coal" },
      { type: "unlock", tech: "line_sn" }
    ],
    sources: [
      "https://apw.ee.pw.edu.pl/tresc/semin'18/13vi2018/6-ElektrowniaPowisle,Filinger.pdf",
      "https://enea.pl/en/history-group"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1906_krakow",
    date: "1906-06",
    title: "Kraków przechodzi na prąd z miejskiej elektrowni",
    paper: "Czas",
    text: "W 1906 r. Teatr Miejski w Krakowie wyłącza własną elektrownię prądu stałego z urządzeniami praskiej firmy Františka Křižíka i zaczyna pobierać energię z Elektrowni Miejskiej na Kazimierzu, zbudowanej w latach 1904–1905 przy miejskiej gazowni. Po krakowskich ulicach od 1901 r. jeżdżą już tramwaje elektryczne.",
    hint: "Miasta wolą kupować prąd od jednej dużej elektrowni niż utrzymywać dziesiątki małych.",
    icon: "plant",
    effects: [{ type: "load", name: "Tramwaje elektryczne w Krakowie", lat: 50.06, lon: 19.94, mw: 0.5, growToMw: 3, years: 15, kind: "tram" }],
    sources: [
      "https://krakow.pl/zalacznik/287448",
      "https://en.wikipedia.org/wiki/List_of_town_tramway_systems_in_Poland"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1907_lodz_ec1",
    date: "1907-09",
    title: "Ruszyła wielka elektrownia miejska w Łodzi",
    paper: "Kurier Warszawski",
    text: "18 września 1907 r. turbozespół o mocy 1300 kVA i napięciu 3000 V w nowej łódzkiej elektrowni (dzisiejsze EC1) został przyłączony do sieci. Do końca roku elektrownia obsługuje ok. 330 odbiorców, a jej głównymi klientami mają zostać fabryki włókiennicze przechodzące na napęd elektryczny.",
    hint: "Łódzkie przędzalnie masowo przechodzą na napęd elektryczny – popyt w regionie gwałtownie urośnie.",
    icon: "factory",
    effects: [
      { type: "load", name: "Fabryki włókiennicze Łodzi", lat: 51.76, lon: 19.46, mw: 2, growToMw: 18, years: 6, kind: "industry" }
    ],
    sources: [
      "https://www.e-kalejdoskop.pl/wiadomosci-a230/otwarcie-centrum-nauki-i-techniki-r6046/pdf",
      "https://www.inyourpocket.com/poland/lodz/articles/ec1-city-within-the-city"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1908_tramwaj_warszawa",
    date: "1908-03",
    title: "Warszawa jeździ tramwajem elektrycznym",
    paper: "Kurier Warszawski",
    text: "26 marca 1908 r. warszawiacy po raz pierwszy mogą przejechać się tramwajem elektrycznym. Elektryczne wagony wypierają tramwaj konny, a miasto zyskuje wielkiego, stałego odbiorcę prądu.",
    hint: "Sieć tramwajowa stolicy będzie rosnąć przez lata – zadbaj o rezerwę mocy w Warszawie.",
    icon: "tram",
    effects: [
      { type: "load", name: "Tramwaje elektryczne w Warszawie", lat: 52.23, lon: 21.01, mw: 1, growToMw: 8, years: 10, kind: "tram" }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/List_of_town_tramway_systems_in_Poland",
      "https://bazhum.muzhp.pl/media/texts/kwartalnik-historii-nauki-i-techniki/1974-tom-19-numer-1/kwartalnik_historii_nauki_i_techniki-r1974-t19-n1-s29-44.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1912_pilchowice",
    date: "1912-11",
    title: "Cesarz otwiera zaporę w Pilchowicach",
    text: "16 listopada 1912 r. w obecności cesarza Wilhelma II otwarto kamienną zaporę na Bobrze w Pilchowicach, która chroni przed powodziami i zasila elektrownię wodną. Na Pomorzu od października 1910 r. pracuje elektrownia wodna w Straszynie na Raduni, a dwa tygodnie po niej ruszyły Rutki.",
    hint: "Odblokowano małe elektrownie wodne i duże elektrownie przy zaporach.",
    icon: "water",
    effects: [
      { type: "unlock", tech: "hydro_small" },
      { type: "unlock", tech: "hydro_dam" }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Pilchowice_Dam",
      "https://pomorskie.travel/en/articles/szlak-elektrowni-wodnych-na-raduni/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1915_ewakuacja",
    date: "1915-08",
    title: "Rosjanie wywożą fabryki, Niemcy w Warszawie",
    paper: "Kurier Warszawski",
    text: "Rok po wybuchu wojny front przesuwa się na wschód. Wycofujący się Rosjanie ewakuują urzędy i zakłady przemysłowe – z samej fabryki Lilpopa wywieziono 328 wagonów majątku – a o świcie 5 sierpnia 1915 r. wysadzają warszawskie mosty. Tego samego dnia do miasta wkraczają Niemcy.",
    hint: "Przemysł Królestwa stoi, popyt w centralnej Polsce gwałtownie spada, a nowe budowy zamierają.",
    icon: "war",
    effects: [
      { type: "freeze", months: 24 },
      { type: "demand", mult: 0.6, months: 40, region: { lat: 52.0, lon: 20.0, radiusKm: 200 } }
    ],
    sources: ["https://edukacja.ipn.gov.pl/download/210/506945/Stolicabezpanstwa1914-1918.pdf"],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1918_niepodleglosc",
    date: "1918-11",
    title: "Polska znów niepodległa",
    paper: "Kurier Warszawski",
    text: "11 listopada 1918 r. Rada Regencyjna przekazuje Józefowi Piłsudskiemu zwierzchnictwo nad wojskiem, a niemiecka załoga opuszcza Warszawę. Odrodzone państwo musi scalić gospodarkę trzech zaborów – w tym setki rozproszonych, zwykle niewielkich elektrowni miejskich i fabrycznych.",
    hint: "Nowe państwo, stare elektrownie – czas na ujednolicenie sieci.",
    icon: "flag",
    effects: [],
    sources: [
      "https://edukacja.ipn.gov.pl/download/210/506945/Stolicabezpanstwa1914-1918.pdf",
      "https://bazhum.muzhp.pl/media/texts/kwartalnik-historii-nauki-i-techniki/1974-tom-19-numer-1/kwartalnik_historii_nauki_i_techniki-r1974-t19-n1-s29-44.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1920_pomorze",
    date: "1920-02",
    title: "Polska wraca nad Bałtyk",
    paper: "Kurier Poznański",
    text: "Na mocy traktatu wersalskiego wojsko polskie przejmuje Pomorze, a 10 lutego 1920 r. gen. Józef Haller w Pucku symbolicznie zaślubia Polskę z morzem, wrzucając pierścień do Zatoki Puckiej. Państwo zyskuje ok. 140 km wybrzeża, a wraz z Wielkopolską – elektrownie miejskie Poznania, Bydgoszczy i Torunia.",
    hint: "Obszar, na którym możesz budować, obejmuje teraz Wielkopolskę i Pomorze.",
    icon: "flag",
    effects: [{ type: "territory", change: "pl_1920" }],
    sources: [
      "https://pl.wikipedia.org/wiki/Za%C5%9Blubiny_Polski_z_morzem",
      "https://bazhum.muzhp.pl/media/texts/kwartalnik-historii-nauki-i-techniki/1974-tom-19-numer-1/kwartalnik_historii_nauki_i_techniki-r1974-t19-n1-s29-44.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1920_bitwa_warszawska",
    date: "1920-08",
    title: "Bolszewicy pod Warszawą. Cud nad Wisłą",
    paper: "Kurier Warszawski",
    text: "W sierpniu 1920 r. Armia Czerwona dociera na kilkanaście kilometrów od Warszawy, a jej oddziały idą na Płock i Włocławek; Białystok jest zajęty od 28 lipca. Kontrofensywa znad Wieprza, rozpoczęta 16 sierpnia, przesądza o zwycięstwie w bitwie warszawskiej (12–25 sierpnia). Wojna rujnuje finanse państwa: wydatki wojskowe wyjęto spod kontroli Ministerstwa Skarbu, a inflacja zmierza ku hiperinflacji.",
    hint: "Na czas walk o stolicę nowe budowy stają na trzy miesiące, a na zajętym przez bolszewików północnym wschodzie spada popyt na prąd.",
    icon: "war",
    effects: [{ type: "freeze", months: 3 }, { type: "demand", mult: 0.8, months: 3, region: { lat: 53.3, lon: 22, radiusKm: 120 } }],
    sources: [
      "https://en.wikipedia.org/wiki/Battle_of_Warsaw_(1920)",
      "https://aop.vse.cz/pdfs/aop/2007/07/20.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1922_ustawa_elektryczna",
    date: "1922-03",
    title: "Sejm uchwala ustawę o prawie elektrycznym",
    paper: "Kurier Warszawski",
    text: "21 marca 1922 r. Sejm przyjął ustawę o prawie elektrycznym (Dz.U. nr 34, poz. 277), która wchodzi w życie 16 czerwca. Budowa i prowadzenie elektrowni oraz sieci wymagają odtąd państwowych uprawnień, a bezterminowe koncesje z czasów zaborów wygasną 1 stycznia 1923 r.",
    hint: "Każda nowa elektrownia i linia działa na podstawie koncesji udzielanej przez państwo.",
    icon: "law",
    effects: [{ type: "regime", regime: "concession" }],
    sources: [
      "https://eli.gov.pl/eli/DU/1922/277/ogl",
      "https://m.sep.com.pl/photo/files/14.%20Ustawa%20elektryczna%201922%20ENG%202022.06.03.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1922_gorny_slask",
    date: "1922-06",
    title: "Wojsko polskie wkracza na Górny Śląsk",
    paper: "Kurier Warszawski",
    text: "Od 20 czerwca 1922 r. Polska przejmuje przyznaną jej po plebiscycie i III powstaniu część Górnego Śląska z Katowicami i Królewską Hutą. To tylko 29 proc. obszaru plebiscytowego, ale aż 53 z 67 kopalń i 22 z 37 wielkich pieców, a także elektrownia w Chorzowie, działająca od 1898 r.",
    hint: "Przejmujesz serce przemysłu: kopalnie węgla i ogromny popyt na prąd.",
    icon: "flag",
    effects: [{ type: "territory", change: "pl_1922_silesia" }],
    sources: [
      "https://dzieje.pl/aktualnosci/powrot-gornego-slaska-do-polski-w-1922-r",
      "https://en.wikipedia.org/wiki/Chorz%C3%B3w_Power_Station"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1923_grodek",
    date: "1923-04",
    title: "Prezydent uruchamia elektrownię w Gródku",
    paper: "Słowo Pomorskie",
    text: "24 kwietnia 1923 r. prezydent Stanisław Wojciechowski uroczyście uruchomił elektrownię wodną w Gródku na Wdzie. To największa elektrownia wodna odrodzonej Polski, mająca stać się sercem sieci zasilającej Pomorze.",
    hint: "Woda z Wdy może zasilić całe Pomorze, jeśli zbudujesz linie przesyłowe.",
    icon: "water",
    effects: [],
    sources: [
      "https://pl.wikipedia.org/wiki/Gr%C3%B3dek_(wie%C5%9B_w_wojew%C3%B3dztwie_kujawsko-pomorskim)",
      "https://m.sep.com.pl/pdf/inne/Alfons_Hoffmann.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1929_zur_gdynia",
    date: "1929-12",
    title: "Elektrownia Żur zasili port w Gdyni",
    paper: "Ilustrowany Kuryer Codzienny",
    text: "W grudniu 1929 r. prezydent Ignacy Mościcki uruchomił elektrownię wodną Żur na Wdzie o mocy 8 MW, przeznaczoną przede wszystkim dla budowanego portu w Gdyni. Energię z Wdy przesyłają linie 60 kV: 70-kilometrowa do Torunia (z 1927 r.) i 140-kilometrowa z Gródka do Grabówka koło Gdyni.",
    hint: "Odblokowano linie 60 kV – możesz przesyłać prąd na ponad 100 km.",
    icon: "water",
    effects: [
      { type: "unlock", tech: "line_60" },
      { type: "load", name: "Port i miasto Gdynia", lat: 54.52, lon: 18.53, mw: 3, growToMw: 15, years: 10, kind: "industry" }
    ],
    sources: [
      "https://pl.wikipedia.org/wiki/%C5%BBur_(wie%C5%9B)",
      "https://m.sep.com.pl/pdf/inne/Alfons_Hoffmann.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1930_wielki_kryzys",
    date: "1930-06",
    title: "Kryzys gasi fabryki, elektrownie bez zbytu",
    paper: "Ilustrowany Kuryer Codzienny",
    text: "Po rekordowym 1929 r., gdy produkcja energii elektrycznej w Polsce przekroczyła 3 mld kWh, przychodzi wielki kryzys. Przemysł ogranicza produkcję, a zużycie prądu spada – najmocniej na Śląsku i w przemyśle azotowym.",
    hint: "Przez kilka lat popyt będzie wyraźnie niższy – nie przeinwestuj.",
    icon: "crisis",
    effects: [{ type: "demand", mult: 0.75, months: 36 }],
    sources: [
      "https://bcpw.bg.pw.edu.pl/Content/7134/download",
      "https://bcpw.bg.pw.edu.pl/Content/7169/download"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1936_kolej_warszawa",
    date: "1936-12",
    title: "Elektryczne pociągi ruszają pod Warszawą",
    paper: "Kurier Warszawski",
    text: "15 grudnia 1936 r. na zelektryfikowanym Warszawskim Węźle Kolejowym ruszyły pierwsze pociągi elektryczne, kursujące z Otwocka przez linię średnicową do Pruszkowa. To początek elektryfikacji PKP; sieć trakcyjna pracuje pod napięciem 3 kV prądu stałego.",
    hint: "Kolej elektryczna to nowy, duży odbiorca w aglomeracji warszawskiej.",
    icon: "rail",
    effects: [
      { type: "load", name: "Warszawski Węzeł Kolejowy", lat: 52.23, lon: 21.01, mw: 5, growToMw: 20, years: 5, kind: "rail" }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Railway_electrification_in_Poland",
      "https://sep.com.pl/genpdf/genpdf2.php?id=458"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1937_linia_150kv",
    date: "1937-12",
    title: "Linia 150 kV łączy Mościce ze Starachowicami",
    paper: "Gazeta Polska",
    text: "W grudniu 1937 r. uruchomiono linię Mościce–Starachowice o napięciu 150 kV, najwyższym w kraju, zbudowaną na zlecenie wojska dla Centralnego Okręgu Przemysłowego, którego program wicepremier Eugeniusz Kwiatkowski przedstawił 5 lutego. Planowane jest jej przedłużenie do Warszawy, by przesyłać prąd z budowanej od 1935 r. zapory w Rożnowie na Dunajcu.",
    hint: "Odblokowano linie najwyższego napięcia (klasa 110–150 kV), a COP przyciąga nowe fabryki.",
    icon: "tower",
    effects: [
      { type: "unlock", tech: "line_110" },
      { type: "load", name: "Zakłady Południowe (Stalowa Wola)", lat: 50.57, lon: 22.05, mw: 5, growToMw: 30, years: 3, kind: "industry" }
    ],
    sources: [
      "https://apw.ee.pw.edu.pl/tresc/semin'19/20iii2019/5-Rozw%C3%B3jSieci110kVnaTerW-wy,jj.pdf",
      "https://dzieje.pl/aktualnosci/decyzja-o-budowie-centralnego-okregu-przemyslowego"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1939_wojna",
    date: "1939-09",
    title: "Wojna! Niemcy i Sowieci napadają na Polskę",
    paper: "Kurier Warszawski",
    text: "1 września 1939 r. Niemcy napadają na Polskę, a 17 września od wschodu wkracza Armia Czerwona – na mocy tajnego protokołu paktu Ribbentrop–Mołotow kraj zostaje podzielony. Ostrzeliwana elektrownia na Powiślu pracuje do 23 września, gdy bomby niszczą kotłownię i halę maszyn. 14 września Niemcy zajęli Stalową Wolę wraz z elektrownią zbudowaną dla COP w latach 1938–1939.",
    hint: "Dwie okupacje: przez lata nie zbudujesz nic nowego, a część elektrowni legnie w gruzach.",
    icon: "war",
    effects: [{ type: "freeze", months: 64 }, { type: "damage", region: { lat: 52.23, lon: 21.01, radiusKm: 15 }, target: "plants", share: 0.5 }],
    sources: [
      "https://pl.wikipedia.org/wiki/Elektrownia_Powi%C5%9Ble",
      "https://en.wikipedia.org/wiki/Soviet_invasion_of_Poland",
      "https://defence24.pl/sily-zbrojne/ukrasc-goeringowi-acht-komma-acht"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1944_powisle_powstanie",
    date: "1944-09",
    title: "Naloty niszczą elektrownię na Powiślu",
    paper: "Biuletyn Informacyjny",
    text: "Zdobyta przez powstańców 1 sierpnia elektrownia na Powiślu przez ponad miesiąc dawała prąd walczącej Warszawie. 4 września 1944 r. zbombardowała ją Luftwaffe i produkcji nie dało się wznowić; następnego dnia powstańcy wycofali się z terenu zakładu.",
    hint: "Warszawa traci główne źródło prądu – odbudowa zacznie się dopiero po wyzwoleniu.",
    icon: "war",
    effects: [
      { type: "damage", region: { lat: 52.23, lon: 21.01, radiusKm: 12 }, target: "all", share: 0.7 }
    ],
    sources: ["https://pl.wikipedia.org/wiki/Elektrownia_Powi%C5%9Ble"],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1945_nowe_granice",
    date: "1945-08",
    title: "Nowe granice, a Sowieci wywożą elektrownie",
    paper: "Rzeczpospolita",
    text: "Konferencja poczdamska przesuwa granice Polski na zachód, po Odrę i Nysę Łużycką. Armia Czerwona traktuje przejmowane fabryki jak łup wojenny: na Górnym i Dolnym Śląsku zdemontowano i wywieziono urządzenia ośmiu elektrowni o łącznej mocy rzędu 450 MW. W Warszawie pierwsza turbina na Powiślu ruszyła znów 25 kwietnia.",
    hint: "Obszar gry obejmuje teraz dzisiejsze terytorium Polski, ale wiele elektrowni na zachodzie stoi pustych.",
    icon: "war",
    effects: [
      { type: "territory", change: "pl_1945" },
      { type: "damage", region: { lat: 50.8, lon: 17.5, radiusKm: 220 }, target: "plants", share: 0.3 }
    ],
    sources: [
      "https://newsletter.iz.poznan.pl/plik,pobierz,6064,9454f14dfef568b368c2dbb3fb689409/Reparacje od Niemiec a sowieckie  demontaze na ziemiach polskich.pdf",
      "https://pl.wikipedia.org/wiki/Elektrownia_Powi%C5%9Ble"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1946_nacjonalizacja",
    date: "1946-01",
    title: "Elektrownie przechodzą na własność państwa",
    paper: "Rzeczpospolita",
    text: "Ustawa z 3 stycznia 1946 r. o przejęciu na własność państwa podstawowych gałęzi gospodarki narodowej obejmuje m.in. przedsiębiorstwa wytwarzające, przesyłające i rozdzielające energię elektryczną. Państwo przejmuje ok. 360 elektrowni o łącznej mocy ok. 2,5 GW; zużycie prądu nie przekracza 250 kWh na mieszkańca rocznie.",
    hint: "Koniec koncesji: od teraz energetyką kieruje państwo i plan centralny.",
    icon: "law",
    effects: [{ type: "regime", regime: "state" }],
    sources: [
      "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19460030017",
      "https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1948_linia_220kv",
    date: "1947-11",
    title: "Pierwsza polska linia 220 kV: Śląsk – Łódź",
    paper: "Życie Warszawy",
    text: "30 listopada 1947 r. popłynął prąd linią z Łagiszy pod Będzinem do Janowa pod Łodzią – pierwszym odcinkiem krajowej sieci przesyłowej zbudowanym na napięcie 220 kV. Licząca 161 km linia powstała w 384 dni od decyzji z 11 listopada 1946 r.; z braku transformatorów i niegotowych jeszcze elektrowni na Śląsku przez pewien czas pracuje pod napięciem 110 kV.",
    hint: "Odblokowano linie 220 kV – szkielet przyszłego systemu krajowego.",
    icon: "tower",
    effects: [{ type: "unlock", tech: "line_220" }],
    sources: [
      "https://www.dbc.wroc.pl//Content/113758/przeg_elektrotech_r24_1948_7_8.pdf",
      "https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1950_elektryfikacja_wsi",
    date: "1950-06",
    title: "Prąd do każdej wsi – Sejm przyjął ustawę",
    paper: "Trybuna Ludu",
    text: "28 czerwca 1950 r. Sejm uchwalił ustawę o powszechnej elektryfikacji wsi i osiedli, realizowaną w ramach planu sześcioletniego. Pod koniec 1945 r. prąd docierał do 3512 wsi, czyli niespełna 10 proc. wszystkich wsi w nowych granicach.",
    hint: "Przez dwie dekady budowa sieci na wsi jest znacznie tańsza.",
    icon: "bulb",
    effects: [{ type: "subsidy", target: "rural", costMult: 0.6, months: 240 }],
    sources: [
      "https://eli.gov.pl/eli/DU/1950/256/ogl",
      "https://www.national-geographic.pl/historia/elektryfikacja-wsi-miala-sluzyc-nie-tylko-mieszkancom-takze-propagandzie/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1954_nowa_huta",
    date: "1954-07",
    title: "Pierwszy spust surówki w Nowej Hucie",
    paper: "Trybuna Ludu",
    text: "22 lipca 1954 r. z wielkiego pieca nr 1 Huty im. Lenina popłynęła pierwsza surówka. Kombinat, budowany od 1950 r. w ramach planu sześcioletniego, będzie jednym z największych odbiorców energii w kraju.",
    hint: "Pod Krakowem rośnie gigantyczny odbiorca – zapewnij mu moc i linie.",
    icon: "factory",
    effects: [
      { type: "load", name: "Huta im. Lenina", lat: 50.07, lon: 20.1, mw: 60, growToMw: 400, years: 20, kind: "industry" }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/Tadeusz_Sendzimir_Steelworks",
      "https://en.wikipedia.org/wiki/Six-Year_Plan"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1958_konin",
    date: "1958-06",
    title: "Konin pali węgiel brunatny",
    paper: "Trybuna Ludu",
    text: "W Wielkopolsce rusza Elektrownia Konin, opalana węglem brunatnym z pobliskich odkrywek. Tani, ale niskokaloryczny węgiel brunatny opłaca się spalać tylko tuż obok kopalni, więc odkrywka i elektrownia tworzą jeden kombinat.",
    hint: "Odblokowano kopalnie i elektrownie na węgiel brunatny – stawiaj je przy złożach.",
    icon: "coal",
    effects: [
      { type: "unlock", tech: "lignite" },
      { type: "unlock", tech: "lignite_mine" }
    ],
    sources: [
      "https://zepak.com.pl/en/power-plants/patnow-konin-power-plants/konin-power-plant.html",
      "https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1964_linia_400kv",
    date: "1964-06",
    title: "Mikułowa – Joachimów: pierwsze 400 kV",
    paper: "Trybuna Ludu",
    text: "Linię Mikułowa–Joachimów, oddaną w 1960 r. jako pierwszą w Polsce linię 400 kV, ale czasowo zasilaną napięciem 220 kV, przełączono na pełne 400 kV. Najwyższe napięcie pozwala przesyłać duże moce na setki kilometrów przy mniejszych stratach.",
    hint: "Odblokowano linie 400 kV.",
    icon: "tower",
    effects: [{ type: "unlock", tech: "line_400" }],
    sources: ["https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1965_turow_adamow",
    date: "1965-06",
    title: "Turów osiąga 1400 MW, rośnie Adamów",
    paper: "Trybuna Ludu",
    text: "Zakończono I etap budowy Elektrowni Turów: siedem bloków po 200 MW daje łącznie 1400 MW. W Elektrowni Adamów pracują już pierwsze bloki po 120 MW – pierwszy zsynchronizowano z siecią w październiku 1964 r., a piąty, ostatni, ruszy we wrześniu 1966 r., dając łącznie 600 MW. Węgiel brunatny staje się filarem systemu.",
    hint: "Bloki 200 MW stają się standardem polskiej energetyki.",
    icon: "coal",
    effects: [],
    sources: [
      "https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf",
      "https://ri.zepak.com.pl/en/news/1111-the-end-of-production-at-elektrownia-adamow/"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1968_solina",
    date: "1968-06",
    title: "Bieszczady: elektrownia wodna Solina gotowa",
    paper: "Trybuna Ludu",
    text: "Oddano do eksploatacji elektrownię wodną Solina na Sanie, której budowę wraz z zaporą rozpoczęto w 1961 r. Razem z wyrównawczą elektrownią Myczkowce (8,3 MW) tworzy zespół, który może szybko reagować na szczyty zapotrzebowania.",
    hint: "Elektrownie wodne startują w kilka minut – bezcenne w szczycie.",
    icon: "water",
    effects: [],
    sources: ["https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1971_zydowo",
    date: "1971-06",
    title: "Żydowo: woda magazynuje energię na szczyt",
    paper: "Trybuna Ludu",
    text: "Na Pomorzu Środkowym oddano do eksploatacji Elektrownię Szczytowo-Pompową Żydowo o mocy 156 MW, budowaną od 1961 r. Nocą pompuje wodę do górnego zbiornika, a w szczycie zapotrzebowania oddaje energię do sieci.",
    hint: "Odblokowano elektrownie szczytowo-pompowe – magazyn energii na skalę systemu.",
    icon: "water",
    effects: [{ type: "unlock", tech: "pumped" }],
    sources: ["https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1972_kozienice_rybnik",
    date: "1972-06",
    title: "Ruszają Kozienice i Rybnik",
    paper: "Życie Warszawy",
    text: "Pierwsze bloki 200 MW pracują w Elektrowni Kozienice i w Elektrowni Rybnik, a Ostrołęka B osiągnęła 600 MW. Od 1970 r. trwa budowa Elektrowni Dolna Odra pod Gryfinem, a Pątnów od 1967 r. dokłada kolejne bloki 200 MW.",
    hint: "Era wielkich elektrowni systemowych – opłaca się budować duże bloki blisko kopalń i rzek.",
    icon: "coal",
    effects: [],
    sources: ["https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1973_kryzys_naftowy",
    date: "1973-10",
    title: "Embargo naftowe wstrząsa Zachodem",
    paper: "Trybuna Ludu",
    text: "Po arabskim ataku na Izrael w październiku 1973 r. arabscy producenci ropy ogłaszają embargo wobec USA i państw, które je wspierają; w ciągu kilku miesięcy ropa na Zachodzie drożeje kilkukrotnie. PRL kupuje ropę niemal wyłącznie z ZSRR, po niższych cenach obowiązujących w RWPG, więc szok nie uderza w nią wprost. Skutki przyjdą pośrednio – przez droższe kredyty zachodnie, które pod koniec dekady pogłębią kryzys gospodarki PRL.",
    hint: "Twoje elektrownie palą krajowy węgiel, więc droga ropa ich nie dotyka – kryzys dotrze do PRL okrężną drogą, przez długi.",
    icon: "oil",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/Comecon",
      "https://www.auto-swiat.pl/wiadomosci/aktualnosci/czy-zabronia-nam-jezdzic-w-niedziele-tak-kiedys-kraje-walczyly-z-kryzysem-naftowym/vyc6dd9"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1979_zima_stulecia",
    date: "1979-01",
    title: "Zima stulecia: węgiel zamarza, gasną światła",
    paper: "Życie Warszawy",
    text: "Śnieżyce i mróz, które uderzyły w sylwestrową noc 1978 r., sparaliżowały kolej; węgiel zamarzał w wagonach i na hałdach, a do jego rozbijania skierowano wojsko. Elektrownie nie nadążają z produkcją, a przeciążoną sieć się wyłącza – planowe wyłączenia, czyli „stopnie zasilania”, od połowy lat 70. są w PRL codziennością.",
    hint: "Mróz ogranicza pracę elektrowni węglowych i podbija zapotrzebowanie – liczy się rezerwa mocy.",
    icon: "cold",
    effects: [
      { type: "derate", techs: ["coal", "lignite"], mult: 0.75, months: 2 },
      { type: "demand", mult: 1.1, months: 2 }
    ],
    sources: [
      "https://www.pap.pl/aktualnosci/zima-stulecia-zaczela-sie-w-sylwestra-snieg-i-mroz-sparalizowaly-kraj",
      "https://www.cire.pl/pliki/2/M_PE_3_historia.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1979_kozienice_rekord",
    date: "1979-06",
    title: "Kozienice największą elektrownią w kraju",
    paper: "Trybuna Ludu",
    text: "Po synchronizacji drugiego bloku 500 MW Elektrownia Kozienice osiągnęła projektowane 2600 MW i stała się największą elektrownią w Polsce. W tym roku ruszyły też pierwszy blok Elektrowni Połaniec oraz elektrownia szczytowo-pompowa Porąbka-Żar o mocy 500 MW.",
    hint: "Bloki 500 MW są tańsze w przeliczeniu na megawat, ale ich awaria mocno uderza w system.",
    icon: "plant",
    effects: [],
    sources: ["https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1980_jastrzebie",
    date: "1980-09",
    title: "Porozumienie jastrzębskie: wolne soboty dla górników",
    paper: "Trybuna Robotnicza",
    text: "3 września 1980 r. w kopalni „Manifest Lipcowy” w Jastrzębiu-Zdroju komisja rządowa podpisała porozumienie ze strajkującymi górnikami. Górnicy wywalczyli m.in. wolne soboty i niedziele oraz zniesienie czterobrygadowego systemu pracy kopalń. Wydobycie węgla kamiennego, które w 1979 r. osiągnęło rekordowe 201 mln t, spadło do 193 mln t w 1980 r. i do 163 mln t w 1981 r.",
    hint: "Węgla jest mniej i drożeje, a elektrownie PRL palą prawie wyłącznie węgiel – licz się z droższym paliwem przez ponad rok.",
    icon: "coal",
    effects: [{ type: "fuel", fuel: "coal", mult: 1.25, months: 15 }],
    sources: [
      "https://dzieje.pl/node/11131",
      "https://czasopisma.pan.pl//Content/132862/PDF/11_GSM_16_3_2000_Olkuski_Produkcja.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1980_20_stopien_zasilania",
    date: "1980-12",
    title: "Ogłoszono 20. stopień zasilania",
    paper: "Życie Warszawy",
    text: "1 grudnia 1980 r. Państwowa Dyspozycja Mocy ogłosiła 20. stopień zasilania: wytypowane zakłady przemysłowe w wyznaczonych godzinach przerywają produkcję, a wyłączenia w największych fabrykach sięgają 2860 MW. Na styczeń 1981 r. energetycy prognozują niedobór mocy rzędu 3 tys. MW. Planowe wyłączenia prądu trwały w PRL od drugiej połowy lat 70. do późnych lat 80.",
    hint: "Mocy brakuje w szczycie: każdy sprawny blok i każda rezerwa są na wagę złota.",
    icon: "factory",
    effects: [{ type: "derate", techs: ["coal","lignite"], mult: 0.85, months: 3 }],
    sources: [
      "https://bc.radom.pl//Content/38042/energoimpulsy-1981-1.pdf",
      "https://www.cire.pl/pliki/2/M_PE_3_historia.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1981_stan_wojenny",
    date: "1981-12",
    title: "Stan wojenny. Strajki w kopalniach stłumione",
    paper: "Trybuna Ludu",
    text: "13 grudnia 1981 r. władze PRL wprowadziły stan wojenny. Górnicy strajkują – 16 grudnia podczas pacyfikacji kopalni „Wujek” w Katowicach zginęło 9 osób. Dostawy węgla, od którego zależy niemal cała polska energetyka, stają pod znakiem zapytania.",
    hint: "Węgiel na kilka miesięcy drożeje i trudniej go zdobyć.",
    icon: "crisis",
    effects: [{ type: "fuel", fuel: "coal", mult: 1.3, months: 6 }],
    sources: ["https://pl.wikipedia.org/wiki/Kalendarium_historii_Polski"],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1981_belchatow",
    date: "1981-12",
    title: "Bełchatów: pierwszy blok 360 MW w sieci",
    paper: "Trybuna Ludu",
    text: "29 grudnia 1981 r. pierwszy blok Elektrowni Bełchatów o mocy 360 MW zsynchronizowano z krajową siecią. Węgiel brunatny z odkrywki, z której pierwszą tonę wydobyto w 1980 r., ma docelowo zasilać 12 bloków.",
    hint: "Największe złoże węgla brunatnego w kraju pozwala na gigantyczną elektrownię w centrum Polski.",
    icon: "coal",
    effects: [],
    sources: [
      "https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-2c7ecf33-cd80-48df-a15a-636107768d70/c/Wieczorek_Blaski_2_2017.pdf",
      "https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1983_zarnowiec",
    date: "1983-06",
    title: "Żarnowiec: woda w górę, atom w budowie",
    paper: "Trybuna Ludu",
    text: "Nad Jeziorem Żarnowieckim oddano do eksploatacji elektrownię szczytowo-pompową o mocy 716 MW w generacji i 840 MW w pompowaniu. Tuż obok trwa budowa pierwszej polskiej elektrowni jądrowej, rozpoczęta na mocy uchwały rządu z 18 stycznia 1982 r.",
    hint: "Odblokowano elektrownie jądrowe – budowa trwa długo, ale daje stabilną, bezemisyjną moc.",
    icon: "nuclear",
    effects: [{ type: "unlock", tech: "nuclear" }],
    sources: [
      "https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf",
      "https://rebus.us.edu.pl/bitstream/20.500.12128/17271/1/Wator_Stan_i_perspektywy_energetyki_j%c4%85drowej_w_Polsce.pdf"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1985_linia_750kv",
    date: "1985-06",
    title: "Linia 750 kV łączy Rzeszów z Chmielnicką",
    paper: "Trybuna Ludu",
    text: "Do eksploatacji przekazano linię 750 kV od Chmielnickiej Elektrowni Jądrowej na Ukrainie do stacji Rzeszów w Widełce. Z ok. 396 km jej długości 114 km biegnie przez Polskę – to najwyższe napięcie w historii polskiego systemu.",
    hint: "Odblokowano linie 750 kV.",
    icon: "tower",
    effects: [{ type: "unlock", tech: "line_750" }],
    sources: [
      "https://en.wikipedia.org/wiki/Rzesz%C3%B3w%E2%80%93Khmelnytskyi_powerline",
      "https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1986_czarnobyl",
    date: "1986-04",
    title: "Chmura z Czarnobyla nad Polską",
    paper: "Trybuna Ludu",
    text: "26 kwietnia 1986 r. wybuchł reaktor w Czarnobylskiej Elektrowni Jądrowej. W Polsce płyn Lugola podano kilkunastu milionom osób (według różnych źródeł 17–18,5 mln) – była to największa akcja tego typu w historii medycyny. Katastrofa wzmacnia sprzeciw wobec budowy elektrowni w Żarnowcu.",
    hint: "Opinia publiczna odwraca się od atomu – budowa elektrowni jądrowych stanie się trudniejsza politycznie.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://www.money.pl/gospodarka/awaria-w-rosyjskiej-elektrowni-atomowej-dzis-plynu-lugola-juz-by-nie-podali-6404201468884609a.html",
      "https://www.pap.pl/aktualnosci/dawny-budowniczy-polskiej-elektrowni-jadrowej-katastrofa-w-czarnobylu-wplynela-na"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1989_wybory",
    date: "1989-06",
    title: "Okrągły Stół i wybory 4 czerwca",
    paper: "Gazeta Wyborcza",
    text: "Obrady Okrągłego Stołu (6 lutego – 5 kwietnia 1989 r.), z osobnymi podzespołami m.in. do spraw górnictwa i ekologii, otworzyły drogę do częściowo wolnych wyborów. W głosowaniu 4 i 18 czerwca „Solidarność” zdobyła wszystkie 161 mandatów w Sejmie, o które mogła walczyć, i 99 ze 100 miejsc w Senacie. Wybory otwierają drogę do niekomunistycznego rządu Tadeusza Mazowieckiego.",
    hint: "Kończy się PRL – wkrótce ruszy przebudowa gospodarki, a z nią energetyki.",
    icon: "flag",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/Polish_Round_Table_Agreement",
      "https://en.wikipedia.org/wiki/1989_Polish_parliamentary_election"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1990_plan_balcerowicza",
    date: "1990-01",
    title: "Plan Balcerowicza: koniec tanich cen",
    paper: "Gazeta Wyborcza",
    text: "28 grudnia 1989 r. Sejm przyjął ustawy planu Balcerowicza: od początku 1990 r. większość cen jest wolna, a dotacje obcięte. Realna cena węgla dla elektrowni wzrosła na początku roku trzykrotnie i tyle samo w ciągu 1990 r. zdrożał prąd dla gospodarstw domowych. Produkcja przemysłowa spadła w 1990 r. o 24 proc., a w 1991 r. o kolejne 12 proc.",
    hint: "Fabryki ograniczają produkcję – przez trzy lata popyt na prąd będzie wyraźnie niższy.",
    icon: "money",
    effects: [{ type: "demand", mult: 0.93, months: 36 }],
    sources: [
      "https://dzieje.pl/node/111758",
      "https://eta-publications.lbl.gov/sites/default/files/lbl-33994.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1990_pse",
    date: "1990-06",
    title: "Powstają Polskie Sieci Elektroenergetyczne",
    paper: "Rzeczpospolita",
    text: "W 1990 r. zawiązano jednoosobową spółkę Skarbu Państwa Polskie Sieci Elektroenergetyczne SA, która przejęła większość sieci najwyższych napięć. Na początku lat 90. zlikwidowano okręgi energetyczne, a sektor podzielono na ponad 30 przedsiębiorstw wytwórczych, PSE i 33 zakłady energetyczne odpowiedzialne za dystrybucję. Rozdrobnienie sektora na lata zahamowało budowę nowych mocy i ograniczyło inwestycje sieciowe.",
    hint: "Szkielet przesyłowy ma jednego gospodarza, ale nowych elektrowni prawie nikt nie buduje – stare bloki muszą wystarczyć na dłużej.",
    icon: "tower",
    effects: [],
    sources: [
      "https://www.ee.pw.edu.pl/sep-ow/PLI/konf/histEEn/RF-Kalendarium-28x09.pdf",
      "https://www.cire.pl/pliki/2/2020/elektroenergetyka_polska_w_latach_1990_2020_olga_fasieckazm.pdf"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_1990_zarnowiec_koniec",
    date: "1990-09",
    title: "Rząd rezygnuje z elektrowni jądrowej Żarnowiec",
    paper: "Gazeta Wyborcza",
    text: "4 września 1990 r. rząd Tadeusza Mazowieckiego, na wniosek ministra przemysłu Tadeusza Syryjczyka, zdecydował o zaniechaniu budowy elektrowni jądrowej w Żarnowcu. W majowym referendum w województwie gdańskim 86 proc. głosujących opowiedziało się przeciw kontynuacji inwestycji.",
    hint: "Polska zostaje bez energetyki jądrowej na dziesięciolecia.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/%C5%BBarnowiec_Nuclear_Power_Plant",
      "https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-f2bbb364-1cc2-4375-8543-575446ac682e/c/ek_ptj2014no3_1_Kielbasa.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1995_ucpte",
    date: "1995-10",
    title: "Polska sieć zsynchronizowana z Zachodem",
    paper: "Rzeczpospolita",
    text: "18 października 1995 r. zakończyło się synchroniczne połączenie systemów krajów grupy CENTREL – Polski, Czech, Słowacji i Węgier – z zachodnioeuropejskim systemem UCPTE. Polską część prac prowadziły Polskie Sieci Elektroenergetyczne, spółka powołana w 1990 r.",
    hint: "Polska sieć pracuje teraz w jednym rytmie z Europą Zachodnią.",
    icon: "handshake",
    effects: [],
    sources: [
      "https://www.pse.pl/-/zapadla-decyzja-o-zakonczeniu-dzialalnosci-centrel-a",
      "https://en.wikipedia.org/wiki/Polskie_Sieci_Elektroenergetyczne"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1997_prawo_energetyczne",
    date: "1997-04",
    title: "Sejm uchwala Prawo energetyczne",
    paper: "Rzeczpospolita",
    text: "10 kwietnia 1997 r. Sejm przyjął ustawę Prawo energetyczne. Powołuje ona niezależnego regulatora – Urząd Regulacji Energetyki – i otwiera drogę do konkurencji w wytwarzaniu i obrocie energią.",
    hint: "Koniec gospodarki nakazowej: od teraz liczą się ceny, taryfy i regulator, a prywatni inwestorzy zgłaszają własne elektrownie.",
    icon: "law",
    effects: [{ type: "regime", regime: "market" }, { type: "ipp", scope: "all" }],
    sources: [
      "https://eli.gov.pl/eli/DU/1997/348/ogl/pol/pdf",
      "https://en.wikipedia.org/wiki/Polskie_Sieci_Elektroenergetyczne"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1997_powodz",
    date: "1997-07",
    title: "Powódź tysiąclecia zalewa Opole i Wrocław",
    paper: "Gazeta Wyborcza",
    text: "Ulewy z początku lipca 1997 r. – w Raciborzu w ciągu pięciu dni spadło 244 mm deszczu – wywołały największą powódź w dziejach Wrocławia. W Polsce zginęło 56 osób, a w Opolu woda wdarła się m.in. do śródmieścia i na wyspy Bolko i Pasieka.",
    hint: "Woda niszczy linie i stacje w dorzeczu Odry – naprawy potrwają.",
    icon: "storm",
    effects: [
      { type: "damage", region: { lat: 50.6, lon: 17.5, radiusKm: 130 }, target: "lines", share: 0.15 },
      { type: "outage", region: { lat: 50.6, lon: 17.5, radiusKm: 130 }, months: 1 }
    ],
    sources: [
      "https://pl.wikipedia.org/wiki/Pow%C3%B3d%C5%BA_tysi%C4%85clecia",
      "https://pl.wikipedia.org/wiki/Pow%C3%B3d%C5%BA_tysi%C4%85clecia_w_Opolu"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_1999_gorzow_ccgt",
    date: "1999-06",
    title: "Gorzów: pierwszy w Polsce blok gazowo-parowy",
    paper: "Rzeczpospolita",
    text: "W Elektrociepłowni Gorzów oddano do eksploatacji pierwszy w Polsce blok gazowo-parowy z turbiną gazową GT8C. Gorące spaliny z turbiny trafiają do kotła odzyskowego, a wytworzona para napędza turbiny parowe, co znacznie podnosi sprawność.",
    hint: "Odblokowano turbiny gazowe i bloki gazowo-parowe – szybkie, ale zależne od ceny gazu.",
    icon: "gas",
    effects: [
      { type: "unlock", tech: "gas_ccgt" },
      { type: "unlock", tech: "gas_ocgt" }
    ],
    sources: ["https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-f7e6c096-16ad-4c70-a205-2ccb1977fea5/c/NE_2_2021_8-9.pdf"],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_2000_swepol",
    date: "2000-06",
    title: "Kabel SwePol łączy Polskę ze Szwecją",
    paper: "Rzeczpospolita",
    text: "Uruchomiono podmorskie połączenie prądu stałego SwePol o mocy 600 MW i napięciu 450 kV między stacją Stärnö koło Karlshamn a stacją pod Słupskiem. Z ok. 254 km trasy ok. 239 km biegnie po dnie Bałtyku; to pierwsze łącze HVDC z metalowym przewodem powrotnym.",
    hint: "Odblokowano linie HVDC i kable podmorskie; możesz handlować energią ze Szwecją.",
    icon: "tower",
    effects: [
      { type: "unlock", tech: "hvdc" },
      { type: "unlock", tech: "cable_sea" },
      { type: "border", name: "Szwecja (SwePol)", lat: 54.49, lon: 16.89, mw: 600 }
    ],
    sources: [
      "https://en.wikipedia.org/wiki/SwePol",
      "https://library.e.abb.com/public/b253de87f1b4f0d5c1256fda004aeae7/swepol.pdf"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_2001_barzowice",
    date: "2001-04",
    title: "Barzowice: pierwsza farma wiatrowa w Polsce",
    paper: "Gazeta Wyborcza",
    text: "W kwietniu 2001 r. w Barzowicach na Pomorzu Zachodnim ruszyła pierwsza w Polsce przemysłowa farma wiatrowa: sześć turbin o łącznej mocy ok. 5 MW. Pierwszy pojedynczy wiatrak, duński Nordtank o mocy 150 kW, stanął już w 1991 r. przy elektrowni wodnej w Żarnowcu.",
    hint: "Odblokowano lądowe farmy wiatrowe – najlepiej wieje na wybrzeżu.",
    icon: "wind",
    effects: [{ type: "unlock", tech: "wind" }],
    sources: [
      "https://globenergia.pl/szlakiem-polskich-elektrowni-wiatrowych/",
      "https://en.wikipedia.org/wiki/Wind_power_in_Poland"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2004_unia_europejska",
    date: "2004-05",
    title: "Polska w Unii Europejskiej",
    paper: "Gazeta Wyborcza",
    text: "1 maja 2004 r. Polska wraz z dziewięcioma innymi państwami wstąpiła do Unii Europejskiej. Fundusze unijne mogą współfinansować sieci i odnawialne źródła, a od 1 stycznia 2005 r. elektrownie obejmie unijny system handlu uprawnieniami do emisji CO₂ (EU ETS).",
    hint: "Przez dekadę rozbudowa sieci jest tańsza dzięki funduszom UE, ale emisje zaczynają kosztować.",
    icon: "flag",
    effects: [{ type: "subsidy", target: "grid", costMult: 0.85, months: 120 }],
    sources: [
      "https://en.wikipedia.org/wiki/2004_enlargement_of_the_European_Union",
      "https://en.wikipedia.org/wiki/European_Union_Emissions_Trading_System"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2007_ets_krach",
    date: "2007-03",
    title: "CO₂ za grosze, ale Bruksela tnie polski limit",
    paper: "Rzeczpospolita",
    text: "W 2005 r. ruszył unijny system handlu uprawnieniami do emisji CO₂ (EU ETS), ale uprawnień rozdano za dużo: w kwietniu 2006 r. tona kosztowała ok. 30 euro, a w 2007 r. uprawnienia z pierwszego okresu potaniały niemal do zera. 26 marca 2007 r. Komisja Europejska ograniczyła polski przydział na lata 2008–2012 do 208,5 mln t CO₂ rocznie – o 26,7 proc. mniej, niż proponował rząd.",
    hint: "Na razie emisje kosztują niewiele, ale limity dla polskich elektrowni będą coraz ciaśniejsze.",
    icon: "money",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/European_Union_Emissions_Trading_System",
      "https://ekolist.cz/cz/zpravodajstvi/tiskove-zpravy/obchodovani-s-emisemi-komise-rozhodla-o-ceskem-a-polskem-narodnim-alokacnim-planu-na-obdobi-2008-2012"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2008_szczecin_blackout",
    date: "2008-04",
    title: "Szczecin bez prądu. Największa awaria od wojny",
    paper: "Głos Szczeciński",
    text: "W nocy z 7 na 8 kwietnia 2008 r. mokry śnieg i silny wiatr zerwały linie wysokiego napięcia zasilające Szczecin. Bez prądu zostało ponad pół miliona mieszkańców Pomorza Zachodniego – w Szczecinie awaria trwała blisko dobę, w mniejszych miejscowościach ponad 32 godziny.",
    hint: "Miasto zasilane z jednego kierunku jest bezbronne – buduj połączenia w pętli.",
    icon: "blackout",
    effects: [{ type: "outage", region: { lat: 53.43, lon: 14.55, radiusKm: 60 }, months: 1 }],
    sources: [
      "https://www.money.pl/gospodarka/blackout-w-polsce-zdarzyl-sie-naprawde-dekade-temu-zgasl-caly-szczecin-nie-bylo-niczego-6396070270957185a.html",
      "https://www.gramwzielone.pl/trendy/102789/blackout-co-oznacza-najglosniejsze-przypadki-i-jak-sie-przed-nim-ochronic"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2008_kryzys_finansowy",
    date: "2008-11",
    title: "Kryzys finansowy: przemysł zużywa mniej prądu",
    paper: "Puls Biznesu",
    text: "Światowy kryzys finansowy dociera do polskich fabryk: od listopada 2008 r. zużycie prądu jest co miesiąc o ok. 6 proc. niższe niż przed rokiem, najmocniej w hutnictwie, chemii, przemyśle szklarskim i cementowniach. W całym 2009 r. krajowe zużycie energii elektrycznej wyniosło 148,7 TWh, o blisko 4 proc. mniej niż rok wcześniej; w 2010 r. wróciło niemal do poziomu z 2008 r.",
    hint: "Przez ponad rok popyt jest niższy – z nowymi blokami można poczekać.",
    icon: "money",
    effects: [{ type: "demand", mult: 0.96, months: 14 }],
    sources: [
      "https://forsal.pl/artykuly/119379,szybko-spada-zuzycie-pradu-w-polsce.html",
      "https://www.gov.pl/documents/33372/436746/DE_1_OcenaPEP2030_05_2015-08-03.doc/41976df9-b307-1a9d-055e-93ef4631cd74"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2009_kryzys_gazowy",
    date: "2009-01",
    title: "Wojna gazowa: tranzyt przez Ukrainę wstrzymany",
    paper: "Gazeta Wyborcza",
    text: "W sporze o ceny Rosja 1 stycznia 2009 r. odcięła gaz dla Ukrainy, a 7 stycznia wstrzymała cały tranzyt przez jej terytorium; dostawy wznowiono dopiero 20 stycznia. Do Polski dociera o jedną trzecią mniej rosyjskiego gazu, więc rząd pozwala ograniczać pobór wielkim zakładom – głównie azotowym w Puławach i Tarnowie, Policom i Orlenowi – chroniąc gospodarstwa domowe.",
    hint: "Gaz bywa bronią polityczną – przez miesiąc elektrownie gazowe pracują z ograniczoną mocą.",
    icon: "gas",
    effects: [{ type: "derate", techs: ["gas_ccgt","gas_ocgt"], mult: 0.7, months: 1 }],
    sources: [
      "https://en.wikipedia.org/wiki/2009_Russia%E2%80%93Ukraine_gas_dispute",
      "https://forsal.pl/artykuly/104022,kryzys-gazowy-uderza-w-polskie-firmy.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2011_wierzchoslawice_pv",
    date: "2011-10",
    title: "Wierzchosławice: pierwsza farma słoneczna",
    paper: "Rzeczpospolita",
    text: "Gminna spółka Energia Wierzchosławice zbudowała pod Tarnowem pierwszą w Polsce naziemną elektrownię fotowoltaiczną o mocy 1 MW. Połowę kosztów pokryła dotacja z Małopolskiego Regionalnego Programu Operacyjnego.",
    hint: "Odblokowano farmy fotowoltaiczne – na razie drogie, ale ceny paneli będą spadać.",
    icon: "solar",
    effects: [{ type: "unlock", tech: "solar" }],
    sources: [
      "https://www.gramwzielone.pl/energia-sloneczna/972/farma-sloneczna-wierzchoslawice-ile-kosztowala-i-ile-zarobi",
      "https://globenergia.pl/pierwsza-polska-farma-fotowoltaiczna/"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_2012_polaniec_biomasa",
    date: "2012-12",
    title: "Połaniec: 205 MW z samej biomasy",
    paper: "Puls Biznesu",
    text: "W Elektrowni Połaniec ruszył Zielony Blok – jednostka o mocy 205 MW opalana wyłącznie biomasą, w ok. 80 proc. leśną i w 20 proc. rolniczą. Inwestor, GDF Suez, przedstawia go jako największy blok biomasowy na świecie.",
    hint: "Odblokowano elektrownie na biomasę – wymagają stałych dostaw paliwa z okolicy.",
    icon: "plant",
    effects: [{ type: "unlock", tech: "biomass" }],
    sources: [
      "https://www.gramwzielone.pl/?p=6997",
      "https://en.newsroom.engie.com/assets/gdf-suez-inaugurates-one-of-the-worlds-biggest-biomass-units-in-poland-205-mw-dc8a-314df.html"
    ],
    certainty: "medium",
    speculative: false
  },
  {
    id: "pl_2015_stopnie_zasilania",
    date: "2015-08",
    title: "Upał. PSE ogłaszają 20. stopień zasilania",
    paper: "Dziennik Gazeta Prawna",
    text: "10 sierpnia 2015 r., w czasie fali upałów, rezerwy mocy spadły poniżej wymaganego minimum, a nieplanowane ubytki obniżyły produkcję o ok. 10 proc. PSE wprowadziły ograniczenia dla odbiorców o mocy umownej powyżej 300 kW – po raz pierwszy od 1989 r.",
    hint: "W upale elektrownie cieplne tracą moc, bo brakuje wody do chłodzenia – pilnuj rezerwy.",
    icon: "heat",
    effects: [{ type: "derate", techs: ["coal", "lignite"], mult: 0.85, months: 1 }],
    sources: [
      "https://www.gramwzielone.pl/?p=22902",
      "https://www.money.pl/gospodarka/wiadomosci/artykul/przerwy-w-dostawach-pradu-pse-wprowadzil,98,0,1878626.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2015_litpol",
    date: "2015-12",
    title: "LitPol Link: prąd płynie na Litwę",
    paper: "Rzeczpospolita",
    text: "9 grudnia 2015 r. ruszyło połączenie LitPol Link – linia 400 kV z Ełku do Olity (Alytus), zakończona litewską stacją prądu stałego typu back-to-back. Docelowa przepustowość to 500 MW.",
    hint: "Nowe połączenie transgraniczne – możesz handlować energią z Litwą.",
    icon: "handshake",
    effects: [{ type: "border", name: "Litwa (LitPol Link)", lat: 53.83, lon: 22.36, mw: 500 }],
    sources: [
      "https://en.wikipedia.org/wiki/LitPol_Link",
      "https://www.epsog.lt/en/projects/litpol-link-the-power-link-between-lithuania-and-poland"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2015_gazoport",
    date: "2015-12",
    title: "Pierwszy gazowiec w Świnoujściu",
    paper: "Rzeczpospolita",
    text: "11 grudnia 2015 r. do terminalu LNG w Świnoujściu, zainaugurowanego 12 października, dotarła pierwsza dostawa skroplonego gazu. Terminal może przyjąć 5 mld m³ gazu rocznie i ma pomóc uniezależnić Polskę od gazu z Rosji. Po aneksji Krymu w 2014 r. premier Donald Tusk zaproponował unię energetyczną, w której jeden europejski podmiot kupowałby gaz dla całej UE.",
    hint: "Gaz może teraz przypłynąć statkiem z dowolnego miejsca na świecie – dostawy są pewniejsze, choć nie tańsze.",
    icon: "gas",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/%C5%9Awinouj%C5%9Bcie_LNG_terminal",
      "https://www.themoscowtimes.com/2014/04/22/polish-prime-minister-proposes-european-energy-union"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2016_ustawa_10h",
    date: "2016-07",
    title: "Ustawa 10H blokuje nowe wiatraki",
    paper: "Rzeczpospolita",
    text: "16 lipca 2016 r. weszła w życie ustawa o inwestycjach w zakresie elektrowni wiatrowych. Turbina musi stać w odległości co najmniej dziesięciokrotności swojej wysokości od zabudowań mieszkalnych, co dla typowego, 150-metrowego wiatraka oznacza 1,5 km.",
    hint: "Lądowe farmy wiatrowe możesz stawiać tylko co najmniej 1,5 km od domów.",
    icon: "law",
    effects: [{ type: "rule", rule: "wind_distance_km", value: 1.5 }],
    sources: [
      "https://eli.gov.pl/eli/DU/2016/961/ogl",
      "https://www.prawo.pl/biznes/przepisy-o-lokalizacji-elektrowni-wiatrowych-juz-obowiazuja,166767.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2018_co2_zamrozenie_cen",
    date: "2018-12",
    title: "CO₂ drożeje, rząd zamraża ceny prądu",
    paper: "Rzeczpospolita",
    text: "Reforma unijnego handlu emisjami z rezerwą stabilności rynku (MSR), działającą od 2019 r., wywindowała cenę uprawnień z ok. 4 euro za tonę w połowie 2017 r. do ponad 20 euro latem 2018 r., a hurtowe ceny prądu w Polsce skoczyły ze 170 do 270–280 zł za MWh. Ustawą z 28 grudnia 2018 r. ceny dla odbiorców zamrożono na 2019 r. na poziomie taryf i umów z 30 czerwca 2018 r., akcyzę obniżono z 20 do 5 zł za MWh, a opłatę przejściową o 95 proc.",
    hint: "Uprawnienia do emisji stają się jednym z największych kosztów bloków węglowych, a rachunki odbiorców – sprawą polityczną.",
    icon: "law",
    effects: [],
    sources: [
      "https://forsal.pl/artykuly/1357004,drogi-klimat-europejski-unijna-polityka-podnosi-nam-ceny-energii.html",
      "https://www.podatki.biz/artykuly/podatki-2019-prezydent-podpisal-nowele-zmniejszajaca-opodatkowanie-pradu_16_39880.htm"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2019_moj_prad",
    date: "2019-08",
    title: "Mój Prąd: dotacje do domowej fotowoltaiki",
    paper: "Rzeczpospolita",
    text: "30 sierpnia 2019 r. NFOŚiGW rozpoczął nabór wniosków w programie „Mój Prąd” z budżetem 1 mld zł. Właściciele domów mogą dostać do 5 tys. zł dotacji na mikroinstalację fotowoltaiczną.",
    hint: "Na dachach rosną gigawaty paneli, których nie kontrolujesz – w słoneczne południe sieć może mieć nadmiar energii.",
    icon: "solar",
    effects: [{ type: "prosumer", mwPerYear: 2200, years: 4 }],
    sources: [
      "https://bank.pl/?p=296211",
      "https://osie.pl/artykul/pdf/120/229/1"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2019_banki_wegiel",
    date: "2019-11",
    title: "Banki odwracają się od węgla",
    paper: "Puls Biznesu",
    text: "14 listopada 2019 r. Europejski Bank Inwestycyjny ogłosił, że od końca 2021 r. przestanie finansować projekty energetyczne oparte na paliwach kopalnych, także gazowe. Od węgla odwracają się też banki komercyjne: mBank od 1 kwietnia 2019 r. nie finansuje w Polsce budowy nowych kopalń ani bloków węglowych.",
    hint: "Kredyt na elektrownie kopalne drożeje – im większy udział węgla i gazu w Twoim systemie, tym wyższe odsetki.",
    icon: "money",
    effects: [{ type: "esg", premium: 0.01, months: 72 }],
    sources: [
      "https://www.eib.org/en/press/all/2019-313-eu-bank-launches-ambitious-new-climate-strategy-and-energy-lending-policy",
      "https://spidersweb.pl/2019/04/wegiel-fundusz-ratunkowy.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2020_covid",
    date: "2020-03",
    title: "Pandemia: fabryki zwalniają, popyt na prąd spada",
    paper: "Gazeta Wyborcza",
    text: "Wiosną 2020 r. pandemia COVID-19 i lockdowny hamują gospodarkę: w maju krajowe zużycie prądu było o 8 proc. niższe niż przed rokiem, a w całym drugim kwartale o 9 proc. Jesienią popyt wrócił do normy i w całym 2020 r. zużycie energii elektrycznej spadło tylko o ok. 2 proc.",
    hint: "Na kilka miesięcy popyt wyraźnie spada – w słoneczne, puste dni sieć może mieć nadmiar energii.",
    icon: "factory",
    effects: [{ type: "demand", mult: 0.93, months: 4 }],
    sources: [
      "https://old.jagiellonski.pl/mFile/7.pdf",
      "https://enerad.pl/jak-lockdown-w-czasach-covid-wplynal-na-zuzycie-pradu-w-polsce/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2020_taksonomia",
    date: "2020-06",
    title: "Unijna taksonomia: co jest „zielone”, a co nie",
    paper: "Rzeczpospolita",
    text: "18 czerwca 2020 r. Parlament Europejski przyjął rozporządzenie o taksonomii, które od 12 lipca określa kryteria działalności gospodarczej zgodnej z drogą do neutralności klimatycznej w 2050 r. W 2022 r. dopisano do niej, pod ścisłymi warunkami, wybrane działalności w energetyce jądrowej i gazowej, by przyspieszyć odchodzenie od węgla i innych paliw stałych lub ciekłych.",
    hint: "Inwestycje w węgiel nie mogą liczyć na „zielone” finansowanie – kapitał na paliwa kopalne drożeje.",
    icon: "law",
    effects: [{ type: "esg", premium: 0.015, months: 240 }],
    sources: [
      "https://finance.ec.europa.eu/sustainable-finance/tools-and-standards/eu-taxonomy-sustainable-activities_en",
      "https://en.wikipedia.org/wiki/EU_taxonomy_for_sustainable_activities"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2021_pep2040",
    date: "2021-02",
    title: "Rząd przyjmuje politykę energetyczną do 2040 r.",
    paper: "Rzeczpospolita",
    text: "2 lutego 2021 r. Rada Ministrów przyjęła „Politykę energetyczną Polski do 2040 r.” (PEP2040), opartą na trzech filarach: sprawiedliwej transformacji, zeroemisyjnym systemie energetycznym i dobrej jakości powietrza. Zakłada ona m.in. ok. 5,9 GW morskich farm wiatrowych w 2030 r. i ok. 11 GW w 2040 r., pierwszy blok jądrowy o mocy 1–1,6 GW w 2033 r. (łącznie sześć bloków) oraz co najmniej 23 proc. OZE w końcowym zużyciu energii brutto w 2030 r.",
    hint: "Rząd stawia na morski wiatr i atom, a węgiel ma stopniowo tracić udział.",
    icon: "law",
    effects: [],
    sources: [
      "https://www.gov.pl/web/polski-atom/uchwala-w-sprawie-polityki-energetycznej-polski-do-2040-r",
      "https://bank.pl/?p=358133"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2021_umowa_spoleczna",
    date: "2021-05",
    title: "Umowa społeczna: kopalnie do 2049 roku",
    paper: "Dziennik Zachodni",
    text: "28 maja 2021 r. w Katowicach przedstawiciele rządu i górniczych związków zawodowych podpisali umowę społeczną, zgodnie z którą kopalnie węgla energetycznego mają być wygaszane do 2049 r. Górnicy dostają gwarancje zatrudnienia do nabycia praw emerytalnych, a odchodzący – 120 tys. zł odprawy; pomoc publiczna dla kopalń wymaga jednak zgody Komisji Europejskiej.",
    hint: "Krajowy węgiel będzie dotowany jeszcze przez lata, ale jego koniec ma już datę.",
    icon: "coal",
    effects: [],
    sources: [
      "https://forsal.pl/biznes/energetyka/artykuly/8176310,podpisano-umowe-spoleczna-ws-gornictwa-co-oznacza-ten-dokument.html",
      "https://archiwum.radio.lublin.pl/2021/05/przedstawiciele-rzadu-i-zwiazkow-zawodowych-podpisali-umowe-spoleczna-dla-gornictwa"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2021_turow",
    date: "2021-09",
    title: "TSUE: 500 tys. euro kary dziennie za Turów",
    paper: "Rzeczpospolita",
    text: "20 września 2021 r. wiceprezes TSUE nałożyła na Polskę okresową karę 500 tys. euro dziennie za niewykonanie majowego postanowienia o wstrzymaniu wydobycia w kopalni Turów. Skargę złożyły Czechy, a rząd odmawia zamknięcia odkrywki, powołując się na bezpieczeństwo energetyczne.",
    hint: "Spór kosztuje setki milionów złotych – odkrywki przy granicy niosą ryzyko prawne.",
    icon: "money",
    effects: [{ type: "money", amount: -200000000 }],
    sources: [
      "https://www.money.pl/gospodarka/kara-za-kopalnie-turow-polska-ma-placic-pol-miliona-euro-dziennie-6685256349075968a.html",
      "https://www.rmf24.pl/fakty/news-500-tys-euro-dziennej-kary-dla-polski-decyzja-tsue-ws-turowa,nId,5493994"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2021_fit_for_55",
    date: "2021-12",
    title: "Fit for 55 i drogie CO₂: rachunki w górę",
    paper: "Dziennik Gazeta Prawna",
    text: "W lipcu 2021 r. Komisja Europejska przedstawiła pakiet „Fit for 55”: co najmniej 55 proc. mniej emisji do 2030 r., ostrzejszy handel emisjami i osobny system dla budynków i transportu. Od maja 2019 r. do listopada 2021 r. tona CO₂ zdrożała ze 100 do 310 zł, a prąd w kontraktach na kolejny rok – w ciągu roku z ok. 242 do ok. 470 zł za MWh. W połowie grudnia URE zatwierdził taryfy, które od stycznia 2022 r. podnoszą rachunki gospodarstw domowych średnio o 24 proc.",
    hint: "Każda tona CO₂ z Twoich bloków węglowych kosztuje coraz więcej, a odbiorcy coraz uważniej liczą rachunki.",
    icon: "money",
    effects: [],
    sources: [
      "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal/delivering-european-green-deal_en",
      "https://bank.pl/?p=394005"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2022_inwazja",
    date: "2022-02",
    title: "Rosja napada na Ukrainę",
    paper: "Rzeczpospolita",
    text: "24 lutego 2022 r. Rosja rozpoczęła pełnoskalową inwazję na Ukrainę; miliony Ukraińców uciekają przed wojną, co staje się największym kryzysem uchodźczym w Europie od II wojny światowej. Rynki energii ogarnia panika: 7 marca europejskie ceny gazu skoczyły w ciągu dnia o 79 proc., do rekordowych 345 euro za MWh.",
    hint: "Wojna za wschodnią granicą wstrząsa rynkami paliw – pewność dostaw zaczyna liczyć się bardziej niż cena.",
    icon: "war",
    effects: [],
    sources: [
      "https://en.wikipedia.org/wiki/Russian_invasion_of_Ukraine",
      "https://energyconnects.com/news/utilities/2022/march/european-gas-surges-79-as-market-mayhem-takes-prices-to-record"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2022_ukraina_synchronizacja",
    date: "2022-03",
    title: "Ukraina dołącza do europejskiej sieci",
    paper: "Rzeczpospolita",
    text: "16 marca 2022 r., trzy tygodnie po rosyjskiej napaści, systemy Ukrainy i Mołdawii awaryjnie zsynchronizowano z siecią Europy kontynentalnej. Wcześniej ukraiński system przez trzy tygodnie pracował w izolacji; Ukrenergo wnioskowało o synchronizację 28 lutego.",
    hint: "Sąsiad za wschodnią granicą pracuje teraz w tej samej sieci co Ty.",
    icon: "handshake",
    effects: [],
    sources: [
      "https://entsoe.eu/news/2022/03/16/continental-europe-successful-synchronisation-with-ukraine-and-moldova-power-systems/",
      "https://www.entsoe.eu/news/2023/03/16/synchronisation-anniversary/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2022_kryzys_energetyczny",
    date: "2022-04",
    title: "Embargo na rosyjski węgiel, ceny w kosmos",
    paper: "Dziennik Gazeta Prawna",
    text: "Po rosyjskiej inwazji na Ukrainę Polska w kwietniu 2022 r. wprowadziła embargo na import węgla z Rosji. Na rynku ARA tona węgla energetycznego kosztuje w 2022 r. od 135 do 432 dolarów, a w ślad za nim drożeje gaz.",
    hint: "Paliwa kopalne przez rok kosztują wielokrotnie więcej – źródła bez paliwa zyskują.",
    icon: "crisis",
    effects: [{ type: "fuel", fuel: "coal", mult: 1.4, months: 9 }, { type: "fuel", fuel: "gas", mult: 1.3, months: 9 }],
    sources: [
      "https://www.gazetaprawna.pl/wiadomosci/kraj/artykuly/8402211,ustawa-embargo-na-import-wegla-z-rosji-andrzej-duda-prezydent.html",
      "https://se.min-pan.krakow.pl/pelne_teksty35/k35_prezentacje/k35se_grudzinski.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2022_gazprom_stop",
    date: "2022-04",
    title: "Gazprom zakręca kurek Polsce",
    paper: "Dziennik Gazeta Prawna",
    text: "27 kwietnia 2022 r. o 8:00 Gazprom wstrzymał dostawy gazu do Polski w ramach kontraktu jamalskiego, a także do Bułgarii, bo PGNiG odmówiło płacenia w rublach. Odbiorcy dostają gaz bez przerw, a magazyny są zapełnione w ok. 80 proc.; szefowa Komisji Europejskiej Ursula von der Leyen nazwała ruch Rosji szantażem.",
    hint: "Rosyjski gaz przestaje płynąć do Polski – liczy się każde inne źródło dostaw.",
    icon: "gas",
    effects: [],
    sources: [
      "https://bank.pl/rosja-zakrecila-polsce-kurek-z-gazem/",
      "https://www.money.pl/gospodarka/stalo-sie-rosja-odciela-polske-od-dostaw-gazu-6762671986494272a.html"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2022_baltic_pipe",
    date: "2022-09",
    title: "Baltic Pipe otwarty: gaz z Norwegii",
    paper: "Rzeczpospolita",
    text: "27 września 2022 r. w Goleniowie otwarto gazociąg Baltic Pipe, który pozwoli sprowadzać do 10 mld m³ gazu rocznie z Norwegii przez Danię. Otwarcie nastąpiło dzień po eksplozjach, które unieruchomiły gazociągi Nord Stream.",
    hint: "Dostawy gazu stają się pewniejsze, choć nie tańsze.",
    icon: "gas",
    effects: [],
    sources: [
      "https://poland.representation.ec.europa.eu/news/gazociag-baltic-pipe-otwarty-2022-09-27_pl",
      "https://en.wikipedia.org/wiki/Baltic_Pipe"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2022_ceny_maksymalne",
    date: "2022-10",
    title: "Ceny maksymalne prądu na 2023 rok",
    paper: "Rzeczpospolita",
    text: "27 października 2022 r. uchwalono ustawę o środkach nadzwyczajnych ograniczających ceny energii elektrycznej. Sprzedawcy muszą stosować ceny nie wyższe niż 693 zł za MWh dla gospodarstw domowych, które przekroczą limit zużycia, i 785 zł za MWh dla małych i średnich firm, samorządów oraz podmiotów użyteczności publicznej; w zamian dostają rekompensaty z Funduszu Wypłaty Różnicy Ceny.",
    hint: "Ceny dla odbiorców mają odgórny limit – różnicę sprzedawcom wyrównuje państwo.",
    icon: "law",
    effects: [],
    sources: [
      "https://eli.gov.pl/eli/DU/2022/2243/ogl",
      "https://globenergia.pl/sejm-przyjal-ustawe-w-sprawie-maksymalnych-cen-energii-elektrycznej/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2022_westinghouse",
    date: "2022-11",
    title: "Atom z Ameryki: wybrano Westinghouse",
    paper: "Rzeczpospolita",
    text: "2 listopada 2022 r. Rada Ministrów wybrała reaktory AP1000 amerykańskiej firmy Westinghouse dla pierwszej polskiej elektrowni jądrowej w lokalizacji Lubiatowo-Kopalino na Pomorzu. Elektrownia ma mieć trzy bloki, a cały program jądrowy zakłada 6–9 GW mocy w reaktorach wodnych ciśnieniowych; pierwszy blok miał ruszyć w 2033 r.",
    hint: "Elektrownia jądrowa nad Bałtykiem nabiera kształtów – trzy bloki AP1000 mają dać stabilną, bezemisyjną moc.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://info.westinghousenuclear.com/news/poland-selects-wec-ap1000",
      "https://www.parkiet.com/energetyka/art37341891-polacy-wybrali-amerykanow-jest-atomowa-uchwala"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2023_wiatraki_700m",
    date: "2023-04",
    title: "Wiatraki bliżej domów, PSE tną fotowoltaikę",
    paper: "Rzeczpospolita",
    text: "23 kwietnia 2023 r. weszła w życie nowelizacja ustawy wiatrakowej: minimalna odległość turbiny od zabudowań wynosi teraz 700 m. Tego samego dnia, w słoneczną niedzielę przy niskim popycie, PSE po raz pierwszy w historii nakazały ograniczyć pracę farm fotowoltaicznych – o ok. 2,2 GW.",
    hint: "Wiatraki mogą stać 700 m od domów; nadwyżki słońca warto magazynować zamiast je tracić.",
    icon: "wind",
    effects: [{ type: "rule", rule: "wind_distance_km", value: 0.7 }],
    sources: [
      "https://www.dzp.pl/files/shares/Alerty/2023 04 27 DZP Alert Ustawa 10H.pdf",
      "https://www.pse.pl/documents/20182/51490/2023_06_01_Redysponowanie_nierynkowe_PV.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2023_reforma_ets",
    date: "2023-04",
    title: "Ostrzejszy handel emisjami, CBAM i ETS2",
    paper: "Rzeczpospolita",
    text: "25 kwietnia 2023 r. Rada UE ostatecznie przyjęła reformę handlu emisjami: sektory objęte EU ETS mają do 2030 r. zmniejszyć emisje o 62 proc. względem 2005 r., a darmowe uprawnienia dla branż objętych nowym granicznym mechanizmem CBAM będą wygaszane w latach 2026–2034. Przeciw CBAM głosowała tylko Polska; osobny system ETS2 dla budynków i transportu drogowego ma ruszyć w 2027 r. (lub w 2028 r., jeśli ceny energii będą wyjątkowo wysokie).",
    hint: "Pula uprawnień będzie kurczyć się coraz szybciej – ceny CO₂ raczej nie wrócą do dawnych poziomów.",
    icon: "law",
    effects: [],
    sources: [
      "https://icapcarbonaction.com/en/node/971",
      "https://agenceurope.eu/en/bulletin/article/13169/34"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2023_rynek_mocy_magazyny",
    date: "2023-12",
    title: "Baterie wygrywają aukcję rynku mocy",
    paper: "Puls Biznesu",
    text: "W grudniowej aukcji rynku mocy na rok dostaw 2028 bateryjne magazyny energii zdobyły rekordowe kontrakty: sama grupa Greenvolt zabezpieczyła 1,2 GW, ponad 70 proc. mocy przyznanej tej technologii. Umowy na 17 lat po 244,90 zł za kW rocznie pozwalają finansować wielkie magazyny. Rynek mocy działa od pierwszej aukcji z 15 listopada 2018 r., zakończonej ceną 240,32 zł za kW na rok.",
    hint: "Odblokowano wielkoskalowe magazyny bateryjne – przesuwają nadwyżki słońca na wieczorny szczyt.",
    icon: "money",
    effects: [
      { type: "unlock", tech: "battery" },
      { type: "subsidy", target: "storage", costMult: 0.8, months: 60 }
    ],
    sources: [
      "https://www.gramwzielone.pl/magazynowanie-energii/20178042/najwiekszy-w-historii-portfel-magazynow-energii-zabezpieczony-na-rynku-mocy",
      "https://inzynieria.com/uploaded/articles/Wstepne_wyniki_aukcji_2021_do_publikacji_2018_11_20_6e18a94ded.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2024_pomoc_ukrainie",
    date: "2024-03",
    title: "Rosja bombarduje ukraińską energetykę, PSE śle prąd",
    paper: "Rzeczpospolita",
    text: "22 marca 2024 r. fala rosyjskich ataków z powietrza uszkodziła ukraińskie obiekty energetyczne i pozbawiła prądu ponad milion ludzi; PSE wysłały Ukrainie w ramach pomocy awaryjnej 300 MW. W całym 2024 r. Polska dostarczyła Ukrainie ok. 191 GWh energii awaryjnie i ok. 637 GWh w handlu, a koszty pomocy awaryjnej pokryło ukraińskie Ukrenergo.",
    hint: "Połączenia transgraniczne to nie tylko handel – w kryzysie sąsiednie systemy ratują się nawzajem.",
    icon: "tower",
    effects: [],
    sources: [
      "https://ca.marketscreener.com/news/latest/Ukraine-energy-grid-getting-help-from-abroad-after-Russian-strikes-operator-says-46262534/",
      "https://api.sejm.gov.pl/sejm/term10/interpellations/attachment/ATTDUXHMT/i15512-o1.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2024_csrd",
    date: "2024-12",
    title: "Raporty ESG obowiązkowe dla największych spółek",
    paper: "Puls Biznesu",
    text: "Ustawą z 6 grudnia 2024 r. Polska wdrożyła unijną dyrektywę CSRD: największe spółki, które dotąd publikowały raporty niefinansowe, w 2025 r. po raz pierwszy przedstawią za 2024 r. raporty zrównoważonego rozwoju poświadczone przez biegłego rewidenta. W kwietniu 2025 r. UE odłożyła o dwa lata ten obowiązek dla firm, które jeszcze nie zaczęły raportować.",
    hint: "Banki i inwestorzy widzą teraz czarno na białym ślad węglowy Twojej firmy – kapitał na paliwa kopalne drożeje.",
    icon: "law",
    effects: [{ type: "esg", premium: 0.02, months: 300 }],
    sources: [
      "https://www.gov.pl/web/finanse/ustawa-csrd",
      "https://www.garrigues.com/en_GB/new/stop-clock-directive-published-official-journal-european-union"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2025_baltowie_synchronizacja",
    date: "2025-02",
    title: "Bałtowie odcięci od Rosji, połączeni przez Polskę",
    paper: "Rzeczpospolita",
    text: "8 lutego 2025 r. Litwa, Łotwa i Estonia odłączyły się od postsowieckiego systemu BRELL, a 9 lutego, po ok. 31 godzinach pracy wyspowej, zsynchronizowały się z Europą kontynentalną. Kluczowe było polskie połączenie LitPol Link – wyłączone o 11:00 i ponownie załączone o 13:05.",
    hint: "Polska staje się bramą Bałtów do europejskiej sieci.",
    icon: "handshake",
    effects: [],
    sources: [
      "https://www.gazetaprawna.pl/wiadomosci/swiat/artykuly/9735038,sieci-krajow-baltyckich-zsynchronizowane-z-kontynentalna-europa.html",
      "https://pism.pl/webroot/upload/files/Komentarz/Komentarz%20PISM%20nr%2010-2025.pdf"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2025_centra_danych",
    date: "2025-02",
    title: "Microsoft inwestuje miliardy w chmurę w Polsce",
    paper: "Puls Biznesu",
    text: "W lutym 2025 r. premier Donald Tusk ogłosił, że Microsoft zainwestuje w Polsce ok. 3 mld zł w centra danych i infrastrukturę chmurową. Branża ostrzega, że jej głównym hamulcem są przyłączenia do sieci, a nie brak kapitału czy popytu.",
    hint: "Centra danych pod Warszawą potrzebują pewnej mocy przez całą dobę.",
    icon: "data",
    effects: [
      { type: "load", name: "Centra danych chmury (Warszawa)", lat: 52.25, lon: 20.95, mw: 50, growToMw: 150, years: 4, kind: "datacenter" }
    ],
    sources: [
      "https://www.gov.pl/web/premier/microsoft-wybuduje-w-polsce-centrum-danych-za-3-mld-zl",
      "https://datacenterdynamics.com/en/news/microsoft-to-invest-704m-into-expanding-polish-data-centers"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2025_atom_zgoda_ke",
    date: "2025-12",
    title: "Bruksela zgadza się na pomoc dla atomu",
    paper: "Rzeczpospolita",
    text: "9 grudnia 2025 r. Komisja Europejska zatwierdziła pomoc publiczną szacowaną na 60 mld zł dla pierwszej polskiej elektrowni jądrowej z trzema reaktorami AP1000 firmy Westinghouse na Pomorzu. Pierwszy beton zaplanowano na 2028 r., a pierwszy blok ma ruszyć w 2036 r.",
    hint: "Budowa elektrowni jądrowych jest teraz wyraźnie tańsza dzięki wsparciu państwa.",
    icon: "nuclear",
    effects: [{ type: "subsidy", target: "nuclear", costMult: 0.7, months: 180 }],
    sources: [
      "https://notesfrompoland.com/2025/12/09/poland-to-launch-construction-of-first-nuclear-plant-after-eu-approves-e14bn-in-state-aid/",
      "https://world-nuclear-news.org/articles/eu-approves-polish-state-aid-for-nuclear-plant"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2026_katar_lng",
    date: "2026-03",
    title: "Wojna w Zatoce: Katar wstrzymuje LNG",
    paper: "Rzeczpospolita",
    text: "Po amerykańsko-izraelskich nalotach na Iran z 28 lutego 2026 r. Iran dwukrotnie zaatakował katarski kompleks gazowy Ras Laffan, a żegluga przez cieśninę Ormuz została poważnie ograniczona. Katar wstrzymał produkcję LNG i ogłosił siłę wyższą wobec odbiorców, w tym Orlenu – katarski gaz to ok. 20 proc. dostaw do Polski. 9 marca ceny gazu w Europie skoczyły w ciągu dnia nawet o 30 proc., do ok. 64 euro za MWh, a ropa Brent kosztuje ponad 100 dolarów za baryłkę.",
    hint: "Gaz drożeje na wiele miesięcy – bloki gazowe stają się drogie, a źródła bez paliwa zyskują.",
    icon: "gas",
    effects: [{ type: "fuel", fuel: "gas", mult: 1.5, months: 6 }],
    sources: [
      "https://www.energyconnects.com/news/utilities/2026/march/european-gas-prices-surge-30-as-middle-east-war-roils-markets",
      "https://portalstoczniowy.pl/en/ostatni-lng-katar-swinoujscie-transport-przed-konfliktem/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2026_baltic_power",
    date: "2026-07",
    title: "Pierwszy prąd z morskich wiatraków na Bałtyku",
    paper: "Rzeczpospolita",
    text: "10 lipca 2026 r. energia z farmy Baltic Power – wspólnej inwestycji Orlenu i Northland Power – po raz pierwszy popłynęła do krajowej sieci przez stację elektroenergetyczną w gminie Choczewo. Docelowo 76 turbin Vestas po 15 MW, ustawionych ok. 23 km od brzegu koło Łeby, da ok. 1,1–1,2 GW.",
    hint: "Odblokowano morskie farmy wiatrowe – potrzebują mocnych linii z wybrzeża w głąb kraju.",
    icon: "wind",
    effects: [{ type: "unlock", tech: "wind_offshore" }],
    sources: [
      "https://www.orlen.pl/en/about-the-company/media/press-releases/current/2026/July-2026/a-historic-milestone-the-wind-farm-in-the-baltic-sea-delivers-first-power-to-the-polish-grid",
      "https://www.offshorewind.biz/2026/07/10/poland-receives-its-first-electricity-from-offshore-wind-as-baltic-power-starts-delivering/"
    ],
    certainty: "high",
    speculative: false
  },
  {
    id: "pl_2028_gigafabryka_ai",
    date: "2028-06",
    title: "Gigafabryka AI w Polsce? Scenariusz",
    paper: "Rzeczpospolita",
    text: "Według planów UE pierwsze europejskie gigafabryki AI mają ruszyć w 2028 r.; w lipcu 2026 r. Polska przystąpiła do wspólnego zamówienia EuroHPC, starając się o obiekt na co najmniej 75 tys. akceleratorów. Scenariusz zakłada, że polski projekt wygrywa, a kampus potrzebuje setek megawatów stabilnej mocy.",
    hint: "Ogromny, całodobowy odbiorca – wymaga mocy bez przerw i solidnych przyłączy.",
    icon: "data",
    effects: [
      { type: "load", name: "Gigafabryka AI (scenariusz)", lat: 52.2, lon: 20.9, mw: 100, growToMw: 300, years: 4, kind: "datacenter" }
    ],
    sources: [
      "https://notesfrompoland.com/2026/07/28/poland-enters-race-to-host-eu-backed-ai-gigafactory/",
      "https://www.gov.pl/web/cppc/zamowienie-na-gigafabryki-ai-otwarte"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "pl_2028_pierwszy_beton",
    date: "2028-12",
    title: "Pierwszy beton pod elektrownię jądrową",
    paper: "Rzeczpospolita",
    text: "Według harmonogramu Polskich Elektrowni Jądrowych pod koniec 2028 r. na Pomorzu ma zostać wylany pierwszy beton jądrowy pod reaktor AP1000. Wniosek o pozwolenie na budowę spółka złożyła w kwietniu 2026 r.",
    hint: "Od pierwszego betonu do prądu w sieci mija zwykle 7–8 lat.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://nucnet.herokuapp.com/news/europe-approves-state-aid-for-poland-nuclear-station-first-concrete-planned-for-2028-12-2-2025",
      "https://www.ans.org/news/article-7903/construction-license-application-submitted-for-polands-first-nuclear-plant"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "pl_2035_smr_wloclawek",
    date: "2035-06",
    title: "Włocławek: pierwszy mały reaktor BWRX-300",
    paper: "Rzeczpospolita",
    text: "Według planów Orlen Synthos Green Energy pierwszy blok BWRX-300 we Włocławku ma ruszyć w połowie lat 30. Spółka ma decyzje zasadnicze dla kilku takich bloków, ale ostateczny harmonogram zależy od kolejnych decyzji administracyjnych i finansowych.",
    hint: "Odblokowano małe reaktory modułowe – mniejsze ryzyko budowy, wyższy koszt megawata.",
    icon: "nuclear",
    effects: [{ type: "unlock", tech: "smr" }],
    sources: [
      "https://world-nuclear-news.org/articles/osge-signs-agreement-with-wloclawek-for-smr-plant",
      "https://globenergia.pl/pierwszy-maly-reaktor-jadrowy-w-polsce-coraz-blizej-inwestycja-we-wloclawku-nabiera-ksztaltow/"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "pl_2036_pierwszy_blok_jadrowy",
    date: "2036-12",
    title: "Pierwszy polski blok jądrowy w sieci",
    paper: "Rzeczpospolita",
    text: "Zgodnie z planem zatwierdzonym przez Komisję Europejską pierwszy blok AP1000 elektrowni w gminie Choczewo ma zacząć produkcję w 2036 r. Kolejne dwa bloki mają dojść w następnych latach, a druga elektrownia jądrowa – według wcześniejszych zapowiedzi – ok. 2043 r.",
    hint: "Według planów Polska dołącza do krajów z energetyką jądrową – ok. 1,2 GW stabilnej mocy na blok.",
    icon: "nuclear",
    effects: [],
    sources: [
      "https://nucnet.herokuapp.com/news/europe-approves-state-aid-for-poland-nuclear-station-first-concrete-planned-for-2028-12-2-2025",
      "https://marketnews.com/polands-first-nuclear-plant-set-for-2036-second-to-follow-by-2043-1741943527006"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "pl_2040_offshore_18gw",
    date: "2040-12",
    title: "Bałtyk: blisko 18 GW morskich farm wiatrowych",
    paper: "Rzeczpospolita",
    text: "Według znowelizowanej w 2023 r. ustawy o morskiej energetyce wiatrowej w 2040 r. w polskiej strefie Bałtyku może pracować blisko 18 GW morskich farm; wcześniejszy cel na 2030 r. zakładał 5,9 GW. Scenariusz zakłada, że cel zostaje osiągnięty dzięki kontraktom różnicowym.",
    hint: "Morski wiatr dostaje stabilne wsparcie – ale potrzebuje linii 400 kV z Pomorza na południe.",
    icon: "wind",
    effects: [{ type: "subsidy", target: "wind", costMult: 0.85, months: 120 }],
    sources: [
      "https://api.sejm.gov.pl/sejm/term10/interpellations/attachment/ATTD3DKHK/i00802-o2.pdf",
      "https://www.gov.pl/web/morska-energetyka-wiatrowa/program-rozwoju-mfw-w-polsce"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "pl_2049_koniec_wegla",
    date: "2049-12",
    title: "Ostatnia kopalnia węgla kamiennego zamknięta",
    paper: "Rzeczpospolita",
    text: "Zgodnie z umową społeczną rządu z górnikami z 2021 r. dotowane kopalnie węgla kamiennego mają działać najdłużej do 2049 r. Scenariusz zakłada, że po zamknięciu ostatniej z nich pozostałe bloki węglowe muszą polegać na droższym imporcie.",
    hint: "Węgiel drożeje na stałe – pora wygaszać stare bloki węglowe.",
    icon: "coal",
    effects: [{ type: "fuel", fuel: "coal", mult: 1.4, months: 120 }],
    sources: [
      "https://www.parkiet.com/firmy/art19642471-polska-wreszcie-ma-strategie-energetyczna",
      "https://www.jetro.go.jp/ext_images/_Reports/01/dc17ed77869f2c79/20230052_01.pdf"
    ],
    certainty: "medium",
    speculative: true
  },
  {
    id: "pl_2050_fuzja",
    date: "2050-06",
    title: "Energia z fuzji: pierwsze komercyjne reaktory",
    text: "Czysto futurystyczny scenariusz: po uruchomieniu ITER (badania od 2034 r., paliwo deuter–tryt od 2039 r. według planu z 2024 r.) i prototypów DEMO pierwsze komercyjne elektrownie termojądrowe trafiają do Europy około połowy stulecia. Harmonogramy fuzji wielokrotnie się przesuwały, więc to wydarzenie jest wyłącznie spekulacją.",
    hint: "Odblokowano elektrownie termojądrowe – element futurystyczny, poza znaną historią.",
    icon: "fusion",
    effects: [{ type: "unlock", tech: "fusion" }],
    sources: [
      "https://iter.org/sites/default/files/media/2024-07/baseline_press_conference_summary_july-2024_b.pdf",
      "https://physicsworld.com/a/iter-fusion-reactor-hit-by-massive-decade-long-delay-and-e5bn-price-hike/"
    ],
    certainty: "medium",
    speculative: true
  }
];
