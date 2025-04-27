import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskService } from '../services/todo.service';
import { validate } from '../../../middleware/validate';
import { bulkActionSchema } from '../models/task.model';
import { BaseTaskController } from './base.task.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { moderatorRequired } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../auth/models/permissions';

@controller('/api/todos')
export class BulkActionTaskController extends BaseTaskController {
  constructor(@inject(TYPES.TaskService) todoService: ITaskService) {
    super(todoService);
  }

  @httpPost('/bulk-complete', validate(bulkActionSchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can bulk complete todos
  async bulkCompleteTasks(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      const success = await this.taskService.bulkCompleteTasks(ids);
      
      if (!success) {
        return res.status(400).json({ message: 'Failed to complete some or all todos' });
      }

      return res.status(200).json({ message: 'Tasks completed successfully' });
    } catch (error) {
      return this.handleError(res, error, 'Failed to complete todos in bulk');
    }
  }
}