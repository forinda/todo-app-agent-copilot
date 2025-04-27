import { Request, Response } from 'express';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserService } from '../services/user.service';
import { validate } from '../../../middleware/validate';
import { getUserSchema } from '../models/user.model';
import { autobind } from '../../../utils/autobind';
import { BaseUserController } from './base.user.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { hasRole, moderatorRequired } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../../modules/auth/models/permissions';

@controller('/api/users')
export class GetUserController extends BaseUserController {
  constructor(@inject(TYPES.UserService) userService: IUserService) {
    super(userService);
  }

  @httpGet('/', jwtMiddleware)
  @moderatorRequired() // List all users requires moderator or admin privileges
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return this.handleError(res, error, 'Failed to fetch users');
    }
  }

  @httpGet('/:id', validate(getUserSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view user details
  async getUserById(@requestParam('id') id: number, req: Request, res: Response) {
    try {
      // Optional: Add additional check to allow users to only view their own profile
      // unless they are admin/moderator
      const currentUserId = req.user?.userId;
      const isSelfProfile = currentUserId === id;
      const isModeratorOrAdmin = req.user?.roles.some(r => 
        r === Role.ADMIN || r === Role.MODERATOR
      );
      
      if (!isSelfProfile && !isModeratorOrAdmin) {
        return res.status(403).json({ 
          message: 'You do not have permission to view other users\' profiles'
        });
      }
      
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      return this.handleError(res, error, `Failed to fetch user ${id}`);
    }
  }

  @httpGet('/email/:email', jwtMiddleware)
  @moderatorRequired() // Looking up users by email requires moderator or admin privileges
  async getUserByEmail(@requestParam('email') email: string, req: Request, res: Response) {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      return this.handleError(res, error, `Failed to fetch user by email ${email}`);
    }
  }
}