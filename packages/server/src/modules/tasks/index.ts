// Export models
export * from './models/task.model';

// Export repositories
export * from './repositories/task.repository';

// Export services
export * from './services/base.todo.service';
export * from './services/get.todo.service';
export * from './services/create.todo.service';
export * from './services/update.todo.service';
export * from './services/delete.todo.service';
export * from './services/assignment.todo.service';
export * from './services/bulk-action.todo.service';
export * from './services/todo.service';

// Export controllers
export * from './controllers/task.controller';

// Module registration
import { ContainerModule } from 'inversify';
import { TYPES } from '../../types/types';
import { ITaskRepository, TaskRepository } from './repositories/task.repository';
import { ITaskService, TaskService } from './services/todo.service';
import { IGetTaskService, GetTaskService } from './services/get.todo.service';
import { ICreateTaskService, CreateTaskService } from './services/create.todo.service';
import { IUpdateTaskService, UpdateTaskService } from './services/update.todo.service';
import { IDeleteTaskService, DeleteTaskService } from './services/delete.todo.service';
import { IAssignmentTaskService, AssignmentTaskService } from './services/assignment.todo.service';
import { IBulkActionTaskService, BulkActionTaskService } from './services/bulk-action.todo.service';
import { TaskController } from './controllers/task.controller';

export const todoModule = new ContainerModule((bind) => {
  // Bind repositories
  bind<ITaskRepository>(TYPES.TaskRepository).to(TaskRepository).inSingletonScope();
  
  // Bind specialized services
  bind<IGetTaskService>(TYPES.GetTaskService).to(GetTaskService).inSingletonScope();
  bind<ICreateTaskService>(TYPES.CreateTaskService).to(CreateTaskService).inSingletonScope();
  bind<IUpdateTaskService>(TYPES.UpdateTaskService).to(UpdateTaskService).inSingletonScope();
  bind<IDeleteTaskService>(TYPES.DeleteTaskService).to(DeleteTaskService).inSingletonScope();
  bind<IAssignmentTaskService>(TYPES.AssignmentTaskService).to(AssignmentTaskService).inSingletonScope();
  bind<IBulkActionTaskService>(TYPES.BulkActionTaskService).to(BulkActionTaskService).inSingletonScope();
  
  // Bind main todo service (facade)
  bind<ITaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
  
  // Controllers are bound automatically by inversify-express-utils
  bind<TaskController>(TaskController).toSelf();
});