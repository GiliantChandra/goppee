import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { config } from '../config';

/** Generate a 6-digit numeric OTP, hash it, store in DB. Returns raw OTP. */
export async function generateOtp(userId: string, accountId: string, amount: number, method: string): Promise<string> {
  const rawOtp = config.DEMO_MODE ? '123456' : String(Math.floor(100000 + crypto.randomInt(900000))).padStart(6, '0');
  const otpHash = await bcrypt.hash(rawOtp, 10); // cost 10 — OTPs are short-lived

  const expiresAt = new Date(Date.now() + config.OTP_EXPIRES_MINUTES * 60 * 1000);

  await prisma.topupRequest.create({
    data: {
      userId,
      accountId,
      amount: BigInt(amount),
      method,
      otpHash,
      expiresAt,
    },
  });

  if (config.DEMO_MODE) {
    // In demo mode, print OTP to server logs instead of sending SMS/email
    console.log(`\n🔑 [DEMO OTP] User ${userId} | Amount: Rp ${amount.toLocaleString('id-ID')} | OTP: ${rawOtp} | Expires: ${expiresAt.toISOString()}\n`);
  }
  // In production: call SMS/email gateway here (Twilio, Mailgun, etc.)

  return rawOtp; // Only returned to confirm we generated it; not sent to client
}

/** Verify OTP and credit balance if valid. Returns transaction record. */
export async function verifyOtpAndTopup(userId: string, accountId: string, rawOtp: string, idempotencyKey: string) {
  // Find pending, non-expired requests for this user + account
  const requests = await prisma.topupRequest.findMany({
    where: {
      userId,
      accountId,
      status: 'PENDING',
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  for (const request of requests) {
    if (request.attempts >= config.OTP_MAX_ATTEMPTS) {
      await prisma.topupRequest.update({ where: { id: request.id }, data: { status: 'FAILED' } });
      continue;
    }

    const matches = await bcrypt.compare(rawOtp, request.otpHash);
    if (!matches) {
      await prisma.topupRequest.update({ where: { id: request.id }, data: { attempts: { increment: 1 } } });
      const remaining = config.OTP_MAX_ATTEMPTS - (request.attempts + 1);
      if (remaining <= 0) throw new Error('OTP_ATTEMPTS_EXCEEDED');
      throw new Error(`INVALID_OTP:${remaining}`);
    }

    // OTP correct — atomically credit and mark complete
    const amount = Number(request.amount);
    return prisma.$transaction(async (tx) => {
      // Idempotency check
      const existingTxn = await tx.transaction.findUnique({ where: { idempotencyKey } });
      if (existingTxn) return existingTxn;

      await tx.account.update({ where: { id: accountId }, data: { balance: { increment: amount } } });
      await tx.topupRequest.update({ where: { id: request.id }, data: { status: 'COMPLETED' } });

      return tx.transaction.create({
        data: {
          userId,
          toAccountId: accountId,
          amount: BigInt(amount),
          type: 'TOPUP',
          category: 'topup',
          title: `Top-up via ${request.method}`,
          subtitle: 'Balance credited',
          status: 'COMPLETED',
          idempotencyKey,
          metadata: { method: request.method, topupRequestId: request.id },
        },
      });
    });
  }

  throw new Error('NO_PENDING_TOPUP');
}

/** Expire all pending OTP requests older than their expiry */
export async function expireStalledOtps(): Promise<void> {
  await prisma.topupRequest.updateMany({
    where: { status: 'PENDING', expiresAt: { lt: new Date() } },
    data: { status: 'EXPIRED' },
  });
}
