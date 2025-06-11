import redis from "../config/redis.js";
import * as sessionRepository from "../repositories/session.repo.js";
import * as tokenService from "../utils/token.utils.js";

export const createSession = async (userId, userAgent, ipAddress) => {
    const refreshToken = tokenService.generateRefreshToken({ id: userId });
    const accessToken = tokenService.generateAccessToken({ id: userId });

    await sessionRepository.createSession(userId, refreshToken, userAgent, ipAddress);
    await redis.set(refreshToken, userId); 

    return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (oldRefreshToken, req) => {
    const session = await sessionRepository.findByRefreshToken(oldRefreshToken);
    if (!session) throw new Error("Refresh token tidak valid atau sesi sudah kedaluwarsa");

    await sessionRepository.invalidateSession(oldRefreshToken);
    await redis.del(oldRefreshToken); 

    const newRefreshToken = tokenService.generateRefreshToken({ id: session.userId });
    const accessToken = tokenService.generateAccessToken({ id: session.userId });

    await sessionRepository.createSession(session.userId, newRefreshToken, req.get("user-agent"), req.ip);
    await redis.set(newRefreshToken, session.userId); 

    return { accessToken, newRefreshToken };
};

export const invalidateSession = async (refreshToken) => {
    await sessionRepository.invalidateSession(refreshToken);
    await redis.del(refreshToken);
};

export const deleteSession = async (refreshToken) => {
    await sessionRepository.deleteSession(refreshToken);
    await redis.del(refreshToken);
};

export const getAllSessions = async () => {
    return sessionRepository.getSessionsCountByDevice();
};
