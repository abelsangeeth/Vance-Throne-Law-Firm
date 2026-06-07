import { FastifyRequest, FastifyReply } from 'fastify';
import { caseService } from '../services/case.service';
import { JWTPayload } from '../types/models';
import { z } from 'zod';

const paramSchema = z.object({
  id: z.string().min(1),
});

export class CaseController {
  async listCases(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as JWTPayload;
    const cases = await caseService.getCasesForUser(user);
    
    return reply.send({
      success: true,
      count: cases.length,
      data: cases,
    });
  }

  async getCase(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as JWTPayload;
    const { id } = paramSchema.parse(request.params);
    const legalCase = await caseService.getCaseById(id, user);

    return reply.send({
      success: true,
      data: legalCase,
    });
  }
}

export const caseController = new CaseController();
export default caseController;
