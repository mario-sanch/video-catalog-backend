import express, { Application } from "express";
import healthRouter from "./routes/health";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", healthRouter);

export default app;
