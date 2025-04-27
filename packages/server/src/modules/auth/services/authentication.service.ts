import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserService } from '../../user/services/user.service';
import { ILoginDTO, IAuthPayload, ITokenResponse } from '../models/auth.model';
import { autobinded } from '../../../utils/autobind';
import { PasswordUtils } from '../../../utils/passwordUtils';
import { IUserModel } from '../../user/models/user.model';
import { Role } from '../models/permissions';
import { ITokenService } from './token.service';

export interface IAuthenticationService {
  login(credentials: ILoginDTO): Promise<ITokenResponse>;
  verifyUserSession(token: string): Promise<IUserModel | null>;
  getUserById(userId: number): Promise<IUserModel | null>;
}

@injectable()
@autobinded
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.PasswordUtils) private passwordUtils: PasswordUtils,
    @inject(TYPES.TokenService) private tokenService: ITokenService
  ) {}

  /**
   * Authenticate user with credentials and return token response
   */
  async login(credentials: ILoginDTO): Promise<ITokenResponse> {
    const { email, password } = credentials;
    
    // Find user by email
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Verify password using PasswordUtils
    if (!await this.passwordUtils.comparePassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    
    // Generate token
    const payload: IAuthPayload = {
      userId: user.id,
      email: user.email,
      roles: user.roles as Role[] || [Role.USER]
    };
    
    const token = this.tokenService.generateToken(payload);
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles as Role[] || [Role.USER]
      }
    };
  }

  /**
   * Verify token and return associated user if valid
   */
  async verifyUserSession(token: string): Promise<IUserModel | null> {
    const decoded = this.tokenService.verifyToken(token);
    if (!decoded) {
      return null;
    }
    
    return this.getUserById(decoded.userId);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<IUserModel | null> {
    return this.userService.getUserById(userId);
  }
}