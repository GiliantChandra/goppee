import { prisma } from '../prisma';

export interface TransferInput {
  fromAccountId: string;
  toAccountIdentifier: string; // accountNumber or contact id
  amount: number; // in IDR
  note?: string;
  idempotencyKey: string; // UUID from client — prevents duplicate submissions
  userId: string;
}

export async function createTransfer(input: TransferInput) {
  const { fromAccountId, toAccountIdentifier, amount, note, idempotencyKey, userId } = input;

  // Idempotency check — return existing result if key was already used
  const existing = await prisma.transaction.findUnique({ where: { idempotencyKey } });
  if (existing) return existing;

  if (amount <= 0) throw new Error('Amount must be positive');

  // Use a transaction to atomically debit + credit
  return prisma.$transaction(async (tx) => {
    const fromAccount = await tx.account.findFirst({
      where: { id: fromAccountId, userId, isActive: true, isFrozen: false },
    });
    if (!fromAccount) throw new Error('SOURCE_ACCOUNT_NOT_FOUND');
    if (fromAccount.balance < amount) throw new Error('INSUFFICIENT_BALANCE');

    // Check daily transfer limit
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayTransfers = await tx.transaction.aggregate({
      where: { fromAccountId, createdAt: { gte: todayStart }, status: 'COMPLETED' },
      _sum: { amount: true },
    });
    const todayTotal = Number(todayTransfers._sum.amount ?? 0) + amount;
    if (BigInt(todayTotal) > fromAccount.dailyTransferLimit) {
      throw new Error('DAILY_LIMIT_EXCEEDED');
    }

    // Find destination account by account number
    const toAccount = await tx.account.findFirst({
      where: { accountNumber: toAccountIdentifier, isActive: true },
    });

    // Debit source
    await tx.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } },
    });

    // Credit destination if internal, otherwise record as external debit
    if (toAccount) {
      await tx.account.update({
        where: { id: toAccount.id },
        data: { balance: { increment: amount } },
      });
    }

    // Record transaction
    const txn = await tx.transaction.create({
      data: {
        userId,
        fromAccountId,
        toAccountId: toAccount?.id ?? null,
        amount: BigInt(amount),
        type: 'TRANSFER',
        category: 'transfer',
        title: `Transfer to ${toAccountIdentifier}`,
        subtitle: note ?? 'Bank transfer',
        status: 'COMPLETED',
        idempotencyKey,
        note,
      },
    });
    return txn;
  });
}

export async function getPocketTransfer(
  userId: string,
  fromAccountId: string,
  toPocketId: string,
  amount: number,
  idempotencyKey: string
) {
  const existing = await prisma.transaction.findUnique({ where: { idempotencyKey } });
  if (existing) return existing;

  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({ where: { id: fromAccountId, userId } });
    if (!account) throw new Error('ACCOUNT_NOT_FOUND');
    if (Number(account.balance) < amount) throw new Error('INSUFFICIENT_BALANCE');

    const pocket = await tx.pocket.findFirst({ where: { id: toPocketId, userId } });
    if (!pocket) throw new Error('POCKET_NOT_FOUND');

    await tx.account.update({ where: { id: fromAccountId }, data: { balance: { decrement: amount } } });
    await tx.pocket.update({ where: { id: toPocketId }, data: { balance: { increment: amount } } });

    return tx.transaction.create({
      data: {
        userId,
        fromAccountId,
        amount: BigInt(amount),
        type: 'POCKET_TRANSFER',
        category: 'transfer',
        title: `To pocket: ${pocket.name}`,
        subtitle: 'Pocket transfer',
        status: 'COMPLETED',
        idempotencyKey,
        metadata: { pocketId: toPocketId, pocketName: pocket.name },
      },
    });
  });
}

export async function withdrawFromPocket(
  userId: string,
  pocketId: string,
  toAccountId: string,
  amount: number,
  idempotencyKey: string
) {
  const existing = await prisma.transaction.findUnique({ where: { idempotencyKey } });
  if (existing) return existing;

  return prisma.$transaction(async (tx) => {
    const pocket = await tx.pocket.findFirst({ where: { id: pocketId, userId } });
    if (!pocket) throw new Error('POCKET_NOT_FOUND');
    if (Number(pocket.balance) < amount) throw new Error('INSUFFICIENT_POCKET_BALANCE');

    const account = await tx.account.findFirst({ where: { id: toAccountId, userId } });
    if (!account) throw new Error('ACCOUNT_NOT_FOUND');

    await tx.pocket.update({ where: { id: pocketId }, data: { balance: { decrement: amount } } });
    await tx.account.update({ where: { id: toAccountId }, data: { balance: { increment: amount } } });

    return tx.transaction.create({
      data: {
        userId,
        toAccountId,
        amount: BigInt(amount),
        type: 'POCKET_TRANSFER',
        category: 'transfer',
        title: `From pocket: ${pocket.name}`,
        subtitle: 'Pocket withdrawal',
        status: 'COMPLETED',
        idempotencyKey,
        metadata: { pocketId, pocketName: pocket.name },
      },
    });
  });
}
