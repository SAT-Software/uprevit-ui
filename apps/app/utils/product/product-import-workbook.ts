import XLSX from "xlsx-js-style";
import { COMPLIANCE_LANGUAGES } from "@/data/compliance-languages";
import { COMPLIANCE_STANDARDS } from "@/data/compliance-standards";
import { COUNTRIES } from "@/data/countries";
import { DEVICE_CLASS_OPTIONS } from "@/data/device-classes";
import { GEO_MARKETS } from "@/data/geo-markets";
import { planKey } from "@/utils/product/product-import-review";
import type {
  ImportComponent,
  ImportedProduct,
  ImportWorkbook,
} from "@/types/product-import";

export const MAX_IMPORT_FILE_MB = 200;
export const MAX_IMPORT_FILE_BYTES = MAX_IMPORT_FILE_MB * 1024 * 1024;
export const MAX_IMPORT_PRODUCTS = 5000;

const SHEETS = {
  products: "products",
  standards: "all standards",
  languages: "languages",
  components: "label components",
};
const IGNORED_SHEETS = ["instructions", "lists"];
const REF_HEADERS = ["product ref (plan number)", "product ref", "plan number"];

const PRODUCT_FIELDS = {
  "product name": "product_name",
  "product description": "product_description",
  department: "department_name",
  project: "project_name",
  "project number": "project_number",
  "target date": "target_date",
  "market / geography": "market_geography",
  "country of origin": "country_of_origin",
  "oem / contract manufacturer": "oem_contract_manufacturer",
  "commercial / clinical": "commercial_clinical",
  "manufacturing location": "manufacturing_location",
  "class of device": "class_of_device",
  "basic udi-di": "basic_udi_di",
} as const;
type ProductField = (typeof PRODUCT_FIELDS)[keyof typeof PRODUCT_FIELDS];

const STANDARD_AUTO_COLUMNS = ["no. of standards selected", "selected standards (auto)"];
const COMPONENT_FIELDS: Record<string, keyof ImportComponent> = {
  "label type": "label_type",
  "component number": "component_number",
  "component description": "component_description",
  "component type": "component_type",
  dimensions: "dimensions",
  "print direction": "print_direction",
};
const COMPONENT_TYPES: Record<string, string> = {
  "pre-printed": "Preprinted",
  preprinted: "Preprinted",
  blank: "Blank",
  "n/a": "N/A",
  na: "N/A",
};

const key = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

const byKey = <T>(items: T[], pick: (item: T) => string) =>
  new Map(items.map((item) => [key(pick(item)), item]));

const STANDARDS = byKey(COMPLIANCE_STANDARDS, (item) => item.id);
const LANGUAGES = byKey(COMPLIANCE_LANGUAGES, (item) => item.name);
const COUNTRY_NAMES = byKey(COUNTRIES, (item) => item.name);
const MARKETS = new Set(GEO_MARKETS.map((item) => key(item.regionAcronym)));
const DEVICE_CLASSES = new Set(DEVICE_CLASS_OPTIONS.map((item) => key(item.value)));

type Row = { row: number; ref: string; cells: Map<string, string>; raw: Map<string, XLSX.CellObject> };
type Table = { headers: string[]; rows: Row[] };

const cellText = (cell?: XLSX.CellObject) => {
  if (!cell || cell.v == null) return "";
  if (cell.t === "n" && cell.w && !/[eE]/.test(cell.w)) return cell.w.trim();
  return String(cell.v).trim();
};

function readTable(sheet: XLSX.WorkSheet, sheetName: string): Table | null {
  const byRow = new Map<number, Map<number, XLSX.CellObject>>();
  for (const address of Object.keys(sheet)) {
    if (address.startsWith("!")) continue;
    const cell = sheet[address] as XLSX.CellObject;
    if (cell?.v == null || cell.v === "") continue;
    const { r, c } = XLSX.utils.decode_cell(address);
    const row = byRow.get(r) ?? new Map<number, XLSX.CellObject>();
    row.set(c, cell);
    byRow.set(r, row);
  }
  const rowNumbers = [...byRow.keys()].sort((a, b) => a - b);
  const headerRow = rowNumbers.slice(0, 10).find((r) => REF_HEADERS.includes(key(cellText(byRow.get(r)!.get(0)))));
  if (headerRow === undefined) return null;

  const headers = new Map<number, string>();
  const seen = new Set<string>();
  for (const [c, cell] of [...byRow.get(headerRow)!.entries()].sort(([a], [b]) => a - b)) {
    const header = cellText(cell);
    if (!header) continue;
    if (seen.has(key(header))) {
      throw new Error(`${sheetName} has more than one column named "${header}". Rename one of them and upload the file again.`);
    }
    seen.add(key(header));
    headers.set(c, header);
  }

  const rows: Row[] = [];
  for (const r of rowNumbers) {
    if (r <= headerRow) continue;
    const cells = new Map<string, string>();
    const raw = new Map<string, XLSX.CellObject>();
    for (const [c, cell] of byRow.get(r)!) {
      const header = headers.get(c);
      if (c === 0 || !header) continue;
      const text = cellText(cell);
      if (!text) continue;
      cells.set(key(header), text);
      raw.set(key(header), cell);
    }
    rows.push({ row: r + 1, ref: cellText(byRow.get(r)!.get(0)), cells, raw });
  }
  return { headers: [...headers.values()], rows };
}

