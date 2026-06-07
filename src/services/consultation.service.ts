import { consultationRepository } from '../repositories/consultation.repository';
import { attorneyRepository } from '../repositories/attorney.repository';
import { Consultation } from '../types/models';
import { AppError } from '../middleware/error.middleware';
import { queue } from '../utils/queue';

export class ConsultationService {
  async bookConsultation(
    clientId: string,
    attorneyId: string,
    datetime: string,
    topic: string,
    notes?: string,
  ): Promise<Consultation> {
    // Validate attorney exists
    const attorney = await attorneyRepository.findById(attorneyId);
    if (!attorney) {
      throw new AppError('The requested attorney does not exist.', 404, 'ATTORNEY_NOT_FOUND');
    }

    // Create consultation
    const consultation = await consultationRepository.create({
      clientId,
      attorneyId,
      datetime,
      topic,
      notes,
    });

    // Delegate async task (simulated email delivery) to background queue
    await queue.add('send_booking_email', {
      consultationId: consultation.id,
      clientEmail: 'client@lawfirm.com', // In a real app we'd fetch client email
      attorneyName: attorney.name,
      datetime: consultation.datetime,
    });

    return consultation;
  }

  async getClientConsultations(clientId: string): Promise<Consultation[]> {
    return consultationRepository.findByClientId(clientId);
  }

  async getAttorneyConsultations(attorneyId: string): Promise<Consultation[]> {
    return consultationRepository.findByAttorneyId(attorneyId);
  }

  async getAllConsultations(): Promise<Consultation[]> {
    return consultationRepository.findAll();
  }
}

export const consultationService = new ConsultationService();
export default consultationService;
