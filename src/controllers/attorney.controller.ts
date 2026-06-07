import { FastifyRequest, FastifyReply } from 'fastify';
import { attorneyService } from '../services/attorney.service';
import { z } from 'zod';

const paramSchema = z.object({
  id: z.string().min(1),
});

export class AttorneyController {
  async listAttorneys(request: FastifyRequest, reply: FastifyReply) {
    const startTime = Date.now();
    const attorneys = await attorneyService.getAttorneys();
    const duration = Date.now() - startTime;

    return reply.send({
      success: true,
      duration: `${duration}ms`,
      source: duration < 50 ? 'cache' : 'database',
      count: attorneys.length,
      data: attorneys,
    });
  }

  async getAttorney(request: FastifyRequest, reply: FastifyReply) {
    const { id } = paramSchema.parse(request.params);
    const attorney = await attorneyService.getAttorneyById(id);
    return reply.send({
      success: true,
      data: attorney,
    });
  }
}

export const attorneyController = new AttorneyController();
export default attorneyController;
