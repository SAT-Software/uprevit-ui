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
  { code: "HR", name: "Croatian", country: "Croatia" },
  { code: "HU", name: "Hungarian", country: "Hungary" },
  { code: "IS", name: "Icelandic", country: "Iceland" },
  { code: "IT", name: "Italian", country: "Italy" },
  { code: "LT", name: "Lithuanian", country: "Lithuania" },
  { code: "LV", name: "Latvian", country: "Latvia" },
  { code: "MT", name: "Maltese", country: "Malta" },
  { code: "NL", name: "Dutch", country: "Netherlands" },
  { code: "NO", name: "Norwegian", country: "Norway" },
  { code: "PL", name: "Polish", country: "Poland" },
  { code: "PT", name: "Portuguese", country: "Portugal" },
  { code: "RO", name: "Romanian", country: "Romania" },
  { code: "SK", name: "Slovak", country: "Slovakia" },
  { code: "SL", name: "Slovenian", country: "Slovenia" },
  { code: "SV", name: "Swedish", country: "Sweden" },
  { code: "TR", name: "Turkish", country: "Turkey" },
];

export const COMPLIANCE_LANGUAGE_GROUPS: ComplianceLanguageGroup[] = [
  {
    id: "canada",
    name: "Canada",
    description: "Standard bilingual labeling set for Canada.",
    languages: ["EN", "FR"],
  },
  {
    id: "belgium",
    name: "Belgium",
    description: "Tri-language packaging commonly used for the Belgian market.",
    languages: ["NL", "FR", "DE"],
  },
  {
    id: "switzerland",
    name: "Switzerland",
    description: "Core Swiss market language set across German, French, and Italian.",
    languages: ["DE", "FR", "IT"],
  },
  {
    id: "nordics",
    name: "Nordics",
    description: "Nordic regional grouping for labeling reviews and packaging prep.",
    languages: ["DA", "FI", "IS", "NO", "SV"],
  },
  {
    id: "iberia",
    name: "Iberia",
    description: "Common language set for Spain and Portugal launches.",
    languages: ["ES", "PT"],
  },
  {
    id: "benelux",
    name: "Benelux",
    description: "Cross-market grouping for Netherlands, Belgium, and Luxembourg use cases.",
    languages: ["NL", "FR", "DE"],
  },
  {
    id: "baltics",
    name: "Baltics",
    description: "Regional set for Estonia, Latvia, and Lithuania.",
    languages: ["ET", "LV", "LT"],
  },
  {
    id: "cee",
    name: "Central & Eastern Europe",
    description: "A starter group covering key Central and Eastern European submissions.",
    languages: ["BG", "CS", "HR", "HU", "PL", "RO", "SK", "SL"],
  },
  {
    id: "eu-core",
    name: "EU Core",
    description: "Frequently requested core language set for broader EU packaging programs.",
    languages: ["DE", "EN", "ES", "FR", "IT", "NL", "PT"],
  },
];
