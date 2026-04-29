"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const Task_1 = require("../models/Task");
const redis_1 = require("../redis");
const taskRoutes = async (fastify) => {
    // GET all tasks
    fastify.get('/', async (request, reply) => {
        const userId = request.user.id;
        const cacheKey = `tasks:${userId}`;
        const cached = await (0, redis_1.getCached)(cacheKey);
        if (cached)
            return reply.send(cached);
        const tasks = await Task_1.Task.find({ userId }).lean();
        const formatted = tasks.map(t => ({ ...t, id: t._id.toString() }));
        await (0, redis_1.setCache)(cacheKey, formatted, 3600);
        return reply.send(formatted);
    });
    // POST create task
    fastify.post('/', async (request, reply) => {
        const userId = request.user.id;
        const body = request.body;
        const task = new Task_1.Task({ ...body, userId });
        await task.save();
        await (0, redis_1.invalidateCache)(`tasks:${userId}`);
        return reply.code(201).send({ ...task.toObject(), id: task._id.toString() });
    });
    // PUT update task
    fastify.put('/:id', async (request, reply) => {
        const userId = request.user.id;
        const { id } = request.params;
        const body = request.body;
        const task = await Task_1.Task.findOneAndUpdate({ _id: id, userId }, { $set: body }, { new: true }).lean();
        if (!task)
            return reply.code(404).send({ error: 'Task not found' });
        await (0, redis_1.invalidateCache)(`tasks:${userId}`);
        return reply.send({ ...task, id: task._id.toString() });
    });
    // DELETE task
    fastify.delete('/:id', async (request, reply) => {
        const userId = request.user.id;
        const { id } = request.params;
        const task = await Task_1.Task.findOneAndDelete({ _id: id, userId });
        if (!task)
            return reply.code(404).send({ error: 'Task not found' });
        await (0, redis_1.invalidateCache)(`tasks:${userId}`);
        return reply.send({ success: true });
    });
};
exports.taskRoutes = taskRoutes;
