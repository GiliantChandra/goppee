import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { auditLog } from '../middleware/audit.middleware';
import { prisma } from '../prisma';

const router = Router();
router.use(requireAuth);

const createPocketSchema = z.object({
  accountId: z.string().min(1),
  name: z.string().min(1).max(50),
  emoji: z.string().max(8).default('💰'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#6366f1'),
  goalAmount: z.number().int().positive().optional(),
  goalDate: z.string().datetime().optional(),
});

const updatePocketSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  emoji: z.string().max(8).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  goalAmount: z.number().int().positive().nullable().optional(),
  goalDate: z.string().datetime().nullable().optional(),
});

// GET /api/pockets
router.get('/', async (req: AuthRequest, res: Response) => {
  const pockets = await prisma.pocket.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'asc' },
  });
  res.json(pockets.map(p => ({
    ...p,
    balance: p.balance.toString(),
    goalAmount: p.goalAmount?.toString() ?? null,
  })));
});

// POST /api/pockets
router.post('/', validate(createPocketSchema), auditLog('CREATE_POCKET'), async (req: AuthRequest, res: Response) => {
  // Verify account belongs to user
  const account = await prisma.account.findFirst({ where: { id: req.body.accountId, userId: req.userId! } });
  if (!account) return void res.status(404).json({ error: 'Account not found' });

  const pocket = await prisma.pocket.create({
    data: {
      userId: req.userId!,
      accountId: req.body.accountId,
      name: req.body.name,
      emoji: req.body.emoji,
      color: req.body.color,
      goalAmount: req.body.goalAmount ? BigInt(req.body.goalAmount) : undefined,
      goalDate: req.body.goalDate ? new Date(req.body.goalDate) : undefined,
    },
  });
  res.status(201).json({ ...pocket, balance: pocket.balance.toString(), goalAmount: pocket.goalAmount?.toString() ?? null });
});

// PATCH /api/pockets/:id
router.patch('/:id', validate(updatePocketSchema), auditLog('UPDATE_POCKET'), async (req: AuthRequest, res: Response) => {
  const pocket = await prisma.pocket.findFirst({ where: { id: req.params.id, userId: req.userId! } });
  if (!pocket) return void res.status(404).json({ error: 'Pocket not found' });

  const updated = await prisma.pocket.update({
    where: { id: pocket.id },
    data: {
      ...req.body,
      goalAmount: req.body.goalAmount !== undefined ? (req.body.goalAmount ? BigInt(req.body.goalAmount) : null) : undefined,
      goalDate: req.body.goalDate !== undefined ? (req.body.goalDate ? new Date(req.body.goalDate) : null) : undefined,
    },
  });
  res.json({ ...updated, balance: updated.balance.toString(), goalAmount: updated.goalAmount?.toString() ?? null });
});

// DELETE /api/pockets/:id
router.delete('/:id', auditLog('DELETE_POCKET'), async (req: AuthRequest, res: Response) => {
  const pocket = await prisma.pocket.findFirst({ where: { id: req.params.id, userId: req.userId! } });
  if (!pocket) return void res.status(404).json({ error: 'Pocket not found' });
  if (pocket.balance > 0) return void res.status(422).json({ error: 'Withdraw all funds before deleting this pocket' });

  await prisma.pocket.delete({ where: { id: pocket.id } });
  res.json({ message: 'Pocket deleted' });
});

export default router;
