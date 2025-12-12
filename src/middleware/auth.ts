import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { logger, logApiError } from '@/lib/logger';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
  };
}

/**
 * Authentication middleware for API routes
 * Validates JWT token and attaches user to request
 */
export async function validateAuth(
  req: NextApiRequest
): Promise<{ id: string; email: string }> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Validate token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.warn({
        type: 'auth_failed',
        error: error?.message || 'Invalid token',
        path: req.url,
      });
      throw new Error('Invalid or expired token');
    }

    if (!user.email) {
      throw new Error('User email not found');
    }

    return {
      id: user.id,
      email: user.email,
    };
  } catch (error: any) {
    logApiError(req.method || 'UNKNOWN', req.url || '', error);
    throw new Error('Authentication failed');
  }
}

/**
 * Higher-order function to wrap API routes with authentication
 */
export function withAuth(
  handler: (
    req: AuthenticatedRequest,
    res: NextApiResponse
  ) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const user = await validateAuth(req);
      (req as AuthenticatedRequest).user = user;
      return handler(req as AuthenticatedRequest, res);
    } catch (error: any) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message || 'Authentication required',
      });
    }
  };
}

/**
 * Optional authentication - doesn't fail if no token provided
 * But validates if token is present
 */
export async function optionalAuth(
  req: NextApiRequest
): Promise<{ id: string; email: string } | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    return await validateAuth(req);
  } catch {
    return null;
  }
}
