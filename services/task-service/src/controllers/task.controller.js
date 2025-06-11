import * as taskService from "../services/task.service.js";

export const getTasks = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query;
        const tasks = await taskService.getTasks(req.user.id, { page, limit, search });
        res.status(200).json({ tasks });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.user.id, req.body);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const task = await taskService.deleteTask(req.user.id, req.params.id);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};