function readDate(cell: XLSX.CellObject | undefined, text: string, date1904: boolean) {
  if (!text) return { value: null };
  if (cell?.t === "n" && typeof cell.v === "number" && cell.v > 0) {
    const parsed = XLSX.SSF.parse_date_code(cell.v, { date1904 });
    if (parsed?.y) {
      const pad = (value: number) => String(value).padStart(2, "0");
      return { value: `${parsed.y}-${pad(parsed.m)}-${pad(parsed.d)}` };
    }
  }
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const parsed = iso ? new Date(`${iso[0]}T00:00:00Z`) : null;
  if (iso && parsed && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso[0]) return { value: iso[0] };
  return { value: null, error: `Target date "${text}" isn't a date. Use the format YYYY-MM-DD.` };
}

const isYes = (value?: string) => key(value ?? "") === "yes";

function emptyProduct(row: Row): ImportedProduct {
  return {
    row: row.row,
    product_plan_number: row.ref,
    product_name: "",
    product_description: "",
    department_name: "",
    project_name: "",
    project_number: "",
    target_date: null,
    product_information: {
      market_geography: "",
      country_of_origin: "",
      oem_contract_manufacturer: "",
      commercial_clinical: "",
      manufacturing_location: "",
      class_of_device: "",
      basic_udi_di: "",
    },
    custom_fields: [],
    compliance: [],
    languages: [],
    label_components: [],
    issues: [],
  };
}

function readProducts(table: Table, notices: string[], date1904: boolean) {
  const customFieldColumns = table.headers.slice(1).filter(
    (header) => !(key(header) in PRODUCT_FIELDS),
  );
  const products: ImportedProduct[] = [];
  let rowsWithoutRef = 0;

  for (const row of table.rows) {
    if (!row.ref) {
      if (row.cells.size) rowsWithoutRef += 1;
      continue;
    }
    const product = emptyProduct(row);
    const error = (message: string) => product.issues.push({ level: "error", message });
    const warning = (message: string) => product.issues.push({ level: "warning", message });

    for (const [header, field] of Object.entries(PRODUCT_FIELDS) as Array<[string, ProductField]>) {
      const value = row.cells.get(header) ?? "";
      if (field === "target_date") {
        const date = readDate(row.raw.get(header), value, date1904);
        product.target_date = date.value;
        if (date.error) error(date.error);
      } else if (field in product.product_information) {
        product.product_information[field as keyof ImportedProduct["product_information"]] = value;
      } else {
        (product as unknown as Record<string, string>)[field] = value;
      }
    }
    for (const header of customFieldColumns) {
      const value = row.cells.get(key(header));
      if (value) product.custom_fields.push({ label: header, value });
    }

    const info = product.product_information;
    if (!product.product_name) error("Product Name is missing.");
    if (!product.product_description) error("Product Description is missing.");
    if (product.product_plan_number.length > 100) error("Plan number is longer than 100 characters.");
    if (info.country_of_origin) {
      const country = COUNTRY_NAMES.get(key(info.country_of_origin));
      if (country) info.country_of_origin = country.name;
      else error(`Country of Origin "${info.country_of_origin}" isn't in the Uprevit country list.`);
    }
    if (info.commercial_clinical) {
      const value = key(info.commercial_clinical);
      if (value === "commercial" || value === "clinical") {
        info.commercial_clinical = value === "commercial" ? "Commercial" : "Clinical";
      } else {
        error(`Commercial / Clinical must be Commercial or Clinical, not "${info.commercial_clinical}".`);
      }
    }
    if (info.market_geography && !MARKETS.has(key(info.market_geography))) {
      warning(`Market "${info.market_geography}" isn't in the Uprevit list. It will be saved as a custom value.`);
    }
    if (info.class_of_device && !DEVICE_CLASSES.has(key(info.class_of_device))) {
      warning(`Class of Device "${info.class_of_device}" isn't in the Uprevit list. It will be saved as a custom value.`);
    }
    products.push(product);
  }

  if (rowsWithoutRef) {
    notices.push(`${rowsWithoutRef} row${rowsWithoutRef === 1 ? "" : "s"} on Products had data but no plan number and ${rowsWithoutRef === 1 ? "was" : "were"} skipped.`);
  }
  return { products, customFieldColumns };
}

