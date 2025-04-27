import { Request, Response } from 'express';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ICategoryService } from '../services/category.service';
import { validate } from '../../../middleware/validate';
import { getCategorySchema } from '../models/category.model';
import { autobind } from '../../../utils/autobind';
import { BaseCategoryController } from './base.category.controller';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { hasRole } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../../modules/auth/models/permissions';

@controller('/api/categories')
export class GetCategoryController extends BaseCategoryController {
  constructor(@inject(TYPES.CategoryService) categoryService: ICategoryService) {
    super(categoryService);
  }

  @httpGet('/', jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.getAllCategories();
      return res.json(categories);
    } catch (error) {
      return this.handleError(res, error, 'Failed to fetch categories');
    }
  }

  @httpGet('/:id', validate(getCategorySchema), jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view a category
  async getCategoryById(@requestParam('id') id: number, req: Request, res: Response) {
    try {
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.json(category);
    } catch (error) {
      return this.handleError(res, error, `Failed to fetch category ${id}`);
    }
  }
}