import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../src/routes/user.routes.js";
import advertisementRouter from "../src/routes/advertisement.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/advertisements", advertisementRouter);
export default app;
