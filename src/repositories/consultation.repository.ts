import { Consultation } from '../types/models';
import { mockConsultations, initMockDb } from '../utils/mockDb';

export class ConsultationRepository {
  async findByClientId(clientId: string): Promise<Consultation[]> {
    initMockDb();
    return mockConsultations.filter((c) => c.clientId === clientId);
  }

  async findByAttorneyId(attorneyId: string): Promise<Consultation[]> {
    initMockDb();
    return mockConsultations.filter((c) => c.attorneyId === attorneyId);
  }

  async findAll(): Promise<Consultation[]> {
    initMockDb();
    return [...mockConsultations];
  }

  async create(data: Omit<Consultation, 'id' | 'createdAt' | 'status'>): Promise<Consultation> {
    initMockDb();
    const newConsultation: Consultation = {
      ...data,
      id: `con-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'confirmed', // Auto-confirm bookings in our template
      createdAt: new Date(),
    };
    mockConsultations.push(newConsultation);
    return newConsultation;
  }
}

export const consultationRepository = new ConsultationRepository();
export default consultationRepository;
