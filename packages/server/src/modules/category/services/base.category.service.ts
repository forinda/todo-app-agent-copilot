import { ICategoryRepository } from '../repositories/category.repository';
import { ICategoryModel, ICategoryDTO } from '../models/category.model';

export interface IBaseCategoryService {
  getRepository(): ICategoryRepository;
}

export abstract class BaseCategoryService implements IBaseCategoryService {
  protected categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  getRepository(): ICategoryRepository {
    return this.categoryRepository;
  }
}