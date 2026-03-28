import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, UserSettings01Icon, Bell, ShieldIcon, SaveIcon, FolderOpenIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SETTINGS_SECTIONS = [
  {
    id: "general",
    title: "General Settings",
    description: "Basic store configuration",
    icon: Settings01Icon,
    color: "text-blue-500 bg-blue-50",
  },
  {
    id: "profile",
    title: "Store Profile",
    description: "Your store information",
    icon: UserSettings01Icon,
    color: "text-purple-500 bg-purple-50",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage notification preferences",
    icon: Bell,
    color: "text-amber-500 bg-amber-50",
  },
  {
    id: "security",
    title: "Security",
    description: "Password and authentication",
    icon: ShieldIcon,
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Theme and display settings",
    icon: FolderOpenIcon,
    color: "text-pink-500 bg-pink-50",
  },
  {
    id: "regional",
    title: "Regional",
    description: "Language and currency",
    icon: Settings01Icon,
    color: "text-cyan-500 bg-cyan-50",
  },
];

export default function Settings() {
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SETTINGS_SECTIONS.map((section) => (
          <div
            key={section.id}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${section.color} mb-4`}>
                <HugeiconsIcon icon={section.icon} size={24} />
              </div>
              <h3 className="font-semibold mb-1">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card">
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
              <Label htmlFor="store-currency">Currency</Label>
              <Input id="store-currency" defaultValue="INR (₹)" className="h-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <HugeiconsIcon icon={ShieldIcon} size={14} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Order Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about new orders</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                <HugeiconsIcon icon={UserSettings01Icon} size={14} className="text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Customer Updates</p>
                <p className="text-xs text-muted-foreground">New customer registrations</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                <HugeiconsIcon icon={ShieldIcon} size={14} className="text-red-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Security Alerts</p>
                <p className="text-xs text-muted-foreground">Important security notifications</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <HugeiconsIcon icon={Bell} size={14} className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Marketing Emails</p>
                <p className="text-xs text-muted-foreground">Promotions and newsletters</p>
              </div>
            </div>
            <Switch />
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
