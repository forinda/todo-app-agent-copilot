// Export models
export * from './models/auth.model';

// Export services
export * from './services/auth.service';
export * from './services/authentication.service';
export * from './services/registration.service';
export * from './services/token.service';
export * from './services/session.service';

// Export controllers
export * from './controllers/auth.controller';

// Module registration
import { ContainerModule } from 'inversify';
import { TYPES } from '../../types/types';
import { IAuthService, AuthService } from './services/auth.service';
import { ITokenService, TokenService } from './services/token.service';
import { IAuthenticationService, AuthenticationService } from './services/authentication.service';
import { IRegistrationService, RegistrationService } from './services/registration.service';
import { ISessionService, SessionService } from './services/session.service';
import { AuthController } from './controllers/auth.controller';

export const authModule = new ContainerModule((bind) => {
  // Bind services
  bind<ITokenService>(TYPES.TokenService).to(TokenService).inSingletonScope();
  bind<IAuthenticationService>(TYPES.AuthenticationService).to(AuthenticationService).inSingletonScope();
  bind<IRegistrationService>(TYPES.RegistrationService).to(RegistrationService).inSingletonScope();
  bind<ISessionService>(TYPES.SessionService).to(SessionService).inSingletonScope();
  
  // Bind main auth service facade
  bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
  
  // Bind controllers
  bind<AuthController>(AuthController).toSelf();
});