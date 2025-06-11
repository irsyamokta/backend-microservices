import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import xssClean from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;
const corsOptions = {
    origin: true,
    credentials: true,
};

app.set('trust proxy', 1);

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(helmet());
app.use(xssClean());
app.use(hpp());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.use((req, res, next) => res.status(404).json({ message: "Route not found" }));

app.get("/", (req, res) => res.send("Server is running"));

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Terjadi kesalahan pada server",
        errors: err.details || undefined,
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT ${PORT}`);
});