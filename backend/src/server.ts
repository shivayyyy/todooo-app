import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { initializeBloomFilter } from './bloom';

import { authRoutes } from './routes/auth';
import { calendarRoutes } from './routes/calendar';
import { taskRoutes } from './routes/tasks';
import { answerRoutes } from './routes/answers';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

dotenv.config();

const fastify = Fastify({ logger: true });

// Register Plugins
fastify.register(cors, {
  origin: true, // required for cookies
  credentials: true
});

fastify.register(fastifyCookie);

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
  cookie: {
    cookieName: 'civictask_token',
    signed: false
  }
});

// Middleware to verify JWT
fastify.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Register Routes
fastify.register(authRoutes, { prefix: '/api/auth' });

// Protected routes
fastify.register(async (app) => {
  app.addHook('onRequest', app.authenticate);
  
  app.register(calendarRoutes, { prefix: '/api/calendar' });
  app.register(taskRoutes, { prefix: '/api/tasks' });
  app.register(answerRoutes, { prefix: '/api/answers' });
});

const start = async () => {
  try {
    // 1. Connect to DB
    await connectDB();
    
    // 2. Initialize Bloom Filter
    await initializeBloomFilter();

    // 3. Start Server
    const port = parseInt(process.env.PORT || '3001', 10);
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
