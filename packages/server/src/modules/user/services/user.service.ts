import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserRepository } from '../repositories/IUserRepository';
import { IUserModel, IUserDTO } from '../models/user.model';
import { autobind, autobinded } from '../../../utils/autobind';
import { IGetUserService, GetUserService } from './get.user.service';
import { ICreateUserService, CreateUserService } from './create.user.service';
import { IUpdateUserService, UpdateUserService } from './update.user.service';
import { IDeleteUserService, DeleteUserService } from './delete.user.service';
import { BaseUserService } from './base.user.service';

export interface IUserService {
  getAllUsers(): Promise<IUserModel[]>;
  getUserById(id: number): Promise<IUserModel | null>;
  getUserByEmail(email: string): Promise<IUserModel | null>;
  createUser(user: IUserDTO): Promise<IUserModel>;
  updateUser(id: number, user: Partial<IUserDTO>): Promise<IUserModel | null>;
  deleteUser(id: number): Promise<boolean>;
}

@injectable()
@autobinded
export class UserService extends BaseUserService implements IUserService {
  private getUserService: IGetUserService;
  private createUserService: ICreateUserService;
  private updateUserService: IUpdateUserService;
  private deleteUserService: IDeleteUserService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.GetUserService) getUserService: IGetUserService,
    @inject(TYPES.CreateUserService) createUserService: ICreateUserService,
    @inject(TYPES.UpdateUserService) updateUserService: IUpdateUserService,
    @inject(TYPES.DeleteUserService) deleteUserService: IDeleteUserService
  ) {
    super(userRepository);
    this.getUserService = getUserService;
    this.createUserService = createUserService;
    this.updateUserService = updateUserService;
    this.deleteUserService = deleteUserService;
  }

  
  async getAllUsers(): Promise<IUserModel[]> {
    return this.getUserService.getAllUsers();
  }

  
  async getUserById(id: number): Promise<IUserModel | null> {
    return this.getUserService.getUserById(id);
  }

  
  async getUserByEmail(email: string): Promise<IUserModel | null> {
    return this.getUserService.getUserByEmail(email);
  }

  
  async createUser(user: IUserDTO): Promise<IUserModel> {
    return this.createUserService.createUser(user);
  }

  
  async updateUser(id: number, user: Partial<IUserDTO>): Promise<IUserModel | null> {
    return this.updateUserService.updateUser(id, user);
  }

  
  async deleteUser(id: number): Promise<boolean> {
    return this.deleteUserService.deleteUser(id);
  }
}