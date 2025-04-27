import { Request, Response } from 'express';
import { controller, httpPost, httpDelete, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskService } from '../services/todo.service';
import { validate } from '../../../middleware/validate';
import { getTaskSchema } from '../models/task.model';
import { autobind } from '../../../utils/autobind';
import { BaseTaskController } from './base.task.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { moderatorRequired } from '../../../middleware/authorization/preAuthorize.decorator';
import { Permission, Role } from '../../auth/models/permissions';

@controller('/api/todos')
export class AssignmentTaskController extends BaseTaskController {
  constructor(@inject(TYPES.TaskService) todoService: ITaskService) {
    super(todoService);
  }

  @httpPost('/:todoId/assign/:userId', validate(getTaskSchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can assign users to todos
  async assignUserToTask(
    @requestParam('todoId') todoId: number,
    @requestParam('userId') userId: number,
    req: Request, 
    res: Response
  ) {
    try {
      const success = await this.taskService.assignUserToTask(todoId, userId);
      if (!success) {
        return res.status(404).json({ message: 'Task or user not found' });
      }

      return res.status(200).json({ message: 'User assigned to todo successfully' });
    } catch (error) {
      return this.handleError(res, error, `Failed to assign user ${userId} to todo ${todoId}`);
    }
  }

  @httpDelete('/:todoId/assign/:userId', validate(getTaskSchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can unassign users from todos
  async unassignUserFromTask(
    @requestParam('todoId') todoId: number,
    @requestParam('userId') userId: number,
    req: Request, 
    res: Response
  ) {
    try {
      const success = await this.taskService.unassignUserFromTask(todoId, userId);
      if (!success) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      return res.status(200).json({ message: 'User unassigned from todo successfully' });
    } catch (error) {
      return this.handleError(res, error, `Failed to unassign user ${userId} from todo ${todoId}`);
    }
  }
}