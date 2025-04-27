import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { IUserModel, IUserDTO } from '../models/user.model';
import { IUserRepository } from '../repositories/IUserRepository';
import { BaseUserService } from './base.user.service';

export interface ICreateUserService {
  createUser(user: IUserDTO): Promise<IUserModel>;
}

@injectable()
@autobinded
export class CreateUserService extends BaseUserService implements ICreateUserService {
  constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
    super(userRepository);
  }

  
  async createUser(user: IUserDTO): Promise<IUserModel> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    return this.userRepository.create(user);
  }
}