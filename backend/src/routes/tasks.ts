import { FastifyPluginAsync } from 'fastify';
import { Task } from '../models/Task';
import { getCached, setCache, invalidateCache } from '../redis';

export const taskRoutes: FastifyPluginAsync = async (fastify) => {
  // GET all tasks
  fastify.get('/', async (request, reply) => {
    const userId = (request.user as any).id;
    const cacheKey = `tasks:${userId}`;

    const cached = await getCached(cacheKey);
    if (cached) return reply.send(cached);

    const tasks = await Task.find({ userId }).lean();
    const formatted = tasks.map(t => ({ ...t, id: t._id.toString() }));
    
    await setCache(cacheKey, formatted, 3600);
    return reply.send(formatted);
  });

  // POST create task
  fastify.post('/', async (request, reply) => {
    const userId = (request.user as any).id;
    const body = request.body as any;

    const task = new Task({ ...body, userId });
    await task.save();

    await invalidateCache(`tasks:${userId}`);
    return reply.code(201).send({ ...task.toObject(), id: task._id.toString() });
  });

  // PUT update task
  fastify.put<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = (request.user as any).id;
    const { id } = request.params;
    const body = request.body as any;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId } as any,
      { $set: body },
      { new: true }
    ).lean();

    if (!task) return reply.code(404).send({ error: 'Task not found' });

    await invalidateCache(`tasks:${userId}`);
    return reply.send({ ...task, id: task._id.toString() });
  });

  // DELETE task
  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = (request.user as any).id;
    const { id } = request.params;

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) return reply.code(404).send({ error: 'Task not found' });

    await invalidateCache(`tasks:${userId}`);
    return reply.send({ success: true });
  });
};
