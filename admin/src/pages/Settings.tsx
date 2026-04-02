import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings01Icon,
  UserSettings01Icon,
  Bell,
  ShieldIcon,
  SaveIcon,
  Sun03Icon,
  LanguageCircleIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SETTINGS_SECTIONS = [
  { id: "store-info", title: "General Settings", description: "Basic store configuration", icon: Settings01Icon, color: "text-blue-500 bg-blue-50" },
  { id: "notifications", title: "Notifications", description: "Manage notification preferences", icon: Bell, color: "text-amber-500 bg-amber-50" },
  { id: "security", title: "Security", description: "Password and authentication", icon: ShieldIcon, color: "text-emerald-500 bg-emerald-50" },
  { id: "appearance", title: "Appearance", description: "Theme and display settings", icon: Sun03Icon, color: "text-pink-500 bg-pink-50" },
  { id: "regional", title: "Regional", description: "Language and currency", icon: LanguageCircleIcon, color: "text-cyan-500 bg-cyan-50" },
];

export default function Settings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={Settings01Icon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your store settings</p>
          </div>
        </div>
      </div>

      {/* Section navigation cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {SETTINGS_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group relative overflow-hidden rounded-xl border bg-card p-5 text-left hover:border-primary/50 hover:shadow-md transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${section.color} mb-3`}>
                <HugeiconsIcon icon={section.icon} size={20} />
              </div>
              <h3 className="font-semibold text-sm mb-0.5">{section.title}</h3>
              <p className="text-xs text-muted-foreground">{section.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Store Information */}
      <div id="store-info" className="rounded-xl border bg-card scroll-mt-6">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <HugeiconsIcon icon={UserSettings01Icon} size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-semibold">Store Information</h2>
              <p className="text-sm text-muted-foreground">Update your store details</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" defaultValue="VolteX Store" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">Contact Email</Label>
              <Input id="store-email" type="email" defaultValue="contact@voltex.com" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-phone">Phone Number</Label>
              <Input id="store-phone" type="tel" defaultValue="+91 98765 43210" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-address">Store Address</Label>
              <Input id="store-address" defaultValue="Mumbai, Maharashtra" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-gst">GST Number</Label>
              <Input id="store-gst" defaultValue="27AAACV1234F1ZS" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-website">Website</Label>
              <Input id="store-website" defaultValue="www.voltex.com" className="h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div id="notifications" className="rounded-xl border bg-card scroll-mt-6">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <HugeiconsIcon icon={Bell} size={20} className="text-amber-500" />
            </div>
            <div>
              <h2 className="font-semibold">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">Choose what notifications you receive</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { icon: ShieldIcon, color: "bg-emerald-50 text-emerald-500", title: "Order Notifications", desc: "Get notified about new orders", defaultOn: true },
            { icon: UserSettings01Icon, color: "bg-purple-50 text-purple-500", title: "Customer Updates", desc: "New customer registrations", defaultOn: true },
            { icon: ShieldIcon, color: "bg-red-50 text-red-500", title: "Security Alerts", desc: "Important security notifications", defaultOn: true },
            { icon: Bell, color: "bg-blue-50 text-blue-500", title: "Marketing Emails", desc: "Promotions and newsletters", defaultOn: false },
            { icon: Settings01Icon, color: "bg-orange-50 text-orange-500", title: "Inventory Alerts", desc: "Low stock and out of stock alerts", defaultOn: true },
            { icon: Bell, color: "bg-indigo-50 text-indigo-500", title: "Payment Updates", desc: "Transaction and payment confirmations", defaultOn: true },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}>
                  <HugeiconsIcon icon={item.icon} size={14} />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <Switch defaultChecked={item.defaultOn} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div id="security" className="rounded-xl border bg-card scroll-mt-6">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <HugeiconsIcon icon={ShieldIcon} size={20} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">Manage your password and account security</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Change Password</h3>
            <div className="grid gap-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <HugeiconsIcon icon={showCurrent ? ViewOffIcon : ViewIcon} size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <HugeiconsIcon icon={showNew ? ViewOffIcon : ViewIcon} size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <HugeiconsIcon icon={showConfirm ? ViewOffIcon : ViewIcon} size={16} />
                  </button>
                </div>
              </div>
              <Button variant="outline" className="w-fit">Update Password</Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between max-w-md rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Authenticator App</p>
                <p className="text-xs text-muted-foreground">Use an app like Google Authenticator</p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium mb-4">Active Sessions</h3>
            <div className="space-y-3 max-w-md">
              {[
                { device: "MacBook Pro", location: "Mumbai, India", time: "Current session", current: true },
                { device: "iPhone 16 Pro", location: "Mumbai, India", time: "2 hours ago", current: false },
                { device: "Chrome on Windows", location: "Delhi, India", time: "3 days ago", current: false },
              ].map((session) => (
                <div key={session.device} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{session.device}</p>
                    <p className="text-xs text-muted-foreground">{session.location} · {session.time}</p>
                  </div>
                  {session.current ? (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">Revoke</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div id="appearance" className="rounded-xl border bg-card scroll-mt-6">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
              <HugeiconsIcon icon={Sun03Icon} size={20} className="text-pink-500" />
            </div>
            <div>
              <h2 className="font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize the look and feel</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3 max-w-sm">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`relative rounded-lg border-2 p-3 text-left transition-all ${
                    theme === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`mb-2 h-10 rounded-md ${t === "light" ? "bg-white border" : t === "dark" ? "bg-zinc-900" : "bg-gradient-to-r from-white to-zinc-900 border"}`} />
                  <p className="text-xs font-medium capitalize">{t}</p>
                  {theme === t && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium mb-3">Sidebar</h3>
            <div className="space-y-3 max-w-sm">
              {[
                { label: "Compact sidebar", desc: "Show only icons in sidebar" },
                { label: "Show section labels", desc: "Display labels for sidebar groups" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium mb-3">Density</h3>
            <div className="grid grid-cols-3 gap-3 max-w-sm">
              {["Compact", "Default", "Comfortable"].map((d) => (
                <button
                  key={d}
                  className={`rounded-lg border p-3 text-xs font-medium transition-all hover:border-primary/40 ${d === "Default" ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional */}
      <div id="regional" className="rounded-xl border bg-card scroll-mt-6">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
              <HugeiconsIcon icon={LanguageCircleIcon} size={20} className="text-cyan-500" />
            </div>
            <div>
              <h2 className="font-semibold">Regional Settings</h2>
              <p className="text-sm text-muted-foreground">Language, currency, and timezone</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="gu">Gujarati</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="inr">
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">INR (₹) — Indian Rupee</SelectItem>
                  <SelectItem value="usd">USD ($) — US Dollar</SelectItem>
                  <SelectItem value="eur">EUR (€) — Euro</SelectItem>
                  <SelectItem value="gbp">GBP (£) — British Pound</SelectItem>
                  <SelectItem value="aed">AED — UAE Dirham</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select defaultValue="ist">
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ist">IST (UTC+5:30) — India</SelectItem>
                  <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                  <SelectItem value="est">EST (UTC-5) — New York</SelectItem>
                  <SelectItem value="pst">PST (UTC-8) — Los Angeles</SelectItem>
                  <SelectItem value="gmt">GMT (UTC+0) — London</SelectItem>
                  <SelectItem value="gst">GST (UTC+4) — Dubai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select defaultValue="dd-mm-yyyy">
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  <SelectItem value="dd-mon-yyyy">DD MMM YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button className="gap-2">
          <HugeiconsIcon icon={SaveIcon} size={16} />
          Save Changes
        </Button>
      </div>
    </>
  );
}
