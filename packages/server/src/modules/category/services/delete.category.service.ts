import { injectable, inject } from 'inversify';
import { autobind, autobinded } from '../../../utils/autobind';
import { TYPES } from '../../../types/types';
import { ICategoryRepository } from '../repositories/category.repository';
import { BaseCategoryService } from './base.category.service';

export interface IDeleteCategoryService {
  deleteCategory(id: number): Promise<boolean>;
}

@injectable()
@autobinded
export class DeleteCategoryService extends BaseCategoryService implements IDeleteCategoryService {
  constructor(@inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository) {
    super(categoryRepository);
  }

  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categoryRepository.delete(id);
  }
}