import { Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ITaskService } from '../services/todo.service';

export abstract class BaseTaskController {
  protected taskService: ITaskService;

  constructor(@inject(TYPES.TaskService) todoService: ITaskService) {
    this.taskService = todoService;
  }

  protected handleError(res: Response, error: any, defaultMessage: string): Response {
    console.error('Task controller error:', error);
    return res.status(500).json({ message: defaultMessage });
  }
}