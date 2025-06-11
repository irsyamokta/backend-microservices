import * as userService from "../services/user.service.js";

export const getUsers = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search = ""} = req.query;
        const params = {
            page: parseInt(page),
            limit: parseInt(limit),
            search
        };

        const users = await userService.getUsers(params);

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};