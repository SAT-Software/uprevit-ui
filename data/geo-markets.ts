export interface GeoMarket {
  regionAcronym: string;
  fullName: string;
  category: string;
  regulatoryBody: string;
  description: string;
}

export const GEO_MARKETS: GeoMarket[] = [
  {
    regionAcronym: "US",
    fullName: "United States",
    category: "Primary Market",
    regulatoryBody: "FDA (CDRH)",
    description:
      "The world's largest standalone market. Highly regulated (510(k)/PMA). Often treated as a separate P&L unit from the rest of the world.",
  },
  {
    regionAcronym: "OUS",
    fullName: "Outside United States",
    category: "Global Grouping",
    regulatoryBody: "Various",
    description:
      "A common corporate term for all markets excluding the USA. Often used to distinguish FDA-regulated products from CE/International versions.",
  },
  {
    regionAcronym: "EU / EEA",
    fullName: "European Union / Economic Area",
    category: "Primary Market",
    regulatoryBody: "EU MDR / IVDR",
    description:
      "The second-largest market. Requires CE Marking. Includes 27 EU member states plus EFTA countries (Iceland, Liechtenstein, Norway).",
  },
  {
    regionAcronym: "ROW",
    fullName: "Rest of World",
    category: "Strategic Grouping",
    regulatoryBody: "Various (Local Registrations)",
    description:
      'A flexible term. Usually refers to markets outside the "Big 5" (US, EU, Japan, Canada, Australia). Often distributor-led markets.',
  },
  {
    regionAcronym: "APAC",
    fullName: "Asia-Pacific",
    category: "Regional",
    regulatoryBody: "Diverse (NMPA, PMDA, CDSCO)",
    description:
      "High-growth region including China, Japan, India, Australia, and South Korea. Regulatory landscape varies wildly from strict (Japan) to developing (SE Asia).",
  },
  {
    regionAcronym: "EMEA",
    fullName: "Europe, Middle East, & Africa",
    category: "Regional",
    regulatoryBody: "CE Mark (dominant) + Local",
    description:
      "A standard sales territory. Europe is the hub; Middle East and Africa often accept CE Marked devices but may require local registration.",
  },
  {
    regionAcronym: "LATAM",
    fullName: "Latin America",
    category: "Regional",
    regulatoryBody: "ANVISA, COFEPRIS, etc.",
    description:
      "Key emerging markets. Brazil (ANVISA) and Mexico (COFEPRIS) are the anchors. Regulations often follow FDA or EU precedents but require local testing/language.",
  },
  {
    regionAcronym: "ASEAN",
    fullName: "Assoc. of SE Asian Nations",
    category: "Sub-Region",
    regulatoryBody: "AMDD (ASEAN Medical Device Directive)",
    description:
      "10 SE Asian countries (Singapore, Vietnam, Thailand, etc.) moving toward harmonized regulations (AMDD).",
  },
  {
    regionAcronym: "MENA",
    fullName: "Middle East & North Africa",
    category: "Sub-Region",
    regulatoryBody: "Local / GCC",
    description:
      "Oil-rich economies (Saudi Arabia, UAE). Often reference FDA or CE clearance for expedited approval.",
  },
  {
    regionAcronym: "DACH",
    fullName: "Germany, Austria, Switzerland",
    category: "Sub-Region (Sales)",
    regulatoryBody: "BfArM / Swissmedic",
    description:
      'The wealthiest and most critical sub-market within Europe. Switzerland is now a "Third Country" to the EU (Mutual Recognition Agreement expired).',
  },
  {
    regionAcronym: "BRICS",
    fullName: "Brazil, Russia, India, China, S. Africa",
    category: "Economic Block",
    regulatoryBody: "Various",
    description:
      "The major emerging economies. Historically grouped due to high growth potential, though regulatory paths are distinct.",
  },
  {
    regionAcronym: "ANZ",
    fullName: "Australia & New Zealand",
    category: "Sub-Region",
    regulatoryBody: "TGA / Medsafe",
    description:
      "English-speaking APAC market. Regulations (TGA) are closely aligned with EU/GHTF standards but sovereign.",
  },
  {
    regionAcronym: "GCC",
    fullName: "Gulf Cooperation Council",
    category: "Sub-Region",
    regulatoryBody: "SFDA / MOH",
    description:
      "The 6 Arab states of the Gulf. Saudi Arabia (SFDA) is the dominant regulator with high standards.",
  },
  {
    regionAcronym: "EAEU",
    fullName: "Eurasian Economic Union",
    category: "Economic Block",
    regulatoryBody: "EAEU Regulations",
    description:
      "Russia, Kazakhstan, Belarus, Armenia, Kyrgyzstan. Moving toward a unified medical device registration system similar to the EU.",
  },
  {
    regionAcronym: "Benelux",
    fullName: "Belgium, Netherlands, Luxembourg",
    category: "Sub-Region (Sales)",
    regulatoryBody: "EU MDR",
    description:
      "A key logistics hub for MedTech in Europe (many distinct European HQs are here).",
  },
  {
    regionAcronym: "Nordics",
    fullName: "Northern Europe",
    category: "Sub-Region (Sales)",
    regulatoryBody: "EU MDR",
    description:
      "Sweden, Denmark, Norway, Finland. Early adopters of digital health and high-tech devices.",
  },
];
