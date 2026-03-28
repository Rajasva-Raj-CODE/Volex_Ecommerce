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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-black tracking-tight">
          Volte<span className="text-primary">X</span>
        </span>
        <Badge variant="secondary" className="ml-2 text-[10px]">
          ADMIN
        </Badge>
      </div>

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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

      <Separator />

      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user?.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.role === "super_admin" ? "Super Admin" : "Product Manager"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
