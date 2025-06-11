import * as taskRepo from "../repositories/task.repo.js";
import { BadRequestError, NotFoundError } from "../utils/error.utils.js";
import { taskValidator } from "../utils/validator/task.validate.js";

export const getTasks = async (userId, { search = "", page = 1, limit = 10 }) => {
    return await taskRepo.getTasks({ userId, page, limit, search });
};

export const getTaskById = async (userId, taskId) => {
    const task = await taskRepo.getTaskById(taskId, userId);
    if (!task) throw new NotFoundError("Kategori tidak ditemukan");
    return task;
};

export const createTask = async (userId, data) => {
    const { error } = taskValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(d => d.message));

    const { title, description, categoryId } = data;

    const taskData = {
        title,
        description,
        categoryId,
        userId,
    };

    const createTask  = await taskRepo.createTask(taskData);

    return createTask;
};

export const updateTask = async (userId, taskId, data) => {
    const { error } = taskValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(d => d.message));

    const { title, description, categoryId } = data;

    const taskData = {
        title,
        description,
        categoryId,
        userId,
    };

    const updateTask  = await taskRepo.updateTask(taskId, userId, taskData);

    return updateTask;
};

export const deleteTask = async (userId, taskId) => {
    const result = await taskRepo.deleteTask(taskId, userId);
    if (result.count === 0) throw new NotFoundError("Kategori tidak ditemukan atau bukan milik Anda");

    return { message: "Kategori berhasil dihapus" };
};