import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorMiddleware } from "./middleware/error.middleware";

// ─── Route imports (added as each module is built) ───────────────────────────
import authRoutes from "./modules/auth/auth.routes";
import invitationRoutes from "./modules/invitations/invitations.routes";
import productRoutes from "./modules/products/products.routes";
import categoryRoutes from "./modules/categories/categories.routes";
import cartRoutes from "./modules/cart/cart.routes";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";
import orderRoutes from "./modules/orders/orders.routes";
import addressRoutes from "./modules/addresses/addresses.routes";
import userRoutes from "./modules/users/users.routes";

const app = express();

// ─── Security middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL, env.ADMIN_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Request parsing ─────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use("/api", generalLimiter);

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "VolteX API is running", env: env.NODE_ENV });
});

// ─── API routes (uncomment as each module is built) ──────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/users", userRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorMiddleware);

export default app;
