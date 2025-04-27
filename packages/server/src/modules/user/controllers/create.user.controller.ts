import { Request, Response } from 'express';
import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserService } from '../services/user.service';
import { IUserDTO } from '../models/user.model';
import { validate } from '../../../middleware/validate';
import { createUserSchema } from '../models/user.model';
import { autobind } from '../../../utils/autobind';
import { BaseUserController } from './base.user.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { adminRequired } from '../../../middleware/authorization/preAuthorize.decorator';

@controller('/api/users')
export class CreateUserController extends BaseUserController {
  constructor(@inject(TYPES.UserService) userService: IUserService) {
    super(userService);
  }

  @httpPost('/', validate(createUserSchema), jwtMiddleware)
  @adminRequired() // Only admin can create users
  async createUser(@requestBody() userData: IUserDTO, req: Request, res: Response) {
    try {
      const newUser = await this.userService.createUser(userData);
      return res.status(201).json(newUser);
    } catch (error) {
      return this.handleError(res, error, 'Failed to create user');
    }
  }
}