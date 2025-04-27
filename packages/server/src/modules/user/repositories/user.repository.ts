import { injectable, inject } from 'inversify';
import { db } from '../../../db';
import { eq } from 'drizzle-orm';
import { IUserModel, IUserDTO } from '../models/user.model';
import { autobinded } from '../../../utils/autobind';
import { Users } from '../../../db/schema';
import { IUserRepository } from './IUserRepository';
import { TYPES } from '../../../types/types';
import { PasswordUtils } from '../../../utils/passwordUtils';

@injectable()
@autobinded
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.PasswordUtils) private passwordUtils: PasswordUtils
  ) {}
  
  async findAll(): Promise<IUserModel[]> {
    const users_ = await db.query.Users.findMany({
      orderBy: Users.name,

    });
    
    return users_
  }

  
  async findById(id: number): Promise<IUserModel | null> {
    const user = await db.query.Users.findFirst({
      where: eq(Users.id, id)
    });
    if (!user) return null;
    return {
      ...user,
      roles: user.roles || []
    } as IUserModel;
  }
  
  async findByEmail(email: string): Promise<IUserModel | null> {
    const user = await db.query.Users.findFirst({
      where: eq(Users.email, email)
    });
    return user as IUserModel | null;
  }

  
  async create(data: IUserDTO, createdBy?: number): Promise<IUserModel> {
    // Hash password if provided
    let hashedPassword: string | undefined = undefined;
    
    if (data.password) {
      hashedPassword = await this.passwordUtils.hashPassword(data.password);
    }
    
    const now = new Date();
    
    const [newUser] = await db.insert(Users)
      .values({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        password: hashedPassword,
        roles: data.roles || ['user'], // Default role
        created_at: now,
        updated_at: now,
        is_active: true
      })
      .returning();
      
    return newUser as IUserModel;
  }

  
  async update(id: number, data: Partial<IUserDTO>, updatedBy?: number): Promise<IUserModel | null> {
    // Check if user exists
    const existingUser = await db.query.Users.findFirst({
      where: eq(Users.id, id)
    });
    
    if (!existingUser) {
      return null;
    }
    
    // Hash password if provided in update
    let hashedPassword = existingUser.password;
    
    if (data.password) {
      hashedPassword = await this.passwordUtils.hashPassword(data.password);
    }
    
    // Update user
    const [updatedUser] = await db.update(Users)
      .set({
        name: data.name !== undefined ? data.name : existingUser.name,
        email: data.email !== undefined ? data.email : existingUser.email,
        avatar: data.avatar !== undefined ? data.avatar : existingUser.avatar,
        password: hashedPassword,
        roles: data.roles !== undefined ? data.roles : existingUser.roles,
        updated_at: new Date(),
      })
      .where(eq(Users.id, id))
      .returning();
      
    return {
      ...updatedUser,
      roles: updatedUser.roles || []
    } as IUserModel | null;
  }

  // New method specifically for deactivating a user (making them inactive)
  async deactivateUser(id: number, deactivatedBy: number): Promise<IUserModel | null> {
    // In this implementation, we're using the roles array to track user status
    // We could alternatively add a separate "isActive" field to the schema
    const existingUser = await this.findById(id);
    
    if (!existingUser) {
      return null;
    }
    
    // Remove active roles and add 'inactive' role
    const updatedRoles = existingUser!.roles?.filter(role => role !== 'admin' && role !== 'user');
    updatedRoles!.push('inactive');
    
    // Update the user with audit info
    const [deactivatedUser] = await db.update(Users)
      .set({
        roles: updatedRoles,
        updated_at: new Date(),
        deactivated_by: deactivatedBy,
        deactivated_at: new Date(),
        is_active: false,
      })
      .where(eq(Users.id, id))
      .returning();
      
    return {
      ...deactivatedUser,
      roles: deactivatedUser.roles || []
    } as IUserModel | null;
  }

  
  async delete(id: number): Promise<boolean> {
    // This will only succeed if there are no todos assigned to this user
    // (due to foreign key constraints)
    try {
      const result = await db.delete(Users)
        .where(eq(Users.id, id))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      return false;
    }
  }
}