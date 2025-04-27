import { IUserRepository } from '../repositories/IUserRepository';
import { IUserModel, IUserDTO } from '../models/user.model';

export interface IBaseUserService {
  getRepository(): IUserRepository;
}

export abstract class BaseUserService implements IBaseUserService {
  protected userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  getRepository(): IUserRepository {
    return this.userRepository;
  }
}