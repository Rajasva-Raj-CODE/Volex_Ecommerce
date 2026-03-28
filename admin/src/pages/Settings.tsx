import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage store configuration</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Update your store details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="VolteX Electronics" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" defaultValue="support@voltex.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+91 1800-572-7662" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="INR (₹)" disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {NOTIFICATIONS.map((item, i) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[i]}
                onCheckedChange={() => toggleNotification(i)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reset all store data including products, orders, and customer information.
          </p>
        </CardContent>
        <CardFooter className="border-t">
          <Button variant="destructive" size="sm">Reset Store Data</Button>
        </CardFooter>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </>
  );
}
