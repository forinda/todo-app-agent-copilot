import { Request, Response } from 'express';
import { controller, httpPut, requestParam, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserService } from '../services/user.service';
import { IUserDTO } from '../models/user.model';
import { validate } from '../../../middleware/validate';
import { updateUserSchema } from '../models/user.model';
import { autobind } from '../../../utils/autobind';
import { BaseUserController } from './base.user.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { hasRole } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../../modules/auth/models/permissions';

@controller('/api/users')
export class UpdateUserController extends BaseUserController {
  constructor(@inject(TYPES.UserService) userService: IUserService) {
    super(userService);
  }

  @httpPut('/:id', validate(updateUserSchema), jwtMiddleware)
  @hasRole(Role.USER) // Base permission needed, but we'll do additional checks inside
  async updateUser(
    @requestParam('id') id: number, 
    @requestBody() userData: Partial<IUserDTO>, 
    req: Request, 
    res: Response
  ) {
    try {
      // Check if user is updating their own profile or has admin privileges
      const currentUserId = req.user?.userId;
      const isSelfUpdate = currentUserId === id;
      const isAdmin = req.user?.roles.includes(Role.ADMIN);
      
      if (!isSelfUpdate && !isAdmin) {
        return res.status(403).json({ 
          message: 'You do not have permission to update other users' 
        });
      }
      
      // If modifying roles, only admin can do that
      if (userData.roles && !isAdmin) {
        return res.status(403).json({ 
          message: 'Only administrators can modify user roles' 
        });
      }

      const updatedUser = await this.userService.updateUser(id, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(updatedUser);
    } catch (error) {
      return this.handleError(res, error, `Failed to update user ${id}`);
    }
  }
}