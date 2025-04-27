import { Container } from 'inversify';
import 'reflect-metadata';
import { SchemaValidator } from '../middleware/schemas';
import { TYPES } from '../types/types';
import { PasswordUtils } from '../utils/passwordUtils';

// Import modules
import { todoModule } from '../modules/tasks';
import { categoryModule } from '../modules/category';
import { userModule } from '../modules/user';
import { authModule } from '../modules/auth';

// Create and configure container
const container = new Container();

// Register utilities
container.bind<SchemaValidator>(TYPES.SchemaValidator).to(SchemaValidator).inSingletonScope();
container.bind<PasswordUtils>(TYPES.PasswordUtils).to(PasswordUtils).inSingletonScope();

// Load modules
container.load(todoModule);
container.load(categoryModule);
container.load(userModule);
container.load(authModule);  // Added auth module

export { container };