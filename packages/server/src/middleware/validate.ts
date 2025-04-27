import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, z } from 'zod';
import { convertZodError } from '../utils/errors/errorConverters';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod error to our ApiError format and send standardized response
        const apiError = convertZodError(error);
        return res.errorHandler(apiError);
      }
      
      // Handle any other errors
      return res.errorHandler(error);
    }
  };