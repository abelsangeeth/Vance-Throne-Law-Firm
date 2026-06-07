import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authService } from '../services/auth.service';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['client', 'attorney']).optional(),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export class AuthController {
  async signUp(request: FastifyRequest, reply: FastifyReply) {
    const validated = signUpSchema.parse(request.body);
    const user = await authService.signUp(
      validated.name,
      validated.email,
      validated.password,
      validated.role,
    );

    const { accessToken, refreshToken } = authService.generateTokens(request.server.jwt, user);

    // Set HTTP-only secure cookie for the access token
    reply.setCookie('access_token', accessToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    return reply.status(201).send({
      success: true,
      message: 'Account successfully created.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  }

  async signIn(request: FastifyRequest, reply: FastifyReply) {
    const validated = signInSchema.parse(request.body);
    const user = await authService.signIn(validated.email, validated.password);

    const { accessToken, refreshToken } = authService.generateTokens(request.server.jwt, user);

    // Set cookie
    reply.setCookie('access_token', accessToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    return reply.send({
      success: true,
      message: 'Successfully authenticated.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  }

  async signOut(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('access_token', { path: '/' });
    return reply.send({
      success: true,
      message: 'Logged out successfully.',
    });
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({
      success: true,
      user: request.user,
    });
  }
}

export const authController = new AuthController();
export default authController;
