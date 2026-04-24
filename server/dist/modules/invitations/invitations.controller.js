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
exports.sendInvite = sendInvite;
exports.listInvitations = listInvitations;
exports.revokeInvitation = revokeInvitation;
exports.requestOtp = requestOtp;
exports.verifyOtp = verifyOtp;
const service = __importStar(require("./invitations.service"));
const response_1 = require("../../utils/response");
async function sendInvite(req, res, next) {
    try {
        const invitation = await service.inviteStaff(req.body, req.user.userId);
        (0, response_1.success)(res, { invitation }, "Invitation sent", 201);
    }
    catch (err) {
        next(err);
    }
}
async function listInvitations(_req, res, next) {
    try {
        const invitations = await service.listInvitations();
        (0, response_1.success)(res, { invitations });
    }
    catch (err) {
        next(err);
    }
}
async function revokeInvitation(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await service.revokeInvitation(id);
        (0, response_1.success)(res, null, "Team member removed");
    }
    catch (err) {
        next(err);
    }
}
async function requestOtp(req, res, next) {
    try {
        const result = await service.requestOtp(req.body);
        (0, response_1.success)(res, result, "OTP sent to your email");
    }
    catch (err) {
        next(err);
    }
}
async function verifyOtp(req, res, next) {
    try {
        const result = await service.verifyOtpAndLogin(req.body);
        (0, response_1.success)(res, result, "Logged in successfully");
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=invitations.controller.js.map