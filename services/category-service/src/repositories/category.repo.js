import prisma from "../config/prisma.js";

export const getCategories = async ({ userId, search = "", page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where: {
                userId,
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            skip: offset,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.category.count({
            where: {
                userId,
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        }),
    ]);

    return {
        data: categories,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

export const getCategoryById = async (id, userId) => {
    return await prisma.category.findFirst({
        where: {
            id,
            userId,
        },
    });
};

export const createCategory = async (data) => {
    return await prisma.category.create({
        data,
    });
};

export const updateCategory = async (id, userId, data) => {
    return await prisma.category.updateMany({
        where: { id, userId },
        data,
    });
};

export const deleteCategory = async (id, userId) => {
    return await prisma.category.deleteMany({
        where: { id, userId },
    });
};
