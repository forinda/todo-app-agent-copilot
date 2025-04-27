import { Request, Response, NextFunction } from 'express';
import { Permission, Roles, Role } from '../../modules/auth/models/permissions';

/**
 * Role-based authorization decorator
 * 
 * @param requiredPermissionOrRole The permission required (e.g. Permission.TODO_CREATE),
 * a role (e.g. Role.ADMIN), or a function that returns boolean
 */
export function preAuthorize(requiredPermissionOrRole: number | Role | ((req: Request) => boolean)) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, ...args: any[]) {
      try {
        // Check if user exists on request (set by JWT middleware)
        if (!req.user) {
          return res.status(401).json({ message: 'Authentication required' });
        }

        let isAuthorized = false;

        // Handle permission check as a number (Permission constant)
        if (typeof requiredPermissionOrRole === 'number') {
          // Check if user has admin role for full access
          const isAdmin = req.user.roles.includes(Role.ADMIN);
          
          if (isAdmin) {
            isAuthorized = true;
          } else {
            // Calculate total permissions for all roles the user has
            let userPermissionsValue = 0;
            for (const role of req.user.roles) {
              userPermissionsValue |= Roles.computePermissionsValue(role);
            }
            
            // Check if the user has the required permission
            isAuthorized = Roles.hasPermission(userPermissionsValue, requiredPermissionOrRole);
          }
        } 
        // Handle role-based check
        else if (typeof requiredPermissionOrRole === 'string') {
          isAuthorized = req.user.roles.includes(requiredPermissionOrRole);
        }
        // Handle function-based permission check
        else if (typeof requiredPermissionOrRole === 'function') {
          isAuthorized = requiredPermissionOrRole(req);
        }

        if (!isAuthorized) {
          return res.status(403).json({ 
            message: 'Forbidden: You do not have permission to perform this action'
          });
        }

        // If authorized, proceed with the original method
        return originalMethod.apply(this, [req, res, ...args]);
      } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ message: 'Internal server error during authorization check' });
      }
    };

    return descriptor;
  };
}

/**
 * Role-based authorization decorator
 * 
 * @param requiredRole The role required (e.g. Role.ADMIN)
 */
export function hasRole(requiredRole: Role) {
  return preAuthorize(requiredRole);
}

/**
 * Admin-only decorator (shorthand for preAuthorize(Role.ADMIN))
 */
export function adminRequired() {
  return preAuthorize(Role.ADMIN);
}

/**
 * Moderator-or-above decorator
 */
export function moderatorRequired() {
  return preAuthorize((req: Request) => {
    return !!req.user && req.user.roles.some(role => 
      role === Role.ADMIN || role === Role.MODERATOR
    );
  });
}