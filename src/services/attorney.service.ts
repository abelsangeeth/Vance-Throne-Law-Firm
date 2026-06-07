import { attorneyRepository } from '../repositories/attorney.repository';
import { Attorney } from '../types/models';
import { cache } from '../utils/cache';
import { AppError } from '../middleware/error.middleware';

export class AttorneyService {
  async getAttorneys(): Promise<Attorney[]> {
    const cacheKey = 'attorneys_list';
    
    // Attempt cache lookup
    const cachedData = await cache.get<Attorney[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Cache miss: Fetch from repository
    const attorneys = await attorneyRepository.findAll();
    
    // Set cache with 60 second TTL
    await cache.set(cacheKey, attorneys, 60);

    return attorneys;
  }

  async getAttorneyById(id: string): Promise<Attorney> {
    const attorney = await attorneyRepository.findById(id);
    if (!attorney) {
      throw new AppError('Attorney not found.', 404, 'NOT_FOUND');
    }
    return attorney;
  }
}

export const attorneyService = new AttorneyService();
export default attorneyService;
