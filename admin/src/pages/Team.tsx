import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add02Icon, MoreVerticalIcon, UserGroupIcon, Trash, UserIcon, ShieldIcon, ClockIcon, UserAccountIcon, Mail01Icon } from "@hugeicons/core-free-icons";
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
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { listInvitations, inviteStaff, revokeInvitation, type ApiInvitation } from "@/lib/invitations-api";
import { ApiError } from "@/lib/api";

function getInitials(email: string, name?: string | null) {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Team() {
  const [invitations, setInvitations] = useState<ApiInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listInvitations();
      setInvitations(data);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInvitations();
  }, [fetchInvitations]);

  function resetForm() {
    setEmail("");
    setName("");
    setErrors({});
  }

  function handleOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) resetForm();
  }

  async function handleInvite() {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSending(true);
    try {
      await inviteStaff(email.trim(), name.trim() || undefined);
      toast.success(`Invitation sent to ${email.trim()}`);
      resetForm();
      setDialogOpen(false);
      void fetchInvitations();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to send invitation");
    } finally {
      setSending(false);
    }
  }

  async function handleRevoke(invitation: ApiInvitation) {
    const actionLabel = invitation.used ? "Remove team member" : "Revoke invitation";
    if (!confirm(`${actionLabel} for ${invitation.email}?`)) return;
    setRevokingId(invitation.id);
    try {
      await revokeInvitation(invitation.id);
      setInvitations((prev) => prev.filter((i) => i.id !== invitation.id));
      toast.success(invitation.used
        ? `${invitation.email} removed from team`
        : `Invitation for ${invitation.email} revoked`
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update team");
    } finally {
      setRevokingId(null);
    }
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
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${invitations.length} invitation${invitations.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <HugeiconsIcon icon={Add02Icon} size={16} />
            Invite Staff
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Staff Member</DialogTitle>
              <DialogDescription>
                They'll receive an email with a magic link to log in via OTP.
              </DialogDescription>
            </DialogHeader>

            <form
              id="invite-form"
              onSubmit={(e) => {
                e.preventDefault();
                void handleInvite();
              }}
            >
              <FieldGroup>
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
                  <FieldLabel htmlFor="invite-name">Full name <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
                  <Input
                    id="invite-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </form>

            <DialogFooter showCloseButton>
              <Button type="submit" form="invite-form" disabled={!email || sending}>
                <HugeiconsIcon icon={Mail01Icon} size={16} />
                {sending ? "Sending…" : "Send Invitation"}
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
                  <span>Staff Email</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={ShieldIcon} size={14} className="text-purple-600 hidden sm:flex" />
                  <span>Invited By</span>
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
                  <span>Invited On</span>
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No staff invitations yet — invite your first team member.
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {getInitials(inv.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{inv.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {inv.invitedBy.name ?? inv.invitedBy.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={inv.used ? "outline" : "secondary"}
                      className={inv.used
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-50"
                      }
                    >
                      {inv.used ? "Active" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(inv.createdAt)}
                  </TableCell>
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
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          variant="destructive"
                          className="gap-2"
                          disabled={revokingId === inv.id}
                          onClick={() => handleRevoke(inv)}
                        >
                          <HugeiconsIcon icon={Trash} size={14} />
                          {revokingId === inv.id ? "Removing…" : inv.used ? "Remove Member" : "Revoke Invite"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
