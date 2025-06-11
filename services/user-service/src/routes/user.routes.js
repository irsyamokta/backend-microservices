import express from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/all", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.patch("/update-user/:id", authMiddleware, updateUser);
router.delete("/delete-user/:id", authMiddleware, deleteUser);

export default router;