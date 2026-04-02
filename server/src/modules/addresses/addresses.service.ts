import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";

export async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  });
}

export async function createAddress(userId: string, data: {
  label: string; line1: string; line2?: string;
  city: string; state: string; pincode: string; isDefault?: boolean;
}) {
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  return prisma.address.create({ data: { ...data, userId } });
}

export async function updateAddress(userId: string, id: string, data: Partial<{
  label: string; line1: string; line2: string;
  city: string; state: string; pincode: string; isDefault: boolean;
}>) {
  const existing = await prisma.address.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError("Address not found", 404);
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  return prisma.address.update({ where: { id }, data });
}

export async function deleteAddress(userId: string, id: string) {
  const existing = await prisma.address.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError("Address not found", 404);
  await prisma.address.delete({ where: { id } });
}
