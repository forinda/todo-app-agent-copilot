import { injectable } from 'inversify';
import { db } from '../../../db';
import { Tasks } from '../../../db/schema/tasks';
import { TaskCategory } from '../../../db/schema/categories';
import { Users } from '../../../db/schema/users';
import { eq, and, like, sql, desc, asc, inArray, SQL } from 'drizzle-orm';
import { ITaskModel, ITaskDTO, PaginatedResult, FilterOptions, SortOptions } from '../models/task.model';
import { autobind, autobinded } from '../../../utils/autobind';
import { TaskUsers } from '../../../db/schema';

export interface ITaskRepository {
  findWithPagination(page: number, limit: number, filter?: FilterOptions, sort?: SortOptions): Promise<PaginatedResult<ITaskModel>>;
  findAll(): Promise<ITaskModel[]>;
  findById(id: number): Promise<ITaskModel | null>;
  findByCategory(categoryId: number): Promise<ITaskModel[]>;
  findByCategoryWithPagination(categoryId: number, page: number, limit: number): Promise<PaginatedResult<ITaskModel>>;
  findByUser(userId: number): Promise<ITaskModel[]>;
  findByUserWithPagination(userId: number, page: number, limit: number): Promise<PaginatedResult<ITaskModel>>;
  create(data: ITaskDTO): Promise<ITaskModel>;
  update(id: number, data: Partial<ITaskDTO>): Promise<ITaskModel | null>;
  delete(id: number): Promise<boolean>;
  bulkDelete(ids: number[]): Promise<boolean>;
  bulkComplete(ids: number[]): Promise<boolean>;
  assignUser(taskId: number, userId: number): Promise<boolean>;
  unassignUser(taskId: number, userId: number): Promise<boolean>;
}

@injectable()
@autobinded
export class TaskRepository implements ITaskRepository {
  