function attachRows(
  sheetName: string,
  table: Table | null,
  products: Map<string, ImportedProduct>,
  notices: string[],
  apply: (product: ImportedProduct, row: Row) => void,
) {
  if (!table) return;
  const seen = new Set<string>();
  const unknown = new Set<string>();
  for (const row of table.rows) {
    if (!row.ref) continue;
    const product = products.get(planKey(row.ref));
    if (!product) {
      if (row.cells.size) unknown.add(row.ref);
      continue;
    }
    if (seen.has(planKey(row.ref))) {
      product.issues.push({ level: "error", message: `Plan number appears more than once on ${sheetName}.` });
      continue;
    }
    seen.add(planKey(row.ref));
    apply(product, row);
  }
  if (unknown.size) {
    const list = [...unknown];
    notices.push(`${sheetName} has rows for plan numbers that aren't on Products, so they were skipped: ${list.slice(0, 5).join(", ")}${list.length > 5 ? ` and ${list.length - 5} more` : ""}.`);
  }
}

function applyStandards(product: ImportedProduct, row: Row, table: Table) {
  const error = (message: string) => product.issues.push({ level: "error", message });
  const names = new Set<string>();
  for (const header of table.headers.slice(1)) {
    const column = key(header);
    const value = row.cells.get(column);
    if (!value || STANDARD_AUTO_COLUMNS.includes(column) || /^(custom standard|description) \d+$/.test(column)) continue;
    const standard = STANDARDS.get(column);
    if (!isYes(value) && key(value) !== "no") {
      error(`Use Yes, No or leave blank under "${header}" on All Standards, not "${value}".`);
    } else if (!standard) {
      if (isYes(value)) error(`"${header}" on All Standards isn't in the Uprevit catalog. Use a Custom Standard column for it.`);
    } else if (isYes(value) && !names.has(column)) {
      names.add(column);
      product.compliance.push({ standard: standard.id, standard_description: standard.description, custom: false });
    }
  }
  const customNumbers = table.headers
    .map((header) => key(header).match(/^custom standard (\d+)$/)?.[1])
    .filter((value): value is string => Boolean(value));
  for (const number of customNumbers) {
    const name = row.cells.get(`custom standard ${number}`) ?? "";
    const description = row.cells.get(`description ${number}`) ?? "";
    if (!name) {
      if (description) error(`Description ${number} on All Standards has no Custom Standard ${number}.`);
      continue;
    }
    if (!description) error(`Custom Standard ${number} "${name}" needs a Description.`);
    if (names.has(key(name)) || STANDARDS.has(key(name))) {
      error(`"${name}" is already a catalog standard. Mark its own column Yes instead.`);
      continue;
    }
    names.add(key(name));
    product.compliance.push({ standard: name, standard_description: description, custom: true });
  }
}

function applyLanguages(product: ImportedProduct, row: Row, table: Table) {
  for (const header of table.headers.slice(1)) {
    const value = row.cells.get(key(header));
    if (!value) continue;
    const language = LANGUAGES.get(key(header));
    if (!isYes(value) && key(value) !== "no") {
      product.issues.push({ level: "error", message: `Use Yes, No or leave blank under "${header}" on Languages, not "${value}".` });
    } else if (isYes(value)) {
      if (language) product.languages.push({ code: language.code, name: language.name, country: language.country });
      else product.issues.push({ level: "error", message: `"${header}" on Languages isn't in the Uprevit language list.` });
    }
  }
  product.languages.sort((a, b) => a.name.localeCompare(b.name));
}

