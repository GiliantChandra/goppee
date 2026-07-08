import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { transferLimiter } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';
import { auditLog } from '../middleware/audit.middleware';
import { prisma } from '../prisma';
import * as txnService from '../services/transaction.service';
import * as authService from '../services/auth.service';

const router = Router();
router.use(requireAuth);

const transferSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountNumber: z.string().min(6),
  amount: z.number().int().positive().min(10000, 'Minimum transfer Rp 10.000'),
  note: z.string().max(200).optional(),
  idempotencyKey: z.string().uuid(),
  pin: z.string().regex(/^\d{4,6}$/),
});

// ─── GET /api/transactions ─────────────────────────────────────────────────
router.get('/', async (req: AuthRequest, res: Response) => {
  const { category, type, search, limit = '50', offset = '0' } = req.query as Record<string, string>;

  const where: any = { userId: req.userId! };
  if (category && category !== 'all') where.category = category;
  if (type && type !== 'all') where.type = type.toUpperCase();
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { subtitle: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(limit), 100),
      skip: Number(offset),
    }),
    prisma.transaction.count({ where }),
  ]);

  res.json({
    transactions: transactions.map(t => ({ ...t, amount: t.amount.toString() })),
    total,
  });
});

// ─── POST /api/transactions/transfer — transfer with PIN ───────────────────
router.post(
  '/transfer',
  transferLimiter,
  validate(transferSchema),
  auditLog('TRANSFER'),
  async (req: AuthRequest, res: Response) => {
    // Verify PIN before executing transfer
    const pinValid = await authService.verifyPin(req.userId!, req.body.pin);
    if (!pinValid) return void res.status(401).json({ error: 'Incorrect PIN' });

    try {
      const txn = await txnService.createTransfer({
        fromAccountId: req.body.fromAccountId,
        toAccountIdentifier: req.body.toAccountNumber,
        amount: req.body.amount,
        note: req.body.note,
        idempotencyKey: req.body.idempotencyKey,
        userId: req.userId!,
      });
      res.status(201).json({ ...txn, amount: txn.amount.toString() });
    } catch (err: any) {
      const errorMap: Record<string, [number, string]> = {
        SOURCE_ACCOUNT_NOT_FOUND: [404, 'Source account not found or frozen'],
        INSUFFICIENT_BALANCE: [422, 'Insufficient balance'],
        DAILY_LIMIT_EXCEEDED: [422, 'Daily transfer limit exceeded'],
      };
      const [status, message] = errorMap[err.message] ?? [500, 'Transfer failed'];
      res.status(status).json({ error: message });
    }
  }
);

// ─── POST /api/transactions/pocket-deposit ─────────────────────────────────
router.post(
  '/pocket-deposit',
  validate(z.object({
    fromAccountId: z.string(),
    toPocketId: z.string(),
    amount: z.number().int().positive(),
    idempotencyKey: z.string().uuid(),
  })),
  auditLog('POCKET_DEPOSIT'),
  async (req: AuthRequest, res: Response) => {
    try {
      const txn = await txnService.getPocketTransfer(
        req.userId!, req.body.fromAccountId, req.body.toPocketId, req.body.amount, req.body.idempotencyKey
      );
      res.status(201).json({ ...txn, amount: txn.amount.toString() });
    } catch (err: any) {
      res.status(422).json({ error: err.message });
    }
  }
);

// ─── POST /api/transactions/pocket-withdraw ─────────────────────────────────
router.post(
  '/pocket-withdraw',
  validate(z.object({
    pocketId: z.string(),
    toAccountId: z.string(),
    amount: z.number().int().positive(),
    idempotencyKey: z.string().uuid(),
  })),
  auditLog('POCKET_WITHDRAW'),
  async (req: AuthRequest, res: Response) => {
    try {
      const txn = await txnService.withdrawFromPocket(
        req.userId!, req.body.pocketId, req.body.toAccountId, req.body.amount, req.body.idempotencyKey
      );
      res.status(201).json({ ...txn, amount: txn.amount.toString() });
    } catch (err: any) {
      res.status(422).json({ error: err.message });
    }
  }
);

export default router;
