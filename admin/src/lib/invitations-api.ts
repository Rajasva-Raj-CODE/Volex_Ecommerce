import { apiRequest } from "./api";

export interface ApiInvitation {
  id: string;
  email: string;
  used: boolean;
  createdAt: string;
  invitedBy: { name: string | null; email: string };
}

interface InvitationsListResponse {
  invitations: ApiInvitation[];
}

interface InviteStaffResponse {
  invitation: {
    id: string;
    email: string;
    createdAt: string;
  };
}

export async function listInvitations() {
  const data = await apiRequest<InvitationsListResponse>("/invitations");
  return data.invitations;
}

export async function inviteStaff(email: string, name?: string) {
  const data = await apiRequest<InviteStaffResponse>("/invitations", {
    method: "POST",
    json: { email, name },
  });
  return data.invitation;
}

export function revokeInvitation(id: string) {
  return apiRequest<null>(`/invitations/${id}`, { method: "DELETE" });
}

export function requestOtp(email: string) {
  return apiRequest<{ message: string }>("/invitations/auth/request-otp", {
    method: "POST",
    auth: false,
    json: { email },
  });
}

export function verifyOtp(email: string, otp: string) {
  return apiRequest<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; name: string | null; role: "ADMIN" | "STAFF" };
  }>("/invitations/auth/verify-otp", {
    method: "POST",
    auth: false,
    json: { email, otp },
  });
}
