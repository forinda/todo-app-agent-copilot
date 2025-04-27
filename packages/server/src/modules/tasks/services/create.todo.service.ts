import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ITaskModel, ITaskDTO } from '../models/task.model';
import { ITaskRepository } from '../repositories/task.repository';
import { BaseTaskService } from './base.todo.service';

export interface ICreateTaskService {
  createTask(task: ITaskDTO): Promise<ITaskModel>;
}

@injectable()
@autobinded
export class CreateTaskService extends BaseTaskService implements ICreateTaskService {
  constructor(@inject(TYPES.TaskRepository) taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  
  async createTask(task: ITaskDTO): Promise<ITaskModel> {
    return this.taskRepository.create(task);
  }
}