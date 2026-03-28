import { HugeiconsIcon } from "@hugeicons/react";
import { Add02Icon, MoreVerticalIcon, UserGroupIcon, Edit02Icon, Trash, UserIcon, ShieldIcon, ClockIcon, UserAccountIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const MOCK_TEAM = [
  { id: "1", name: "Rajesh Kumar", email: "admin@voltex.com", role: "Super Admin", status: "Active", lastActive: "Just now", avatar: "RK" },
  { id: "2", name: "Priya Sharma", email: "pm@voltex.com", role: "Product Manager", status: "Active", lastActive: "2 hours ago", avatar: "PS" },
  { id: "3", name: "Ankit Verma", email: "ankit@voltex.com", role: "Product Manager", status: "Active", lastActive: "1 day ago", avatar: "AV" },
  { id: "4", name: "Divya Menon", email: "divya@voltex.com", role: "Super Admin", status: "Invited", lastActive: "—", avatar: "DM" },
];

const ROLE_STYLES: Record<string, { className: string }> = {
  "Super Admin": { className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  "Product Manager": { className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
};

const STATUS_STYLES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  Active: { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" },
  Invited: { variant: "secondary", className: "bg-amber-50 text-amber-700 hover:bg-amber-50" },
};

export default function Team() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={UserGroupIcon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Team</h1>
            <p className="text-sm text-muted-foreground">{MOCK_TEAM.length} team members</p>
          </div>
        </div>
        <Button className="gap-2">
          <HugeiconsIcon icon={Add02Icon} size={16} />
          Invite Member
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserIcon} size={14} className="text-amber-600 hidden sm:flex" />
                  <span>Member</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={ShieldIcon} size={14} className="text-purple-600 hidden sm:flex" />
                  <span>Role</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserAccountIcon} size={14} className="text-emerald-600 hidden sm:flex" />
                  <span>Status</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={ClockIcon} size={14} className="text-blue-600 hidden sm:flex" />
                  <span>Last Active</span>
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TEAM.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={ROLE_STYLES[member.role]?.className || ""} variant="secondary">
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_STYLES[member.status]?.className || ""} variant={STATUS_STYLES[member.status]?.variant || "secondary"}>
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.lastActive}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" className="size-8 text-muted-foreground data-open:bg-muted" size="icon" />
                      }
                    >
                      <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="gap-2">
                        <HugeiconsIcon icon={Edit02Icon} size={14} />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" className="gap-2">
                        <HugeiconsIcon icon={Trash} size={14} />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
