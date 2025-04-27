import { Request, Response } from 'express';
import { controller, httpDelete, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ICategoryService } from '../services/category.service';
import { validate } from '../../../middleware/validate';
import { getCategorySchema } from '../models/category.model';
import { autobind } from '../../../utils/autobind';
import { BaseCategoryController } from './base.category.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { adminRequired } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../../modules/auth/models/permissions';

@controller('/api/categories')
export class DeleteCategoryController extends BaseCategoryController {
  constructor(@inject(TYPES.CategoryService) categoryService: ICategoryService) {
    super(categoryService);
  }

  @httpDelete('/:id', validate(getCategorySchema), jwtMiddleware)
  @adminRequired() // Only admin can delete categories
  async deleteCategory(@requestParam('id') id: number, req: Request, res: Response) {
    try {
      const success = await this.categoryService.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: 'Category not found or cannot be deleted' });
      }

      return res.status(204).end();
    } catch (error) {
      return this.handleError(res, error, `Failed to delete category ${id}`);
    }
  }
}