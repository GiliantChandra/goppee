import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from './auth.middleware';

/**
 * Writes an audit log entry for every request that passes through.
 * Call this AFTER auth middleware so userId is available.
 */
export function auditLog(action: string) {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    // Fire-and-forget — don't block the request
    prisma.auditLog
      .create({
        data: {
          userId: req.userId ?? null,
          action,
          details: {
            method: req.method,
            path: req.path,
            body: sanitizeBody(req.body),
          } as object,
          ipAddress: getClientIp(req),
          userAgent: req.headers['user-agent'] ?? null,
        },
      })
      .catch((err) => console.error('[AuditLog] Failed to write:', err));
    next();
  };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

/** Remove sensitive fields before logging request body */
function sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
  if (!body || typeof body !== 'object') return {};
  const safe = { ...body };
  const sensitiveKeys = ['password', 'pin', 'otp', 'cvv', 'cardNumber', 'token', 'refreshToken'];
  for (const key of sensitiveKeys) {
    if (key in safe) safe[key] = '[REDACTED]';
  }
  return safe;
}
