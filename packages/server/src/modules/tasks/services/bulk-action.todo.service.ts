import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ITaskRepository } from '../repositories/task.repository';
import { BaseTaskService } from './base.todo.service';

export interface IBulkActionTaskService {
  bulkCompleteTasks(ids: number[]): Promise<boolean>;
}

@injectable()
@autobinded
export class BulkActionTaskService extends BaseTaskService implements IBulkActionTaskService {
  constructor(@inject(TYPES.TaskRepository) taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  
  async bulkCompleteTasks(ids: number[]): Promise<boolean> {
    return this.taskRepository.bulkComplete(ids);
  }
}