export declare function getAddresses(userId: string): Promise<{
    id: string;
    userId: string;
    label: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}[]>;
export declare function createAddress(userId: string, data: {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}): Promise<{
    id: string;
    userId: string;
    label: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}>;
export declare function updateAddress(userId: string, id: string, data: Partial<{
    label: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}>): Promise<{
    id: string;
    userId: string;
    label: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}>;
export declare function deleteAddress(userId: string, id: string): Promise<void>;
//# sourceMappingURL=addresses.service.d.ts.map