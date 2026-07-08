import rateLimit from 'express-rate-limit';
import { config } from '../config';

const windowMs = config.RATE_LIMIT_WINDOW_MS;

/** 5 login attempts per minute per IP */
export const loginLimiter = rateLimit({
  windowMs,
  max: config.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait a minute and try again.' },
  skipSuccessfulRequests: true, // only count failed attempts
});

/** 10 transfer requests per minute per IP */
export const transferLimiter = rateLimit({
  windowMs,
  max: config.TRANSFER_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many transfer requests. Please try again later.' },
});

/** 5 top-up requests per minute per IP */
export const topupLimiter = rateLimit({
  windowMs,
  max: config.TOPUP_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many top-up requests. Please try again later.' },
});

/** General API rate limit: 100 req/min */
export const generalLimiter = rateLimit({
  windowMs,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});
