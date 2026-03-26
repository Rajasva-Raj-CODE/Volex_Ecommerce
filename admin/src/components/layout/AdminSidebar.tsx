import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/types";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  products: Package,
  categories: FolderTree,
  orders: ShoppingCart,
  customers: Users,
  team: UserCog,
  settings: Settings,
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: "dashboard", roles: ["super_admin", "product_manager"] },
  { label: "Products", path: "/products", icon: "products", roles: ["super_admin", "product_manager"] },
  { label: "Categories", path: "/categories", icon: "categories", roles: ["super_admin", "product_manager"] },
  { label: "Orders", path: "/orders", icon: "orders", roles: ["super_admin"] },
  { label: "Customers", path: "/customers", icon: "customers", roles: ["super_admin"] },
  { label: "Team", path: "/team", icon: "team", roles: ["super_admin"] },
  { label: "Settings", path: "/settings", icon: "settings", roles: ["super_admin"] },
];

export default function AdminSidebar() {
  const { user, logout, hasRole } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) => hasRole(item.roles));

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/10 bg-[#0a0a0a]">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <span className="text-xl font-black tracking-tight text-white">
          Volte<span className="text-[#49A5A2]">X</span>
        </span>
        <span className="ml-2 rounded-md bg-[#49A5A2]/10 px-2 py-0.5 text-[10px] font-bold text-[#49A5A2]">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {visibleItems.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#49A5A2]/10 text-[#49A5A2]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#49A5A2]/20 text-sm font-bold text-[#49A5A2]">
            {user?.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name}
            </p>
            <p className="truncate text-xs text-white/40">
              {user?.role === "super_admin" ? "Super Admin" : "Product Manager"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-red-400"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
