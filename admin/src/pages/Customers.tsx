import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon, UserGroupIcon, Mail02Icon, Location01Icon, UserIcon, Calendar02Icon, ArrowDown01Icon, HashtagIcon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_CUSTOMERS = [
  { id: "C001", name: "Amit Patel", email: "amit@email.com", phone: "+91 98765 43210", location: "Mumbai", orders: 5, totalSpend: 125000, status: "Active", joined: "15 Jan 2026", gender: "Male" },
  { id: "C002", name: "Sneha Reddy", email: "sneha@email.com", phone: "+91 87654 32109", location: "Hyderabad", orders: 3, totalSpend: 75000, status: "Active", joined: "20 Jan 2026", gender: "Female" },
  { id: "C003", name: "Rohit Singh", email: "rohit@email.com", phone: "+91 76543 21098", location: "Delhi", orders: 8, totalSpend: 200000, status: "VIP", joined: "05 Jan 2026", gender: "Male" },
  { id: "C004", name: "Meera Iyer", email: "meera@email.com", phone: "+91 65432 10987", location: "Chennai", orders: 2, totalSpend: 45000, status: "Active", joined: "25 Jan 2026", gender: "Female" },
  { id: "C005", name: "Vikram Shah", email: "vikram@email.com", phone: "+91 54321 09876", location: "Ahmedabad", orders: 4, totalSpend: 95000, status: "Active", joined: "18 Jan 2026", gender: "Male" },
  { id: "C006", name: "Kavita Nair", email: "kavita@email.com", phone: "+91 43210 98765", location: "Kochi", orders: 6, totalSpend: 150000, status: "VIP", joined: "10 Jan 2026", gender: "Female" },
  { id: "C007", name: "Arjun Das", email: "arjun@email.com", phone: "+91 32109 87654", location: "Kolkata", orders: 1, totalSpend: 22000, status: "Inactive", joined: "28 Jan 2026", gender: "Male" },
  { id: "C008", name: "Pooja Gupta", email: "pooja@email.com", phone: "+91 21098 76543", location: "Jaipur", orders: 3, totalSpend: 65000, status: "Active", joined: "22 Jan 2026", gender: "Female" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-700" },
  VIP: { bg: "bg-purple-50", text: "text-purple-700" },
  Inactive: { bg: "bg-gray-100", text: "text-gray-500" },
};

const GENDER_COLORS: Record<string, string> = {
  Male: "bg-blue-100 text-blue-700",
  Female: "bg-pink-100 text-pink-700",
};

export default function Customers() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={UserGroupIcon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Customers</h1>
            <p className="text-sm text-muted-foreground">{MOCK_CUSTOMERS.length} customers</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon icon={Search02Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9 h-9" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserIcon} size={14} className="text-blue-600 hidden sm:flex" />
                  <span>Customer</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Mail02Icon} size={14} className="text-purple-600 hidden sm:flex" />
                  <span>Contact</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} size={14} className="text-rose-600 hidden sm:flex" />
                  <span>Location</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={HashtagIcon} size={14} className="text-amber-600 hidden sm:flex" />
                  <span>Orders</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-emerald-600 hidden sm:flex" />
                  <span>Total Spend</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Calendar02Icon} size={14} className="text-indigo-600 hidden sm:flex" />
                  <span>Joined</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserGroupIcon} size={14} className="text-cyan-600 hidden sm:flex" />
                  <span>Status</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CUSTOMERS.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-medium">
                        {customer.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-xs flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={Mail02Icon} size={12} />
                      {customer.email}
                    </p>
                    <p className="text-xs flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={Location01Icon} size={12} />
                      {customer.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <HugeiconsIcon icon={Location01Icon} size={14} />
                    {customer.location}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">{customer.orders}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">₹{customer.totalSpend.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-muted-foreground">{customer.joined}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={`${GENDER_COLORS[customer.gender] || "bg-gray-100 text-gray-700"} text-[10px] font-medium border-0`}>
                      {customer.gender}
                    </Badge>
                    <Badge className={`${STATUS_STYLES[customer.status]?.bg} ${STATUS_STYLES[customer.status]?.text} text-[10px] font-medium border-0`}>
                      {customer.status}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
