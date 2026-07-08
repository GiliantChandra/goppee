import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { topupLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { auditLog } from '../middleware/audit.middleware';
import * as otpService from '../services/otp.service';

const router = Router();
router.use(requireAuth);

const TOPUP_MIN = 10_000;
const TOPUP_MAX = 50_000_000;

const initiateSchema = z.object({
  accountId: z.string().min(1),
  amount: z.number().int()
    .min(TOPUP_MIN, `Minimum top-up is Rp ${TOPUP_MIN.toLocaleString('id-ID')}`)
    .max(TOPUP_MAX, `Maximum top-up is Rp ${TOPUP_MAX.toLocaleString('id-ID')}`),
  method: z.enum(['VIRTUAL_ACCOUNT', 'BANK_TRANSFER', 'CREDIT_CARD']),
});

const verifySchema = z.object({
  accountId: z.string().min(1),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  idempotencyKey: z.string().uuid(),
});

// POST /api/topup/initiate — generate OTP and start top-up flow
router.post(
  '/initiate',
  topupLimiter,
  validate(initiateSchema),
  auditLog('TOPUP_INITIATE'),
  async (req: AuthRequest, res: Response) => {
    // Verify account belongs to user
    const { prisma } = await import('../prisma');
    const account = await prisma.account.findFirst({
      where: { id: req.body.accountId, userId: req.userId!, isActive: true },
    });
    if (!account) return void res.status(404).json({ error: 'Account not found' });

    await otpService.generateOtp(req.userId!, req.body.accountId, req.body.amount, req.body.method);

    // Never return the OTP in the response — in demo mode it's in server logs
    res.json({
      message: 'OTP sent',
      hint: process.env.DEMO_MODE === 'true' ? 'Check server logs for OTP (DEMO_MODE=true)' : 'Check your registered phone/email',
      expiresInMinutes: process.env.OTP_EXPIRES_MINUTES ?? 5,
    });
  }
);

// POST /api/topup/verify — verify OTP and credit balance
router.post(
  '/verify',
  topupLimiter,
  validate(verifySchema),
  auditLog('TOPUP_VERIFY'),
  async (req: AuthRequest, res: Response) => {
    try {
      const txn = await otpService.verifyOtpAndTopup(
        req.userId!, req.body.accountId, req.body.otp, req.body.idempotencyKey
      );
      res.status(201).json({
        message: 'Top-up successful',
        transaction: { ...txn, amount: txn.amount.toString() },
      });
    } catch (err: any) {
      if (err.message === 'OTP_ATTEMPTS_EXCEEDED') return void res.status(422).json({ error: 'Too many incorrect OTP attempts. Request a new OTP.' });
      if (err.message?.startsWith('INVALID_OTP:')) {
        const remaining = err.message.split(':')[1];
        return void res.status(401).json({ error: `Incorrect OTP. ${remaining} attempt(s) remaining.` });
      }
      if (err.message === 'NO_PENDING_TOPUP') return void res.status(404).json({ error: 'No pending top-up request found or OTP expired.' });
      res.status(500).json({ error: 'Top-up verification failed' });
    }
  }
);

export default router;
