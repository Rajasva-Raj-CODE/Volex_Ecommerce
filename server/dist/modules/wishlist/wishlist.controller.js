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
exports.getWishlist = getWishlist;
exports.addToWishlist = addToWishlist;
exports.removeFromWishlist = removeFromWishlist;
const service = __importStar(require("./wishlist.service"));
const response_1 = require("../../utils/response");
async function getWishlist(req, res, next) {
    try {
        const wishlist = await service.getWishlist(req.user.userId);
        (0, response_1.success)(res, wishlist);
    }
    catch (err) {
        next(err);
    }
}
async function addToWishlist(req, res, next) {
    try {
        const { productId } = req.body;
        const item = await service.addToWishlist(req.user.userId, productId);
        (0, response_1.success)(res, { item }, "Added to wishlist", 201);
    }
    catch (err) {
        next(err);
    }
}
async function removeFromWishlist(req, res, next) {
    try {
        const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
        await service.removeFromWishlist(req.user.userId, productId);
        (0, response_1.success)(res, null, "Removed from wishlist");
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=wishlist.controller.js.map