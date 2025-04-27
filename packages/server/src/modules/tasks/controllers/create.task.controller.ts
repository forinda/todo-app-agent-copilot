import { Request, Response } from 'express';
import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskService } from '../services/todo.service';
import { ITaskDTO } from '../models/task.model';
import { validate } from '../../../middleware/validate';
import { createTaskSchema } from '../models/task.model';
import { autobind } from '../../../utils/autobind';
import { BaseTaskController } from './base.task.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { preAuthorize, hasRole } from '../../../middleware/authorization/preAuthorize.decorator';
import { Permission, Role } from '../../auth/models/permissions';

@controller('/api/todos')
export class CreateTaskController extends BaseTaskController {
  constructor(@inject(TYPES.TaskService) todoService: ITaskService) {
    super(todoService);
  }

  @httpPost('/', validate(createTaskSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any user can create todos
  async createTask(@requestBody() todoData: ITaskDTO, req: Request, res: Response) {
    try {
      // Add the current user as creator
      const currentUserId = req.user?.userId;
      if (currentUserId) {
        (todoData as any).createdBy = String(currentUserId);
      }
      
      const newTask = await this.taskService.createTask(todoData);
      return res.status(201).json(newTask);
    } catch (error) {
      return this.handleError(res, error, 'Failed to create todo');
    }
  }
}