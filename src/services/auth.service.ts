import bcrypt from 'bcryptjs';
import { JWT } from '@fastify/jwt';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../middleware/error.middleware';
import { User, JWTPayload } from '../types/models';

export class AuthService {
  async signUp(
    name: string,
    email: string,
    password: string,
    role: 'client' | 'attorney' = 'client',
  ): Promise<User> {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('An account with this email address already exists.', 400, 'USER_EXISTS');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      role,
    });

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    return user;
  }

  generateTokens(jwtSigner: JWT, user: User) {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwtSigner.sign(payload, { expiresIn: '15m' });
    const refreshToken = jwtSigner.sign({ id: user.id }, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
export default authService;
