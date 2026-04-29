"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerRoutes = void 0;
const AnswerEntry_1 = require("../models/AnswerEntry");
const redis_1 = require("../redis");
const answerRoutes = async (fastify) => {
    // GET all answers
    fastify.get('/', async (request, reply) => {
        const userId = request.user.id;
        const cacheKey = `answers:${userId}`;
        const cached = await (0, redis_1.getCached)(cacheKey);
        if (cached)
            return reply.send(cached);
        const answers = await AnswerEntry_1.AnswerEntry.find({ userId }).lean();
        const formatted = answers.map(a => ({ ...a, id: a._id.toString() }));
        await (0, redis_1.setCache)(cacheKey, formatted, 3600);
        return reply.send(formatted);
    });
    // POST create answer
    fastify.post('/', async (request, reply) => {
        const userId = request.user.id;
        const body = request.body;
        const answer = new AnswerEntry_1.AnswerEntry({ ...body, userId });
        await answer.save();
        await (0, redis_1.invalidateCache)(`answers:${userId}`);
        return reply.code(201).send({ ...answer.toObject(), id: answer._id.toString() });
    });
    // PUT update answer
    fastify.put('/:id', async (request, reply) => {
        const userId = request.user.id;
        const { id } = request.params;
        const body = request.body;
        const answer = await AnswerEntry_1.AnswerEntry.findOneAndUpdate({ _id: id, userId }, { $set: body }, { new: true }).lean();
        if (!answer)
            return reply.code(404).send({ error: 'Answer not found' });
        await (0, redis_1.invalidateCache)(`answers:${userId}`);
        return reply.send({ ...answer, id: answer._id.toString() });
    });
    // DELETE answer
    fastify.delete('/:id', async (request, reply) => {
        const userId = request.user.id;
        const { id } = request.params;
        const answer = await AnswerEntry_1.AnswerEntry.findOneAndDelete({ _id: id, userId });
        if (!answer)
            return reply.code(404).send({ error: 'Answer not found' });
        await (0, redis_1.invalidateCache)(`answers:${userId}`);
        return reply.send({ success: true });
    });
};
exports.answerRoutes = answerRoutes;
