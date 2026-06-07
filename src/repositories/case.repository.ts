import { Case } from '../types/models';
import { mockCases, initMockDb } from '../utils/mockDb';

export class CaseRepository {
  async findByClientId(clientId: string): Promise<Case[]> {
    initMockDb();
    return mockCases.filter((c) => c.clientId === clientId);
  }

  async findByAttorneyId(attorneyId: string): Promise<Case[]> {
    initMockDb();
    return mockCases.filter((c) => c.attorneyId === attorneyId);
  }

  async findAll(): Promise<Case[]> {
    initMockDb();
    return [...mockCases];
  }

  async findById(id: string): Promise<Case | null> {
    initMockDb();
    const item = mockCases.find((c) => c.id === id);
    return item || null;
  }
}

export const caseRepository = new CaseRepository();
export default caseRepository;
