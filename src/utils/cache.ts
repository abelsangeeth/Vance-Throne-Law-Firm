import logger from './logger';

interface CacheEntry {
  value: any;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) {
      // Simulate database/network trip delay for a cache miss
      await new Promise((resolve) => setTimeout(resolve, 150));
      logger.debug(`Cache miss for key: ${key}`);
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      logger.debug(`Cache expired for key: ${key}`);
      this.cache.delete(key);
      await new Promise((resolve) => setTimeout(resolve, 150));
      return null;
    }

    logger.debug(`Cache hit for key: ${key}`);
    return entry.value as T;
  }

  async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
    logger.debug(`Cache set for key: ${key} with TTL of ${ttlSeconds}s`);
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
    logger.debug(`Cache deleted for key: ${key}`);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    logger.debug('Cache cleared entirely');
  }

  // Diagnostic helper to simulate cache health check status
  async ping(): Promise<boolean> {
    return true;
  }
}

export const cache = new MemoryCache();
export default cache;
