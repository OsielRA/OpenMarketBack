import type { IUserRepository } from '../repositories/interfaces/user.repository.js';
import { NewUserDTO } from '../shared/dto/user.dto.js';
import { HttpError } from '../shared/errors/httpError.js';

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
