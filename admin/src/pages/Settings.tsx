import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const NOTIFICATIONS = [
  { label: "New order alerts", desc: "Get notified for every new order", defaultOn: true },
  { label: "Low stock alerts", desc: "Alert when product stock falls below 10", defaultOn: true },
  { label: "Customer sign-up alerts", desc: "Notify when new customers register", defaultOn: false },
];

export default function Settings() {
  const [notifications, setNotifications] = useState(
    NOTIFICATIONS.map((n) => n.defaultOn)
  );

  const toggleNotification = (index: number) => {
    setNotifications((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage store configuration</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="VolteX Electronics" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" defaultValue="support@voltex.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue="+91 1800-572-7662" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="INR (₹)" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {NOTIFICATIONS.map((item, i) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[i]}
                    onCheckedChange={() => toggleNotification(i)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
