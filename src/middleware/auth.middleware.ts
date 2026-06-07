import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from './error.middleware';
import { JWTPayload } from '../types/models';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Attempt to verify the JWT from request cookie or header
    const token = request.cookies.access_token || request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError('Authentication token missing. Please sign in.', 401, 'UNAUTHORIZED');
    }

    // verify token using fastify-jwt utility
    const decoded = await request.jwtVerify<JWTPayload>();
    request.user = decoded;
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError('Session expired or invalid token. Please sign in.', 401, 'UNAUTHORIZED');
  }
}

export function requireRole(allowedRoles: ('admin' | 'attorney' | 'client')[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Ensure authentication has run first
    if (!request.user) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const userPayload = request.user as JWTPayload;
    
    if (!allowedRoles.includes(userPayload.role)) {
      throw new AppError(
        'Access denied: You do not have permissions to access this resource.',
        403,
        'FORBIDDEN',
      );
    }
  };
}
