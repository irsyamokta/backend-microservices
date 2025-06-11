import * as categoryRepo from "../repositories/category.repo.js";
import { BadRequestError, NotFoundError } from "../utils/error.utils.js";
import { categoryValidator } from "../utils/validator/category.validate.js";

export const getCategories = async (userId, { page = 1, limit = 10, search = "" }) => {
    return await categoryRepo.getCategories({ userId, page, limit, search });
};

export const getCategoryById = async (userId, categoryId) => {
    const category = await categoryRepo.getCategoryById(categoryId, userId);
    if (!category) throw new NotFoundError("Kategori tidak ditemukan");
    return category;
};

export const createCategory = async (userId, data) => {
    const { error } = categoryValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(d => d.message));

    const category = await categoryRepo.createCategory({
        ...data,
        userId,
    });

    return category;
};

export const updateCategory = async (userId, categoryId, data) => {
    const { error } = categoryValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(d => d.message));

    const result = await categoryRepo.updateCategory(categoryId, userId, data);
    if (result.count === 0) throw new NotFoundError("Kategori tidak ditemukan atau bukan milik Anda");

    return { message: "Kategori berhasil diperbarui" };
};

export const deleteCategory = async (userId, categoryId) => {
    const result = await categoryRepo.deleteCategory(categoryId, userId);
    if (result.count === 0) throw new NotFoundError("Kategori tidak ditemukan atau bukan milik Anda");

    return { message: "Kategori berhasil dihapus" };
};
