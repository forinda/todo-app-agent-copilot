import { injectable } from 'inversify';
import { autobinded } from '../../../utils/autobind';
import { Response } from 'express';

export interface ICookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

export interface ISessionService {
  getCookieOptions(): ICookieOptions;
  setSessionCookie(res: Response, token: string): void;
  clearSessionCookie(res: Response): void;
}

@injectable()
@autobinded
export class SessionService implements ISessionService {
  /**
   * Get standard cookie options
   */
  getCookieOptions(): ICookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    };
  }

  /**
   * Set session cookie with auth token
   */
  setSessionCookie(res: Response, token: string): void {
    res.cookie('auth_token', token, this.getCookieOptions());
  }

  /**
   * Clear session cookie
   */
  clearSessionCookie(res: Response): void {
    res.clearCookie('auth_token', {
      ...this.getCookieOptions(),
      maxAge: 0,
    });
  }
}