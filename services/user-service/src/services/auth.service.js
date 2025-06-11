import * as authRepository from "../repositories/auth.repo.js";
import * as userRepository from "../repositories/user.repo.js";
import * as sessionService from "./session.service.js";
import * as tokenService from "../utils/token.utils.js";

import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { registerValidator, loginValidator } from "../utils/validators/auth.validate.js";
import { BadRequestError, UnauthorizedError, ForbiddenError } from "../utils/error.utils.js";

import { emitUserCreated, emitUserLoggedIn } from "../events/user.event.publisher.js";

export const register = async (data) => {
    const { error } = registerValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { name, email, password } = data;
    const existingUser = await authRepository.getUserByEmail(email);
    if (existingUser) throw new ForbiddenError("Akun sudah terdaftar");

    const hashedPassword = await hashPassword(password);

    const registerData = {
        name,
        email,
        password: hashedPassword,
    };

    const newUser = await authRepository.createUser(registerData);

    emitUserCreated({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
    });

    return { message: "Akun berhasil dibuat" };
};

export const login = async (data, req, res) => {
    const { error } = loginValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { email, password } = data;
    const user = await authRepository.getUserByEmail(email);
    if (!user) throw new UnauthorizedError("Akun tidak ditemukan");

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) throw new UnauthorizedError("Kredensial tidak valid");

    const userAgent = req.get("user-agent") || "unknown";
    const ipAddress = req.ip;

    const { refreshToken } = await sessionService.createSession(user.id, userAgent, ipAddress);
    res.cookie("refreshToken", refreshToken, tokenService.cookieOptions());

    emitUserLoggedIn({
        id: user.id,
        email: user.email,
        userAgent,
        ipAddress,
        timestamp: new Date().toISOString(),
    });

    return { message: "Login berhasil", data: { id: user.id, name: user.name, role: user.role } };
};

export const logout = async (cookies) => {
    const { refreshToken } = cookies;
    if (refreshToken) await sessionService.invalidateSession(refreshToken);
    return { message: "Berhasil logout" };
};

export const refreshToken = async (cookies, req, res) => {
    const { refreshToken } = cookies;
    if (!refreshToken) throw new UnauthorizedError("Tidak ada token yang diberikan");

    const { accessToken, newRefreshToken } = await sessionService.rotateRefreshToken(refreshToken, req);
    res.cookie("refreshToken", newRefreshToken, tokenService.cookieOptions());
    return { accessToken };
};

export const me = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new UnauthorizedError("Tidak ada token yang diberikan");

    const dataUser = {
        id: user.id,
        name: user.name,
        email: user.email,
    };

    return dataUser;
};