import { Request, Response } from 'express';
import { 
  controller, 
  httpGet, 
  httpPost, 
  httpPut, 
  httpDelete,
  requestParam,
  requestBody
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserService } from '../services/user.service';
import { IUserDTO } from '../models/user.model';
import { validate } from '../../../middleware/validate';
import { 
  createUserSchema, 
  updateUserSchema, 
  getUserSchema 
} from '../models/user.model';
import { autobind } from '../../../utils/autobind';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { hasRole, moderatorRequired, adminRequired } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../../modules/auth/models/permissions';
import { GetUserController } from './get.user.controller';
import { CreateUserController } from './create.user.controller';
import { UpdateUserController } from './update.user.controller';
import { DeleteUserController } from './delete.user.controller';

/**
 * This is a facade controller that delegates to specialized controllers.
 * It maintains the same API for backward compatibility while allowing
 * us to transition to a more modular structure that follows the
 * Single Responsibility Principle.
 */
@controller('/users')
export class UserController {
  private getUserController: GetUserController;
  private createUserController: CreateUserController;
  private updateUserController: UpdateUserController;
  private deleteUserController: DeleteUserController;

  constructor(
    @inject(TYPES.UserService) private userService: IUserService
  ) {
    this.getUserController = new GetUserController(userService);
    this.createUserController = new CreateUserController(userService);
    this.updateUserController = new UpdateUserController(userService);
    this.deleteUserController = new DeleteUserController(userService);
  }

  @httpGet('/', jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can list all users
  async getAllUsers(req: Request, res: Response) {
    return this.getUserController.getAllUsers(req, res);
  }

  @httpGet('/:id', validate(getUserSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view user details
  async getUserById(@requestParam('id') id: number, req: Request, res: Response) {
    return this.getUserController.getUserById(id, req, res);
  }

  @httpGet('/email/:email', jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can lookup users by email
  async getUserByEmail(@requestParam('email') email: string, req: Request, res: Response) {
    return this.getUserController.getUserByEmail(email, req, res);
  }

  @httpPost('/', validate(createUserSchema), jwtMiddleware)
  @adminRequired() // Only admin can create users
  async createUser(@requestBody() userData: IUserDTO, req: Request, res: Response) {
    return this.createUserController.createUser(userData, req, res);
  }

  @httpPut('/:id', validate(updateUserSchema), jwtMiddleware)
  @hasRole(Role.USER) // Base permission, additional checks in controller
  async updateUser(
    @requestParam('id') id: number, 
    @requestBody() userData: Partial<IUserDTO>, 
    req: Request, 
    res: Response
  ) {
    return this.updateUserController.updateUser(id, userData, req, res);
  }

  @httpDelete('/:id', validate(getUserSchema), jwtMiddleware)
  @adminRequired() // Only admin can delete users
  async deleteUser(@requestParam('id') id: number, req: Request, res: Response) {
    return this.deleteUserController.deleteUser(id, req, res);
  }
}