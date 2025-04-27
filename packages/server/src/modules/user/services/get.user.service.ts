import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { IUserModel } from '../models/user.model';
import { IUserRepository } from '../repositories/IUserRepository';
import { BaseUserService } from './base.user.service';

export interface IGetUserService {
  getAllUsers(): Promise<IUserModel[]>;
  getUserById(id: number): Promise<IUserModel | null>;
  getUserByEmail(email: string): Promise<IUserModel | null>;
}

@injectable()
@autobinded
export class GetUserService extends BaseUserService implements IGetUserService {
  constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
    super(userRepository);
  }

  
  async getAllUsers(): Promise<IUserModel[]> {
    return this.userRepository.findAll();
  }

  
  async getUserById(id: number): Promise<IUserModel | null> {
    return this.userRepository.findById(id);
  }

  
  async getUserByEmail(email: string): Promise<IUserModel | null> {
    return this.userRepository.findByEmail(email);
  }
}