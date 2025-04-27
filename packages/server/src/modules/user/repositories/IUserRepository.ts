import { IUserModel, IUserDTO } from '../models/user.model';


export interface IUserRepository {
  findAll(): Promise<IUserModel[]>;
  findById(id: number): Promise<IUserModel | null>;
  findByEmail(email: string): Promise<IUserModel | null>;
  create(data: IUserDTO, createdBy?: number): Promise<IUserModel>;
  update(id: number, data: Partial<IUserDTO>, updatedBy?: number): Promise<IUserModel | null>;
  deactivateUser(id: number, deactivatedBy: number): Promise<IUserModel | null>;
  delete(id: number): Promise<boolean>;
}
