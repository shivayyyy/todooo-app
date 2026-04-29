"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const bloom_1 = require("./bloom");
const auth_1 = require("./routes/auth");
const calendar_1 = require("./routes/calendar");
const tasks_1 = require("./routes/tasks");
const answers_1 = require("./routes/answers");
dotenv_1.default.config();
const fastify = (0, fastify_1.default)({ logger: true });
// Register Plugins
fastify.register(cors_1.default, {
    origin: true, // required for cookies
    credentials: true
});
fastify.register(cookie_1.default);
fastify.register(jwt_1.default, {
    secret: process.env.JWT_SECRET,
    cookie: {
        cookieName: 'civictask_token',
        signed: false
    }
});
// Middleware to verify JWT
fastify.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
    }
});
// Register Routes
fastify.register(auth_1.authRoutes, { prefix: '/api/auth' });
// Protected routes
fastify.register(async (app) => {
    app.addHook('onRequest', app.authenticate);
    app.register(calendar_1.calendarRoutes, { prefix: '/api/calendar' });
    app.register(tasks_1.taskRoutes, { prefix: '/api/tasks' });
    app.register(answers_1.answerRoutes, { prefix: '/api/answers' });
});
const start = async () => {
    try {
        // 1. Connect to DB
        await (0, db_1.connectDB)();
        // 2. Initialize Bloom Filter
        await (0, bloom_1.initializeBloomFilter)();
        // 3. Start Server
        const port = parseInt(process.env.PORT || '3001', 10);
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
