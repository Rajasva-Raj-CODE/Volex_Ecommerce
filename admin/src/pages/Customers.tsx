import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const MOCK_CUSTOMERS = [
  { id: "1", name: "Amit Patel", email: "amit@email.com", orders: 12, spent: 245000, joined: "Jan 2025", status: "Active" },
  { id: "2", name: "Sneha Reddy", email: "sneha@email.com", orders: 8, spent: 189000, joined: "Feb 2025", status: "Active" },
  { id: "3", name: "Rohit Singh", email: "rohit@email.com", orders: 15, spent: 312000, joined: "Nov 2024", status: "Active" },
  { id: "4", name: "Meera Iyer", email: "meera@email.com", orders: 3, spent: 92000, joined: "Mar 2026", status: "Active" },
  { id: "5", name: "Vikram Shah", email: "vikram@email.com", orders: 6, spent: 156000, joined: "Dec 2024", status: "Inactive" },
  { id: "6", name: "Kavita Nair", email: "kavita@email.com", orders: 9, spent: 201000, joined: "Jan 2025", status: "Active" },
];

export default function Customers() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground">{MOCK_CUSTOMERS.length} customers</p>
      </div>

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CUSTOMERS.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.joined}</TableCell>
                <TableCell className="text-muted-foreground">{c.orders}</TableCell>
                <TableCell className="font-semibold">₹{c.spent.toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <Badge variant={c.status === "Active" ? "outline" : "secondary"}>
                    {c.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
