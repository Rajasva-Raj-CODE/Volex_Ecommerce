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
exports.placeOrder = placeOrder;
exports.getUserOrders = getUserOrders;
exports.getOrder = getOrder;
exports.listAllOrders = listAllOrders;
exports.updateOrderStatus = updateOrderStatus;
const service = __importStar(require("./orders.service"));
const orders_schema_1 = require("./orders.schema");
const response_1 = require("../../utils/response");
async function placeOrder(req, res, next) {
    try {
        const order = await service.placeOrder(req.user.userId, req.body);
        (0, response_1.success)(res, { order }, "Order placed", 201);
    }
    catch (err) {
        next(err);
    }
}
async function getUserOrders(req, res, next) {
    try {
        const query = orders_schema_1.orderQuerySchema.parse(req.query);
        const result = await service.getUserOrders(req.user.userId, query);
        (0, response_1.success)(res, result);
    }
    catch (err) {
        next(err);
    }
}
async function getOrder(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        // customers see only their own; admin/staff see any
        const userId = req.user.role === "ADMIN" || req.user.role === "STAFF"
            ? undefined
            : req.user.userId;
        const order = await service.getOrder(id, userId);
        (0, response_1.success)(res, { order });
    }
    catch (err) {
        next(err);
    }
}
async function listAllOrders(req, res, next) {
    try {
        const query = orders_schema_1.orderQuerySchema.parse(req.query);
        const result = await service.listAllOrders(query);
        (0, response_1.success)(res, result);
    }
    catch (err) {
        next(err);
    }
}
async function updateOrderStatus(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const order = await service.updateOrderStatus(id, req.body);
        (0, response_1.success)(res, { order }, "Order status updated");
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=orders.controller.js.map