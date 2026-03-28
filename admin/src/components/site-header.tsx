import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, Bell } from "@hugeicons/core-free-icons";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/products/add": "Add Product",
  "/categories": "Categories",
  "/orders": "Orders",
  "/customers": "Customers",
  "/team": "Team",
  "/settings": "Settings",
};

export function SiteHeader() {
  const location = useLocation();
  let title = PAGE_TITLES[location.pathname] || "Dashboard";
  if (location.pathname.startsWith("/products/edit/")) {
    title = "Edit Product";
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <HugeiconsIcon icon={Search02Icon} size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="h-8 w-48 pl-8 lg:w-64" />
          </div>
          <Button variant="outline" size="icon" className="relative size-8">
            <HugeiconsIcon icon={Bell} size={14} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
