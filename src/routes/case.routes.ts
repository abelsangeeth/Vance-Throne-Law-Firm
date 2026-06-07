import { FastifyInstance } from 'fastify';
import { caseController } from '../controllers/case.controller';
import { requireAuth } from '../middleware/auth.middleware';

export default async function caseRoutes(app: FastifyInstance) {
  // All case routes require authentication
  app.addHook('preHandler', requireAuth);

  app.get('/', caseController.listCases);
  app.get('/:id', caseController.getCase);
}
