import { caseRepository } from '../repositories/case.repository';
import { Case, JWTPayload } from '../types/models';
import { AppError } from '../middleware/error.middleware';

export class CaseService {
  async getCasesForUser(user: JWTPayload): Promise<Case[]> {
    if (user.role === 'admin') {
      return caseRepository.findAll();
    } else if (user.role === 'attorney') {
      // In our mock, Seraphina Vance is 'att-1'
      const attorneyId = user.id === 'usr-attorney' ? 'att-1' : 'unknown';
      return caseRepository.findByAttorneyId(attorneyId);
    } else {
      return caseRepository.findByClientId(user.id);
    }
  }

  async getCaseById(id: string, user: JWTPayload): Promise<Case> {
    const legalCase = await caseRepository.findById(id);
    if (!legalCase) {
      throw new AppError('Case file not found.', 404, 'NOT_FOUND');
    }

    // Access control: Ensure user owns or is assigned to this case
    if (user.role === 'client' && legalCase.clientId !== user.id) {
      throw new AppError('Access denied: You are not authorized to view this case file.', 403, 'FORBIDDEN');
    }

    if (user.role === 'attorney') {
      const attorneyId = user.id === 'usr-attorney' ? 'att-1' : 'unknown';
      if (legalCase.attorneyId !== attorneyId) {
        throw new AppError('Access denied: You are not assigned as counsel to this case.', 403, 'FORBIDDEN');
      }
    }

    return legalCase;
  }
}

export const caseService = new CaseService();
export default caseService;
