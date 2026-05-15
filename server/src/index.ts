import { env } from "./config/env";
import app from "./app";

// Only start the HTTP server when running locally (not on Vercel serverless)
if (!process.env.VERCEL) {
  const server = app.listen(env.PORT, () => {
    console.log(`🚀  VolteX API running on http://localhost:${env.PORT}`);
    console.log(`📦  Environment: ${env.NODE_ENV}`);
  });

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
}

// Required by Vercel — export the Express app
export default app;
