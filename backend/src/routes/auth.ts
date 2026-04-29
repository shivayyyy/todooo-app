import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { addUsernameToBloomFilter, isUsernameTakenByBloomFilter } from '../bloom';

export const authRoutes: FastifyPluginAsync = async (fastify) => {

  // Check Username Availability
  fastify.get<{ Querystring: { username: string } }>('/check-username', async (request, reply) => {
    const { username } = request.query;
    if (!username) {
      return reply.code(400).send({ error: 'Username is required' });
    }

    // 1. Fast path: Bloom Filter
    if (!isUsernameTakenByBloomFilter(username)) {
      return reply.send({ available: true });
    }

    // 2. Slow path: DB check (since bloom filter can have false positives)
    const existing = await User.findOne({ username: username.toLowerCase() }).lean();
    if (existing) {
      return reply.send({ available: false });
    }

    // If it was a false positive
    return reply.send({ available: true });
  });

  // Signup
  fastify.post('/signup', async (request, reply) => {
    const { username, password, phone } = request.body as any;

    if (!username || !password || !phone) {
      return reply.code(400).send({ error: 'Username, password, and phone are required' });
    }

    try {
      // Create user
      const user = new User({ username, password, phone });
      await user.save();

      // Add to bloom filter
      addUsernameToBloomFilter(username);

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
    } catch (err: any) {
      if (err.code === 11000) {
        return reply.code(409).send({ error: 'Username already taken' });
      }
      return reply.code(500).send({ error: err.message });
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body as any;

    if (!username || !password) {
      return reply.code(400).send({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return reply.code(401).send({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
    const jwtUser = request.user as any;
    const user = await User.findById(jwtUser.id).lean();
    if (!user) {
      return reply.code(401).send({ error: 'User not found' });
    }
    return reply.send({ user: { id: user._id, username: user.username, phone: user.phone } });
  });

};
