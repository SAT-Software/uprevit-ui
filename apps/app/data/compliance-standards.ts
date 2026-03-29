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
    description: "Electronic Records & Signatures (Audit Trails).",
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
    id: "21 CFR Part 820",
    type: "Regulation",
    category: "QMS",
    scope: "USA",
    description: "FDA Quality System Regulation.",
  },
  {
    id: "CLIA (42 CFR 493)",
    type: "Regulation",
    category: "IVD / Labs",
    scope: "USA",
    description:
      "Clinical Laboratory Improvement Amendments. Regulates US facilities that perform testing on humans.",
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
      "Basic safety and essential performance of medical electrical equipment.",
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
      "Electromagnetic Disturbances. Mandatory testing to ensure devices don't emit/absorb interference (e.g., WiFi, MRI noise).",
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
    description: "Software Lifecycle Processes (SaMD & SiMD).",
  },
  {
    id: "IEC 62366-1",
    type: "Standard",
    category: "Usability",
    scope: "Global",
    description:
      "Application of usability engineering (Human Factors) to medical devices.",
  },
  {
    id: "IEC 82304-1",
    type: "Standard",
    category: "Software",
    scope: "Global",
    description:
      "Health software – General requirements for product safety. Focuses on standalone software (like your SaaS).",
  },
  {
    id: "ISO 10993 Series",
    type: "Standard",
    category: "Biocompatibility",
    scope: "Global",
    description:
      "Biological evaluation of medical devices (cytotoxicity, irritation, etc.). Needed for anything touching a patient.",
  },
  {
    id: "ISO 13485:2016",
    type: "Standard",
    category: "QMS",
    scope: "Global",
    description:
      'The "Gold Standard" for Medical Device Quality Management Systems. Required for regulatory purposes in most markets (except US, though FDA is harmonizing via QMSR).',
  },
  {
    id: "ISO 14155",
    type: "Standard",
    category: "Clinical",
    scope: "Global",
    description:
      "Good Clinical Practice (GCP) for clinical investigations of medical devices.",
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
    description: 'Standardized symbols (e.g., "Sterile", "IVD").',
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
      'General requirements for "information to be supplied by the manufacturer" (Labels + IFUs).',
  },
  {
    id: "ISO 23640",
    type: "Standard",
    category: "IVD Performance",
    scope: "Global",
    description: "Stability testing of in vitro diagnostic reagents.",
  },
];
