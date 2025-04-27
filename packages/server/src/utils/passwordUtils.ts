import  bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import { autobinded } from './autobind';

@injectable()
@autobinded
export class PasswordUtils {
  /**
   * Default salt rounds for bcrypt
   * Higher rounds = more secure but slower
   */
  private readonly DEFAULT_SALT_ROUNDS = 10;

  /**
   * Hash a plain text password
   * @param password Plain text password to hash
   * @param saltRounds Optional salt rounds (defaults to 10)
   * @returns Promise resolving to hashed password
   */
  async hashPassword(password: string, saltRounds: number = this.DEFAULT_SALT_ROUNDS): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compare a plain text password against a hashed password
   * @param plainTextPassword Plain text password to compare
   * @param hashedPassword Hashed password to compare against
   * @returns Promise resolving to boolean indicating if passwords match
   */
  async comparePassword(plainTextPassword: string, hashedPassword: string | null): Promise<boolean> {
    if (!hashedPassword) {
      return false;
    }
    
    try {
      const match = await bcrypt.compare(plainTextPassword, hashedPassword);
      return match;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
  
  /**
   * Validates password strength using configurable rules
   * @param password The password to validate
   * @param options Optional validation options
   * @returns Boolean indicating if password meets strength requirements
   */
  validatePasswordStrength(
    password: string, 
    options: {
      minLength?: number,
      requireUppercase?: boolean,
      requireLowercase?: boolean,
      requireNumbers?: boolean,
      requireSpecialChars?: boolean
    } = {}
  ): { valid: boolean, message: string } {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = false
    } = options;
    
    if (password.length < minLength) {
      return { 
        valid: false, 
        message: `Password must be at least ${minLength} characters long` 
      };
    }
    
    if (requireUppercase && !/[A-Z]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one uppercase letter' 
      };
    }
    
    if (requireLowercase && !/[a-z]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one lowercase letter' 
      };
    }
    
    if (requireNumbers && !/\d/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one number' 
      };
    }
    
    if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { 
        valid: false, 
        message: 'Password must contain at least one special character' 
      };
    }
    
    return { valid: true, message: 'Password meets strength requirements' };
  }
}