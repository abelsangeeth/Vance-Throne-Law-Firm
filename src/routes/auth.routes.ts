import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

export default async function authRoutes(app: FastifyInstance) {
  app.post('/signup', authController.signUp);
  app.post('/signin', authController.signIn);
  app.post('/signout', authController.signOut);
  app.get('/me', { preHandler: [requireAuth] }, authController.getProfile);
}
