import { Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserService } from '../services/user.service';

export abstract class BaseUserController {
  protected userService: IUserService;

  constructor(@inject(TYPES.UserService) userService: IUserService) {
    this.userService = userService;
  }

  protected handleError(res: Response, error: any, defaultMessage: string): Response {
    console.error('User controller error:', error);
    
    if (error instanceof Error) {
      // Check for known error messages and return appropriate status codes
      if (error.message === 'User with this email already exists' || 
          error.message === 'Email is already in use by another user') {
        return res.status(409).json({ message: error.message });
      }
    }
    
    return res.status(500).json({ message: defaultMessage });
  }
}