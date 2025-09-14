import { User } from '@/database/models/user.model';
import { NewUserDTO } from '@/shared/dto';

import { IUserRepository } from '../interfaces';

export class UserSequelizeRepository implements IUserRepository {
  async findById(id: number) {
    return User.findByPk(id);
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async create(data: NewUserDTO) {
    return User.create(data);
  }
}
