import { User } from '@/database/models/user.model';
import { NewUserDTO } from '@/shared/dto';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: NewUserDTO): Promise<User>;
}
