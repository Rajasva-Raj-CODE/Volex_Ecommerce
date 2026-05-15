"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageSchema = void 0;
const zod_1 = require("zod");
exports.uploadImageSchema = zod_1.z.object({
    fileName: zod_1.z.string().min(1).max(180),
    dataUrl: zod_1.z.string().min(1),
    folder: zod_1.z
        .enum(["products", "categories", "banners"])
        .default("products"),
});
//# sourceMappingURL=uploads.schema.js.map