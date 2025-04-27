import { Request, Response } from 'express';
import { controller, httpDelete, httpPost, requestParam, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskService } from '../services/todo.service';
import { validate } from '../../../middleware/validate';
import { getTaskSchema, bulkActionSchema } from '../models/task.model';
import { BaseTaskController } from './base.task.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { moderatorRequired } from '../../../middleware/authorization/preAuthorize.decorator';
import { Permission, Role } from '../../auth/models/permissions';

@controller('/api/todos')
export class DeleteTaskController extends BaseTaskController {
  constructor(@inject(TYPES.TaskService) todoService: ITaskService) {
    super(todoService);
  }

  @httpDelete('/:id', validate(getTaskSchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can delete todos
  async deleteTask(@requestParam('id') id: number, req: Request, res: Response) {
    try {
      const success = await this.taskService.deleteTask(id);
      if (!success) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(204).end();
    } catch (error) {
      return this.handleError(res, error, `Failed to delete todo ${id}`);
    }
  }

  @httpPost('/bulk-delete', validate(bulkActionSchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can bulk delete todos
  async bulkDeleteTasks(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      const success = await this.taskService.bulkDeleteTasks(ids);
      
      if (!success) {
        return res.status(400).json({ message: 'Failed to delete some or all todos' });
      }

      return res.status(204).end();
    } catch (error) {
      return this.handleError(res, error, 'Failed to delete todos in bulk');
    }
  }
}