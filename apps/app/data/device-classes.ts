export interface DeviceClassOption {
  value: string;
  className: string;
  regulation: string;
  description?: string;
}

export interface DeviceClassGroup {
  regulation: string;
  options: DeviceClassOption[];
}

const createOption = (
  regulation: string,
  className: string,
  description?: string,
): DeviceClassOption => ({
  value: `${regulation} - ${className}`,
  regulation,
  className,
  description,
});

export const DEVICE_CLASS_GROUPS: DeviceClassGroup[] = [
  {
    regulation: "FDA",
    options: [
      createOption("FDA", "Class I", "General controls"),
      createOption("FDA", "Class II", "General and special controls"),
      createOption("FDA", "Class III", "Premarket approval"),
    ],
  },
  {
    regulation: "EU MDR",
    options: [
      createOption("EU MDR", "Class I", "Low risk"),
      createOption("EU MDR", "Class Is", "Sterile Class I device"),
      createOption("EU MDR", "Class Im", "Measuring Class I device"),
      createOption("EU MDR", "Class Ir", "Reusable surgical instrument"),
      createOption("EU MDR", "Class IIa", "Low to medium risk"),
      createOption("EU MDR", "Class IIb", "Medium to high risk"),
      createOption("EU MDR", "Class III", "High risk"),
    ],
  },
  {
    regulation: "EU IVDR",
    options: [
      createOption("EU IVDR", "Class A", "Lowest IVD risk"),
      createOption("EU IVDR", "Class B"),
      createOption("EU IVDR", "Class C"),
      createOption("EU IVDR", "Class D", "Highest IVD risk"),
    ],
  },
  {
    regulation: "Health Canada",
    options: [
      createOption("Health Canada", "Class I", "Lowest risk"),
      createOption("Health Canada", "Class II"),
      createOption("Health Canada", "Class III"),
      createOption("Health Canada", "Class IV", "Highest risk"),
    ],
  },
  {
    regulation: "TGA",
    options: [
      createOption("TGA", "Class I", "Lowest classification"),
      createOption("TGA", "Class I sterile"),
      createOption("TGA", "Class I measuring"),
      createOption("TGA", "Class IIa"),
      createOption("TGA", "Class IIb"),
      createOption("TGA", "Class III", "Highest classification"),
    ],
  },
  {
    regulation: "UKCA / MHRA",
    options: [
      createOption("UKCA / MHRA", "Class I", "Low risk"),
      createOption("UKCA / MHRA", "Class IIa", "Lower medium risk"),
      createOption("UKCA / MHRA", "Class IIb", "Higher medium risk"),
      createOption("UKCA / MHRA", "Class III", "High risk"),
    ],
  },
  {
    regulation: "PMDA Japan",
    options: [
      createOption("PMDA Japan", "Class I", "Extremely low risk"),
      createOption("PMDA Japan", "Class II", "Low risk"),
      createOption("PMDA Japan", "Class III", "Medium risk"),
      createOption("PMDA Japan", "Class IV", "High risk"),
    ],
  },
  {
    regulation: "NMPA China",
    options: [
      createOption("NMPA China", "Class I"),
      createOption("NMPA China", "Class II"),
      createOption("NMPA China", "Class III"),
    ],
  },
  {
    regulation: "ANVISA Brazil",
    options: [
      createOption("ANVISA Brazil", "Risk Class I", "Low risk"),
      createOption("ANVISA Brazil", "Risk Class II", "Medium risk"),
      createOption("ANVISA Brazil", "Risk Class III", "High risk"),
      createOption("ANVISA Brazil", "Risk Class IV", "Maximum risk"),
    ],
  },
];

export const DEVICE_CLASS_OPTIONS = DEVICE_CLASS_GROUPS.flatMap(
  (group) => group.options,
);

export const findDeviceClassOption = (value?: string | null) =>
  DEVICE_CLASS_OPTIONS.find((option) => option.value === value);