function applyComponents(product: ImportedProduct, row: Row, table: Table) {
  const groups = new Map<number, Partial<Record<keyof ImportComponent, string>>>();
  for (const header of table.headers.slice(1)) {
    const match = key(header).match(/^(.+?) (\d+)$/);
    const field = match && COMPONENT_FIELDS[match[1]];
    if (!field) continue;
    const value = row.cells.get(key(header));
    if (!value) continue;
    const group = groups.get(Number(match[2])) ?? {};
    group[field] = value;
    groups.set(Number(match[2]), group);
  }
  const numbers = new Set<string>();
  for (const [index, group] of [...groups.entries()].sort(([a], [b]) => a - b)) {
    const error = (message: string) => product.issues.push({ level: "error", message: `Component ${index}: ${message}` });
    const number = group.component_number ?? "";
    const type = COMPONENT_TYPES[key(group.component_type ?? "")];
    if (!number) error("Component Number is missing.");
    if (!group.component_type) error("Component Type is missing.");
    else if (!type) error(`Component Type must be Pre-printed, Blank or N/A, not "${group.component_type}".`);
    if (number && numbers.has(key(number))) error(`Component Number ${number} is used more than once.`);
    numbers.add(key(number));
    product.label_components.push({
      component_number: number,
      component_type: type ?? group.component_type ?? "",
      component_description: group.component_description ?? "",
      dimensions: group.dimensions ?? "",
      label_type: (group.label_type ?? "").split(/[;,]/).map((item) => item.trim()).filter(Boolean),
      print_direction: group.print_direction ?? "",
    });
  }
}

export function parseImportWorkbook(buffer: ArrayBuffer): ImportWorkbook {
  if (buffer.byteLength > MAX_IMPORT_FILE_BYTES) throw new Error(`The file is larger than ${MAX_IMPORT_FILE_MB} MB. Split it into smaller files and import them one at a time.`);
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    throw new Error("This file couldn't be read. Save it as an Excel workbook (.xlsx) and try again.");
  }

  const sheets = new Map(workbook.SheetNames.map((name) => [key(name), workbook.Sheets[name]]));
  const productsSheet = sheets.get(SHEETS.products);
  const productsTable = productsSheet ? readTable(productsSheet, "Products") : null;
  if (!productsTable) {
    throw new Error("This file has no Products sheet with a \"Product Ref (Plan Number)\" header. Download the Uprevit import template and fill it in.");
  }

  const notices: string[] = [];
  const { products, customFieldColumns } = readProducts(productsTable, notices, !!workbook.Workbook?.WBProps?.date1904);
  if (!products.length) throw new Error("The Products sheet has no products. Add at least one row with a plan number.");
  if (products.length > MAX_IMPORT_PRODUCTS) {
    throw new Error(`The file has ${products.length} products. Import at most ${MAX_IMPORT_PRODUCTS} at a time by splitting it into smaller files.`);
  }

  const byRef = new Map<string, ImportedProduct>();
  const counts = new Map<string, number>();
  products.forEach((product) => counts.set(planKey(product.product_plan_number), (counts.get(planKey(product.product_plan_number)) ?? 0) + 1));
  for (const product of products) {
    if ((counts.get(planKey(product.product_plan_number)) ?? 0) > 1) {
      product.issues.push({ level: "error", message: "This plan number is used by more than one product in the file." });
    }
    if (!byRef.has(planKey(product.product_plan_number))) byRef.set(planKey(product.product_plan_number), product);
  }

  const table = (name: string, label: string) => {
    const sheet = sheets.get(name);
    if (!sheet) return null;
    const result = readTable(sheet, label);
    if (!result) {
      throw new Error(`The ${label} sheet has no "Product Ref (Plan Number)" header in column A. Restore the header from the template, or delete the sheet, and upload the file again.`);
    }
    return result;
  };
  const standards = table(SHEETS.standards, "All Standards");
  const languages = table(SHEETS.languages, "Languages");
  const components = table(SHEETS.components, "Label Components");
  attachRows("All Standards", standards, byRef, notices, (product, row) => applyStandards(product, row, standards!));
  attachRows("Languages", languages, byRef, notices, (product, row) => applyLanguages(product, row, languages!));
  attachRows("Label Components", components, byRef, notices, (product, row) => applyComponents(product, row, components!));

  const known = new Set([...Object.values(SHEETS), ...IGNORED_SHEETS]);
  const skipped = workbook.SheetNames.filter((name) => !known.has(key(name)));
  if (skipped.length) notices.push(`These sheets aren't part of the template and were skipped: ${skipped.join(", ")}.`);
  for (const [name, label] of [[SHEETS.standards, "All Standards"], [SHEETS.languages, "Languages"], [SHEETS.components, "Label Components"]]) {
    if (!sheets.has(name)) notices.push(`The file has no ${label} sheet, so products get no ${label.toLowerCase()}.`);
  }

  return { products, customFieldColumns, notices };
}
