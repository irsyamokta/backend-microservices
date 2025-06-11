import * as userRepository from "../repositories/user.repo.js";
import { NotFoundError, BadRequestError } from "../utils/error.utils.js";
import { updateProfileValidator } from "../utils/validators/user.validate.js";

import { emitUserUpdated, emitUserDeleted } from "../events/user.event.publisher.js";

export const getUsers = async ({ page = 1, limit = 10, search = "" }) => {
    const users = await userRepository.getUsers({ page, limit, search });
    return users;
};

export const getUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
};

export const updateUser = async (userId, data) => {
    const { error } = updateProfileValidator(data);
    if (error) throw new BadRequestError("Validation failed", error.details.map(err => err.message));

    const user = await userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("User not found");

    const { name, email } = data;
    if (email !== user.email) {
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            throw new BadRequestError("Email already exists");
        }
    }

    const payload = { name, email };
    const updatedUser = await userRepository.updateUser(userId, payload);

    await emitUserUpdated({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email });

    return updatedUser;
};

export const deleteUser = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("User not found");

    await userRepository.deleteUser(userId);

    await emitUserDeleted({ id: user.id, email: user.email });

    return { message: "User berhasil dihapus" };
};
