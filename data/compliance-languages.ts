export interface ComplianceLanguage {
  code: string;
  name: string;
  country: string;
}

export interface ComplianceLanguageGroup {
  id: string;
  name: string;
  description: string;
  languages: string[];
}

export const COMPLIANCE_LANGUAGES: ComplianceLanguage[] = [
  { code: "AR", name: "Arabic", country: "Saudi Arabia" },
  { code: "BG", name: "Bulgarian", country: "Bulgaria" },
  { code: "CS", name: "Czech", country: "Czech Republic" },
  { code: "DA", name: "Danish", country: "Denmark" },
  { code: "DE", name: "German", country: "Germany" },
  { code: "EL", name: "Greek", country: "Greece" },
  { code: "EN", name: "English", country: "United States" },
  { code: "ES", name: "Spanish", country: "Spain" },
  { code: "ET", name: "Estonian", country: "Estonia" },
  { code: "FI", name: "Finnish", country: "Finland" },
  { code: "FR", name: "French", country: "France" },
  { code: "GA", name: "Irish", country: "Ireland" },
  { code: "HE", name: "Hebrew", country: "Israel" },
  { code: "HR", name: "Croatian", country: "Croatia" },
  { code: "HU", name: "Hungarian", country: "Hungary" },
  { code: "ID", name: "Indonesian", country: "Indonesia" },
  { code: "IS", name: "Icelandic", country: "Iceland" },
  { code: "IT", name: "Italian", country: "Italy" },
  { code: "JA", name: "Japanese", country: "Japan" },
  { code: "KO", name: "Korean", country: "South Korea" },
  { code: "LT", name: "Lithuanian", country: "Lithuania" },
  { code: "LV", name: "Latvian", country: "Latvia" },
  { code: "MS", name: "Malay", country: "Malaysia" },
  { code: "MT", name: "Maltese", country: "Malta" },
  { code: "NL", name: "Dutch", country: "Netherlands" },
  { code: "NO", name: "Norwegian", country: "Norway" },
  { code: "PL", name: "Polish", country: "Poland" },
  { code: "PT", name: "Portuguese", country: "Portugal" },
  { code: "RO", name: "Romanian", country: "Romania" },
  { code: "RU", name: "Russian", country: "Russia" },
  { code: "SK", name: "Slovak", country: "Slovakia" },
  { code: "SL", name: "Slovenian", country: "Slovenia" },
  { code: "SV", name: "Swedish", country: "Sweden" },
  { code: "TH", name: "Thai", country: "Thailand" },
  { code: "TR", name: "Turkish", country: "Turkey" },
  { code: "VI", name: "Vietnamese", country: "Vietnam" },
  { code: "ZH", name: "Chinese (Simplified)", country: "China" },
];

export const COMPLIANCE_LANGUAGE_GROUPS: ComplianceLanguageGroup[] = [
  {
    id: "canada",
    name: "Canada",
    description: "Standard bilingual labeling set for Canada.",
    languages: ["EN", "FR"],
  },
  {
    id: "english-core",
    name: "English Core",
    description: "Baseline set for the US, UK, ANZ, and many export programs that launch in English first.",
    languages: ["EN"],
  },
  {
    id: "pan-european",
    name: "Pan-European",
    description: "Broad EU and EEA pack covering the supported European official-language set used across multi-country launches.",
    languages: [
      "BG",
      "CS",
      "DA",
      "DE",
      "EL",
      "EN",
      "ES",
      "ET",
      "FI",
      "FR",
      "GA",
      "HR",
      "HU",
      "IS",
      "IT",
      "LT",
      "LV",
      "MT",
      "NL",
      "NO",
      "PL",
      "PT",
      "RO",
      "SK",
      "SL",
      "SV",
    ],
  },
  {
    id: "dach",
    name: "DACH",
    description: "German-language packaging set commonly used for Germany and Austria before Swiss localization is layered in.",
    languages: ["DE"],
  },
  {
    id: "switzerland",
    name: "Switzerland",
    description: "Core Swiss pack spanning German, French, and Italian for national distribution.",
    languages: ["DE", "FR", "IT"],
  },
  {
    id: "benelux",
    name: "Benelux",
    description: "Regional mix typically used across Belgium, the Netherlands, and Luxembourg launch plans.",
    languages: ["NL", "FR", "DE"],
  },
  {
    id: "nordics",
    name: "Nordics",
    description: "Nordic and EEA-north set for Denmark, Finland, Iceland, Norway, and Sweden.",
    languages: ["DA", "FI", "IS", "NO", "SV"],
  },
  {
    id: "baltics",
    name: "Baltics",
    description: "Local-language set for Estonia, Latvia, and Lithuania.",
    languages: ["ET", "LV", "LT"],
  },
  {
    id: "central-europe",
    name: "Central Europe",
    description: "Useful regional pack for Poland, Czechia, Slovakia, Hungary, and Slovenia.",
    languages: ["PL", "CS", "SK", "HU", "SL"],
  },
  {
    id: "southeast-europe",
    name: "Southeast Europe",
    description: "Common Southeastern European language bundle for Bulgaria, Greece, Croatia, and Romania.",
    languages: ["BG", "EL", "HR", "RO"],
  },
  {
    id: "latin-america",
    name: "Latin America",
    description: "Practical Spanish-plus-Portuguese set for broader LATAM programs, including Brazil.",
    languages: ["ES", "PT"],
  },
  {
    id: "east-asia",
    name: "East Asia",
    description: "Country-specific local-language set for China, Japan, and South Korea launches.",
    languages: ["ZH", "JA", "KO"],
  },
  {
    id: "asean-core",
    name: "ASEAN Core",
    description: "Starter mix for Southeast Asia programs where English is paired with key local-market languages.",
    languages: ["EN", "ID", "MS", "TH", "VI"],
  },
  {
    id: "gulf-arabic",
    name: "Gulf / Arabic",
    description: "Common bilingual packaging baseline for Gulf markets where Arabic and English are paired.",
    languages: ["AR", "EN"],
  },
];
