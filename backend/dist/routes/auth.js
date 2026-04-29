"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const bloom_1 = require("../bloom");
const authRoutes = async (fastify) => {
    // Check Username Availability
    fastify.get('/check-username', async (request, reply) => {
        const { username } = request.query;
        if (!username) {
            return reply.code(400).send({ error: 'Username is required' });
        }
        // 1. Fast path: Bloom Filter
        if (!(0, bloom_1.isUsernameTakenByBloomFilter)(username)) {
            return reply.send({ available: true });
        }
        // 2. Slow path: DB check (since bloom filter can have false positives)
        const existing = await User_1.User.findOne({ username: username.toLowerCase() }).lean();
        if (existing) {
            return reply.send({ available: false });
        }
        // If it was a false positive
        return reply.send({ available: true });
    });
    // Signup
    fastify.post('/signup', async (request, reply) => {
        const { username, password, phone } = request.body;
        if (!username || !password || !phone) {
            return reply.code(400).send({ error: 'Username, password, and phone are required' });
        }
        try {
            // Create user
            const user = new User_1.User({ username, password, phone });
            await user.save();
            // Add to bloom filter
            (0, bloom_1.addUsernameToBloomFilter)(username);
            // Generate token
            const token = fastify.jwt.sign({ id: user._id, username: user.username });
            reply.setCookie('civictask_token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 // 30 days
            });
            return reply.send({
                user: { id: user._id, username: user.username, phone: user.phone }
            });
        }
        catch (err) {
            if (err.code === 11000) {
                return reply.code(409).send({ error: 'Username already taken' });
            }
            return reply.code(500).send({ error: err.message });
        }
    });
    // Login
    fastify.post('/login', async (request, reply) => {
        const { username, password } = request.body;
        if (!username || !password) {
            return reply.code(400).send({ error: 'Username and password are required' });
        }
        const user = await User_1.User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return reply.code(401).send({ error: 'Invalid username or password' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return reply.code(401).send({ error: 'Invalid username or password' });
        }
        const token = fastify.jwt.sign({ id: user._id, username: user.username });
        reply.setCookie('civictask_token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });
        return reply.send({
            user: { id: user._id, username: user.username, phone: user.phone }
        });
    });
    // Logout
    fastify.post('/logout', async (request, reply) => {
        reply.clearCookie('civictask_token', { path: '/' });
        return reply.send({ success: true });
    });
    // Get current user (uses authenticate hook implicitly since it checks token)
    fastify.get('/me', { preValidation: [fastify.authenticate] }, async (request, reply) => {
        const jwtUser = request.user;
        const user = await User_1.User.findById(jwtUser.id).lean();
        if (!user) {
            return reply.code(401).send({ error: 'User not found' });
        }
        return reply.send({ user: { id: user._id, username: user.username, phone: user.phone } });
    });
};
exports.authRoutes = authRoutes;
