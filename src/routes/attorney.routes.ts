import { FastifyInstance } from 'fastify';
import { attorneyController } from '../controllers/attorney.controller';

export default async function attorneyRoutes(app: FastifyInstance) {
  app.get('/', attorneyController.listAttorneys);
  app.get('/:id', attorneyController.getAttorney);
}
