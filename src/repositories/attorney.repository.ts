import { Attorney } from '../types/models';
import { mockAttorneys, initMockDb } from '../utils/mockDb';

export class AttorneyRepository {
  async findAll(): Promise<Attorney[]> {
    initMockDb();
    return [...mockAttorneys];
  }

  async findById(id: string): Promise<Attorney | null> {
    initMockDb();
    const attorney = mockAttorneys.find((a) => a.id === id);
    return attorney || null;
  }
}

export const attorneyRepository = new AttorneyRepository();
export default attorneyRepository;
