import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskRepository } from '../repositories/task.repository';
import { 
  ITaskModel, 
  ITaskDTO, 
  PaginatedResult, 
  TasksOptions,
  PaginationOptions 
} from '../models/task.model';
import { autobind, autobinded } from '../../../utils/autobind';
import { BaseTaskService } from './base.todo.service';
import { IGetTaskService } from './get.todo.service';
import { ICreateTaskService } from './create.todo.service';
import { IUpdateTaskService } from './update.todo.service';
import { IDeleteTaskService } from './delete.todo.service';
import { IAssignmentTaskService } from './assignment.todo.service';
import { IBulkActionTaskService } from './bulk-action.todo.service';

export interface ITaskService {
  getTasks(options: TasksOptions): Promise<PaginatedResult<ITaskModel>>;
  getAllTasks(): Promise<ITaskModel[]>;
  getTaskById(id: number): Promise<ITaskModel | null>;
  createTask(task: ITaskDTO): Promise<ITaskModel>;
  updateTask(id: number, task: Partial<ITaskDTO>): Promise<ITaskModel | null>;
  deleteTask(id: number): Promise<boolean>;
  completeTask(id: number): Promise<ITaskModel | null>;
  getTasksByCategory(categoryId: number, pagination?: PaginationOptions): Promise<PaginatedResult<ITaskModel>>;
  getTasksByUser(userId: number, pagination?: PaginationOptions): Promise<PaginatedResult<ITaskModel>>;
  bulkDeleteTasks(ids: number[]): Promise<boolean>;
  bulkCompleteTasks(ids: number[]): Promise<boolean>;
  assignUserToTask(taskId: number, userId: number): Promise<boolean>;
  unassignUserFromTask(taskId: number, userId: number): Promise<boolean>;
}

/**
 * This is a facade service that delegates to specialized services.
 * It provides a unified interface for all task operations while
 * internally following the single responsibility principle through
 * specialized service classes.
 */
@injectable()
@autobinded
export class TaskService extends BaseTaskService implements ITaskService {
  constructor(
    @inject(TYPES.TaskRepository) taskRepository: ITaskRepository,
    @inject(TYPES.GetTaskService) private getTaskService: IGetTaskService,
    @inject(TYPES.CreateTaskService) private createTaskService: ICreateTaskService,
    @inject(TYPES.UpdateTaskService) private updateTaskService: IUpdateTaskService,
    @inject(TYPES.DeleteTaskService) private deleteTaskService: IDeleteTaskService,
    @inject(TYPES.AssignmentTaskService) private assignmentTaskService: IAssignmentTaskService,
    @inject(TYPES.BulkActionTaskService) private bulkActionTaskService: IBulkActionTaskService
  ) {
    super(taskRepository);
  }

  
  async getTasks(options: TasksOptions): Promise<PaginatedResult<ITaskModel>> {
    return this.getTaskService.getTasks(options);
  }

  
  async getAllTasks(): Promise<ITaskModel[]> {
    return this.getTaskService.getAllTasks();
  }

  
  async getTaskById(id: number): Promise<ITaskModel | null> {
    return this.getTaskService.getTaskById(id);
  }

  
  async createTask(task: ITaskDTO): Promise<ITaskModel> {
    return this.createTaskService.createTask(task);
  }

  
  async updateTask(id: number, task: Partial<ITaskDTO>): Promise<ITaskModel | null> {
    return this.updateTaskService.updateTask(id, task);
  }

  
  async deleteTask(id: number): Promise<boolean> {
    return this.deleteTaskService.deleteTask(id);
  }

  
  async completeTask(id: number): Promise<ITaskModel | null> {
    return this.updateTaskService.completeTask(id);
  }

  
  async getTasksByCategory(categoryId: number, pagination?: PaginationOptions): Promise<PaginatedResult<ITaskModel>> {
    return this.getTaskService.getTasksByCategory(categoryId, pagination);
  }

  
  async getTasksByUser(userId: number, pagination?: PaginationOptions): Promise<PaginatedResult<ITaskModel>> {
    return this.getTaskService.getTasksByUser(userId, pagination);
  }

  
  async bulkDeleteTasks(ids: number[]): Promise<boolean> {
    return this.deleteTaskService.bulkDeleteTasks(ids);
  }

  
  async bulkCompleteTasks(ids: number[]): Promise<boolean> {
    return this.bulkActionTaskService.bulkCompleteTasks(ids);
  }

  
  async assignUserToTask(taskId: number, userId: number): Promise<boolean> {
    return this.assignmentTaskService.assignUserToTask(taskId, userId);
  }

  async unassignUserFromTask(taskId: number, userId: number): Promise<boolean> {
    return this.assignmentTaskService.unassignUserFromTask(taskId, userId);
  }
}