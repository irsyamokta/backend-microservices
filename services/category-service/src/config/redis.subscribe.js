import Redis from 'ioredis';

const redisSubscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisSubscriber.on('connect', () => {
    console.log('✅ Redis Subscriber connected');
});

redisSubscriber.on('error', (err) => {
    console.error('❌ Redis Subscriber error:', err);
});

export default redisSubscriber;