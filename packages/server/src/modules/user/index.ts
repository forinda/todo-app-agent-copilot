// Export models
export * from './models/user.model';

// Export repositories
export * from './repositories/user.repository';

// Export services
export * from './services/base.user.service';
export * from './services/get.user.service';
export * from './services/create.user.service';
export * from './services/update.user.service';
export * from './services/delete.user.service';
export * from './services/user.service';

// Export controllers
export * from './controllers/base.user.controller';
export * from './controllers/get.user.controller';
export * from './controllers/create.user.controller';
export * from './controllers/update.user.controller';
export * from './controllers/delete.user.controller';
export * from './controllers/user.controller';

// Module registration
import { ContainerModule } from 'inversify';
import { TYPES } from '../../types/types';
import { UserRepository } from './repositories/user.repository';
import { IUserRepository } from './repositories/IUserRepository';
import { IUserService, UserService } from './services/user.service';
import { IGetUserService, GetUserService } from './services/get.user.service';
import { ICreateUserService, CreateUserService } from './services/create.user.service';
import { IUpdateUserService, UpdateUserService } from './services/update.user.service';
import { IDeleteUserService, DeleteUserService } from './services/delete.user.service';
import { UserController } from './controllers/user.controller';
import { GetUserController } from './controllers/get.user.controller';
import { CreateUserController } from './controllers/create.user.controller';
import { UpdateUserController } from './controllers/update.user.controller';
import { DeleteUserController } from './controllers/delete.user.controller';

export const userModule = new ContainerModule((bind) => {
  // Bind repositories
  bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
  
  // Bind specialized services
  bind<IGetUserService>(TYPES.GetUserService).to(GetUserService).inSingletonScope();
  bind<ICreateUserService>(TYPES.CreateUserService).to(CreateUserService).inSingletonScope();
  bind<IUpdateUserService>(TYPES.UpdateUserService).to(UpdateUserService).inSingletonScope();
  bind<IDeleteUserService>(TYPES.DeleteUserService).to(DeleteUserService).inSingletonScope();
  
  // Bind main user service (facade)
  bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
  
  // Bind controllers
  bind<UserController>(UserController).toSelf();
  bind<GetUserController>(GetUserController).toSelf();
  bind<CreateUserController>(CreateUserController).toSelf();
  bind<UpdateUserController>(UpdateUserController).toSelf();
  bind<DeleteUserController>(DeleteUserController).toSelf();
});