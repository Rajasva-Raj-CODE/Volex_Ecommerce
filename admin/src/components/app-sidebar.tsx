import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardBrowsingIcon,
  Package01Icon,
  FolderIcon,
  ShoppingBag01Icon,
  UserIcon,
  UserSettings01Icon,
  Settings01Icon,
  MoreVerticalIcon,
  Logout01Icon,
  PercentCircleIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Role } from "@/lib/types";
import { getRoleLabel } from "@/lib/roles";

const NAV_ITEMS: { title: string; url: string; icon: typeof DashboardBrowsingIcon; roles: Role[] }[] = [
  { title: "Dashboard", url: "/", icon: DashboardBrowsingIcon, roles: ["ADMIN", "STAFF"] },
  { title: "Products", url: "/products", icon: Package01Icon, roles: ["ADMIN", "STAFF"] },
  { title: "Categories", url: "/categories", icon: FolderIcon, roles: ["ADMIN", "STAFF"] },
  { title: "Orders", url: "/orders", icon: ShoppingBag01Icon, roles: ["ADMIN"] },
  { title: "Coupons", url: "/coupons", icon: PercentCircleIcon, roles: ["ADMIN"] },
  { title: "Reviews", url: "/reviews", icon: StarIcon, roles: ["ADMIN"] },
  { title: "Customers", url: "/customers", icon: UserIcon, roles: ["ADMIN"] },
  { title: "Team", url: "/team", icon: UserSettings01Icon, roles: ["ADMIN"] },
  { title: "Settings", url: "/settings", icon: Settings01Icon, roles: ["ADMIN"] },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const { isMobile } = useSidebar();
  const displayName = user?.name ?? user?.email ?? "Unknown user";
  const avatarInitial = (user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? "U").toUpperCase();

  const visibleItems = NAV_ITEMS.filter((item) => hasRole(item.roles));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<NavLink to="/" />}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-black">V</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">VolteX</span>
                <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    render={<NavLink to={item.url} />}
                  >
                    <HugeiconsIcon icon={Icon} size={20} color="currentColor" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8">
                        <AvatarFallback>{avatarInitial}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user ? getRoleLabel(user.role) : "Unknown"}
                        </span>
                      </div>
                      <HugeiconsIcon icon={MoreVerticalIcon} className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-8">
                        <AvatarFallback>{avatarInitial}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Badge variant="secondary" className="mx-2 mb-1">
                    {user ? getRoleLabel(user.role) : "Unknown"}
                  </Badge>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} variant="destructive">
                  <HugeiconsIcon icon={Logout01Icon} size={18} color="currentColor" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
