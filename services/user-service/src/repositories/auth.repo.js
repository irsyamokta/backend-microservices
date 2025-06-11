import prisma from "../../src/config/prisma.js";

export const getUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });

export const createUser = async (data) => prisma.user.create({ data });