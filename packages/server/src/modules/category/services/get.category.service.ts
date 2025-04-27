import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ICategoryModel } from '../models/category.model';
import { ICategoryRepository } from '../repositories/category.repository';
import { BaseCategoryService } from './base.category.service';

export interface IGetCategoryService {
  getAllCategories(): Promise<ICategoryModel[]>;
  getCategoryById(id: number): Promise<ICategoryModel | null>;
}

@injectable()
@autobinded
export class GetCategoryService extends BaseCategoryService implements IGetCategoryService {
  constructor(@inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository) {
    super(categoryRepository);
  }

  
  async getAllCategories(): Promise<ICategoryModel[]> {
    return this.categoryRepository.findAll();
  }

  
  async getCategoryById(id: number): Promise<ICategoryModel | null> {
    return this.categoryRepository.findById(id);
  }
}