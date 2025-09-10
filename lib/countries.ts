export enum Countries {
  CZ = "Zahraničie - Česká republika",
  SK = "Slovensko",
  UAT = "Zahriničie - Rakúsko",  
}

export enum Regions {
  KE = "Košický",
  BA = "Bratislavský",
  BB = "Banskobystrický",
  PO = "Presovský",
  NR = "Nitriansky",
  TC = "Trenciansky",
  TV = "Trnavský",
  ZA = "Zilinský",
}

export const districts = [
  'Banská Bystrica',
  'Banská Štiavnica', 
  'Bardejov',
  'Bánovce nad Bebravou', 
  'Brezno', 
  'Bratislava I',
  'Bratislava II',
  'Bratislava III', 
  'Bratislava IV', 
  'Bratislava V', 
  'Bytča', 
  'Čadca', 
  'Detva', 
  'Dolný Kubín', 
  'Dunajská Streda', 
  'Galanta', 
  'Gelnica', 
  'Hlohovec', 
  'Humenné', 
  'Ilava', 
  'Kežmarok', 
  'Komárno', 
  'Košice I', 
  'Košice II', 
  'Košice III', 
  'Košice IV', 
  'Košice-okolie', 
  'Krupina', 
  'Kysucké Nové Mesto', 
  'Levice', 
  'Levoča', 
  'Liptovský Mikuláš', 
  'Lučenec', 
  'Malacky', 
  'Martin', 
  'Medzilaborce', 
  'Michalovce', 
  'Myjava', 
  'Námestovo', 
  'Nitra', 
  'Nové Mesto nad Váhom', 
  'Nové Zámky', 
  'Partizánske', 
  'Pezinok', 
  'Piešťany', 
  'Poltár', 
  'Poprad', 
  'Považská Bystrica', 
  'Prešov', 
  'Prievidza', 
  'Púchov', 
  'Revúca', 
  'Rimavská Sobota', 
  'Rožňava', 
  'Ružomberok', 
  'Sabinov', 
  'Senec', 
  'Senica', 
  'Skalica', 
  'Snina', 
  'Sobrance', 
  'Spišská Nová Ves', 
  'Stará Ľubovňa', 
  'Stropkov', 
  'Svidník', 
  'Šaľa', 
  'Topoľčany', 
  'Trebišov', 
  'Trenčín', 
  'Trnava', 
  'Turčianske Teplice', 
  'Tvrdošín', 
  'Veľký Krtíš', 
  'Vranov nad Topľou', 
  'Zlaté Moravce', 
  'Zvolen', 
  'Žarnovica', 
  'Žiar nad Hronom', 
  'Žilina'
];

export const regionOptions = Object.keys(Regions).map((region) => ({
  label: Regions[region as keyof typeof Regions],
  value: region,
}));

export const getCityOptions = (region: string) => {
  return regions[region as keyof typeof regions].map((value) => ({
    label: value,
    value,
  }));
};

export const KE_cities = [
  "Trebisov",
  "Secovce",
  "Kralovsky chlmec",
  "Cierna nad Tisou",
];

export const PO_cities = [
  "Bardejov",
  "Humenne",
  "Kezmarok",
  "Levoca",
  "Medizlaborce",
  "Poprad",
  "Snina",
  "Stara Lubovna",
  "Stropkov",
  "Svidnik",
  "Vranov nad Toplou",
];

export const ZA_cities = [
  "Cadca",
  "Bytca",
  "Martin",
  "Namestovo",
  "Ruzomberok",
  "Tvrdosin",
  "Zilina",
  "Turcianske Teplice",
  "Liptovsky Mikulas",
];

export const regions = {
  KE: KE_cities,
  PO: PO_cities,
  ZA: ZA_cities,
};