  async findWithPagination(
    page: number, 
    limit: number, 
    filter?: FilterOptions,
    sort?: SortOptions
  ): Promise<PaginatedResult<ITaskModel>> {
    // Calculate offset
    const offset = (page - 1) * limit;

    // Start building query conditions
    let conditions: SQL<unknown>[] = [];
    
    if (filter?.categoryId) {
      conditions.push(eq(Tasks.category_id, filter.categoryId));
    }
    
    if (filter?.completed !== undefined) {
      conditions.push(eq(Tasks.completed, filter.completed));
    }
    
    if (filter?.search) {
      conditions.push(like(Tasks.title, `%${filter.search}%`));
    }

    // Count total matching records
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(Tasks);
    
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    // Build the main query
    let orderByClause = desc(Tasks.created_at); // Default ordering
    
    if (sort?.field) {
      // Handle each valid sort field explicitly for type safety
      const column = 
        sort.field === 'id' ? Tasks.id :
        sort.field === 'title' ? Tasks.title :
        sort.field === 'description' ? Tasks.description :
        sort.field === 'completed' ? Tasks.completed :
        sort.field === 'createdAt' ? Tasks.created_at :
        sort.field === 'updatedAt' ? Tasks.updated_at :
        sort.field === 'dueDate' ? Tasks.due_date :
        sort.field === 'categoryId' ? Tasks.category_id :
        Tasks.created_at; // Default fallback
      
      orderByClause = sort.direction === 'asc' ? asc(column) : desc(column);
    }
    
    // Create query with conditional where clause
    const query = db.query.Tasks.findMany({
      with: {
        category: true,
      },
      limit,
      offset,
      orderBy: orderByClause,
      ...(conditions.length > 0 ? { where: and(...conditions) } : {})
    });

    const results = await query;

    // For each task, get assigned users
    const tasksWithUsers = await Promise.all(
      results.map(async (task) => {
        const userAssignments = await db
          .select()
          .from(TaskUsers)
          .where(eq(TaskUsers.task_id, task.id))
          .leftJoin(Users, eq(TaskUsers.user_id, Users.id));

        const assignedUsers = userAssignments.map(assignment => assignment.users);

        return {
          ...task,
          assignedUsers
        } as unknown as ITaskModel;
      })
    );

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      data: tasksWithUsers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  
  async findAll(): Promise<ITaskModel[]> {
    // Get all tasks with their categories
    const results = await db.query.Tasks.findMany({
      with: {
        category: true,
      }
    });

    // For each task, get assigned users
    const tasksWithUsers = await Promise.all(
      results.map(async (task) => {
        const userAssignments = await db
          .select()
          .from(TaskUsers)
          .where(eq(TaskUsers.task_id, task.id))
          .leftJoin(Users, eq(TaskUsers.user_id, Users.id));

        const assignedUsers = userAssignments.map(assignment => assignment.users);

        return {
          ...task,
          assignedUsers
        } as unknown as ITaskModel;
      })
    );

    return tasksWithUsers;
  }

  
  async findById(id: number): Promise<ITaskModel | null> {
    const result = await db.query.Tasks.findFirst({
      where: eq(Tasks.id, id),
      with: {
        category: true,
      }
    });

    if (!result) {
      return null;
    }

    // Get assigned users
    const userAssignments = await db
      .select()
      .from(TaskUsers)
      .where(eq(TaskUsers.task_id, id))
      .leftJoin(Users, eq(TaskUsers.user_id, Users.id));

    const assignedUsers = userAssignments.map(assignment => assignment.users);

    return {
      ...result,
      assignedUsers
    } as unknown as ITaskModel;
  }

  
  async findByCategory(categoryId: number): Promise<ITaskModel[]> {
    const results = await db.query.Tasks.findMany({
      where: eq(Tasks.category_id, categoryId),
      with: {
        category: true,
      }
    });

    // For each task, get assigned users
    const tasksWithUsers = await Promise.all(
      results.map(async (task) => {
        const userAssignments = await db
          .select()
          .from(TaskUsers)
          .where(eq(TaskUsers.task_id, task.id))
          .leftJoin(Users, eq(TaskUsers.user_id, Users.id));

        const assignedUsers = userAssignments.map(assignment => assignment.users);

        return {
          ...task,
          assignedUsers
        } as unknown as ITaskModel;
      })
    );

    return tasksWithUsers;
  }

  
  async findByCategoryWithPagination(
    categoryId: number, 
    page: number, 
    limit: number
  ): Promise<PaginatedResult<ITaskModel>> {
    return this.findWithPagination(page, limit, { categoryId });
  }

  
  async findByUser(userId: number): Promise<ITaskModel[]> {
    // Get all task IDs assigned to this user
    const taskIdsResult = await db
      .select({ taskId: TaskUsers.task_id })
      .from(TaskUsers)
      .where(eq(TaskUsers.user_id, userId));

    const taskIds = taskIdsResult.map(result => result.taskId);

    if (taskIds.length === 0) {
      return [];
    }

    // Get tasks with their categories
    const tasksResult = await db.query.Tasks.findMany({
      where: () => inArray(Tasks.id, taskIds),
      with: {
        category: true,
      }
    });

    // For each task, get assigned users
    const tasksWithUsers = await Promise.all(
      tasksResult.map(async (task) => {
        const userAssignments = await db
          .select()
          .from(TaskUsers)
          .where(eq(TaskUsers.task_id, task.id))
          .leftJoin(Users, eq(TaskUsers.user_id, Users.id));

        const assignedUsers = userAssignments.map(assignment => assignment.users);

        return {
          ...task,
          assignedUsers
        } as unknown as ITaskModel;
      })
    );

    return tasksWithUsers;
  }

  
  async findByUserWithPagination(
    userId: number, 
    page: number, 
    limit: number
  ): Promise<PaginatedResult<ITaskModel>> {
    // Get all task IDs assigned to this user
    const taskIdsResult = await db
      .select({ taskId: TaskUsers.task_id })
      .from(TaskUsers)
      .where(eq(TaskUsers.user_id, userId));

    const taskIds = taskIdsResult.map(result => result.taskId);

    if (taskIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Count total matching records
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(Tasks)
      .where(
        // tasks.id.in(taskIds)
        inArray(Tasks.id, taskIds)
    );

    const total = Number(countResult?.count || 0);

    // Get tasks with pagination
    const tasksResult = await db.query.Tasks.findMany({
      where: () => inArray(Tasks.id, taskIds),
      with: {
        category: true,
      },
      limit,
      offset,
      orderBy: desc(Tasks.created_at)
    });

    // For each task, get assigned users
    const tasksWithUsers = await Promise.all(
      tasksResult.map(async (task) => {
        const userAssignments = await db
          .select()
          .from(TaskUsers)
          .where(eq(TaskUsers.task_id, task.id))
          .leftJoin(Users, eq(TaskUsers.user_id, Users.id));

        const assignedUsers = userAssignments.map(assignment => assignment.users);

        return {
          ...task,
          assignedUsers
        } as unknown as ITaskModel;
      })
    );

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      data: tasksWithUsers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  
  async create(data: ITaskDTO): Promise<ITaskModel> {
    // Create the task
    const [newTask] = await db.insert(Tasks).values({
      title: data.title,
      description: data.description,
      completed: data.completed || false,
      category_id: data.categoryId,
      due_date : data.dueDate instanceof Date ? data.dueDate : data.dueDate ? new Date(data.dueDate) : undefined,
      created_by: 1, // Default created_by field
      updated_by: 1  // Default updated_by field
    }).returning();

    // Assign users if provided
    if (data.assignedUserIds && data.assignedUserIds.length > 0) {
      await Promise.all(
        data.assignedUserIds.map(userId =>
          db.insert(TaskUsers).values({
            task_id: newTask.id,
            user_id: userId,
            created_by: 1, // Default created_by field
            updated_by: 1, // Default updated_by field
          })
        )
      );
    }

    // Fetch the created task with relationships
    return this.findById(newTask.id) as Promise<ITaskModel>;
  }

  
  async update(id: number, data: Partial<ITaskDTO>): Promise<ITaskModel | null> {
    // Check if task exists
    const existingTask = await db.query.Tasks.findFirst({
      where: eq(Tasks.id, id)
    });

    if (!existingTask) {
      return null;
    }

    // Update the task
    const [updatedTask] = await db.update(Tasks)
      .set({
        title: data.title !== undefined ? data.title : existingTask.title,
        description: data.description !== undefined ? data.description : existingTask.description,
        completed: data.completed !== undefined ? data.completed : existingTask.completed,
        category_id: data.categoryId !== undefined ? data.categoryId : existingTask.category_id,
        due_date: data.dueDate instanceof Date 
          ? data.dueDate 
          : data.dueDate 
            ? new Date(data.dueDate) 
            : existingTask.due_date,

        updated_at: new Date(),
        updated_by: 1 // Default updated_by field
      })
      .where(eq(Tasks.id, id))
      .returning();

    // Update user assignments if provided
    if (data.assignedUserIds !== undefined) {
      // Remove all existing assignments
      await db.delete(TaskUsers).where(eq(TaskUsers.task_id, id));

      // Add new assignments
      if (data.assignedUserIds.length > 0) {
        await Promise.all(
          data.assignedUserIds.map(userId =>
            db.insert(TaskUsers).values({
              task_id: id,
              user_id: userId,created_by: 1, // Default created_by field
              updated_by: 1, // Default updated_by field
            })
          )
        );
      }
    }

    // Fetch the updated task with relationships
    return this.findById(id);
  }

  
  async delete(id: number): Promise<boolean> {
    // First delete all user assignments
    await db.delete(TaskUsers).where(eq(TaskUsers.task_id, id));

    // Then delete the task
    const result = await db.delete(Tasks)
      .where(eq(Tasks.id, id))
      .returning();
      
    return result.length > 0;
  }

  
  async bulkDelete(ids: number[]): Promise<boolean> {
    try {
      // First delete all user assignments for these tasks
      await db.delete(TaskUsers).where(inArray(TaskUsers.task_id, ids));

      // Then delete the tasks
      await db.delete(Tasks).where(inArray(Tasks.id, ids));
      
      return true;
    } catch (error) {
      console.error('Error bulk deleting tasks:', error);
      return false;
    }
  }

  
  async bulkComplete(ids: number[]): Promise<boolean> {
    try {
      await db.update(Tasks)
        .set({ 
          completed: true,
          updated_at: new Date()
        })
        .where(inArray(Tasks.id, ids));
      
      return true;
    } catch (error) {
      console.error('Error bulk completing tasks:', error);
      return false;
    }
  }

  
  async assignUser(taskId: number, userId: number): Promise<boolean> {
    try {
      // Check if task exists
      const task = await db.query.Tasks.findFirst({
        where: eq(Tasks.id, taskId)
      });
      
      if (!task) {
        return false;
      }
      
      // Check if user exists
      const user = await db.query.Users.findFirst({
        where: eq(Users.id, userId)
      });
      
      if (!user) {
        return false;
      }
      
      // Check if assignment already exists
      const existingAssignment = await db
        .select()
        .from(TaskUsers)
        .where(and(
          eq(TaskUsers.task_id, taskId),
          eq(TaskUsers.user_id, userId)
        ));
      
      if (existingAssignment.length > 0) {
        return true; // Assignment already exists
      }
      
      // Create assignment
      await db.insert(TaskUsers).values({
        task_id: taskId,
        user_id: userId,
        created_by: userId, // Assuming the user being assigned is also the creator
        updated_by: userId, // Assuming the user being assigned is also the updater
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning user to task:', error);
      return false;
    }
  }

  
  async unassignUser(taskId: number, userId: number): Promise<boolean> {
    try {
      const result = await db.delete(TaskUsers)
        .where(and(
          eq(TaskUsers.task_id, taskId),
          eq(TaskUsers.user_id, userId)
        ))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Error unassigning user from task:', error);
      return false;
    }
  }
}