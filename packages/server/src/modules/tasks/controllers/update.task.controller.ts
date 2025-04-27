import { Request, Response } from 'express';
import { controller, httpPut, requestParam, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskService } from '../services/todo.service';
import { ITaskDTO } from '../models/task.model';
import { validate } from '../../../middleware/validate';
import { updateTaskSchema, getTaskSchema } from '../models/task.model';
import { autobind } from '../../../utils/autobind';
import { BaseTaskController } from './base.task.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { hasRole } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../auth/models/permissions';

@controller('/api/todos')
export class UpdateTaskController extends BaseTaskController {
  constructor(@inject(TYPES.TaskService) todoService: ITaskService) {
    super(todoService);
  }

  @httpPut('/:id', validate(updateTaskSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any user can update their todos
  async updateTask(
    @requestParam('id') id: number, 
    @requestBody() todoData: Partial<ITaskDTO>, 
    req: Request, 
    res: Response
  ) {
    try {
      // Add the current user as updater
      const currentUserId = req.user?.userId;
      const dataToUpdate = { ...todoData };
      
      if (currentUserId) {
        // Use spread operator to create a new object with the updatedBy property
        (dataToUpdate as any).updatedBy = String(currentUserId);
      }
      
      const updatedTask = await this.taskService.updateTask(id, dataToUpdate);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.json(updatedTask);
    } catch (error) {
      return this.handleError(res, error, `Failed to update todo ${id}`);
    }
  }

  @httpPut('/:id/complete', validate(getTaskSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any user can complete todos
  async completeTask(@requestParam('id') id: number, req: Request, res: Response) {
    try {
      const completedTask = await this.taskService.completeTask(id);
      if (!completedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.json(completedTask);
    } catch (error) {
      return this.handleError(res, error, `Failed to complete todo ${id}`);
    }
  }
}