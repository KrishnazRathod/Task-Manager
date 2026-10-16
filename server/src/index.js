import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDb } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import taskRoutes from "./routes/tasks.js";

const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskmanager";

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "task-manager-api" });
});

app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDb(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
