export interface BarcodeStandard {
  name: string;
  type: string;
  standardOrAgency: string;
  primaryUseCase: string;
  keyFeaturesAndCompliance: string;
}

export const BARCODE_STANDARDS: BarcodeStandard[] = [
  {
    name: "GS1 DataMatrix",
    type: "2D",
    standardOrAgency: "GS1",
    primaryUseCase:
      "The Industry Standard. Used for UDI (Unique Device Identification), surgical instruments, implants, and small medical devices.",
    keyFeaturesAndCompliance:
      "High data density in small space. Supports error correction. Required for Direct Part Marking (DPM).",
  },
  {
    name: "GS1-128",
    type: "1D",
    standardOrAgency: "GS1",
    primaryUseCase:
      "Secondary packaging, shipping cases, and logistics labels.",
    keyFeaturesAndCompliance:
      "Encodes Application Identifiers (AI) like Lot No., Expiry Date, and GTIN. highly readable by standard scanners.",
  },
  {
    name: "HIBCC Data Matrix",
    type: "2D",
    standardOrAgency: "HIBCC",
    primaryUseCase:
      "Small medical devices and instruments where HIBCC standard is preferred over GS1.",
    keyFeaturesAndCompliance:
      "Starts with a + character. Encodes the HIBC UDI format.",
  },
  {
    name: "QR Code (GS1)",
    type: "2D",
    standardOrAgency: "GS1",
    primaryUseCase:
      '"Extended packaging" (e-Labeling), Instructions for Use (IFU), and patient engagement.',
    keyFeaturesAndCompliance:
      "Can hold URLs for digital health information. Distinct from Data Matrix (QR has squares in 3 corners).",
  },
  {
    name: "EAN-13 (GTIN-13)",
    type: "1D",
    standardOrAgency: "GS1",
    primaryUseCase:
      "Retail medical products (OTC drugs, consumer devices like thermometers/blood pressure monitors).",
    keyFeaturesAndCompliance:
      "Point-of-Sale (POS) scanning. Standard retail barcode outside North America.",
  },
  {
    name: "UPC-A (GTIN-12)",
    type: "1D",
    standardOrAgency: "GS1",
    primaryUseCase: "Retail medical products in North America.",
    keyFeaturesAndCompliance: "Point-of-Sale (POS) scanning.",
  },
  {
    name: "ISBT 128 (Data Matrix)",
    type: "2D",
    standardOrAgency: "ICCBBA",
    primaryUseCase: "Labeling of blood bags, cells, tissues, and organs.",
    keyFeaturesAndCompliance:
      "specialized for Medical Products of Human Origin (MPHO). Ensures global traceability of biological products.",
  },
  {
    name: "ISBT 128 (Code 128)",
    type: "1D",
    standardOrAgency: "ICCBBA",
    primaryUseCase:
      "Blood bag donation numbers and product codes (legacy but still widely used).",
    keyFeaturesAndCompliance:
      "The linear version of the blood/tissue standard.",
  },
  {
    name: "Code 128",
    type: "1D",
    standardOrAgency: "ISO/IEC",
    primaryUseCase:
      "General purpose internal tracking, asset tags, and patient wristbands.",
    keyFeaturesAndCompliance:
      "High-density linear barcode. Basis for GS1-128 and ISBT 128.",
  },
  {
    name: "Code 39",
    type: "1D",
    standardOrAgency: "ISO/IEC",
    primaryUseCase:
      "Legacy healthcare applications, older patient wristbands, and internal asset tracking.",
    keyFeaturesAndCompliance:
      "Low data density. Being phased out in favor of Code 128 and Data Matrix.",
  },
  {
    name: "Aztec Code",
    type: "2D",
    standardOrAgency: "ISO/IEC",
    primaryUseCase:
      "Patient wristbands (very popular here due to center-out reading).",
    keyFeaturesAndCompliance:
      'Doesn\'t require "quiet zone" (white space) around edges, making it great for curved wristbands.',
  },
  {
    name: "Codabar",
    type: "1D",
    standardOrAgency: "ISO/IEC",
    primaryUseCase: "Legacy Blood bank use.",
    keyFeaturesAndCompliance:
      "largely obsolete and replaced by ISBT 128, but may exist in older systems.",
  },
];
