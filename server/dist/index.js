"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const app_1 = __importDefault(require("./app"));
const server = app_1.default.listen(env_1.env.PORT, () => {
    console.log(`🚀  VolteX API running on http://localhost:${env_1.env.PORT}`);
    console.log(`📦  Environment: ${env_1.env.NODE_ENV}`);
});
// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received — shutting down gracefully...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});
process.on("SIGINT", () => {
    server.close(() => {
        console.log("\nServer stopped.");
        process.exit(0);
    });
});
// Required by Vercel — export the Express app
exports.default = app_1.default;
//# sourceMappingURL=index.js.map