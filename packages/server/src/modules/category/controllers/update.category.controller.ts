import { Request, Response } from 'express';
import { controller, httpPut, requestParam, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ICategoryService } from '../services/category.service';
import { ICategoryDTO } from '../models/category.model';
import { validate } from '../../../middleware/validate';
import { updateCategorySchema } from '../models/category.model';
import { autobind } from '../../../utils/autobind';
import { BaseCategoryController } from './base.category.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { moderatorRequired } from '../../../middleware/authorization/preAuthorize.decorator';

@controller('/api/categories')
export class UpdateCategoryController extends BaseCategoryController {
  constructor(@inject(TYPES.CategoryService) categoryService: ICategoryService) {
    super(categoryService);
  }

  @httpPut('/:id', validate(updateCategorySchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can update categories
  async updateCategory(
    @requestParam('id') id: number, 
    @requestBody() categoryData: Partial<ICategoryDTO>, 
    req: Request, 
    res: Response
  ) {
    try {
      // Add the current user as updater
      const currentUserId = req.user?.userId;
      if (currentUserId) {
        (categoryData as any).updatedBy = String(currentUserId);
      }
      
      const updatedCategory = await this.categoryService.updateCategory(id, categoryData);
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.json(updatedCategory);
    } catch (error) {
      return this.handleError(res, error, `Failed to update category ${id}`);
    }
  }
}