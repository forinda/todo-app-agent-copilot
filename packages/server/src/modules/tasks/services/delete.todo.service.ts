import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ITaskRepository } from '../repositories/task.repository';
import { BaseTaskService } from './base.todo.service';

export interface IDeleteTaskService {
  deleteTask(id: number): Promise<boolean>;
  bulkDeleteTasks(ids: number[]): Promise<boolean>;
}

@injectable()
@autobinded
export class DeleteTaskService extends BaseTaskService implements IDeleteTaskService {
  constructor(@inject(TYPES.TaskRepository) taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  
  async deleteTask(id: number): Promise<boolean> {
    return this.taskRepository.delete(id);
  }

  
  async bulkDeleteTasks(ids: number[]): Promise<boolean> {
    return this.taskRepository.bulkDelete(ids);
  }
}