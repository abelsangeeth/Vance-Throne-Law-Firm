import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Log the error
  logger.error({
    msg: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  // Handle validation errors (e.g. Zod)
  if (error instanceof ZodError) {
    const issues = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return reply.status(400).send({
      success: false,
      error: 'Validation Failed',
      code: 'VALIDATION_ERROR',
      details: issues,
    });
  }

  // Handle custom AppErrors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  // Fastify native validation errors
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: error.message,
      code: 'BAD_REQUEST',
    });
  }

  // Fastify JWT errors
  if (error.statusCode === 401) {
    return reply.status(401).send({
      success: false,
      error: 'Unauthorized: Invalid token',
      code: 'UNAUTHORIZED',
    });
  }

  // Generic Internal Server Error (hide database/system internals)
  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({
    success: false,
    error: statusCode === 500 ? 'An unexpected server error occurred.' : error.message,
    code: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR',
  });
}
