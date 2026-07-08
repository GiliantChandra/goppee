import 'dotenv/config';
import { z } from 'zod';

// Validate and parse all required environment variables at startup.
// If any are missing or malformed, the process exits immediately with a clear error.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DEMO_MODE: z.string().transform(v => v === 'true').default('true'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 chars'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().default(5),
  TRANSFER_RATE_LIMIT_MAX: z.coerce.number().default(10),
  TOPUP_RATE_LIMIT_MAX: z.coerce.number().default(5),
  OTP_EXPIRES_MINUTES: z.coerce.number().default(5),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(3),
  MAX_FAILED_LOGIN_ATTEMPTS: z.coerce.number().default(5),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
