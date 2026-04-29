"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarRoutes = void 0;
const CalendarEvent_1 = require("../models/CalendarEvent");
const redis_1 = require("../redis");
const calendarRoutes = async (fastify) => {
    // GET all events for a user (with caching)
    fastify.get('/', async (request, reply) => {
        const userId = request.user.id;
        const cacheKey = `calendar:${userId}`;
        const cached = await (0, redis_1.getCached)(cacheKey);
        if (cached) {
            return reply.send(cached);
        }
        const events = await CalendarEvent_1.CalendarEvent.find({ userId }).lean();
        // Map _id to id for frontend compatibility
        const formatted = events.map(e => ({ ...e, id: e._id.toString() }));
        await (0, redis_1.setCache)(cacheKey, formatted, 3600); // Cache for 1 hour
        return reply.send(formatted);
    });
    // POST create event
    fastify.post('/', async (request, reply) => {
        const userId = request.user.id;
        const body = request.body;
        const event = new CalendarEvent_1.CalendarEvent({ ...body, userId });
        await event.save();
        await (0, redis_1.invalidateCache)(`calendar:${userId}`);
        const formatted = { ...event.toObject(), id: event._id.toString() };
        return reply.code(201).send(formatted);
    });
    // PUT update event
    fastify.put('/:id', async (request, reply) => {
        const userId = request.user.id;
        const { id } = request.params;
        const body = request.body;
        const event = await CalendarEvent_1.CalendarEvent.findOneAndUpdate({ _id: id, userId }, { $set: body }, { new: true }).lean();
        if (!event)
            return reply.code(404).send({ error: 'Event not found' });
        await (0, redis_1.invalidateCache)(`calendar:${userId}`);
        return reply.send({ ...event, id: event._id.toString() });
    });
    // DELETE event
    fastify.delete('/:id', async (request, reply) => {
        const userId = request.user.id;
        const { id } = request.params;
        const event = await CalendarEvent_1.CalendarEvent.findOneAndDelete({ _id: id, userId });
        if (!event)
            return reply.code(404).send({ error: 'Event not found' });
        await (0, redis_1.invalidateCache)(`calendar:${userId}`);
        return reply.send({ success: true });
    });
};
exports.calendarRoutes = calendarRoutes;
