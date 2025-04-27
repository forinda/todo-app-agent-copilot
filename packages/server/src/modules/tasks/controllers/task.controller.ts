import { Request, Response } from 'express';
import { 
  controller, 
  httpGet, 
  httpPost, 
  httpPut, 
  httpDelete,
  requestParam,
  requestBody
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskService } from '../services/todo.service';
import { ITaskDTO, createTaskSchema, updateTaskSchema, getTaskSchema, taskFilterSchema, bulkActionSchema } from '../models/task.model';
import { validate } from '../../../middleware/validate';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { hasRole, moderatorRequired } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../auth/models/permissions';
import { GetTaskController } from './get.task.controller';
import { CreateTaskController } from './create.task.controller';
import { UpdateTaskController } from './update.task.controller';
import { DeleteTaskController } from './delete.task.controller';
import { AssignmentTaskController } from './assignment.task.controller';
import { BulkActionTaskController } from './bulk-action.task.controller';

/**
 * This is a facade controller that delegates to specialized controllers.
 * It maintains the same API for backward compatibility while internally
 * following the Single Responsibility Principle.
 */
@controller('/todos')
export class TaskController {
  private getTaskController: GetTaskController;
  private createTaskController: CreateTaskController;
  private updateTaskController: UpdateTaskController;
  private deleteTaskController: DeleteTaskController;
  private assignmentTaskController: AssignmentTaskController;
  private bulkActionTaskController: BulkActionTaskController;

  constructor(
    @inject(TYPES.TaskService) private taskService: ITaskService
  ) {
    this.getTaskController = new GetTaskController(taskService);
    this.createTaskController = new CreateTaskController(taskService);
    this.updateTaskController = new UpdateTaskController(taskService);
    this.deleteTaskController = new DeleteTaskController(taskService);
    this.assignmentTaskController = new AssignmentTaskController(taskService);
    this.bulkActionTaskController = new BulkActionTaskController(taskService);
  }

  @httpGet('/', validate(taskFilterSchema), jwtMiddleware)
  @hasRole(Role.USER)
  async getAllTasks(req: Request, res: Response) {
    return this.getTaskController.getAllTasks(req, res);
  }

  @httpGet('/:id', validate(getTaskSchema), jwtMiddleware)
  @hasRole(Role.USER)
  async getTaskById(@requestParam('id') id: number, req: Request, res: Response) {
    return this.getTaskController.getTaskById(id, req, res);
  }

  @httpPost('/', validate(createTaskSchema), jwtMiddleware)
  @hasRole(Role.USER)
  async createTask(@requestBody() todoData: ITaskDTO, req: Request, res: Response) {
    return this.createTaskController.createTask(todoData, req, res);
  }

  @httpPut('/:id', validate(updateTaskSchema), jwtMiddleware)
  @hasRole(Role.USER)
  async updateTask(
    @requestParam('id') id: number, 
    @requestBody() todoData: Partial<ITaskDTO>, 
    req: Request, 
    res: Response
  ) {
    return this.updateTaskController.updateTask(id, todoData, req, res);
  }

  @httpDelete('/:id', validate(getTaskSchema), jwtMiddleware)
  @moderatorRequired()
  async deleteTask(@requestParam('id') id: number, req: Request, res: Response) {
    return this.deleteTaskController.deleteTask(id, req, res);
  }

  @httpPut('/:id/complete', validate(getTaskSchema), jwtMiddleware)
  @hasRole(Role.USER)
  async completeTask(@requestParam('id') id: number, req: Request, res: Response) {
    return this.updateTaskController.completeTask(id, req, res);
  }

  @httpGet('/category/:categoryId', validate(getTaskSchema), jwtMiddleware)
  @hasRole(Role.USER)
  async getTasksByCategory(@requestParam('categoryId') categoryId: number, req: Request, res: Response) {
    return this.getTaskController.getTasksByCategory(categoryId, req, res);
  }

  @httpGet('/user/:userId', validate(getTaskSchema), jwtMiddleware)
  @hasRole(Role.USER)
  async getTasksByUser(@requestParam('userId') userId: number, req: Request, res: Response) {
    return this.getTaskController.getTasksByUser(userId, req, res);
  }

  @httpPost('/bulk-delete', validate(bulkActionSchema), jwtMiddleware)
  @moderatorRequired()
  async bulkDeleteTasks(req: Request, res: Response) {
    return this.deleteTaskController.bulkDeleteTasks(req, res);
  }

  @httpPost('/bulk-complete', validate(bulkActionSchema), jwtMiddleware)
  @moderatorRequired()
  async bulkCompleteTasks(req: Request, res: Response) {
    return this.bulkActionTaskController.bulkCompleteTasks(req, res);
  }

  @httpPost('/:todoId/assign/:userId', validate(getTaskSchema), jwtMiddleware)
  @moderatorRequired()
  async assignUserToTask(
    @requestParam('todoId') todoId: number,
    @requestParam('userId') userId: number,
    req: Request, 
    res: Response
  ) {
    return this.assignmentTaskController.assignUserToTask(todoId, userId, req, res);
  }

  @httpDelete('/:todoId/assign/:userId', validate(getTaskSchema), jwtMiddleware)
  @moderatorRequired()
  async unassignUserFromTask(
    @requestParam('todoId') todoId: number,
    @requestParam('userId') userId: number,
    req: Request, 
    res: Response
  ) {
    return this.assignmentTaskController.unassignUserFromTask(todoId, userId, req, res);
  }
}