import type { ImportProductPayload } from "@/hooks/product/useImportProducts";
import type {
  ImportCheckResult,
  ImportDestination,
  ImportedProduct,
  ImportIssue,
  ImportProjectChoice,
  ImportRowStatus,
} from "@/types/product-import";

export interface ImportRow {
  product: ImportedProduct;
  issues: ImportIssue[];
  destination: ImportDestination;
  status: ImportRowStatus;
}

export const planKey = (value: string) => value.trim().toLowerCase();

export function buildImportRows(
  products: ImportedProduct[],
  check: ImportCheckResult,
  assignments: Map<string, ImportProjectChoice>,
  excluded: Set<string>,
): ImportRow[] {
  const existingPlans = new Set(check.existing_plan_numbers.map(planKey));
  const matches = new Map(check.projects.map((item) => [planKey(item.value), item]));

  return products.map((product) => {
    const key = planKey(product.product_plan_number);
    const issues = [...product.issues];
    const error = (message: string) => issues.push({ level: "error", message });
    if (existingPlans.has(key)) error("A product with this plan number already exists in your workspace.");

    const assigned = assignments.get(key);
    const match = matches.get(planKey(product.project));
    let destination: ImportDestination;
    if (assigned) {
      destination = { kind: "existing", label: assigned.project_name, departmentLabel: "", project: assigned };
    } else if (product.project && match?.project) {
      destination = { kind: "existing", label: match.project.project_name, departmentLabel: match.project.department_name, project: match.project };
    } else {
      destination = { kind: "none", label: "", departmentLabel: "" };
      if (product.project && match?.ambiguous) {
        issues.push({ level: "warning", message: `More than one project in your workspace is named "${product.project}". Assign the right project here, or use its project number in the file.` });
      } else if (product.project) {
        error(`Project "${product.project}" isn't in your workspace. The import doesn't create projects. Assign an existing project here, or create the project in Uprevit and upload the file again.`);
      }
    }

    const status: ImportRowStatus = excluded.has(key)
      ? "excluded"
      : issues.some((issue) => issue.level === "error")
        ? "error"
        : destination.kind === "none"
          ? "needs-project"
          : "ready";
    return { product, issues, destination, status };
  });
}

export function toImportPayload(row: ImportRow, excludedColumns: Set<string>): ImportProductPayload {
  const { product, destination } = row;
  return {
    product_plan_number: product.product_plan_number,
    product_name: product.product_name,
    product_description: product.product_description,
    target_date: product.target_date,
    project_id: destination.project?._id ?? "",
    product_information: product.product_information,
    custom_fields: product.custom_fields.filter((field) => !excludedColumns.has(field.label)),
    compliance: product.compliance.map(({ standard, standard_description }) => ({ standard, standard_description })),
    languages: product.languages,
    label_components: product.label_components,
  };
}

export function importCheckInput(products: ImportedProduct[]) {
  return {
    plan_numbers: products.map((product) => product.product_plan_number),
    projects: [...new Map(products.filter((product) => product.project).map((product) => [planKey(product.project), product.project])).values()],
  };
}
