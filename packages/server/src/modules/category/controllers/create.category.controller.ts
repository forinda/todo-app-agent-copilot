import { Request, Response } from 'express';
import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ICategoryService } from '../services/category.service';
import { ICategoryDTO } from '../models/category.model';
import { validate } from '../../../middleware/validate';
import { createCategorySchema } from '../models/category.model';
import { autobind } from '../../../utils/autobind';
import { BaseCategoryController } from './base.category.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { moderatorRequired } from '../../../middleware/authorization/preAuthorize.decorator';

@controller('/api/categories')
export class CreateCategoryController extends BaseCategoryController {
  constructor(@inject(TYPES.CategoryService) categoryService: ICategoryService) {
    super(categoryService);
  }

  @httpPost('/', validate(createCategorySchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can create categories
  async createCategory(@requestBody() categoryData: ICategoryDTO, req: Request, res: Response) {
    try {
      // Add the current user as creator
      const currentUserId = req.user?.userId;
      if (currentUserId) {
        (categoryData as any).createdBy = String(currentUserId);
      }
      
      const newCategory = await this.categoryService.createCategory(categoryData);
      return res.status(201).json(newCategory);
    } catch (error) {
      return this.handleError(res, error, 'Failed to create category');
    }
  }
}