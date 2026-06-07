import { FastifyRequest, FastifyReply } from 'fastify';
import { cache } from '../utils/cache';

export class HealthController {
  async check(request: FastifyRequest, reply: FastifyReply) {
    const cacheHealthy = await cache.ping();
    
    // Simulate DB ping
    const dbHealthy = true; 

    const healthy = cacheHealthy && dbHealthy;

    return reply.status(healthy ? 200 : 503).send({
      success: healthy,
      status: healthy ? 'UP' : 'DOWN',
      timestamp: new Date(),
      services: {
        database: dbHealthy ? 'HEALTHY' : 'UNHEALTHY',
        cache: cacheHealthy ? 'HEALTHY' : 'UNHEALTHY',
      },
    });
  }
}

export const healthController = new HealthController();
export default healthController;
