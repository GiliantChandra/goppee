import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import { loginLimiter } from '../middleware/rateLimit.middleware';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { auditLog } from '../middleware/audit.middleware';
import * as authService from '../services/auth.service';

const router = Router();

// ─── Schemas ─────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
  name: z.string().min(2).max(60),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const pinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, 'PIN must be 4-6 digits'),
});

// ─── Routes ──────────────────────────────────────────────────────────────────

router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body.email, req.body.password, req.body.name, req.body.phone);
    res.status(201).json({ message: 'Account created', user });
  } catch (err: any) {
    if (err.message === 'EMAIL_TAKEN') return void res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', loginLimiter, validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, expiresIn } = await authService.login(req.body.email, req.body.password);

    // Refresh token in HttpOnly cookie — not accessible via JS
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth/refresh',
    });

    res.json({ accessToken, expiresIn });
  } catch (err: any) {
    if (err.message === 'INVALID_CREDENTIALS') return void res.status(401).json({ error: 'Invalid email or password' });
    if (err.message === 'ACCOUNT_LOCKED') return void res.status(403).json({ error: 'Account locked after too many failed attempts. Contact support.' });
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (!token) return void res.status(401).json({ error: 'No refresh token provided' });
  try {
    const { accessToken, expiresIn } = await authService.refreshAccessToken(token);
    res.json({ accessToken, expiresIn });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (token) await authService.revokeRefreshToken(token).catch(() => {});
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  res.json({ message: 'Logged out' });
});

router.post('/verify-pin', requireAuth, validate(pinSchema), auditLog('VERIFY_PIN'), async (req: AuthRequest, res: Response) => {
  const valid = await authService.verifyPin(req.userId!, req.body.pin);
  if (!valid) return void res.status(401).json({ error: 'Incorrect PIN' });
  res.json({ valid: true });
});

router.put('/set-pin', requireAuth, validate(pinSchema), auditLog('SET_PIN'), async (req: AuthRequest, res: Response) => {
  try {
    await authService.setPin(req.userId!, req.body.pin);
    res.json({ message: 'PIN updated' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
