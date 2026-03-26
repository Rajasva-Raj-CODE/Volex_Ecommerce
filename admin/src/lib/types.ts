export type Role = "super_admin" | "product_manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: Role[];
}
