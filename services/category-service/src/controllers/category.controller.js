import * as categoryService from "../services/category.service.js";

export const getCategories = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page, limit, search } = req.query;
        const categories = await categoryService.getCategories(userId, { page, limit, search });
        res.json({ categories });
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const categoryId = req.params.id;
        const category = await categoryService.getCategoryById(userId, categoryId);
        res.json({ category });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const category = await categoryService.createCategory(userId, req.body);
        res.status(201).json({ category });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const categoryId = req.params.id;
        const result = await categoryService.updateCategory(userId, categoryId, req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const categoryId = req.params.id;
        const result = await categoryService.deleteCategory(userId, categoryId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
