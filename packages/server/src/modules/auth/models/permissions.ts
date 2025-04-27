/**
 * Enum for application roles
 */
export enum Role {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

/**
 * Application permissions using bitwise values
 * Each permission is a power of 2 to allow combining permissions
 */
export class Permission {
  static readonly TODO_READ = 1;      // 2^0 = 1
  static readonly TODO_CREATE = 2;    // 2^1 = 2
  static readonly TODO_UPDATE = 4;    // 2^2 = 4
  static readonly TODO_DELETE = 8;    // 2^3 = 8
  static readonly TODO_ASSIGN = 16;   // 2^4 = 16
  
  static readonly CATEGORY_READ = 32;    // 2^5 = 32
  static readonly CATEGORY_CREATE = 64;  // 2^6 = 64
  static readonly CATEGORY_UPDATE = 128; // 2^7 = 128
  static readonly CATEGORY_DELETE = 256; // 2^8 = 256
  
  static readonly USER_READ = 512;      // 2^9 = 512
  static readonly USER_CREATE = 1024;   // 2^10 = 1024
  static readonly USER_UPDATE = 2048;   // 2^11 = 2048
  static readonly USER_DELETE = 4096;   // 2^12 = 4096
  
  static readonly ADMIN = 8192;         // 2^13 = 8192
}

/**
 * Predefined roles with combinations of permissions
 */
export class Roles {
  static readonly USER = [
    Permission.TODO_READ,
    Permission.TODO_CREATE,
    Permission.TODO_UPDATE,
    Permission.CATEGORY_READ,
    Permission.USER_READ
  ];
  
  static readonly MODERATOR = [
    ...Roles.USER,
    Permission.TODO_DELETE,
    Permission.TODO_ASSIGN,
    Permission.CATEGORY_CREATE,
    Permission.CATEGORY_UPDATE,
  ];
  
  static readonly ADMIN = [
    ...Roles.MODERATOR,
    Permission.CATEGORY_DELETE,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.ADMIN
  ];
  
  /**
   * Maps role names to permission arrays
   */
  static readonly ROLE_PERMISSIONS: Record<string, number[]> = {
    [Role.USER]: Roles.USER,
    [Role.MODERATOR]: Roles.MODERATOR,
    [Role.ADMIN]: Roles.ADMIN
  };
  
  /**
   * Computes the combined permission value for a role
   */
  static computePermissionsValue(roleName: Role | string): number {
    const role = typeof roleName === 'string' ? roleName.toLowerCase() as Role : roleName;
    const permissions = Roles.ROLE_PERMISSIONS[role] || [];
    return permissions.reduce((sum, permission) => sum | permission, 0);
  }
  
  /**
   * Checks if a permissions value includes a specific permission
   */
  static hasPermission(permissionsValue: number, permission: number): boolean {
    return (permissionsValue & permission) === permission;
  }
  
  /**
   * Checks if a role has a specific permission
   */
  static roleHasPermission(role: Role, permission: number): boolean {
    const permissionsValue = Roles.computePermissionsValue(role);
    return Roles.hasPermission(permissionsValue, permission);
  }
}