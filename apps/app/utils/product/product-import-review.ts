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

const nameKey = (department: string, project: string) =>
  `${planKey(department)}\n${planKey(project)}`;

export function buildImportRows(
  products: ImportedProduct[],
  check: ImportCheckResult,
  assignments: Map<string, ImportProjectChoice>,
  excluded: Set<string>,
): ImportRow[] {
  const existingPlans = new Set(check.existing_plan_numbers.map(planKey));
  const takenNumbers = new Map(
    check.taken_project_numbers.map((item) => [item.project_number.trim(), item.project_name]),
  );
  const destinations = new Map(
    check.destinations.map((item) => [nameKey(item.department_name, item.project_name), item]),
  );

  const numbersByProject = new Map<string, Set<string>>();
  for (const product of products) {
    const projectKey = nameKey(product.department_name, product.project_name);
    if (assignments.has(planKey(product.product_plan_number)) || excluded.has(planKey(product.product_plan_number))) continue;
    if (!product.department_name || !product.project_name || destinations.get(projectKey)?.project || destinations.get(projectKey)?.ambiguous) continue;
    const numbers = numbersByProject.get(projectKey) ?? new Set<string>();
    if (product.project_number) numbers.add(product.project_number);
    numbersByProject.set(projectKey, numbers);
  }
  const projectsByNumber = new Map<string, number>();
  numbersByProject.forEach((numbers) => numbers.forEach((number) => projectsByNumber.set(number, (projectsByNumber.get(number) ?? 0) + 1)));

  return products.map((product) => {
    const key = planKey(product.product_plan_number);
    const issues = [...product.issues];
    const error = (message: string) => issues.push({ level: "error", message });
    if (existingPlans.has(key)) error("A product with this plan number already exists in your workspace.");

    const assigned = assignments.get(key);
    const fromFile = destinations.get(nameKey(product.department_name, product.project_name));
    let destination: ImportDestination;
    if (assigned) {
      destination = { kind: "existing", label: assigned.project_name, departmentLabel: "", createsDepartment: false, project: assigned };
    } else if (product.department_name && product.project_name && fromFile?.project) {
      destination = { kind: "existing", label: fromFile.project.project_name, departmentLabel: product.department_name, createsDepartment: false, project: fromFile.project };
    } else if (product.department_name && product.project_name && fromFile?.ambiguous) {
      destination = { kind: "none", label: "", departmentLabel: product.department_name, createsDepartment: false };
      issues.push({ level: "warning", message: `Your workspace has more than one department named "${product.department_name}" or project named "${product.project_name}", so the file can't say which one. Assign the right project here.` });
    } else if (product.department_name && product.project_name) {
      const numbers = [...(numbersByProject.get(nameKey(product.department_name, product.project_name)) ?? [])];
      const number = numbers.length === 1 ? numbers[0] : "";
      destination = { kind: "new", label: product.project_name, departmentLabel: product.department_name, createsDepartment: !fromFile?.department_exists, projectNumber: number };
      if (!numbers.length) error(`Add a Project Number to create the new project "${product.project_name}", or assign an existing project.`);
      else if (numbers.length > 1) error(`Rows for the new project "${product.project_name}" give different Project Numbers (${numbers.join(", ")}). Use one number.`);
      else if (takenNumbers.has(number)) error(`Project number ${number} is already used by project "${takenNumbers.get(number)}". Use another number, or that project's name.`);
      else if ((projectsByNumber.get(number) ?? 0) > 1) error(`Project number ${number} is used for more than one new project in the file.`);
    } else {
      destination = { kind: "none", label: "", departmentLabel: product.department_name, createsDepartment: false };
      if (product.project_name) {
        issues.push({ level: "warning", message: `Project "${product.project_name}" has no Department in the file, so it can't be matched. Assign a project here, or add the Department and upload the file again.` });
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
    ...(destination.project
      ? { project_id: destination.project._id }
      : {
          new_project: {
            department_name: product.department_name,
            project_name: product.project_name,
            project_number: destination.projectNumber ?? product.project_number,
          },
        }),
    product_information: product.product_information,
    custom_fields: product.custom_fields.filter((field) => !excludedColumns.has(field.label)),
    compliance: product.compliance.map(({ standard, standard_description }) => ({ standard, standard_description })),
    languages: product.languages,
    label_components: product.label_components,
  };
}

export function importCheckInput(products: ImportedProduct[]) {
  const destinations = new Map<string, { department_name: string; project_name: string }>();
  for (const product of products) {
    if (product.department_name && product.project_name) {
      destinations.set(nameKey(product.department_name, product.project_name), {
        department_name: product.department_name,
        project_name: product.project_name,
      });
    }
  }
  return {
    plan_numbers: products.map((product) => product.product_plan_number),
    project_numbers: [...new Set(products.map((product) => product.project_number).filter(Boolean))],
    destinations: [...destinations.values()],
  };
}
