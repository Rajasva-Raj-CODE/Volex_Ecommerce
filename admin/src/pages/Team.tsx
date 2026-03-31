import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add02Icon, MoreVerticalIcon, UserGroupIcon, Edit02Icon, Trash, UserIcon, ShieldIcon, ClockIcon, UserAccountIcon, Mail01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";

const MOCK_TEAM = [
  { id: "1", name: "Rajesh Kumar", email: "admin@voltex.com", phone: "+91 98765 43210", role: "Super Admin", status: "Active", lastActive: "Just now", avatar: "RK" },
  { id: "2", name: "Priya Sharma", email: "pm@voltex.com", phone: "+91 98765 43211", role: "Product Manager", status: "Active", lastActive: "2 hours ago", avatar: "PS" },
  { id: "3", name: "Ankit Verma", email: "ankit@voltex.com", phone: "+91 98765 43212", role: "Product Manager", status: "Active", lastActive: "1 day ago", avatar: "AV" },
  { id: "4", name: "Divya Menon", email: "divya@voltex.com", phone: "+91 98765 43213", role: "Super Admin", status: "Invited", lastActive: "—", avatar: "DM" },
];

const ROLE_STYLES: Record<string, { className: string }> = {
  "Super Admin": { className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  "Product Manager": { className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
};

const STATUS_STYLES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  Active: { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" },
  Invited: { variant: "secondary", className: "bg-amber-50 text-amber-700 hover:bg-amber-50" },
};

type TeamMember = typeof MOCK_TEAM[number];

export default function Team() {
  const [team, setTeam] = useState(MOCK_TEAM);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setRole("");
    setErrors({});
  }

  function handleOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) resetForm();
  }

  function handleEditOpenChange(open: boolean) {
    setEditDialogOpen(open);
    if (!open) {
      setEditingMember(null);
      resetForm();
    }
  }

  function openEdit(member: TeamMember) {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setRole(member.role === "Super Admin" ? "super_admin" : "product_manager");
    setErrors({});
    setEditDialogOpen(true);
  }

  function handleInvite() {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else if (team.some((m) => m.email === email.trim())) {
      newErrors.email = "This email has already been invited";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!role) newErrors.role = "Please select a role";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nameParts = name.trim().split(" ");
    const avatar = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : name.trim().slice(0, 2).toUpperCase();
    const roleLabel = role === "super_admin" ? "Super Admin" : "Product Manager";

    setTeam((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: roleLabel,
        status: "Invited",
        lastActive: "—",
        avatar,
      },
    ]);

    toast.success(`Invitation sent to ${name.trim()}`);
    resetForm();
    setDialogOpen(false);
  }

  function handleEdit() {
    if (!editingMember) return;

    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else if (team.some((m) => m.id !== editingMember.id && m.email === email.trim())) {
      newErrors.email = "This email is already in use";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!role) newErrors.role = "Please select a role";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nameParts = name.trim().split(" ");
    const avatar = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : name.trim().slice(0, 2).toUpperCase();
    const roleLabel = role === "super_admin" ? "Super Admin" : "Product Manager";

    setTeam((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? { ...m, name: name.trim(), email: email.trim(), phone: phone.trim(), role: roleLabel, avatar }
          : m
      )
    );

    toast.success(`${name.trim()} updated successfully`);
    setEditingMember(null);
    resetForm();
    setEditDialogOpen(false);
  }

  function handleRemove(member: TeamMember) {
    setTeam((prev) => prev.filter((m) => m.id !== member.id));
    toast.success(`${member.name} has been removed`);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={UserGroupIcon} size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Team</h1>
            <p className="text-sm text-muted-foreground">{team.length} team members</p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <HugeiconsIcon icon={Add02Icon} size={16} />
            Invite Member
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team. They'll receive an email with instructions.
              </DialogDescription>
            </DialogHeader>

            <form
              id="invite-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleInvite();
              }}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="invite-name">Full name</FieldLabel>
                  <Input
                    id="invite-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="invite-email">Email address</FieldLabel>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                  />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="invite-phone">Phone number</FieldLabel>
                  <Input
                    id="invite-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                  />
                  {errors.phone && <FieldError>{errors.phone}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select value={role} onValueChange={(v) => {
                    if (v) {
                      setRole(v);
                      if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
                    }
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">
                        <HugeiconsIcon icon={ShieldIcon} size={14} className="text-purple-600" />
                        Super Admin
                      </SelectItem>
                      <SelectItem value="product_manager">
                        <HugeiconsIcon icon={UserAccountIcon} size={14} className="text-blue-600" />
                        Product Manager
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <FieldError>{errors.role}</FieldError>}
                </Field>
              </FieldGroup>
            </form>

            <DialogFooter showCloseButton>
              <Button type="submit" form="invite-form" disabled={!name || !email || !phone || !role}>
                <HugeiconsIcon icon={Mail01Icon} size={16} />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  <HugeiconsIcon icon={SmartPhone01Icon} size={14} className="text-indigo-600 hidden sm:flex" />
                  <span>Phone</span>
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
            {team.map((member) => (
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
                <TableCell className="text-muted-foreground">{member.phone}</TableCell>
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
                      <DropdownMenuItem className="gap-2" onClick={() => openEdit(member)}>
                        <HugeiconsIcon icon={Edit02Icon} size={14} />
                        Edit Member
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" className="gap-2" onClick={() => handleRemove(member)}>
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

      <Dialog open={editDialogOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update details for {editingMember?.name}.
            </DialogDescription>
          </DialogHeader>

          <form
            id="edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit();
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-name">Full name</FieldLabel>
                <Input
                  id="edit-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                />
                {errors.name && <FieldError>{errors.name}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-email">Email address</FieldLabel>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-phone">Phone number</FieldLabel>
                <Input
                  id="edit-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                />
                {errors.phone && <FieldError>{errors.phone}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select value={role} onValueChange={(v) => {
                  if (v) {
                    setRole(v);
                    if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
                  }
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">
                      <HugeiconsIcon icon={ShieldIcon} size={14} className="text-purple-600" />
                      Super Admin
                    </SelectItem>
                    <SelectItem value="product_manager">
                      <HugeiconsIcon icon={UserAccountIcon} size={14} className="text-blue-600" />
                      Product Manager
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <FieldError>{errors.role}</FieldError>}
              </Field>
            </FieldGroup>
          </form>

          <DialogFooter showCloseButton>
            <Button type="submit" form="edit-form" disabled={!name || !email || !phone || !role}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
