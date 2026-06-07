import { User } from '../types/models';
import { mockUsers, initMockDb } from '../utils/mockDb';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    initMockDb();
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    initMockDb();
    const user = mockUsers.find((u) => u.id === id);
    return user || null;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    initMockDb();
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  }
}

export const userRepository = new UserRepository();
export default userRepository;
