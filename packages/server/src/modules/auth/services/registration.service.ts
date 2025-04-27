import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { IUserService } from '../../user/services/user.service';
import { IRegisterDTO, IAuthPayload, ITokenResponse } from '../models/auth.model';
import { autobinded } from '../../../utils/autobind';
import { PasswordUtils } from '../../../utils/passwordUtils';
import { Role } from '../models/permissions';
import { ITokenService } from './token.service';

export interface IRegistrationService {
  register(userDetails: IRegisterDTO): Promise<ITokenResponse>;
}

@injectable()
@autobinded
export class RegistrationService implements IRegistrationService {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.PasswordUtils) private passwordUtils: PasswordUtils,
    @inject(TYPES.TokenService) private tokenService: ITokenService
  ) {}

  /**
   * Register a new user and return token response
   */
  async register(userDetails: IRegisterDTO): Promise<ITokenResponse> {
    const { email } = userDetails;
    
    // Check if user already exists
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    // Validate password strength
    const passwordValidation = this.passwordUtils.validatePasswordStrength(userDetails.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }
    
    // Hash the password using PasswordUtils
    const hashedPassword = await this.passwordUtils.hashPassword(userDetails.password);
    
    // Create new user
    const newUser = await this.userService.createUser({
      ...userDetails,
      password: hashedPassword,
      roles: userDetails.roles || [Role.USER]
    });
    
    // Generate token
    const payload: IAuthPayload = {
      userId: newUser.id,
      email: newUser.email,
      roles: (newUser.roles as Role[]) || [Role.USER]
    };
    
    const token = this.tokenService.generateToken(payload);
    
    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roles: (newUser.roles as Role[]) || [Role.USER]
      }
    };
  }
}