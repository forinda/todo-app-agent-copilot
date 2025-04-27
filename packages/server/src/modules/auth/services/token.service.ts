import { injectable } from 'inversify';
import { autobinded } from '../../../utils/autobind';
import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../models/auth.model';
import { Role } from '../models/permissions';

export interface ITokenService {
  generateToken(payload: IAuthPayload): string;
  verifyToken(token: string): IAuthPayload | null;
  getTokenSecret(): string;
}

@injectable()
@autobinded
export class TokenService implements ITokenService {
  /**
   * Get JWT secret from environment or use default
   */
  getTokenSecret(): string {
    return process.env.JWT_SECRET || 'default_secret_change_me';
  }
  
  /**
   * Generate a JWT token with the given payload
   */
  generateToken(payload: IAuthPayload): string {
    const secret = this.getTokenSecret();
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }
  
  /**
   * Verify a JWT token and return the decoded payload
   */
  verifyToken(token: string): IAuthPayload | null {
    try {
      const secret = this.getTokenSecret();
      const decoded = jwt.verify(token, secret) as IAuthPayload;
      
      // Ensure roles are properly typed
      if (decoded.roles) {
        decoded.roles = decoded.roles.map(role => {
          // Validate that each role is a valid Role enum value
          if (Object.values(Role).includes(role as Role)) {
            return role as Role;
          }
          return Role.USER; // Default to USER role if invalid
        });
      } else {
        decoded.roles = [Role.USER]; // Default roles if none provided
      }
      
      return decoded;
    } catch (error) {
      return null;
    }
  }
}