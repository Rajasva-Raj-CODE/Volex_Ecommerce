export type Role = "ADMIN" | "STAFF";

export interface User {
  id: string;
  name: string | null;
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
