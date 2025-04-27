export const TYPES = {
  // Task module
  TaskRepository: Symbol.for('TaskRepository'),
  TaskService: Symbol.for('TaskService'),
  GetTaskService: Symbol.for('GetTaskService'),
  CreateTaskService: Symbol.for('CreateTaskService'),
  UpdateTaskService: Symbol.for('UpdateTaskService'),
  DeleteTaskService: Symbol.for('DeleteTaskService'),
  AssignmentTaskService: Symbol.for('AssignmentTaskService'),
  BulkActionTaskService: Symbol.for('BulkActionTaskService'),
  
  // Category module
  CategoryRepository: Symbol.for('CategoryRepository'),
  CategoryService: Symbol.for('CategoryService'),
  GetCategoryService: Symbol.for('GetCategoryService'),
  CreateCategoryService: Symbol.for('CreateCategoryService'),
  UpdateCategoryService: Symbol.for('UpdateCategoryService'),
  DeleteCategoryService: Symbol.for('DeleteCategoryService'),
  
  // User module
  UserRepository: Symbol.for('UserRepository'),
  UserService: Symbol.for('UserService'),
  GetUserService: Symbol.for('GetUserService'),
  CreateUserService: Symbol.for('CreateUserService'),
  UpdateUserService: Symbol.for('UpdateUserService'),
  DeleteUserService: Symbol.for('DeleteUserService'),
  
  // Auth module
  AuthService: Symbol.for('AuthService'),
  TokenService: Symbol.for('TokenService'),
  AuthenticationService: Symbol.for('AuthenticationService'),
  RegistrationService: Symbol.for('RegistrationService'),
  SessionService: Symbol.for('SessionService'),
  
  // Utilities
  SchemaValidator: Symbol.for('SchemaValidator'),
  PasswordUtils: Symbol.for('PasswordUtils'),
};