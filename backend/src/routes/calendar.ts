import { FastifyPluginAsync } from 'fastify';
import { CalendarEvent } from '../models/CalendarEvent';
import { getCached, setCache, invalidateCache } from '../redis';

export const calendarRoutes: FastifyPluginAsync = async (fastify) => {
  // GET all events for a user (with caching)
  fastify.get('/', async (request, reply) => {
    const userId = (request.user as any).id;
    const cacheKey = `calendar:${userId}`;

    const cached = await getCached(cacheKey);
    if (cached) {
      return reply.send(cached);
    }

    const events = await CalendarEvent.find({ userId }).lean();
    
    // Map _id to id for frontend compatibility
    const formatted = events.map(e => ({ ...e, id: e._id.toString() }));
    
    await setCache(cacheKey, formatted, 3600); // Cache for 1 hour
    return reply.send(formatted);
  });

  // POST create event
  fastify.post('/', async (request, reply) => {
    const userId = (request.user as any).id;
    const body = request.body as any;

    const event = new CalendarEvent({ ...body, userId });
    await event.save();

    await invalidateCache(`calendar:${userId}`);

    const formatted = { ...event.toObject(), id: event._id.toString() };
    return reply.code(201).send(formatted);
  });

  // PUT update event
  fastify.put<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = (request.user as any).id;
    const { id } = request.params;
    const body = request.body as any;

    const event = await CalendarEvent.findOneAndUpdate(
      { _id: id, userId } as any,
      { $set: body },
      { new: true }
    ).lean();

    if (!event) return reply.code(404).send({ error: 'Event not found' });

    await invalidateCache(`calendar:${userId}`);
    return reply.send({ ...event, id: event._id.toString() });
  });

  // DELETE event
  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = (request.user as any).id;
    const { id } = request.params;

    const event = await CalendarEvent.findOneAndDelete({ _id: id, userId });
    if (!event) return reply.code(404).send({ error: 'Event not found' });

    await invalidateCache(`calendar:${userId}`);
    return reply.send({ success: true });
  });
};
