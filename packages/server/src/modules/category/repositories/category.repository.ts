import { injectable } from 'inversify';
import { db } from '../../../db';
import { TaskCategory } from '../../../db/schema/categories';
import { eq } from 'drizzle-orm';
import { ICategoryModel, ICategoryDTO } from '../models/category.model';
import { autobind, autobinded } from '../../../utils/autobind';

export interface ICategoryRepository {
  findAll(): Promise<ICategoryModel[]>;
  findById(id: number): Promise<ICategoryModel | null>;
  create(data: ICategoryDTO): Promise<ICategoryModel>;
  update(id: number, data: Partial<ICategoryDTO>): Promise<ICategoryModel | null>;
  delete(id: number): Promise<boolean>;
}

@injectable()
@autobinded
export class CategoryRepository implements ICategoryRepository {
  
  async findAll(): Promise<ICategoryModel[]> {
    return db.query.TaskCategory.findMany({
      orderBy: TaskCategory.name
    });
  }

  
  async findById(id: number): Promise<ICategoryModel | null> {
    const result = await db.query.TaskCategory.findFirst({
      where: eq(TaskCategory.id, id)
    });
    
    return result || null;
  }

  
  async create(data: ICategoryDTO): Promise<ICategoryModel> {
    // For now, using a default user ID (1) for both created_by and updated_by
    // In a real application, this would come from the authenticated user's context
    const defaultUserId = 1;
    
    const [newCategory] = await db.insert(TaskCategory)
      .values({
        name: data.name,
        color: data.color || '#3498db',
        created_by: (data as any).createdBy || defaultUserId,
        updated_by: (data as any).updatedBy || defaultUserId
      })
      .returning();
      
    return newCategory;
  }

  
  async update(id: number, data: Partial<ICategoryDTO>): Promise<ICategoryModel | null> {
    // Check if category exists
    const existingCategory = await db.query.TaskCategory.findFirst({
      where: eq(TaskCategory.id, id)
    });
    
    if (!existingCategory) {
      return null;
    }
    
    // For now, using a default user ID for updated_by
    // In a real application, this would come from the authenticated user's context
    const defaultUserId = (data as any).updatedBy || existingCategory.updated_by;
    
    // Update category
    const [updatedCategory] = await db.update(TaskCategory)
      .set({
        name: data.name !== undefined ? data.name : existingCategory.name,
        color: data.color !== undefined ? data.color : existingCategory.color,
        updated_by: defaultUserId,
        updated_at: new Date()
      })
      .where(eq(TaskCategory.id, id))
      .returning();
      
    return updatedCategory;
  }

  
  async delete(id: number): Promise<boolean> {
    // This will only succeed if there are no todos using this category
    // (due to foreign key constraints)
    try {
      const result = await db.delete(TaskCategory)
        .where(eq(TaskCategory.id, id))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      return false;
    }
  }
}