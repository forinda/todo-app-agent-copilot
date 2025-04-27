// Export models
export * from './models/category.model';

// Export repositories
export * from './repositories/category.repository';

// Export services
export * from './services/base.category.service';
export * from './services/get.category.service';
export * from './services/create.category.service';
export * from './services/update.category.service';
export * from './services/delete.category.service';
export * from './services/category.service';

// Export controllers
export * from './controllers/base.category.controller';
export * from './controllers/get.category.controller';
export * from './controllers/create.category.controller';
export * from './controllers/update.category.controller';
export * from './controllers/delete.category.controller';
export * from './controllers/category.controller';

// Module registration
import { ContainerModule } from 'inversify';
import { TYPES } from '../../types/types';
import { ICategoryRepository, CategoryRepository } from './repositories/category.repository';

// Import specialized services
import { ICategoryService, CategoryService } from './services/category.service';
import { IGetCategoryService, GetCategoryService } from './services/get.category.service';
import { ICreateCategoryService, CreateCategoryService } from './services/create.category.service';
import { IUpdateCategoryService, UpdateCategoryService } from './services/update.category.service';
import { IDeleteCategoryService, DeleteCategoryService } from './services/delete.category.service';

// Import controllers
import { CategoryController } from './controllers/category.controller';
import { GetCategoryController } from './controllers/get.category.controller';
import { CreateCategoryController } from './controllers/create.category.controller';
import { UpdateCategoryController } from './controllers/update.category.controller';
import { DeleteCategoryController } from './controllers/delete.category.controller';

export const categoryModule = new ContainerModule((bind) => {
  // Bind repositories
  bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository).inSingletonScope();
  
  // Bind specialized services
  bind<IGetCategoryService>(TYPES.GetCategoryService).to(GetCategoryService).inSingletonScope();
  bind<ICreateCategoryService>(TYPES.CreateCategoryService).to(CreateCategoryService).inSingletonScope();
  bind<IUpdateCategoryService>(TYPES.UpdateCategoryService).to(UpdateCategoryService).inSingletonScope();
  bind<IDeleteCategoryService>(TYPES.DeleteCategoryService).to(DeleteCategoryService).inSingletonScope();
  
  // Bind main category service (facade)
  bind<ICategoryService>(TYPES.CategoryService).to(CategoryService).inSingletonScope();
  
  // Bind controllers
  bind<CategoryController>(CategoryController).toSelf();
  bind<GetCategoryController>(GetCategoryController).toSelf();
  bind<CreateCategoryController>(CreateCategoryController).toSelf();
  bind<UpdateCategoryController>(UpdateCategoryController).toSelf();
  bind<DeleteCategoryController>(DeleteCategoryController).toSelf();
});