import { Request, Response } from 'express';
import { controller, httpDelete, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserService } from '../services/user.service';
import { validate } from '../../../middleware/validate';
import { getUserSchema } from '../models/user.model';
import { autobind } from '../../../utils/autobind';
import { BaseUserController } from './base.user.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { adminRequired } from '../../../middleware/authorization/preAuthorize.decorator';

@controller('/api/users')
export class DeleteUserController extends BaseUserController {
  constructor(@inject(TYPES.UserService) userService: IUserService) {
    super(userService);
  }

  @httpDelete('/:id', validate(getUserSchema), jwtMiddleware)
  @adminRequired() // Only admin can delete users
  async deleteUser(@requestParam('id') id: number, req: Request, res: Response) {
    try {
      // Prevent admins from deleting themselves
      if (id === req.user?.userId) {
        return res.status(400).json({ message: 'You cannot delete your own account' });
      }
      
      const success = await this.userService.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: 'User not found or cannot be deleted' });
      }

      return res.status(204).end();
    } catch (error) {
      return this.handleError(res, error, `Failed to delete user ${id}`);
    }
  }
}