import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ILoginDTO, IAuthPayload, ITokenResponse, IRegisterDTO } from '../models/auth.model';
import { autobinded } from '../../../utils/autobind';
import { IUserModel } from '../../user/models/user.model';
import { IAuthenticationService } from './authentication.service';
import { IRegistrationService } from './registration.service';
import { ITokenService } from './token.service';

/**
 * AuthService serves as a facade to coordinate between specialized services
 */
export interface IAuthService {
  login(credentials: ILoginDTO): Promise<ITokenResponse>;
  register(userDetails: IRegisterDTO): Promise<ITokenResponse>;
  generateToken(payload: IAuthPayload): string;
  verifyToken(token: string): IAuthPayload | null;
  getUserById(userId: number): Promise<IUserModel | null>;
}

@injectable()
@autobinded
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.TokenService) private tokenService: ITokenService,
    @inject(TYPES.AuthenticationService) private authenticationService: IAuthenticationService,
    @inject(TYPES.RegistrationService) private registrationService: IRegistrationService
  ) {}

  /**
   * Authenticate user with credentials
   */
  async login(credentials: ILoginDTO): Promise<ITokenResponse> {
    return this.authenticationService.login(credentials);
  }

  /**
   * Register a new user
   */
  async register(userDetails: IRegisterDTO): Promise<ITokenResponse> {
    return this.registrationService.register(userDetails);
  }
  
  /**
   * Generate a JWT token
   */
  generateToken(payload: IAuthPayload): string {
    return this.tokenService.generateToken(payload);
  }
  
  /**
   * Verify a JWT token
   */
  verifyToken(token: string): IAuthPayload | null {
    return this.tokenService.verifyToken(token);
  }

  /**
   * Get a user by ID
   */
  async getUserById(userId: number): Promise<IUserModel | null> {
    return this.authenticationService.getUserById(userId);
  }
}