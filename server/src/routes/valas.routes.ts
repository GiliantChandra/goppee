import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { auditLog } from '../middleware/audit.middleware';
import { prisma } from '../prisma';

const router = Router();
router.use(requireAuth);

const SUPPORTED_CURRENCIES = ['USD', 'SGD', 'EUR', 'JPY', 'GBP', 'SAR'];

const convertSchema = z.object({
  fromCurrency: z.enum(['IDR', 'USD', 'SGD', 'EUR', 'JPY', 'GBP', 'SAR']),
  toCurrency: z.enum(['IDR', 'USD', 'SGD', 'EUR', 'JPY', 'GBP', 'SAR']),
  amount: z.number().positive(),
  accountId: z.string().optional(), // IDR source account
  idempotencyKey: z.string().uuid(),
  pin: z.string().regex(/^\d{4,6}$/),
});

// GET /api/valas — get all valas accounts + exchange rates
router.get('/', async (req: AuthRequest, res: Response) => {
  const [valasAccounts, rates] = await Promise.all([
    prisma.valasAccount.findMany({ where: { userId: req.userId! } }),
    prisma.exchangeRate.findMany(),
  ]);

  // Ensure all supported currencies exist
  const missing = SUPPORTED_CURRENCIES.filter(c => !valasAccounts.find(v => v.currency === c));
  if (missing.length > 0) {
    await prisma.valasAccount.createMany({
      data: missing.map(currency => ({ userId: req.userId!, currency })),
      skipDuplicates: true,
    });
    // Re-fetch
    const updated = await prisma.valasAccount.findMany({ where: { userId: req.userId! } });
    return void res.json({
      accounts: updated.map(v => ({ ...v, balance: v.balance.toString() })),
      rates: Object.fromEntries(rates.map(r => [r.currency, r.rateToIdr.toString()])),
    });
  }

  res.json({
    accounts: valasAccounts.map(v => ({ ...v, balance: v.balance.toString() })),
    rates: Object.fromEntries(rates.map(r => [r.currency, r.rateToIdr.toString()])),
  });
});

// POST /api/valas/convert — convert IDR ↔ foreign currency
router.post(
  '/convert',
  validate(convertSchema),
  auditLog('VALAS_CONVERT'),
  async (req: AuthRequest, res: Response) => {
    const { fromCurrency, toCurrency, amount, accountId, idempotencyKey, pin } = req.body;

    // PIN verification
    const { verifyPin } = await import('../services/auth.service');
    const pinValid = await verifyPin(req.userId!, pin);
    if (!pinValid) return void res.status(401).json({ error: 'Incorrect PIN' });

    // Get exchange rates
    const rates = await prisma.exchangeRate.findMany();
    const rateMap = Object.fromEntries(rates.map(r => [r.currency, Number(r.rateToIdr)]));

    // Calculate converted amounts
    let idrAmount: number;
    let foreignAmount: number;
    let foreignCurrency: string;

    if (fromCurrency === 'IDR') {
      // Buying foreign currency with IDR
      if (!SUPPORTED_CURRENCIES.includes(toCurrency)) return void res.status(400).json({ error: 'Unsupported target currency' });
      if (!accountId) return void res.status(400).json({ error: 'accountId required when converting from IDR' });
      idrAmount = Math.round(amount);
      foreignCurrency = toCurrency;
      foreignAmount = parseFloat((amount / rateMap[toCurrency]).toFixed(6));
    } else {
      // Selling foreign currency for IDR
      if (fromCurrency === toCurrency) return void res.status(400).json({ error: 'Same currency conversion not allowed' });
      foreignCurrency = fromCurrency;
      foreignAmount = amount;
      idrAmount = Math.round(amount * rateMap[fromCurrency]);
    }

    // Atomic conversion
    await prisma.$transaction(async (tx) => {
      const existingTxn = await tx.transaction.findUnique({ where: { idempotencyKey } });
      if (existingTxn) return existingTxn;

      if (fromCurrency === 'IDR') {
        // Debit IDR account
        const acc = await tx.account.findFirst({ where: { id: accountId, userId: req.userId!, isActive: true } });
        if (!acc || Number(acc.balance) < idrAmount) throw new Error('INSUFFICIENT_BALANCE');
        await tx.account.update({ where: { id: accountId! }, data: { balance: { decrement: idrAmount } } });
        await tx.valasAccount.upsert({
          where: { userId_currency: { userId: req.userId!, currency: foreignCurrency } },
          create: { userId: req.userId!, currency: foreignCurrency, balance: foreignAmount },
          update: { balance: { increment: foreignAmount } },
        });
      } else {
        // Debit foreign account
        const valas = await tx.valasAccount.findUnique({ where: { userId_currency: { userId: req.userId!, currency: foreignCurrency } } });
        if (!valas || Number(valas.balance) < foreignAmount) throw new Error('INSUFFICIENT_VALAS_BALANCE');
        await tx.valasAccount.update({
          where: { userId_currency: { userId: req.userId!, currency: foreignCurrency } },
          data: { balance: { decrement: foreignAmount } },
        });
        if (accountId) {
          await tx.account.update({ where: { id: accountId }, data: { balance: { increment: idrAmount } } });
        }
      }

      return tx.transaction.create({
        data: {
          userId: req.userId!,
          fromAccountId: fromCurrency === 'IDR' ? accountId : null,
          toAccountId: toCurrency === 'IDR' ? accountId : null,
          amount: BigInt(idrAmount),
          type: 'VALAS_CONVERT',
          category: 'transfer',
          title: `Convert ${fromCurrency} → ${toCurrency}`,
          subtitle: `${amount} ${fromCurrency} = ${foreignAmount} ${foreignCurrency}`,
          status: 'COMPLETED',
          idempotencyKey,
          metadata: { fromCurrency, toCurrency, foreignAmount, idrAmount, rate: rateMap[foreignCurrency] },
        },
      });
    });

    res.status(201).json({ message: 'Conversion successful', foreignAmount, idrAmount, currency: foreignCurrency });
  }
);

export default router;
