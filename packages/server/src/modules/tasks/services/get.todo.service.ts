import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { 
  ITaskModel, 
  PaginatedResult, 
  TasksOptions, 
  PaginationOptions 
} from '../models/task.model';
import { ITaskRepository } from '../repositories/task.repository';
import { BaseTaskService } from './base.todo.service';

export interface IGetTaskService {
  getTasks(options: TasksOptions): Promise<PaginatedResult<ITaskModel>>;
  getAllTasks(): Promise<ITaskModel[]>;
  getTaskById(id: number): Promise<ITaskModel | null>;
  getTasksByCategory(categoryId: number, pagination?: PaginationOptions): Promise<PaginatedResult<ITaskModel>>;
  getTasksByUser(userId: number, pagination?: PaginationOptions): Promise<PaginatedResult<ITaskModel>>;
}

@injectable()
@autobinded
export class GetTaskService extends BaseTaskService implements IGetTaskService {
  constructor(@inject(TYPES.TaskRepository) taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  
  async getTasks(options: TasksOptions): Promise<PaginatedResult<ITaskModel>> {
    const { page, limit, filter, sort } = options;
    return this.taskRepository.findWithPagination(page, limit, filter, sort);
  }

  
  async getAllTasks(): Promise<ITaskModel[]> {
    return this.taskRepository.findAll();
  }

  
  async getTaskById(id: number): Promise<ITaskModel | null> {
    return this.taskRepository.findById(id);
  }

  
  async getTasksByCategory(categoryId: number, pagination?: PaginationOptions): Promise<PaginatedResult<ITaskModel>> {
    return this.taskRepository.findByCategoryWithPagination(
      categoryId, 
      pagination?.page || 1, 
      pagination?.limit || 10
    );
  }

  
  async getTasksByUser(userId: number, pagination?: PaginationOptions): Promise<PaginatedResult<ITaskModel>> {
    return this.taskRepository.findByUserWithPagination(
      userId, 
      pagination?.page || 1, 
      pagination?.limit || 10
    );
  }
}