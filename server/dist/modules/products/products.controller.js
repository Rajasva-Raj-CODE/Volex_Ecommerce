"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const service = __importStar(require("./products.service"));
const products_schema_1 = require("./products.schema");
const response_1 = require("../../utils/response");
async function listProducts(req, res, next) {
    try {
        const query = products_schema_1.productQuerySchema.parse(req.query);
        const result = await service.listProducts(query);
        (0, response_1.success)(res, result);
    }
    catch (err) {
        next(err);
    }
}
async function getProduct(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await service.getProduct(id);
        (0, response_1.success)(res, { product });
    }
    catch (err) {
        next(err);
    }
}
async function createProduct(req, res, next) {
    try {
        const product = await service.createProduct(req.body);
        (0, response_1.success)(res, { product }, "Product created", 201);
    }
    catch (err) {
        next(err);
    }
}
async function updateProduct(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await service.updateProduct(id, req.body);
        (0, response_1.success)(res, { product }, "Product updated");
    }
    catch (err) {
        next(err);
    }
}
async function deleteProduct(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await service.deleteProduct(id);
        (0, response_1.success)(res, null, "Product deleted");
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=products.controller.js.map