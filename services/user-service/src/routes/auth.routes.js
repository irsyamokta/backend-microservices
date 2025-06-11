import express from "express";
import { register, login, logout, refreshToken, me } from "../controllers/auth.controller.js";
import { authMiddleware, accessMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", accessMiddleware, me);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", authMiddleware, refreshToken);
router.post("/logout", authMiddleware, logout);

export default router;