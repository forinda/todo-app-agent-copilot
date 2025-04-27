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
import { ICategoryService } from '../services/category.service';
import { ICategoryDTO } from '../models/category.model';
import { validate } from '../../../middleware/validate';
import { 
  createCategorySchema, 
  updateCategorySchema, 
  getCategorySchema 
} from '../models/category.model';
import { autobind } from '../../../utils/autobind';
import { jwtMiddleware } from '../../../middleware/authorization/jwt.middleware';
import { hasRole, moderatorRequired, adminRequired } from '../../../middleware/authorization/preAuthorize.decorator';
import { Role } from '../../../modules/auth/models/permissions';

// Import specialized controllers
import { GetCategoryController } from './get.category.controller';
import { CreateCategoryController } from './create.category.controller';
import { UpdateCategoryController } from './update.category.controller';
import { DeleteCategoryController } from './delete.category.controller';

/**
 * This is a facade controller that delegates to specialized controllers.
 * It maintains the same API for backward compatibility while internally
 * following the Single Responsibility Principle.
 */
@controller('/categories')
export class CategoryController {
  private getCategoryController: GetCategoryController;
  private createCategoryController: CreateCategoryController;
  private updateCategoryController: UpdateCategoryController;
  private deleteCategoryController: DeleteCategoryController;

  constructor(
    @inject(TYPES.CategoryService) private categoryService: ICategoryService
  ) {
    this.getCategoryController = new GetCategoryController(categoryService);
    this.createCategoryController = new CreateCategoryController(categoryService);
    this.updateCategoryController = new UpdateCategoryController(categoryService);
    this.deleteCategoryController = new DeleteCategoryController(categoryService);
  }

  @httpGet('/', jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view categories
  async getAllCategories(req: Request, res: Response) {
    return this.getCategoryController.getAllCategories(req, res);
  }

  @httpGet('/:id', validate(getCategorySchema), jwtMiddleware)
  @hasRole(Role.USER) // Any authenticated user can view a category
  async getCategoryById(@requestParam('id') id: number, req: Request, res: Response) {
    return this.getCategoryController.getCategoryById(id, req, res);
  }

  @httpPost('/', validate(createCategorySchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can create categories
  async createCategory(@requestBody() categoryData: ICategoryDTO, req: Request, res: Response) {
    return this.createCategoryController.createCategory(categoryData, req, res);
  }

  @httpPut('/:id', validate(updateCategorySchema), jwtMiddleware)
  @moderatorRequired() // Only moderators and admins can update categories
  async updateCategory(
    @requestParam('id') id: number, 
    @requestBody() categoryData: Partial<ICategoryDTO>, 
    req: Request, 
    res: Response
  ) {
    return this.updateCategoryController.updateCategory(id, categoryData, req, res);
  }

  @httpDelete('/:id', validate(getCategorySchema), jwtMiddleware)
  @adminRequired() // Only admin can delete categories
  async deleteCategory(@requestParam('id') id: number, req: Request, res: Response) {
    return this.deleteCategoryController.deleteCategory(id, req, res);
  }
}