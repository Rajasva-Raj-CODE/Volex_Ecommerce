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
const express_1 = require("express");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const requireRole_middleware_1 = require("../../middleware/requireRole.middleware");
const orders_schema_1 = require("./orders.schema");
const controller = __importStar(require("./orders.controller"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
// Customer routes
router.post("/", (0, validate_middleware_1.validate)(orders_schema_1.placeOrderSchema), controller.placeOrder);
router.get("/my", controller.getUserOrders);
router.get("/:id", controller.getOrder);
// Admin / Staff routes
router.get("/", (0, requireRole_middleware_1.requireRole)("ADMIN", "STAFF"), controller.listAllOrders);
router.put("/:id/status", (0, requireRole_middleware_1.requireRole)("ADMIN", "STAFF"), (0, validate_middleware_1.validate)(orders_schema_1.updateOrderStatusSchema), controller.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map