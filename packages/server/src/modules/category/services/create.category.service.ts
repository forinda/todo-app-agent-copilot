import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ICategoryModel, ICategoryDTO } from '../models/category.model';
import { ICategoryRepository } from '../repositories/category.repository';
import { BaseCategoryService } from './base.category.service';

export interface ICreateCategoryService {
  createCategory(category: ICategoryDTO): Promise<ICategoryModel>;
}

@injectable()
@autobinded
export class CreateCategoryService extends BaseCategoryService implements ICreateCategoryService {
  constructor(@inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository) {
    super(categoryRepository);
  }

  
  async createCategory(category: ICategoryDTO): Promise<ICategoryModel> {
    return this.categoryRepository.create(category);
  }
}