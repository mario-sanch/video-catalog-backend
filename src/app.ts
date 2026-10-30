import express, { Application } from "express";
import healthRouter from "./routes/health";
import videosRouter from "./routes/videos";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", healthRouter);
app.use("/api/videos", videosRouter);

export default app;
