import { FastifyRequest, FastifyReply } from 'fastify';
import { consultationService } from '../services/consultation.service';
import { JWTPayload } from '../types/models';
import { queue } from '../utils/queue';
import { z } from 'zod';

const bookSchema = z.object({
  attorneyId: z.string().min(1, 'Attorney selection is required.'),
  datetime: z.string().datetime({ message: 'A valid datetime ISO string is required.' }),
  topic: z.string().min(3, 'Topic description must be at least 3 characters.'),
  notes: z.string().optional(),
});

export class ConsultationController {
  async book(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as JWTPayload;
    const validated = bookSchema.parse(request.body);

    const consultation = await consultationService.bookConsultation(
      user.id,
      validated.attorneyId,
      validated.datetime,
      validated.topic,
      validated.notes,
    );

    return reply.status(201).send({
      success: true,
      message: 'Consultation appointment scheduled and confirmed. A background job has been queued to deliver your validation details.',
      data: consultation,
    });
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as JWTPayload;
    let consultations;

    if (user.role === 'admin') {
      consultations = await consultationService.getAllConsultations();
    } else if (user.role === 'attorney') {
      // Vance is att-1
      const attorneyId = user.id === 'usr-attorney' ? 'att-1' : 'unknown';
      consultations = await consultationService.getAttorneyConsultations(attorneyId);
    } else {
      consultations = await consultationService.getClientConsultations(user.id);
    }

    return reply.send({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  }

  async jobs(request: FastifyRequest, reply: FastifyReply) {
    const jobs = await queue.getJobs();
    return reply.send({
      success: true,
      data: jobs,
    });
  }
}

export const consultationController = new ConsultationController();
export default consultationController;
