import { Request, Response } from 'express';
import { controller, httpPost, httpGet, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IAuthService } from '../services/auth.service';
import { ILoginDTO, IRegisterDTO } from '../models/auth.model';
import { validate } from '../../../middleware/validate';
import { loginSchema, registerSchema } from '../models/auth.model';
import { Role } from '../models/permissions';
import { ISessionService } from '../services/session.service';

@controller('/auth')
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.SessionService) private sessionService: ISessionService
  ) {}

  @httpPost('/login', validate(loginSchema))
  async login(@requestBody() credentials: ILoginDTO, req: Request, res: Response) {
    try {
      const result = await this.authService.login(credentials);
      
      // Set session token as HTTP-only cookie
      this.sessionService.setSessionCookie(res, result.token);
      
      // Return only the user info, not the token (token is in cookie)
      const { token, ...userInfo } = result;
      return res.success(userInfo, 'Login successful', 200);
    } catch (error: any) {
      return res.error(error.message || 'Authentication failed', 401, 'AUTH_ERROR');
    }
  }

  @httpPost('/logout')
  async logout(req: Request, res: Response) {
    // Clear the auth cookie
    this.sessionService.clearSessionCookie(res);
    return res.success(null, 'Logged out successfully', 200);
  }

  @httpGet('/me')
  async getCurrentUser(req: Request, res: Response) {
    try {
      // Extract token from cookie
      const token = req.cookies.auth_token;
      
      if (!token) {
        return res.error('Authentication required', 401, 'AUTH_REQUIRED');
      }
      
      // Verify token
      const userInfo = this.authService.verifyToken(token);
      if (!userInfo) {
        return res.error('Invalid or expired session', 401, 'INVALID_SESSION');
      }
      
      // Get user profile
      const user = await this.authService.getUserById(userInfo.userId);
      if (!user) {
        return res.error('User not found', 404, 'USER_NOT_FOUND');
      }
      
      // Remove sensitive information
      const { password, ...userWithoutPassword } = user;
      
      return res.success(userWithoutPassword, 'User profile retrieved successfully');
    } catch (error: any) {
      return res.error(error.message || 'Authentication failed', 401, 'AUTH_ERROR');
    }
  }

  @httpPost('/register', validate(registerSchema))
  async register(@requestBody() userDetails: IRegisterDTO, req: Request, res: Response) {
    try {
      const result = await this.authService.register(userDetails);
      
      // Set session token as HTTP-only cookie for immediate login after registration
      this.sessionService.setSessionCookie(res, result.token);
      
      // Return only the user info, not the token (token is in cookie)
      const { token, ...userInfo } = result;
      return res.success(userInfo, 'Registration successful', 201);
    } catch (error: any) {
      return res.error(error.message || 'Registration failed', 400, 'REGISTRATION_ERROR');
    }
  }
}