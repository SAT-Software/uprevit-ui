export interface Project {
  _id?: string;
  project_name: string;
  project_number: string;
  project_description: string;
  image?: string;
  project_manager: string;
  department_id: string;
  admin_id: string;
  workspace_id: string;
  users?: string[];
  isArchived?: boolean | null;
  actionBy?: string;
  actionAt?: Date;
  actionType?: string;
}
