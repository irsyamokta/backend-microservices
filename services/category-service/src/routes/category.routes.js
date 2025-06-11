import express from "express";
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { authMiddleware } from "../../../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/all", getCategories);
router.get("/:id", getCategoryById);
router.post("/create-category", createCategory);
router.patch("/update-category/:id", updateCategory);
router.delete("/delete-category/:id", deleteCategory);

export default router;
