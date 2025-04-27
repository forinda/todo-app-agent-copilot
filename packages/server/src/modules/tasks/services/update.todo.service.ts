import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ITaskModel, ITaskDTO } from '../models/task.model';
import { ITaskRepository } from '../repositories/task.repository';
import { BaseTaskService } from './base.todo.service';

export interface IUpdateTaskService {
  updateTask(id: number, task: Partial<ITaskDTO>): Promise<ITaskModel | null>;
  completeTask(id: number): Promise<ITaskModel | null>;
}

@injectable()
@autobinded
export class UpdateTaskService extends BaseTaskService implements IUpdateTaskService {
  constructor(@inject(TYPES.TaskRepository) taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  
  async updateTask(id: number, task: Partial<ITaskDTO>): Promise<ITaskModel | null> {
    return this.taskRepository.update(id, task);
  }

  
  async completeTask(id: number): Promise<ITaskModel | null> {
    const task = await this.taskRepository.findById(id);
    
    if (!task) {
      return null;
    }
    
    return this.taskRepository.update(id, { completed: true });
  }
}