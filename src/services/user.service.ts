import { IUserRepository } from '@/repositories/interfaces';
import { NewUserDTO } from '@/shared/dto';
import { HttpError } from '@/shared/errors/httpError';

export class UserService {
  constructor(private readonly repo: IUserRepository) {}

  async getById(id: number) {
    const user = await this.repo.findById(id);
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
    return user;
  }

  async register(input: NewUserDTO) {
    const exists = await this.repo.findByEmail(input.email);
    if (exists) throw new HttpError(409, 'Email ya registrado');
    return this.repo.create({ ...input, role: 'customer' });
  }
}
