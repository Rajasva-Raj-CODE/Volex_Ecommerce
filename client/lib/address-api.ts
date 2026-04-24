"use client";

import { authedApiRequest } from "./auth-api";

export interface ApiAddress {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  userId: string;
}

export interface CreateAddressInput {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export async function getAddresses(): Promise<ApiAddress[]> {
  const result = await authedApiRequest<{ addresses: ApiAddress[] }>("/addresses");
  return result.addresses;
}

export async function createAddress(data: CreateAddressInput): Promise<ApiAddress> {
  const result = await authedApiRequest<{ address: ApiAddress }>("/addresses", {
    method: "POST",
    json: data,
  });
  return result.address;
}

export async function updateAddress(id: string, data: Partial<CreateAddressInput>): Promise<ApiAddress> {
  const result = await authedApiRequest<{ address: ApiAddress }>(`/addresses/${id}`, {
    method: "PUT",
    json: data,
  });
  return result.address;
}

export function deleteAddress(id: string): Promise<void> {
  return authedApiRequest<void>(`/addresses/${id}`, { method: "DELETE" });
}
