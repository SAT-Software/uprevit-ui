import ProductsPageProductTable, {
  Item,
} from "@/features/products/ProductsPageProductTable";
import CreateProductDialog from "@/features/products/CreateProductDialog";

export const sampleProducts: Item[] = [
  {
    productId: "PROD-001",
    createdOn: "2025-04-10T09:15:00Z",
    createdBy: "Alice",
    modifiedOn: "2025-04-14T14:30:00Z",
    modifiedBy: "Bob",
    productName: "Central Heating Unit Rev.A",
    description:
      "Advanced central heating control unit with smart temperature regulation and energy optimization features.",
    projectId: "PROJ-ALPHA",
    departmentId: "uih2gf872y",
    version: "1.0",
    status: "Submitted",
    targetDate: 1720656000000, // July 11, 2025
    completionDate: 1721692800000, // July 23, 2025
    delayReason:
      "Component sourcing delays and additional testing requirements",
    tabsCompleted: ["product-information", "component-details", "product-data"],
    completionPercentage: 43, // 3/7 = 43%
  },
  {
    productId: "PROD-002",
    createdOn: "2025-03-22T11:00:00Z",
    createdBy: "Charlie",
    modifiedOn: "2025-04-15T10:05:00Z",
    modifiedBy: "Charlie",
    productName: "Air Quality Sensor Module",
    description:
      "High-precision air quality monitoring module with multi-sensor integration for comprehensive environmental analysis.",
    projectId: "PROJ-BETA",
    departmentId: "uh2t38787gce8",
    version: "0.8",
    status: "Draft",
    targetDate: 1725148800000, // September 1, 2025
    completionDate: null,
    delayReason: null,
    tabsCompleted: ["product-information"],
    completionPercentage: 14, // 1/7 = 14%
  },
  {
    productId: "PROD-003",
    createdOn: "2024-11-01T16:45:00Z",
    createdBy: "David",
    modifiedOn: "2025-01-20T08:00:00Z",
    modifiedBy: "Alice",
    productName: "Smart Thermostat Gen1",
    description:
      "First generation smart thermostat with basic temperature control and scheduling capabilities.",
    projectId: "PROJ-GAMMA",
    departmentId: "uih2gf872y",
    version: "1.2",
    status: "Archived",
    targetDate: 1705968000000, // January 22, 2025
    completionDate: 1705968000000, // January 22, 2025
    delayReason: null,
    tabsCompleted: [
      "product-information",
      "component-details",
      "compliance-information",
      "product-data",
      "operational-parameters",
      "label-tags",
      "schematics-symbols",
    ],
    completionPercentage: 100, // 7/7 = 100%
  },
  {
    productId: "PROD-004",
    createdOn: "2025-01-15T10:30:00Z",
    createdBy: "Eve",
    modifiedOn: "2025-04-20T09:00:00Z",
    modifiedBy: "Frank",
    productName: "Ventilation Fan Assembly",
    description:
      "Energy-efficient ventilation system with variable speed control and noise reduction technology.",
    projectId: "PROJ-DELTA",
    departmentId: "uih2gf872y",
    version: "2.1",
    status: "Submitted",
    targetDate: 1722470400000, // August 1, 2025
    completionDate: null,
    delayReason: null,
    tabsCompleted: ["product-information", "component-details"],
    completionPercentage: 29, // 2/7 = 29%
  },
  {
    productId: "PROD-005",
    createdOn: "2025-02-01T14:00:00Z",
    createdBy: "Grace",
    modifiedOn: "2025-04-22T11:45:00Z",
    modifiedBy: "Grace",
    productName: "CO2 Sensor Unit",
    description:
      "Precision CO2 monitoring device with real-time data logging and alert system.",
    projectId: "PROJ-BETA",
    departmentId: "uh2t38787gce8",
    version: "1.0",
    status: "Draft",
    targetDate: 1727740800000, // October 1, 2025
    completionDate: null,
    delayReason: null,
    tabsCompleted: [],
    completionPercentage: 0, // 0/7 = 0%
  },
  {
    productId: "PROD-006",
    createdOn: "2024-12-10T08:20:00Z",
    createdBy: "Heidi",
    modifiedOn: "2025-03-01T15:10:00Z",
    modifiedBy: "Judy",
    productName: "Humidity Sensor Probe",
    description:
      "High-accuracy humidity measurement device with temperature compensation and calibration features.",
    projectId: "PROJ-EPSILON",
    departmentId: "uh2t38787gce8",
    version: "0.7",
    status: "Submitted",
    targetDate: 1717632000000, // June 6, 2025
    completionDate: 1719273600000, // June 25, 2025
    delayReason: "Calibration equipment malfunction caused production delays",
    tabsCompleted: [
      "product-information",
      "component-details",
      "compliance-information",
      "product-data",
    ],
    completionPercentage: 57, // 4/7 = 57%
  },
  {
    productId: "PROD-007",
    createdOn: "2025-04-01T12:00:00Z",
    createdBy: "Ivan",
    modifiedOn: "2025-04-18T16:25:00Z",
    modifiedBy: "Alice",
    productName: "Smart Home Hub Controller",
    description:
      "Central control unit for smart home automation with multi-protocol support and cloud connectivity.",
    projectId: "PROJ-GAMMA",
    departmentId: "uih2gf872y",
    version: "1.5",
    status: "Draft",
    targetDate: 1730419200000, // November 1, 2025
    completionDate: null,
    delayReason: null,
    tabsCompleted: ["product-information"],
    completionPercentage: 14, // 1/7 = 14%
  },
  {
    productId: "PROD-008",
    createdOn: "2024-10-05T09:00:00Z",
    createdBy: "Judy",
    modifiedOn: "2025-02-15T13:00:00Z",
    modifiedBy: "Mallory",
    productName: "Water Leak Detector",
    description:
      "Early warning system for water leaks with wireless connectivity and battery backup.",
    projectId: "PROJ-ZETA",
    departmentId: "uh2t38787gce8",
    version: "1.0",
    status: "Archived",
    targetDate: 1707091200000, // February 5, 2025
    completionDate: 1708473600000, // February 21, 2025
    delayReason: "Software certification delays and hardware revision needed",
    tabsCompleted: [
      "product-information",
      "component-details",
      "compliance-information",
      "product-data",
      "operational-parameters",
    ],
    completionPercentage: 71, // 5/7 = 71%
  },
  {
    productId: "PROD-009",
    createdOn: "2025-03-15T17:30:00Z",
    createdBy: "Mallory",
    modifiedOn: "2025-04-24T08:55:00Z",
    modifiedBy: "Bob",
    productName: "Boiler Control Unit Rev.B",
    description:
      "Second revision of the boiler control system with enhanced safety features and efficiency algorithms.",
    projectId: "PROJ-ALPHA",
    departmentId: "uih2gf872y",
    version: "1.1",
    status: "Submitted",
    targetDate: 1724889600000, // August 29, 2025
    completionDate: null,
    delayReason: null,
    tabsCompleted: [
      "product-information",
      "component-details",
      "compliance-information",
    ],
    completionPercentage: 43, // 3/7 = 43%
  },
  {
    productId: "PROD-010",
    createdOn: "2025-04-12T13:10:00Z",
    createdBy: "Niaj",
    modifiedOn: "2025-04-19T10:20:00Z",
    modifiedBy: "Niaj",
    productName: "Temperature Sensor Array",
    description:
      "Multi-point temperature monitoring system with high-resolution sensors and data aggregation.",
    projectId: "PROJ-BETA",
    departmentId: "uh2t38787gce8",
    version: "0.9",
    status: "Draft",
    targetDate: 1727654400000, // September 30, 2025
    completionDate: null,
    delayReason: null,
    tabsCompleted: [],
    completionPercentage: 0, // 0/7 = 0%
  },
  {
    productId: "PROD-011",
    createdOn: "2024-09-20T11:50:00Z",
    createdBy: "Olivia",
    modifiedOn: "2025-01-10T14:40:00Z",
    modifiedBy: "David",
    productName: "Smart Radiator Valve",
    description:
      "Automated radiator control valve with zone-based temperature management and energy saving modes.",
    projectId: "PROJ-GAMMA",
    departmentId: "uih2gf872y",
    version: "1.3",
    status: "Submitted",
    targetDate: 1704067200000, // January 1, 2025
    completionDate: 1705968000000, // January 22, 2025
    delayReason: "Supply chain disruptions and quality control issues",
    tabsCompleted: [
      "product-information",
      "component-details",
      "compliance-information",
      "product-data",
      "operational-parameters",
    ],
    completionPercentage: 71, // 5/7 = 71%
  },
  {
    productId: "PROD-012",
    createdOn: "2025-04-05T10:00:00Z",
    createdBy: "Peggy",
    modifiedOn: "2025-04-21T17:00:00Z",
    modifiedBy: "Charlie",
    productName: "Energy Monitoring Plug",
    description:
      "Smart power monitoring device with real-time energy consumption tracking and reporting features.",
    projectId: "PROJ-ETA",
    departmentId: "uih2gf872y",
    version: "1.0",
    status: "Draft",
    targetDate: 1732147200000, // November 21, 2025
    completionDate: null,
    delayReason: null,
    tabsCompleted: ["product-information"],
    completionPercentage: 14, // 1/7 = 14%
  },
  {
    productId: "PROD-013",
    createdOn: "2024-08-15T15:25:00Z",
    createdBy: "Walter",
    modifiedOn: "2024-12-01T09:35:00Z",
    modifiedBy: "Eve",
    productName: "Air Purifier Filter Cartridge",
    description:
      "High-efficiency air purification filter with multi-stage filtration and smart replacement indicators.",
    projectId: "PROJ-THETA",
    departmentId: "uih2gf872y",
    version: "2.0",
    status: "Archived",
    targetDate: 1699142400000, // November 5, 2024
    completionDate: 1701648000000, // December 4, 2024
    delayReason:
      "Manufacturing equipment upgrade required for new filtration technology",
    tabsCompleted: [
      "product-information",
      "component-details",
      "compliance-information",
      "product-data",
      "operational-parameters",
      "label-tags",
    ],
    completionPercentage: 86, // 6/7 = 86%
  },
];

function ProductsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <p className="text-base font-semibold">All Products</p>
          <CreateProductDialog />
        </div>
        {/* <Departments departments={departments} /> */}
        <ProductsPageProductTable sampleProducts={sampleProducts} />
      </div>
    </div>
  );
}

export default ProductsPage;
