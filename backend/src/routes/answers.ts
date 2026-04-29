import { FastifyPluginAsync } from 'fastify';
import { AnswerEntry } from '../models/AnswerEntry';
import { getCached, setCache, invalidateCache } from '../redis';

export const answerRoutes: FastifyPluginAsync = async (fastify) => {
  // GET all answers
  fastify.get('/', async (request, reply) => {
    const userId = (request.user as any).id;
    const cacheKey = `answers:${userId}`;

    const cached = await getCached(cacheKey);
    if (cached) return reply.send(cached);

    const answers = await AnswerEntry.find({ userId }).lean();
    const formatted = answers.map(a => ({ ...a, id: a._id.toString() }));
    
    await setCache(cacheKey, formatted, 3600);
    return reply.send(formatted);
  });

  // POST create answer
  fastify.post('/', async (request, reply) => {
    const userId = (request.user as any).id;
    const body = request.body as any;

    const answer = new AnswerEntry({ ...body, userId });
    await answer.save();

    await invalidateCache(`answers:${userId}`);
    return reply.code(201).send({ ...answer.toObject(), id: answer._id.toString() });
  });

  // PUT update answer
  fastify.put<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = (request.user as any).id;
    const { id } = request.params;
    const body = request.body as any;

    const answer = await AnswerEntry.findOneAndUpdate(
      { _id: id, userId } as any,
      { $set: body },
      { new: true }
    ).lean();

    if (!answer) return reply.code(404).send({ error: 'Answer not found' });

    await invalidateCache(`answers:${userId}`);
    return reply.send({ ...answer, id: answer._id.toString() });
  });

  // DELETE answer
  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = (request.user as any).id;
    const { id } = request.params;

    const answer = await AnswerEntry.findOneAndDelete({ _id: id, userId });
    if (!answer) return reply.code(404).send({ error: 'Answer not found' });

    await invalidateCache(`answers:${userId}`);
    return reply.send({ success: true });
  });
};
