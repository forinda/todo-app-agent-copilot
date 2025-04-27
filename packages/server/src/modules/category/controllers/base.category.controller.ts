import { Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ICategoryService } from '../services/category.service';

export abstract class BaseCategoryController {
  protected categoryService: ICategoryService;

  constructor(@inject(TYPES.CategoryService) categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  protected handleError(res: Response, error: any, defaultMessage: string): Response {
    console.error('Category controller error:', error);
    return res.status(500).json({ message: defaultMessage });
  }
}