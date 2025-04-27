import 'reflect-metadata';
import express, { Router, Request } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './config/inversify.config';
import { errorHandlerMiddleware, responseFormatterMiddleware } from './utils/responseFormatter';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

// Import controllers (required for inversify-express-utils to discover them)
import './modules/tasks/controllers/task.controller';
import './modules/category/controllers/category.controller';
import './modules/user/controllers/user.controller';
import './modules/auth/controllers/auth.controller';

const r = Router({ caseSensitive: true });
// Create server
const server = new InversifyExpressServer(container, r, {
  rootPath: '/api/v1',
});

server.setConfig((app) => {
  // Middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-production-domain.com'] 
      : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true, // Enable credentials (cookies) in CORS
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 86400 // Cache preflight requests for 24 hours
  }));
  app.use(cookieParser()); // Add cookie parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Add response formatter middleware
  app.use(responseFormatterMiddleware);

  // Simple logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    req.id = crypto.randomBytes(32).toString('hex');
    next();
  });
});

// Configure global error handler
server.setErrorConfig((app) => {
  // Handle 404 errors for undefined routes
  app.use((req, res) => {
    res.error(`Route not found: ${req.path}`, 404, 'ROUTE_NOT_FOUND');
  });
  
  // Global error handler must be last
  app.use(errorHandlerMiddleware);
});

const app = server.build();
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

export default app;
