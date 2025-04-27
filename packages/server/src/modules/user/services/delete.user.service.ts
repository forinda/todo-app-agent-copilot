import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { IUserRepository } from '../repositories/IUserRepository';
import { BaseUserService } from './base.user.service';

export interface IDeleteUserService {
  deleteUser(id: number): Promise<boolean>;
}

@injectable()
@autobinded
export class DeleteUserService extends BaseUserService implements IDeleteUserService {
  constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
    super(userRepository);
  }

  
  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}