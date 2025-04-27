import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types/types';
import { ICategoryRepository } from '../repositories/category.repository';
import { ICategoryModel, ICategoryDTO } from '../models/category.model';
import { autobind, autobinded } from '../../../utils/autobind';
import { BaseCategoryService } from './base.category.service';
import { IGetCategoryService } from './get.category.service';
import { ICreateCategoryService } from './create.category.service';
import { IUpdateCategoryService } from './update.category.service';
import { IDeleteCategoryService } from './delete.category.service';

export interface ICategoryService {
  getAllCategories(): Promise<ICategoryModel[]>;
  getCategoryById(id: number): Promise<ICategoryModel | null>;
  createCategory(category: ICategoryDTO): Promise<ICategoryModel>;
  updateCategory(id: number, category: Partial<ICategoryDTO>): Promise<ICategoryModel | null>;
  deleteCategory(id: number): Promise<boolean>;
}

/**
 * This is a facade service that delegates to specialized services.
 * It provides a unified interface for all category operations while
 * internally following the single responsibility principle through
 * specialized service classes.
 */
@injectable()
@autobinded
export class CategoryService extends BaseCategoryService implements ICategoryService {
  constructor(
    @inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository,
    @inject(TYPES.GetCategoryService) private getCategoryService: IGetCategoryService,
    @inject(TYPES.CreateCategoryService) private createCategoryService: ICreateCategoryService,
    @inject(TYPES.UpdateCategoryService) private updateCategoryService: IUpdateCategoryService,
    @inject(TYPES.DeleteCategoryService) private deleteCategoryService: IDeleteCategoryService
  ) {
    super(categoryRepository);
  }

  
  async getAllCategories(): Promise<ICategoryModel[]> {
    return this.getCategoryService.getAllCategories();
  }

  
  async getCategoryById(id: number): Promise<ICategoryModel | null> {
    return this.getCategoryService.getCategoryById(id);
  }

  
  async createCategory(category: ICategoryDTO): Promise<ICategoryModel> {
    return this.createCategoryService.createCategory(category);
  }

  
  async updateCategory(id: number, category: Partial<ICategoryDTO>): Promise<ICategoryModel | null> {
    return this.updateCategoryService.updateCategory(id, category);
  }

  
  async deleteCategory(id: number): Promise<boolean> {
    return this.deleteCategoryService.deleteCategory(id);
  }
}