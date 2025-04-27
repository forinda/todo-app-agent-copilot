import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { IUserModel, IUserDTO } from '../models/user.model';
import { IUserRepository } from '../repositories/IUserRepository';
import { BaseUserService } from './base.user.service';

export interface IUpdateUserService {
  updateUser(id: number, user: Partial<IUserDTO>): Promise<IUserModel | null>;
}

@injectable()
@autobinded
export class UpdateUserService extends BaseUserService implements IUpdateUserService {
  constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
    super(userRepository);
  }

  
  async updateUser(id: number, user: Partial<IUserDTO>): Promise<IUserModel | null> {
    // If email is being updated, check if it's already in use by another user
    if (user.email) {
      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email is already in use by another user');
      }
    }
    
    return this.userRepository.update(id, user);
  }
}