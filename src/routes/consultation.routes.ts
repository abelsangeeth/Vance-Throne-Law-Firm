import { FastifyInstance } from 'fastify';
import { consultationController } from '../controllers/consultation.controller';
import { requireAuth } from '../middleware/auth.middleware';

export default async function consultationRoutes(app: FastifyInstance) {
  // All consultation routes require authentication
  app.addHook('preHandler', requireAuth);

  app.post('/', consultationController.book);
  app.get('/', consultationController.list);
  app.get('/jobs', consultationController.jobs);
}
