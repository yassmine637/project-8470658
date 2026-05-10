const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'Tunisie': [
    'Tunis', 'Sfax', 'Sousse', 'Bizerte', 'Gabès', 'Ariana', 'Gafsa', 'Kairouan',
    'Monastir', 'Médenine', 'Nabeul', 'Ben Arous', 'Kasserine', 'Béja', 'Tataouine',
    'Jendouba', 'Mahdia', 'Siliana', 'Le Kef', 'Sidi Bouzid', 'Zaghouan', 'Tozeur',
    'Kébili', 'Manouba', 'La Marsa', 'Hammam-Lif', 'La Goulette', 'Radès', 'Mégrine',
    'Moknine', 'Msaken', 'Korba', 'Hammam Sousse', 'Akouda', 'Kalaa Kebira',
    'El Aïn', 'Téboulba', 'Djerba', 'Zarzis', 'Ben Gardane', 'Matmata',
    'Douz', 'Nefta', 'Haïdra', 'Thala', 'Sbeitla', 'Maktar', 'Testour',
  ],
  'France': [
    'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier',
    'Strasbourg', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Étienne', 'Le Havre',
    'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Clermont-Ferrand',
    'Aix-en-Provence', 'Brest', 'Tours', 'Amiens', 'Limoges', 'Perpignan', 'Metz',
    'Besançon', 'Boulogne-Billancourt', 'Orléans', 'Mulhouse', 'Rouen', 'Caen', 'Nancy',
    'Argenteuil', 'Montreuil', 'Roubaix', 'Dunkerque', 'Avignon', 'Poitiers', 'Créteil',
    'Vitry-sur-Seine', 'Asnieres-sur-Seine', 'Colombes', 'Versailles', 'Saint-Denis',
    'Pau', 'Rueil-Malmaison', 'Tourcoing', 'Champigny-sur-Marne', 'Courbevoie',
    'Nanterre', 'Aulnay-sous-Bois', 'Calais', 'Antibes', 'Cannes', 'Ajaccio',
  ],
  'Belgique': [
    'Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège', 'Bruges', 'Namur',
    'Louvain', 'Mons', 'Malines', 'Aalst', 'La Louvière', 'Courtrai', 'Hasselt',
    'Ostende', 'Genk', 'Molenbeek-Saint-Jean', 'Anderlecht', 'Ixelles', 'Seraing',
    'Tournai', 'Verviers', 'Schaerbeek', 'Etterbeek', 'Uccle', 'Sint-Niklaas',
  ],
  'Suisse': [
    'Zurich', 'Genève', 'Bâle', 'Lausanne', 'Berne', 'Winterthour', 'Lucerne',
    'Saint-Gall', 'Lugano', 'Biel/Bienne', 'Thoune', 'Köniz', 'La Chaux-de-Fonds',
    'Schaffhouse', 'Fribourg', 'Chur', 'Neuchâtel', 'Uster', 'Sion', 'Emmen',
    'Kriens', 'Arbon', 'Wil', 'Bulle', 'Zug',
  ],
  'Maroc': [
    'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tanger', 'Meknès',
    'Oujda', 'Kénitra', 'Tétouan', 'Salé', 'Safi', 'El Jadida', 'Khouribga',
    'Béni Mellal', 'Essaouira', 'Nador', 'Settat', 'Berrechid', 'Khémisset',
    'Errachidia', 'Ouarzazate', 'Taroudant', 'Taza', 'Guelmim',
  ],
  'Algérie': [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif',
    'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'El Oued', 'Skikda', 'Tiaret', 'Béjaïa',
    'Tlemcen', 'Ouargla', 'Mostaganem', 'Bordj Bou Arréridj', 'Chlef',
    'Médéa', 'Tizi Ouzou', 'Bouira', 'Jijel', 'Guelma',
  ],
  'Libye': [
    'Tripoli', 'Benghazi', 'Misrata', 'Tarhuna', 'Khoms', 'Zawiya', 'Zintan',
    'Tobrouk', 'Sabhā', 'Derna', 'Zuwara', 'Ajdabiya', 'Zliten', 'Al-Marj',
  ],
  'Égypte': [
    'Le Caire', 'Alexandrie', 'Gizeh', 'Shubra El Kheima', 'Port Saïd', 'Suez',
    'Louxor', 'Mansoura', 'El-Mahalla El-Kubra', 'Tanta', 'Asyut', 'Ismaïlia',
    'Faiyoum', 'Zagazig', 'Assouan', 'Damiette', 'Damanhour', 'Minya', 'Beni Suef',
    'Hurghada', 'Charm el-Cheikh', 'Sohag', 'Qena', 'Kafr el-Cheikh',
  ],
  'Arabie Saoudite': [
    'Riyad', 'Djeddah', 'La Mecque', 'Médine', 'Dammam', 'Al-Khobar', 'Jubail',
    'Tabuk', 'Abha', 'Haïl', 'Taïf', 'Najran', 'Al-Qatif', 'Yanbu', 'Khamis Mushait',
    'Al-Ahsa', 'Sakaka', 'Arar', 'Jizan', 'Al-Jouf',
  ],
  'Émirats Arabes Unis': [
    'Dubaï', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras al-Khaimah', 'Fujairah',
    'Umm al-Qaïwaïn', 'Al Aïn', 'Khor Fakkan', 'Kalba', 'Dibba Al-Hisn',
  ],
  'Qatar': [
    'Doha', 'Al Wakrah', 'Al Khor', 'Lusail', 'Dukhan', 'Mesaïeed', 'Al Rayyan',
    'Ash Shahaniyah', 'Madinat ash Shamal',
  ],
  'Koweït': [
    'Koweït City', 'Hawalli', 'Al Ahmadi', 'Al Jahra', 'Moubarak Al-Kabir',
    'Al Farwaniyah', 'Salmiya', 'Rumaithiya',
  ],
  'Bahreïn': [
    'Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'Isa Town', 'Sitra',
    'Jidhafs', 'Al Malikiyah', 'Budaiya',
  ],
  'Oman': [
    'Mascate', 'Salalah', 'Seeb', 'Sohar', 'Nizwa', 'Sur', 'Ibra', 'Barka',
    'Rustaq', 'Al Buraimi', 'Khasab', 'Duqm',
  ],
  'Jordanie': [
    'Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Russeifa', 'Mafraq', 'Jérash', 'Madaba',
    'Karak', 'Tafileh', 'Ma\'an', 'Ajloun', 'Balqa', 'Zarqa',
  ],
  'Liban': [
    'Beyrouth', 'Tripoli', 'Sidon', 'Tyr', 'Jounieh', 'Zahlé', 'Baalbek',
    'Nabatieh', 'Aley', 'Batroun', 'Jbeil', 'Bint Jbeil',
  ],
  'Syrie': [
    'Damas', 'Alep', 'Homs', 'Lattaquié', 'Hama', 'Deir ez-Zor', 'Al-Hasakah',
    'Raqqa', 'Daraa', 'Idleb', 'Qamishli', 'Tartous',
  ],
  'Irak': [
    'Bagdad', 'Bassorah', 'Mossoul', 'Erbil', 'Najaf', 'Kerbala', 'Kirkouk',
    'Sulaymaniyah', 'Nassiriya', 'Amarah', 'Hilla', 'Kout', 'Tikrit', 'Ramadi',
  ],
  'Palestine': [
    'Ramallah', 'Gaza', 'Hébron', 'Naplouse', 'Jénine', 'Jéricho', 'Tulkarem',
    'Qalqilya', 'Bethléem', 'Khan Younès', 'Rafah', 'Jabaliya',
  ],
  'Soudan': [
    'Khartoum', 'Omdurman', 'Khartoum-Nord', 'Port-Soudan', 'Kassala', 'El-Obeid',
    'Gedaref', 'Wad Medani', 'El Fasher', 'Nyala', 'Juba',
  ],
  'Yémen': [
    'Sanaa', 'Aden', 'Taïz', 'Hodeïda', 'Moukallab', 'Ibb', 'Dhamar',
    'Al Mukalla', 'Saada', 'Marib',
  ],
  'Allemagne': [
    'Berlin', 'Hambourg', 'Munich', 'Cologne', 'Francfort', 'Stuttgart', 'Düsseldorf',
    'Dortmund', 'Essen', 'Leipzig', 'Brême', 'Dresde', 'Hanovre', 'Nuremberg',
    'Duisbourg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Karlsruhe',
    'Mannheim', 'Augsbourg', 'Wiesbaden', 'Mönchengladbach', 'Gelsenkirchen',
    'Aix-la-Chapelle', 'Brunswick', 'Kiel', 'Chemnitz', 'Halle', 'Magdebourg',
    'Fribourg-en-Brisgau', 'Krefeld', 'Lübeck', 'Oberhausen', 'Erfurt', 'Rostock',
  ],
  'Royaume-Uni': [
    'Londres', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Édimbourg',
    'Liverpool', 'Manchester', 'Bristol', 'Cardiff', 'Leicester', 'Salford', 'Coventry',
    'Hull', 'Stoke-on-Trent', 'Wolverhampton', 'Derby', 'Nottingham', 'Southampton',
    'Newcastle upon Tyne', 'Belfast', 'Oxford', 'Cambridge', 'Brighton',
    'Portsmouth', 'Plymouth', 'Sunderland', 'Reading', 'Aberdeen',
  ],
  'Italie': [
    'Rome', 'Milan', 'Naples', 'Turin', 'Palerme', 'Gênes', 'Bologne', 'Florence',
    'Bari', 'Catane', 'Venise', 'Vérone', 'Messine', 'Padoue', 'Trieste', 'Brescia',
    'Tarente', 'Prato', 'Modène', 'Reggio de Calabre', 'Pérouse', 'Livourne',
    'Cagliari', 'Foggia', 'Salerne', 'Rimini', 'Syracuse', 'Bolzano',
  ],
  'Espagne': [
    'Madrid', 'Barcelone', 'Valence', 'Séville', 'Saragosse', 'Málaga', 'Murcie',
    'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Valladolid', 'Cordoue', 'Vigo',
    'Gijón', 'Hospitalet', 'Grenade', 'Vitoria', 'La Corogne', 'Elche', 'Oviedo',
    'Santa Cruz de Tenerife', 'Badalona', 'Valladolid', 'Terrassa', 'Jerez',
  ],
  'Pays-Bas': [
    'Amsterdam', 'Rotterdam', 'La Haye', 'Utrecht', 'Eindhoven', 'Groningue',
    'Tilburg', 'Almere', 'Breda', 'Nimègue', 'Apeldoorn', 'Haarlem', 'Arnhem',
    'Enschede', 'Amersfoort', 'Zaandam', 'Maastricht', 'Dordrecht', 'Leiden',
  ],
  'Portugal': [
    'Lisbonne', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Setúbal',
    'Almada', 'Funchal', 'Coimbra', 'Cascais', 'Loures', 'Sintra', 'Odivelas',
    'Guimarães', 'Matosinhos', 'Évora', 'Aveiro', 'Faro', 'Viseu',
  ],
  'Autriche': [
    'Vienne', 'Graz', 'Linz', 'Salzbourg', 'Innsbruck', 'Klagenfurt', 'Villach',
    'Wels', 'Sankt Pölten', 'Dornbirn', 'Steyr', 'Feldkirch', 'Bregenz', 'Leonding',
  ],
  'Luxembourg': [
    'Luxembourg', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Pétange',
    'Ettelbruck', 'Diekirch', 'Wiltz', 'Rumelange', 'Grevenmacher',
  ],
  'Irlande': [
    'Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk',
    'Swords', 'Bray', 'Navan', 'Kilkenny', 'Ennis', 'Tralee', 'Carlow', 'Sligo',
  ],
  'Grèce': [
    'Athènes', 'Thessalonique', 'Patras', 'Héraklion', 'Larissa', 'Volos',
    'Ioannina', 'La Canée', 'Chalcis', 'Kavala', 'Rhodes', 'Sérès', 'Agrinio',
    'Katerini', 'Trikala', 'Lamia', 'Véria', 'Mytilène',
  ],
  'Suède': [
    'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping',
    'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås',
    'Södertälje', 'Eskilstuna', 'Karlstad', 'Täby', 'Växjö',
  ],
  'Norvège': [
    'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Fredrikstad',
    'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg', 'Skien', 'Ålesund',
    'Sandefjord', 'Haugesund', 'Tønsberg', 'Moss', 'Bodø',
  ],
  'Danemark': [
    'Copenhague', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg', 'Esbjerg',
    'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Helsingør',
    'Herning', 'Silkeborg', 'Næstved',
  ],
  'Finlande': [
    'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä',
    'Lahti', 'Kuopio', 'Pori', 'Kouvola', 'Joensuu', 'Lappeenranta', 'Hämeenlinna',
    'Vaasa', 'Rovaniemi', 'Seinäjoki', 'Mikkeli',
  ],
  'Pologne': [
    'Varsovie', 'Cracovie', 'Wrocław', 'Łódź', 'Poznań', 'Gdańsk', 'Szczecin',
    'Bydgoszcz', 'Lublin', 'Katowice', 'Białystok', 'Gdynia', 'Częstochowa',
    'Radom', 'Sosnowiec', 'Toruń', 'Kielce', 'Rzeszów', 'Gliwice', 'Zabrze',
  ],
  'Tchéquie': [
    'Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'Ústí nad Labem',
    'České Budějovice', 'Hradec Králové', 'Pardubice', 'Zlín', 'Havířov', 'Kladno',
    'Most', 'Opava', 'Frýdek-Místek',
  ],
  'Hongrie': [
    'Budapest', 'Debrecen', 'Miskolc', 'Szeged', 'Pécs', 'Győr', 'Nyíregyháza',
    'Kecskemét', 'Székesfehérvár', 'Szombathely', 'Érd', 'Tatabánya', 'Kaposvár',
    'Veszprém', 'Sopron',
  ],
  'Roumanie': [
    'Bucarest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Craiova', 'Brașov', 'Galați',
    'Ploiești', 'Oradea', 'Brăila', 'Arad', 'Pitești', 'Bacău', 'Sibiu', 'Târgu Mureș',
    'Baia Mare', 'Buzău', 'Suceava', 'Satu Mare', 'Râmnicu Vâlcea',
  ],
  'États-Unis': [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphie',
    'San Antonio', 'San Diego', 'Dallas', 'San José', 'Austin', 'Jacksonville',
    'Fort Worth', 'Columbus', 'Charlotte', 'Indianapolis', 'San Francisco', 'Seattle',
    'Denver', 'Nashville', 'Oklahoma City', 'El Paso', 'Washington', 'Las Vegas',
    'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno',
    'Mesa', 'Sacramento', 'Atlanta', 'Kansas City', 'Omaha', 'Colorado Springs',
    'Raleigh', 'Long Beach', 'Virginia Beach', 'Miami', 'Oakland', 'Minneapolis',
    'Tampa', 'New Orleans', 'Arlington', 'Wichita', 'Cleveland', 'Boston', 'Portland',
  ],
  'Canada': [
    'Toronto', 'Montréal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg',
    'Québec', 'Hamilton', 'Brampton', 'Mississauga', 'Surrey', 'Laval', 'Halifax',
    'London', 'Markham', 'Vaughan', 'Gatineau', 'Saskatoon', 'Longueuil',
    'Burnaby', 'Kitchener', 'Windsor', 'Regina', 'Richmond Hill',
  ],
  'Australie': [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adélaïde', 'Gold Coast', 'Canberra',
    'Newcastle', 'Sunshine Coast', 'Wollongong', 'Hobart', 'Geelong', 'Townsville',
    'Cairns', 'Darwin', 'Toowoomba', 'Ballarat', 'Bendigo', 'Launceston',
  ],
};

export function getCitiesForCountry(countryName: string): string[] {
  return CITIES_BY_COUNTRY[countryName] ?? [];
}

export default CITIES_BY_COUNTRY;
