import express from "express";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import template from "./template";
import userRoutes from "./routers/user.routes";
import authRoutes from "./routers/auth.routes";

const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compress());
app.use(helmet());
app.use(cors());
app.use("/", userRoutes);
app.use("/", authRoutes);
app.get("/", (req, res) => {
  res.status(200).send(template());
});
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: `${err.name}: ${err.message}` });
  }
});
export default app;
