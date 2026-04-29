"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.setCache = exports.getCached = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redis = new ioredis_1.default(process.env.REDIS_URL);
exports.redis.on('connect', () => {
    console.log('Redis connected successfully');
});
exports.redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});
// Helper for caching
const getCached = async (key) => {
    const data = await exports.redis.get(key);
    return data ? JSON.parse(data) : null;
};
exports.getCached = getCached;
const setCache = async (key, data, ttlSeconds = 3600) => {
    await exports.redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
};
exports.setCache = setCache;
const invalidateCache = async (pattern) => {
    const keys = await exports.redis.keys(pattern);
    if (keys.length > 0) {
        await exports.redis.del(...keys);
    }
};
exports.invalidateCache = invalidateCache;
