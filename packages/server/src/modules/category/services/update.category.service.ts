import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ICategoryModel, ICategoryDTO } from '../models/category.model';
import { ICategoryRepository } from '../repositories/category.repository';
import { BaseCategoryService } from './base.category.service';

export interface IUpdateCategoryService {
  updateCategory(id: number, category: Partial<ICategoryDTO>): Promise<ICategoryModel | null>;
}

@injectable()
@autobinded
export class UpdateCategoryService extends BaseCategoryService implements IUpdateCategoryService {
  constructor(@inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository) {
    super(categoryRepository);
  }

  
  async updateCategory(id: number, category: Partial<ICategoryDTO>): Promise<ICategoryModel | null> {
    return this.categoryRepository.update(id, category);
  }
}