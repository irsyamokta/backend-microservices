import redisSubscriber from "../config/redis.subscribe.js";
import prisma from "../config/prisma.js";

const SUBSCRIBE_CHANNEL = "user-events";

export const subscribeToUserEvents = async () => {
    try {
        await redisSubscriber.subscribe(SUBSCRIBE_CHANNEL);
        console.log(`✅ Subscribed to Redis channel: ${SUBSCRIBE_CHANNEL}`);

        redisSubscriber.on("message", async (channel, message) => {
            if (!message) {
                console.warn("⚠️ Received empty Redis message, ignoring.");
                return;
            }

            try {
                const parsed = JSON.parse(message);
                if (!parsed?.event || !parsed?.data) {
                    console.warn("⚠️ Redis message missing event/data:", parsed);
                    return;
                }

                const { event, data } = parsed;
                console.log("✅ Parsed Redis event:", event, data);
                await handleUserEvent(event, data);
            } catch (err) {
                console.error("❌ Failed to parse or handle Redis message:", message, err);
            }
        });
    } catch (err) {
        console.error("❌ Redis subscription error:", err);
    }
};

const handleUserEvent = async (event, data) => {
    switch (event) {
        case "user.created":
            await prisma.user.upsert({
                where: { id: data.id },
                update: {
                    name: data.name,
                    email: data.email,
                },
                create: {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                },
            });
            break;

        case "user.deleted":
            await prisma.user.deleteMany({
                where: { id: data.id },
            });
            await prisma.category.deleteMany({
                where: { userId: data.id },
            });
            break;

        case "user.updated":
            await prisma.user.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    email: data.email,
                },
            });
            break;

        default:
            console.log("Unhandled user event:", event);
    }
};