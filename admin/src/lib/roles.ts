import type { Role } from "./types";

export function getRoleLabel(role: Role) {
  return role === "ADMIN" ? "Admin" : "Staff";
}
