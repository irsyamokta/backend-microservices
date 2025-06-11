import express from "express";
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { authMiddleware } from "../../../../middlewares/auth.middleware.js";
import { categoryMiddleware } from "../../../../middlewares/category.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/all", getTasks);
router.get("/:id", getTaskById);
router.post("/create-task", categoryMiddleware, createTask);
router.patch("/update-task/:id", categoryMiddleware, updateTask);
router.delete("/delete-task/:id", deleteTask);

export default router;
