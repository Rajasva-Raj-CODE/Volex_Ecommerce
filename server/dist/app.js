"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const rateLimiter_1 = require("./middleware/rateLimiter");
const error_middleware_1 = require("./middleware/error.middleware");
// ─── Route imports (added as each module is built) ───────────────────────────
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const invitations_routes_1 = __importDefault(require("./modules/invitations/invitations.routes"));
const products_routes_1 = __importDefault(require("./modules/products/products.routes"));
const categories_routes_1 = __importDefault(require("./modules/categories/categories.routes"));
const cart_routes_1 = __importDefault(require("./modules/cart/cart.routes"));
const wishlist_routes_1 = __importDefault(require("./modules/wishlist/wishlist.routes"));
const orders_routes_1 = __importDefault(require("./modules/orders/orders.routes"));
const addresses_routes_1 = __importDefault(require("./modules/addresses/addresses.routes"));
const app = (0, express_1.default)();
// ─── Security middleware ──────────────────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [env_1.env.CLIENT_URL, env_1.env.ADMIN_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// ─── Request parsing ─────────────────────────────────────────────────────────
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// ─── Logging ─────────────────────────────────────────────────────────────────
if (env_1.env.NODE_ENV !== "test") {
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev"));
}
// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use("/api", rateLimiter_1.generalLimiter);
// ─── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ success: true, message: "VolteX API is running", env: env_1.env.NODE_ENV });
});
// ─── API routes (uncomment as each module is built) ──────────────────────────
app.use("/api/auth", auth_routes_1.default);
app.use("/api/invitations", invitations_routes_1.default);
app.use("/api/products", products_routes_1.default);
app.use("/api/categories", categories_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
app.use("/api/addresses", addresses_routes_1.default);
// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map