import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy" });
});

(async () => {
  await registerRoutes(app);

  // Error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // In a Vercel environment, the Express app itself is the serverless function.
  // We don't need to listen on a port.
})();

export default app;
