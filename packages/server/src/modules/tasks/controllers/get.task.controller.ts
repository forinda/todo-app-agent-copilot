import { Request, Response } from 'express';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskService } from '../services/todo.service';
import { validate } from '../../../middleware/validate';
import { getTaskSchema, taskFilterSchema } from '../models/task.model';
import { autobinded } from '../../../utils/autobind';
import { BaseTaskController } from './base.task.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { hasRole } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../auth/models/permissions';

@controller('/api/todos')
@autobinded
export class GetTaskController extends BaseTaskController {
  constructor(@inject(TYPES.TaskService) todoService: ITaskService) {
    super(todoService);
  }

  @httpGet('/', validate(taskFilterSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view todos
  async getAllTasks(req: Request, res: Response) {
    try {
      const { page, limit, categoryId, completed, search, sortField, sortDirection } = req.query;
      
      const options = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        filter: {
          categoryId: categoryId ? Number(categoryId) : undefined,
          completed: completed === 'true',
          search: search as string
        },
        sort: {
          field: sortField as string || 'createdAt',
          direction: (sortDirection as 'asc' | 'desc') || 'desc'
        }
      };

      const result = await this.taskService.getTasks(options);
      return res.status(200).json(result);
    } catch (error) {
      return this.handleError(res, error, 'Error retrieving todos');
    }
  }

  @httpGet('/:id', validate(getTaskSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view a todo
  async getTaskById(@requestParam('id') id: number, req: Request, res: Response) {
    try {
      const todo = await this.taskService.getTaskById(id);
      if (!todo) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json(todo);
    } catch (error) {
      return this.handleError(res, error, `Error retrieving todo ${id}`);
    }
  }

  @httpGet('/category/:categoryId', validate(getTaskSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view todos by category
  async getTasksByCategory(@requestParam('categoryId') categoryId: number, req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      
      const pagination = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10
      };

      const result = await this.taskService.getTasksByCategory(categoryId, pagination);
      return res.status(200).json(result);
    } catch (error) {
      return this.handleError(res, error, `Error retrieving todos for category ${categoryId}`);
    }
  }

  @httpGet('/user/:userId', validate(getTaskSchema), jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view todos by user
  async getTasksByUser(@requestParam('userId') userId: number, req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      
      const pagination = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10
      };

      const result = await this.taskService.getTasksByUser(userId, pagination);
      return res.status(200).json(result);
    } catch (error) {
      return this.handleError(res, error, `Error retrieving todos for user ${userId}`);
    }
  }
}