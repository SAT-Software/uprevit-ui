export interface ComplianceStandard {
  id: string;
  type: string;
  category: string;
  scope: string;
  description: string;
}

export const COMPLIANCE_STANDARDS: ComplianceStandard[] = [
  {
    id: "21 CFR Part 11",
    type: "Regulation",
    category: "Software/Data",
    scope: "USA",
    description:
      "Electronic records and electronic signatures. Applies when FDA-required records or signatures are kept electronically (audit trails, access controls).",
  },
  {
    id: "21 CFR Part 801",
    type: "Regulation",
    category: "Labeling",
    scope: "USA (FDA)",
    description:
      "FDA requirements for medical device labeling, including UDI placement and formatting.",
  },
  {
    id: "21 CFR Part 809",
    type: "Regulation",
    category: "Labeling (IVD)",
    scope: "USA (FDA)",
    description:
      "FDA labeling requirements for in vitro diagnostic products, including label and instructions-for-use content.",
  },
  {
    id: "21 CFR Part 820",
    type: "Regulation",
    category: "QMS",
    scope: "USA",
    description:
      "FDA Quality Management System Regulation (QMSR). In effect since 2 February 2026 and incorporates ISO 13485:2016 by reference.",
  },
  {
    id: "21 CFR Part 830",
    type: "Regulation",
    category: "Labeling/UDI",
    scope: "USA (FDA)",
    description:
      "FDA Unique Device Identification system, covering UDI assignment, FDA-accredited issuing agencies and GUDID data submission.",
  },
  {
    id: "Australia TG (Medical Devices) Regulations 2002",
    type: "Regulation",
    category: "Regulatory",
    scope: "Australia (TGA)",
    description:
      "Australian regulations for medical devices and IVDs under the Therapeutic Goods Act 1989, including the Essential Principles for labeling, classification and conformity assessment.",
  },
  {
    id: "Brazil ANVISA RDC 751/2022",
    type: "Regulation",
    category: "Regulatory",
    scope: "Brazil (ANVISA)",
    description:
      "Brazilian rules for medical device classification, notification/registration, labeling and instructions for use. IVDs are covered by RDC 830/2023.",
  },
  {
    id: "Brazil ANVISA RDC 830/2023",
    type: "Regulation",
    category: "Regulatory (IVD)",
    scope: "Brazil (ANVISA)",
    description:
      "Brazilian rules for in vitro diagnostic device classification, notification/registration, labeling and instructions for use.",
  },
  {
    id: "Canada Medical Devices Regulations (SOR/98-282)",
    type: "Regulation",
    category: "Regulatory",
    scope: "Canada (Health Canada)",
    description:
      "Canadian requirements for medical device and IVD classification, licensing and labeling (sections 21–23).",
  },
  {
    id: "China CFDA Order 6 (Labels & IFU)",
    type: "Regulation",
    category: "Labeling",
    scope: "China (NMPA)",
    description:
      "Provisions for medical device instructions for use and labels. Sets the content and language requirements for Chinese labels and IFUs.",
  },
  {
    id: "China State Council Order 739",
    type: "Regulation",
    category: "Regulatory",
    scope: "China (NMPA)",
    description:
      "Regulations on the Supervision and Administration of Medical Devices (2021). Core framework for device and IVD registration, classification and post-market obligations.",
  },
  {
    id: "CLIA (42 CFR 493)",
    type: "Regulation",
    category: "IVD / Labs",
    scope: "USA",
    description:
      "Clinical Laboratory Improvement Amendments. Regulates US laboratories that test human specimens. Relevant to IVD manufacturers through FDA CLIA test categorization (waived, moderate or high complexity).",
  },
  {
    id: "EAEU Medical Device Rules (EEC Decisions 27, 46, 106)",
    type: "Regulation",
    category: "Regulatory",
    scope: "EAEU (Russia, Belarus, Kazakhstan, Armenia, Kyrgyzstan)",
    description:
      "Eurasian Economic Union framework: general safety and effectiveness requirements including labeling (Decision 27), registration rules (Decision 46) and QMS requirements (Decision 106). National registration routes remain available until 31 December 2027.",
  },
  {
    id: "EU eIFU Regulation (2021/2226)",
    type: "Regulation",
    category: "Labeling (eIFU)",
    scope: "EU",
    description:
      "Conditions for supplying instructions for use in electronic form instead of paper, as amended by Regulation (EU) 2025/1234. Applies only to eligible devices.",
  },
  {
    id: "EU IVDR (2017/746)",
    type: "Regulation",
    category: "Regulatory (IVD)",
    scope: "EU",
    description:
      "In-Vitro Diagnostic Regulation. Strict rules for CE marking IVDs.",
  },
  {
    id: "EU MDR (2017/745)",
    type: "Regulation",
    category: "Regulatory",
    scope: "EU",
    description: "General Medical Device Regulation.",
  },
  {
    id: "GS1 General Specs",
    type: "Standard",
    category: "Labeling/UDI",
    scope: "Global",
    description:
      "The technical specs for barcodes (GTIN, GLN, DataMatrix) used for UDI compliance.",
  },
  {
    id: "IEC 60601-1",
    type: "Standard",
    category: "Safety (Hardware)",
    scope: "Global",
    description:
      "Basic safety and essential performance of medical electrical equipment (2005 + A1:2012 + A2:2020).",
  },
  {
    id: "IEC 60601-1-11",
    type: "Standard",
    category: "Electrical (Home)",
    scope: "Global",
    description:
      "Requirements for medical electrical equipment used in the home healthcare environment (lay user).",
  },
  {
    id: "IEC 60601-1-2",
    type: "Standard",
    category: "Electrical (EMC)",
    scope: "Global",
    description:
      "Electromagnetic disturbances (EMC) requirements and tests for medical electrical equipment (2014 + A1:2020).",
  },
  {
    id: "IEC 61010-1",
    type: "Standard",
    category: "IVD / Lab Safety",
    scope: "Global",
    description:
      "Safety requirements for electrical equipment for measurement, control, and laboratory use. (Used for IVD analyzers instead of 60601).",
  },
  {
    id: "IEC 61010-2-101",
    type: "Standard",
    category: "IVD / Lab Safety",
    scope: "Global",
    description: "Particular requirements for IVD medical equipment.",
  },
  {
    id: "IEC 62304",
    type: "Standard",
    category: "Software",
    scope: "Global",
    description:
      "Medical device software life cycle processes for SaMD and SiMD (2006 + A1:2015).",
  },
  {
    id: "IEC 62366-1",
    type: "Standard",
    category: "Usability",
    scope: "Global",
    description:
      "Application of usability engineering (human factors) to medical devices (2015 + A1:2020).",
  },
  {
    id: "IEC 81001-5-1",
    type: "Standard",
    category: "Cybersecurity",
    scope: "Global",
    description:
      "Health software and health IT systems: security activities in the product life cycle. Complements IEC 62304 for connected or data-handling software.",
  },
  {
    id: "IEC 82304-1",
    type: "Standard",
    category: "Software",
    scope: "Global",
    description:
      "Health software – general requirements for product safety. Applies to standalone health software products.",
  },
  {
    id: "India Medical Devices Rules, 2017",
    type: "Regulation",
    category: "Regulatory",
    scope: "India (CDSCO)",
    description:
      "Indian rules for medical device and IVD import, manufacture, registration and labeling, including the standards hierarchy (Rule 7), labeling (Rule 44) and QMS requirements (Fifth Schedule).",
  },
  {
    id: "ISO 10993 Series",
    type: "Standard",
    category: "Biocompatibility",
    scope: "Global",
    description:
      "Biological evaluation of medical devices (cytotoxicity, sensitization, irritation, etc.). Applies to devices with direct or indirect body contact; the tests depend on contact type and duration. Part 1 is now the 2025 edition.",
  },
  {
    id: "ISO 11607-1",
    type: "Standard",
    category: "Sterile Packaging",
    scope: "Global",
    description:
      "Packaging for terminally sterilized medical devices – requirements for materials, sterile barrier systems and packaging systems (2019 + A1:2023).",
  },
  {
    id: "ISO 11607-2",
    type: "Standard",
    category: "Sterile Packaging",
    scope: "Global",
    description:
      "Packaging for terminally sterilized medical devices – validation requirements for forming, sealing and assembly processes (2019 + A1:2023).",
  },
  {
    id: "ISO 13485:2016",
    type: "Standard",
    category: "QMS",
    scope: "Global",
    description:
      "Quality management systems for medical devices. Required or recognized in most markets; in the US, the FDA QMSR (21 CFR Part 820) incorporates it by reference.",
  },
  {
    id: "ISO 14155",
    type: "Standard",
    category: "Clinical",
    scope: "Global",
    description:
      "Good clinical practice for clinical investigations of medical devices in human subjects. Current edition: 2026.",
  },
  {
    id: "ISO 14971:2019",
    type: "Standard",
    category: "Risk Mgmt",
    scope: "Global",
    description:
      "Application of risk management to medical devices. Essential for demonstrating safety.",
  },
  {
    id: "ISO 15223-1:2021",
    type: "Standard",
    category: "Labeling (Symbols)",
    scope: "Global",
    description:
      "Symbols to be used with information supplied by the manufacturer (e.g., \"Sterile\", \"IVD\"). Amendment 1:2025 updates the authorized representative symbol.",
  },
  {
    id: "ISO 17664-1",
    type: "Standard",
    category: "Labeling (Reprocessing)",
    scope: "Global",
    description:
      "Information manufacturers must provide for processing before use or reuse of critical or semi-critical medical devices, and other medical devices intended to be sterilized (2021).",
  },
  {
    id: "ISO 17664-2",
    type: "Standard",
    category: "Labeling (Reprocessing)",
    scope: "Global",
    description:
      "Information manufacturers must provide for processing before use or reuse of non-critical medical devices not intended to be sterilized (2021).",
  },
  {
    id: "ISO 18113 Series",
    type: "Standard",
    category: "IVD Labeling",
    scope: "Global",
    description:
      "Information supplied by the manufacturer (labeling) for in vitro diagnostic medical devices.",
  },
  {
    id: "ISO 20417:2021",
    type: "Standard",
    category: "Labeling",
    scope: "Global",
    description:
      "General requirements for \"information to be supplied by the manufacturer\" (Labels + IFUs). Superseded by ISO 20417:2026, but still referenced by some markets.",
  },
  {
    id: "ISO 20417:2026",
    type: "Standard",
    category: "Labeling",
    scope: "Global",
    description:
      "General requirements for \"information to be supplied by the manufacturer\" (Labels + IFUs). Current edition, replacing ISO 20417:2021.",
  },
  {
    id: "ISO 23640",
    type: "Standard",
    category: "IVD Performance",
    scope: "Global",
    description: "Stability testing of in vitro diagnostic reagents.",
  },
  {
    id: "Japan MHLW Ordinance 169",
    type: "Regulation",
    category: "QMS",
    scope: "Japan (MHLW / PMDA)",
    description:
      "Ministerial Ordinance on QMS for medical devices and IVDs. Based on ISO 13485 with additional Japanese requirements.",
  },
  {
    id: "Japan PMD Act",
    type: "Regulation",
    category: "Regulatory",
    scope: "Japan (MHLW / PMDA)",
    description:
      "Pharmaceuticals and Medical Devices Act. Framework for medical device and IVD approval, certification, labeling (package inserts) and post-market obligations.",
  },
  {
    id: "MDSAP",
    type: "Audit Program",
    category: "QMS",
    scope: "USA, Canada, Australia, Brazil, Japan",
    description:
      "Medical Device Single Audit Program. One ISO 13485-based QMS audit accepted by participating regulators; required for Health Canada licences for Class II–IV devices.",
  },
  {
    id: "Russia Government Decree 1684",
    type: "Regulation",
    category: "Regulatory",
    scope: "Russia (Roszdravnadzor)",
    description:
      "Russian national rules for medical device state registration, in force since 1 March 2025. Applies to devices registered through the national route.",
  },
  {
    id: "Switzerland IvDO (SR 812.219)",
    type: "Regulation",
    category: "Regulatory (IVD)",
    scope: "Switzerland (Swissmedic)",
    description:
      "Swiss In Vitro Diagnostic Medical Devices Ordinance. Aligned with EU IVDR, with Swiss-specific requirements such as a Swiss authorised representative.",
  },
  {
    id: "Switzerland MedDO (SR 812.213)",
    type: "Regulation",
    category: "Regulatory",
    scope: "Switzerland (Swissmedic)",
    description:
      "Swiss Medical Devices Ordinance. Aligned with EU MDR, with Swiss-specific requirements such as a Swiss authorised representative.",
  },
  {
    id: "UK MDR 2002 (SI 2002/618)",
    type: "Regulation",
    category: "Regulatory",
    scope: "Great Britain (MHRA)",
    description:
      "UK Medical Devices Regulations 2002, as amended. Applies to medical devices and IVDs placed on the Great Britain market (UKCA). Northern Ireland follows EU MDR/IVDR.",
  },
];
