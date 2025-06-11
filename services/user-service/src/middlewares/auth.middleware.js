import jwt from "jsonwebtoken";
import { findByRefreshToken } from "../repositories/session.repo.js";

export const authMiddleware = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            status: "unauthorized",
            message: "Tidak ada refresh token di cookie"
        });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const session = await findByRefreshToken(refreshToken);

        if (!session || !session.isValid) {
            return res.status(403).json({
                status: "forbidden",
                message: "Sesi tidak valid"
            });
        }

        req.user = { id: payload.userId };
        next();
    } catch (error) {
        console.error("Refresh Token Verification Error:", error);
        res.status(403).json({
            status: "forbidden",
            message: "Refresh token tidak valid"
        });
    }
};

export const accessMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token tidak diberikan" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { id: payload.userId };
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token tidak valid" });
    }
};