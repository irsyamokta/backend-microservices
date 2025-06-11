import prisma from "../config/prisma.js";

export const getUsers = async ({ page = 1, limit = 10, search = ""}) => {
    const skip = (page - 1) * limit;

    const where = {
        AND: [
            search ? { name: { contains: search, mode: "insensitive" } } : {}
        ]
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
            }
        }),
        prisma.user.count({ where })
    ]);

    return {
        users,
        total,
        page,
        lastPage: Math.ceil(total / limit)
    };
};

export const getUserById = async (id, selectedField = null) => prisma.user.findUnique({ where: { id }, select: selectedField });

export const getUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });

export const updateUser = async (id, data) => prisma.user.update({ where: { id }, data });

export const deleteUser = async (id) => prisma.user.delete({ where: { id } });