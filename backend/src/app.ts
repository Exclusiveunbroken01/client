// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Import all module routes
import authRoutes from "./modules/auth/auth.routes.js";
import bookingsRoutes from "./modules/bookings/bookings.routes.js";
import flightsRoutes from "./modules/flights/flights.routes.js";
import paymentsRoutes from "./modules/payments/payments.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import countriesRoutes from "./modules/countries/countries.routes.js";

// Import middleware
import { errorHandler } from "./middleware/errorMiddleware.js";
import { requestLogger } from "./middleware/requestLogger.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your Next.js frontend
  credentials: true,               // allow cookies
}));

app.use(helmet());
app.use(express.json());
app.use(requestLogger);

// Register routes for all modules here
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/flights", flightsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/countries", countriesRoutes);

// Global error handler
app.use(errorHandler);

export default app;
