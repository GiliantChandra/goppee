import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../prisma';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// ─── GET /api/accounts — list all accounts ───────────────────────────────────
router.get('/', async (req: AuthRequest, res: Response) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.userId!, isActive: true },
    select: {
      id: true, type: true, label: true, balance: true,
      accountNumber: true, cardNumberMasked: true, expiryDate: true,
      gradient: true, isFrozen: true, isActive: true,
      dailyTransferLimit: true, onlinePurchaseLimit: true, atmWithdrawalLimit: true,
      // Never return cvvEncrypted or cardNumberEncrypted
    },
    orderBy: { createdAt: 'asc' },
  });

  // Convert BigInt to string for JSON serialization
  const serialized = accounts.map(acc => ({
    ...acc,
    balance: acc.balance.toString(),
    dailyTransferLimit: acc.dailyTransferLimit.toString(),
    onlinePurchaseLimit: acc.onlinePurchaseLimit.toString(),
    atmWithdrawalLimit: acc.atmWithdrawalLimit.toString(),
  }));

  res.json(serialized);
});

// ─── GET /api/accounts/:id — single account ────────────────────────────────
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const account = await prisma.account.findFirst({
    where: { id: req.params.id, userId: req.userId!, isActive: true },
    select: {
      id: true, type: true, label: true, balance: true,
      accountNumber: true, cardNumberMasked: true, expiryDate: true,
      gradient: true, isFrozen: true,
    },
  });
  if (!account) return void res.status(404).json({ error: 'Account not found' });

  res.json({ ...account, balance: account.balance.toString() });
});

// ─── PATCH /api/accounts/:id/freeze — freeze/unfreeze card ─────────────────
router.patch('/:id/freeze', async (req: AuthRequest, res: Response) => {
  const account = await prisma.account.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!account) return void res.status(404).json({ error: 'Account not found' });

  const updated = await prisma.account.update({
    where: { id: account.id },
    data: { isFrozen: !account.isFrozen },
    select: { id: true, isFrozen: true },
  });
  res.json(updated);
});

// ─── GET /api/accounts/summary — total balance across all accounts ─────────
router.get('/summary/totals', async (req: AuthRequest, res: Response) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.userId!, isActive: true },
    select: { balance: true, type: true },
  });
  const total = accounts.reduce((sum, a) => sum + BigInt(a.balance), BigInt(0));
  res.json({ totalBalance: total.toString(), accountCount: accounts.length });
});

export default router;
