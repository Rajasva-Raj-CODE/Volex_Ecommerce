"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddresses = getAddresses;
exports.createAddress = createAddress;
exports.updateAddress = updateAddress;
exports.deleteAddress = deleteAddress;
const prisma_1 = require("../../config/prisma");
const error_middleware_1 = require("../../middleware/error.middleware");
async function getAddresses(userId) {
    return prisma_1.prisma.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: "desc" }, { id: "asc" }],
    });
}
async function createAddress(userId, data) {
    if (data.isDefault) {
        await prisma_1.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma_1.prisma.address.create({ data: { ...data, userId } });
}
async function updateAddress(userId, id, data) {
    const existing = await prisma_1.prisma.address.findFirst({ where: { id, userId } });
    if (!existing)
        throw new error_middleware_1.AppError("Address not found", 404);
    if (data.isDefault) {
        await prisma_1.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma_1.prisma.address.update({ where: { id }, data });
}
async function deleteAddress(userId, id) {
    const existing = await prisma_1.prisma.address.findFirst({ where: { id, userId } });
    if (!existing)
        throw new error_middleware_1.AppError("Address not found", 404);
    await prisma_1.prisma.address.delete({ where: { id } });
}
//# sourceMappingURL=addresses.service.js.map