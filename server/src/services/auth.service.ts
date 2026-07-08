import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { config } from '../config';

const BCRYPT_ROUNDS = 12;

export interface TokenPair {
  accessToken: string;
  expiresIn: string;
}

// ─── Registration ─────────────────────────────────────────────────────────────

export async function register(email: string, password: string, name: string, phone?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, name, phone, passwordHash },
  });
  return { id: user.id, email: user.email, name: user.name };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<TokenPair & { refreshToken: string }> {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always run bcrypt compare to prevent timing attacks on email enumeration
  const dummyHash = '$2b$12$invalidhashfortimingattackprevention1234567890123456';
  const compareTarget = user?.passwordHash ?? dummyHash;
  const valid = await bcrypt.compare(password, compareTarget);

  if (!user || !valid) {
    if (user) {
      // Increment failed attempts
      const attempts = user.failedLoginAttempts + 1;
      const shouldLock = attempts >= config.MAX_FAILED_LOGIN_ATTEMPTS;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: attempts,
          lockedAt: shouldLock ? new Date() : undefined,
        },
      });
      if (shouldLock) throw new Error('ACCOUNT_LOCKED');
    }
    throw new Error('INVALID_CREDENTIALS');
  }

  if (user.lockedAt) throw new Error('ACCOUNT_LOCKED');

  // Reset failed attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0 },
  });

  return issueTokens(user.id, user.email, user.name);
}

// ─── Token Management ─────────────────────────────────────────────────────────

export async function issueTokens(userId: string, email: string, name: string): Promise<TokenPair & { refreshToken: string }> {
  const accessToken = jwt.sign(
    { sub: userId, email, name },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN as any }
  );

  // Generate a cryptographically random refresh token
  const rawRefresh = require('crypto').randomBytes(64).toString('hex');
  const tokenHash = await bcrypt.hash(rawRefresh, 10); // cost 10 for refresh — lower for speed

  // Store hash, not the raw token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });

  return { accessToken, refreshToken: rawRefresh, expiresIn: config.JWT_EXPIRES_IN };
}

export async function refreshAccessToken(rawRefreshToken: string): Promise<TokenPair> {
  // Find all non-expired, non-revoked refresh tokens for potential match
  const candidates = await prisma.refreshToken.findMany({
    where: { revoked: false, expiresAt: { gt: new Date() } },
    include: { user: { select: { id: true, email: true, name: true, lockedAt: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  for (const candidate of candidates) {
    const matches = await bcrypt.compare(rawRefreshToken, candidate.tokenHash);
    if (matches) {
      if (candidate.user.lockedAt) throw new Error('ACCOUNT_LOCKED');

      // Rotate: revoke old, issue new access token
      await prisma.refreshToken.update({ where: { id: candidate.id }, data: { revoked: true } });

      const accessToken = jwt.sign(
        { sub: candidate.user.id, email: candidate.user.email, name: candidate.user.name },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN as any }
      );
      return { accessToken, expiresIn: config.JWT_EXPIRES_IN };
    }
  }
  throw new Error('INVALID_REFRESH_TOKEN');
}

export async function revokeRefreshToken(rawRefreshToken: string): Promise<void> {
  const candidates = await prisma.refreshToken.findMany({
    where: { revoked: false },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  for (const candidate of candidates) {
    if (await bcrypt.compare(rawRefreshToken, candidate.tokenHash)) {
      await prisma.refreshToken.update({ where: { id: candidate.id }, data: { revoked: true } });
      return;
    }
  }
}

// ─── PIN Verification ─────────────────────────────────────────────────────────

export async function verifyPin(userId: string, pin: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { pinHash: true },
  });
  if (!user?.pinHash) return false;
  return bcrypt.compare(pin, user.pinHash);
}

export async function setPin(userId: string, newPin: string): Promise<void> {
  if (!/^\d{4,6}$/.test(newPin)) throw new Error('PIN must be 4-6 digits');
  const pinHash = await bcrypt.hash(newPin, BCRYPT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { pinHash } });
}
