import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search02Icon,
  Bell,
  ShoppingCart01Icon,
  Package01Icon,
  UserGroupIcon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Settings01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    title: "New order received",
    desc: "ORD-1285 — Amit Patel placed an order for ₹69,999",
    time: "2 min ago",
    read: false,
    icon: ShoppingCart01Icon,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    type: "order",
    title: "Order shipped",
    desc: "ORD-1283 — Sneha Reddy's order has been dispatched",
    time: "18 min ago",
    read: false,
    icon: ShoppingCart01Icon,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 3,
    type: "product",
    title: "Low stock alert",
    desc: "Canon EOS R50 is running low — only 5 units left",
    time: "1 hr ago",
    read: false,
    icon: Package01Icon,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: 4,
    type: "customer",
    title: "New customer registered",
    desc: "Rahul Verma signed up from Pune",
    time: "3 hr ago",
    read: true,
    icon: UserGroupIcon,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: 5,
    type: "order",
    title: "Order delivered",
    desc: "ORD-1280 — Vikram Shah's order was delivered",
    time: "5 hr ago",
    read: true,
    icon: CheckmarkCircle02Icon,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: 6,
    type: "system",
    title: "Payment failed",
    desc: "ORD-1281 — Meera Iyer's payment of ₹89,990 failed",
    time: "Yesterday",
    read: true,
    icon: AlertCircleIcon,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 7,
    type: "product",
    title: "Product out of stock",
    desc: "Samsung Galaxy S24+ is now out of stock",
    time: "Yesterday",
    read: true,
    icon: Package01Icon,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 8,
    type: "system",
    title: "System update",
    desc: "Admin panel was updated to v2.1.0 successfully",
    time: "2 days ago",
    read: true,
    icon: Settings01Icon,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
  },
];

const FILTER_TABS = ["All", "Orders", "Products", "Customers", "System"];

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
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  let title = PAGE_TITLES[location.pathname] || "Dashboard";
  if (location.pathname.startsWith("/products/edit/")) {
    title = "Edit Product";
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true;
    return n.type === activeTab.toLowerCase().replace("customers", "customer");
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="relative size-8" />
              }
            >
              <HugeiconsIcon icon={Bell} size={14} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </SheetTrigger>

            <SheetContent
              side="right"
              showCloseButton={false}
              className="flex flex-col gap-0 p-0 sm:max-w-[50vw]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon icon={Bell} size={16} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">Notifications</h2>
                    <p className="text-xs text-muted-foreground">
                      {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllRead}
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 border-b px-4 py-2.5 overflow-x-auto">
                {FILTER_TABS.map((tab) => {
                  const tabType = tab.toLowerCase().replace("customers", "customer");
                  const count =
                    tab === "All"
                      ? notifications.filter((n) => !n.read).length
                      : notifications.filter((n) => n.type === tabType && !n.read).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {tab}
                      {count > 0 && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${activeTab === tab ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Notification list */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <HugeiconsIcon icon={Bell} size={20} />
                    </div>
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filtered.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        className={`group relative flex items-start gap-3.5 px-5 py-4 cursor-pointer transition-colors hover:bg-muted/40 ${
                          !notif.read ? "bg-primary/[0.03]" : ""
                        }`}
                      >
                        {/* Unread dot */}
                        {!notif.read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                        )}

                        {/* Icon */}
                        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notif.iconBg}`}>
                          <HugeiconsIcon icon={notif.icon} size={17} className={notif.iconColor} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm leading-snug ${!notif.read ? "font-semibold" : "font-medium"}`}>
                              {notif.title}
                            </p>
                            <span className="shrink-0 text-[11px] text-muted-foreground mt-0.5">{notif.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.desc}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge
                              className={`text-[10px] border-0 px-1.5 py-0.5 h-auto font-medium capitalize ${
                                notif.type === "order" ? "bg-blue-100 text-blue-700" :
                                notif.type === "product" ? "bg-amber-100 text-amber-700" :
                                notif.type === "customer" ? "bg-emerald-100 text-emerald-700" :
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {notif.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Dismiss button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                          className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t px-5 py-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{notifications.length} total notifications</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotifications([])}
                  className="h-7 text-xs text-muted-foreground hover:text-red-600"
                >
                  Clear all
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
