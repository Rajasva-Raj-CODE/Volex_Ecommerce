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
exports.adminLogin = adminLogin;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.getMe = getMe;
exports.customerRegister = customerRegister;
exports.customerLogin = customerLogin;
const authService = __importStar(require("./auth.service"));
const response_1 = require("../../utils/response");
async function adminLogin(req, res, next) {
    try {
        const tokens = await authService.adminLogin(req.body);
        (0, response_1.success)(res, tokens, "Logged in successfully");
    }
    catch (err) {
        next(err);
    }
}
async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        const tokens = await authService.refreshTokens(refreshToken);
        (0, response_1.success)(res, tokens, "Tokens refreshed");
    }
    catch (err) {
        next(err);
    }
}
async function logout(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (refreshToken)
            await authService.logout(refreshToken);
        (0, response_1.success)(res, null, "Logged out");
    }
    catch (err) {
        next(err);
    }
}
async function getMe(req, res, next) {
    try {
        const user = await authService.getMe(req.user.userId);
        (0, response_1.success)(res, { user });
    }
    catch (err) {
        next(err);
    }
}
async function customerRegister(req, res, next) {
    try {
        const tokens = await authService.customerRegister(req.body);
        (0, response_1.success)(res, tokens, "Account created successfully", 201);
    }
    catch (err) {
        next(err);
    }
}
async function customerLogin(req, res, next) {
    try {
        const tokens = await authService.customerLogin(req.body);
        (0, response_1.success)(res, tokens, "Logged in successfully");
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map