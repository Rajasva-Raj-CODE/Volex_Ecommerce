import type { SendInviteInput, RequestOtpInput, VerifyOtpInput } from "./invitations.schema";
export declare function inviteStaff(input: SendInviteInput, invitedById: string): Promise<{
    id: string;
    email: string;
    createdAt: Date;
}>;
export declare function listInvitations(): Promise<({
    invitedBy: {
        email: string;
        name: string | null;
    };
} & {
    email: string;
    id: string;
    createdAt: Date;
    used: boolean;
    invitedById: string;
})[]>;
export declare function revokeInvitation(id: string): Promise<void>;
export declare function requestOtp(input: RequestOtpInput): Promise<{
    message: string;
}>;
export declare function verifyOtpAndLogin(input: VerifyOtpInput): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
    };
}>;
//# sourceMappingURL=invitations.service.d.ts.map