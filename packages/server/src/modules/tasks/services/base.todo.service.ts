import { ITaskRepository } from '../repositories/task.repository';
import { ITaskModel, ITaskDTO } from '../models/task.model';

export interface IBaseTaskService {
  getRepository(): ITaskRepository;
}

export abstract class BaseTaskService implements IBaseTaskService {
  protected taskRepository: ITaskRepository;

  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  getRepository(): ITaskRepository {
    return this.taskRepository;
  }
}