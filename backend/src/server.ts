import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import app from "./app.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Routes
app.get("/", (req, res) => {
  res.send("Backend server running...");
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
