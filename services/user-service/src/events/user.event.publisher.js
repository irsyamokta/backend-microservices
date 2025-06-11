import redis from "../config/redis.js";

/**
 * Publikasi event ke Redis channel "user-events"
 * @param {string} event 
 * @param {object} data 
 */
export const publishUserEvent = async (event, data) => {
    const payload = JSON.stringify({ event, data });
    await redis.publish("user-events", payload);
};

export const emitUserCreated = async (payload) => {
    await publishUserEvent("user.created", payload);
};

export const emitUserLoggedIn = async (payload) => {
    await publishUserEvent("user.logged_in", payload);
};

export const emitUserUpdated = async (payload) => {
    await publishUserEvent("user.updated", payload);
};

export const emitUserDeleted = async (payload) => {
    await publishUserEvent("user.deleted", payload);
};
