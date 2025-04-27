import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../../modules/auth/models/auth.model';
import { Role } from '../../modules/auth/models/permissions';

declare global {
  namespace Express {
    interface Request {
      user?: IAuthPayload;
    }
  }
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from cookie
  const token = req.cookies?.auth_token;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Verify token
    const secret = process.env.JWT_SECRET || 'default_secret_change_me';
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
    
    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};