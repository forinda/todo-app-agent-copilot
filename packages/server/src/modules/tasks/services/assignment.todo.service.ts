import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ITaskRepository } from '../repositories/task.repository';
import { BaseTaskService } from './base.todo.service';

export interface IAssignmentTaskService {
  assignUserToTask(taskId: number, userId: number): Promise<boolean>;
  unassignUserFromTask(taskId: number, userId: number): Promise<boolean>;
}

@injectable()
@autobinded
export class AssignmentTaskService extends BaseTaskService implements IAssignmentTaskService {
  constructor(@inject(TYPES.TaskRepository) taskRepository: ITaskRepository) {
    super(taskRepository);
  }

  
  async assignUserToTask(taskId: number, userId: number): Promise<boolean> {
    return this.taskRepository.assignUser(taskId, userId);
  }

  
  async unassignUserFromTask(taskId: number, userId: number): Promise<boolean> {
    return this.taskRepository.unassignUser(taskId, userId);
  }
}