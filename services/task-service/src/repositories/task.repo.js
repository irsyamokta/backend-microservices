import prisma from "../config/prisma.js";

export const getTasks = async ({ userId, search = "", page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where: {
                userId,
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            skip: offset,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.task.count({
            where: {
                userId,
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        }),
    ]);

    return {
        data: tasks,
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
    };
};

export const getTaskById = async (id) => prisma.task.findFirst({ where: { id } });

export const createTask = async (data) => prisma.task.create({ data });

export const updateTask = async (id, userId, data) => prisma.task.update({ where: { id, userId }, data });

export const deleteTask = async (id, userId) => prisma.task.deleteMany({ where: { id, userId } });