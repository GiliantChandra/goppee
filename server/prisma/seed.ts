import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function main() {
  console.log('🌱 Seeding NovaPay database...');

  // ─── Exchange Rates ─────────────────────────────────────────────────────────
  const rates = [
    { currency: 'USD', rateToIdr: 16245 },
    { currency: 'SGD', rateToIdr: 12180 },
    { currency: 'EUR', rateToIdr: 17890 },
    { currency: 'JPY', rateToIdr: 108 },
    { currency: 'GBP', rateToIdr: 20450 },
    { currency: 'SAR', rateToIdr: 4330 },
  ];

  for (const rate of rates) {
    await prisma.exchangeRate.upsert({
      where: { currency: rate.currency },
      update: { rateToIdr: rate.rateToIdr },
      create: rate,
    });
  }
  console.log('✅ Exchange rates seeded');

  // ─── Demo User ─────────────────────────────────────────────────────────────
  const email = process.env.SEED_USER_EMAIL ?? 'arjuna@novapay.id';
  const rawPassword = process.env.SEED_USER_PASSWORD ?? 'Password1!';
  const rawPin = process.env.SEED_USER_PIN ?? '1234';

  const passwordHash = await bcrypt.hash(rawPassword, BCRYPT_ROUNDS);
  const pinHash = await bcrypt.hash(rawPin, BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Arjuna Pratama',
      phone: '+62812345678',
      passwordHash,
      pinHash,
      memberSince: new Date('2022-01-15'),
    },
  });
  console.log(`✅ Demo user created: ${user.email}`);

  // ─── Accounts ──────────────────────────────────────────────────────────────
  const accountsData = [
    {
      type: 'CHECKING' as const,
      label: 'Primary Checking',
      balance: BigInt(24_850_000),
      accountNumber: '1234567890',
      cardNumberMasked: '4532 •••• •••• 8821',
      expiryDate: '08/28',
      cvvEncrypted: 'enc:123',      // In production: AES-256-GCM encrypted
      gradient: ['#6366f1', '#8b5cf6'],
    },
    {
      type: 'SAVINGS' as const,
      label: 'Savings Account',
      balance: BigInt(78_500_000),
      accountNumber: '9876543210',
      cardNumberMasked: '5412 •••• •••• 3345',
      expiryDate: '03/27',
      cvvEncrypted: 'enc:456',
      gradient: ['#0ea5e9', '#14b8a6'],
    },
    {
      type: 'INVESTMENT' as const,
      label: 'Investment Portfolio',
      balance: BigInt(156_200_000),
      accountNumber: '1122334455',
      cardNumberMasked: '3714 •••• •••• 6612',
      expiryDate: '11/29',
      cvvEncrypted: 'enc:789',
      gradient: ['#f59e0b', '#f97316'],
    },
  ];

  const createdAccounts: { id: string; label: string }[] = [];
  for (const accData of accountsData) {
    const existing = await prisma.account.findFirst({
      where: { userId: user.id, label: accData.label },
    });
    if (!existing) {
      const acc = await prisma.account.create({
        data: { userId: user.id, ...accData },
      });
      createdAccounts.push({ id: acc.id, label: acc.label });
    } else {
      createdAccounts.push({ id: existing.id, label: existing.label });
    }
  }
  console.log('✅ Accounts seeded');

  const primaryAcc = createdAccounts[0];

  // ─── Valas Accounts ─────────────────────────────────────────────────────────
  const valasCurrencies = [
    { currency: 'USD', balance: 350.50 },
    { currency: 'SGD', balance: 125.00 },
    { currency: 'EUR', balance: 0 },
    { currency: 'JPY', balance: 0 },
    { currency: 'GBP', balance: 0 },
    { currency: 'SAR', balance: 0 },
  ];

  for (const v of valasCurrencies) {
    await prisma.valasAccount.upsert({
      where: { userId_currency: { userId: user.id, currency: v.currency } },
      update: {},
      create: { userId: user.id, currency: v.currency, balance: v.balance },
    });
  }
  console.log('✅ Valas accounts seeded');

  // ─── Pockets ────────────────────────────────────────────────────────────────
  const pocketsData = [
    { name: 'Emergency Fund', emoji: '🛡️', color: '#6366f1', balance: BigInt(36_500_000), goalAmount: BigInt(50_000_000), goalDate: new Date('2026-12-31') },
    { name: 'Bali Vacation', emoji: '🏖️', color: '#14b8a6', balance: BigInt(9_200_000), goalAmount: BigInt(15_000_000), goalDate: new Date('2026-09-01') },
    { name: 'New Laptop', emoji: '💻', color: '#f59e0b', balance: BigInt(18_000_000), goalAmount: BigInt(25_000_000), goalDate: new Date('2026-08-01') },
    { name: 'House Down Payment', emoji: '🏠', color: '#ec4899', balance: BigInt(78_500_000), goalAmount: BigInt(200_000_000), goalDate: new Date('2028-06-01') },
  ];

  for (const p of pocketsData) {
    const existing = await prisma.pocket.findFirst({
      where: { userId: user.id, name: p.name },
    });
    if (!existing) {
      await prisma.pocket.create({
        data: { userId: user.id, accountId: primaryAcc.id, ...p },
      });
    }
  }
  console.log('✅ Pockets seeded');

  // ─── Seed Transactions ───────────────────────────────────────────────────────
  const txnCount = await prisma.transaction.count({ where: { userId: user.id } });
  if (txnCount === 0) {
    const txns = [
      { title: 'Monthly Salary', subtitle: 'PT Teknologi Maju', amount: BigInt(12_500_000), type: 'CREDIT', category: 'salary', createdAt: new Date('2026-07-01') },
      { title: 'Transfer to Savings', subtitle: 'Internal transfer', amount: BigInt(2_000_000), type: 'TRANSFER', category: 'transfer', createdAt: new Date('2026-07-01') },
      { title: 'Starbucks Coffee', subtitle: 'Food & Beverages', amount: BigInt(85_000), type: 'DEBIT', category: 'food', createdAt: new Date('2026-07-05') },
      { title: 'Netflix Subscription', subtitle: 'Entertainment', amount: BigInt(186_000), type: 'DEBIT', category: 'entertainment', createdAt: new Date('2026-06-30') },
      { title: 'Grab — Airport Trip', subtitle: 'Transportation', amount: BigInt(245_000), type: 'DEBIT', category: 'transport', createdAt: new Date('2026-06-29') },
      { title: 'H&M Purchase', subtitle: 'Shopping', amount: BigInt(1_320_000), type: 'DEBIT', category: 'shopping', createdAt: new Date('2026-06-28') },
      { title: 'PLN Electricity', subtitle: 'Utilities', amount: BigInt(450_000), type: 'DEBIT', category: 'utilities', createdAt: new Date('2026-06-27') },
      { title: 'Transfer from Budi', subtitle: 'Personal transfer', amount: BigInt(500_000), type: 'CREDIT', category: 'transfer', createdAt: new Date('2026-06-25') },
      { title: 'Garuda Indonesia', subtitle: 'Travel — Bali Flight', amount: BigInt(2_850_000), type: 'DEBIT', category: 'travel', createdAt: new Date('2026-06-24') },
      { title: 'Tokopedia Order', subtitle: 'Online Shopping', amount: BigInt(673_000), type: 'DEBIT', category: 'shopping', createdAt: new Date('2026-06-23') },
      { title: 'Halodoc Consultation', subtitle: 'Health', amount: BigInt(75_000), type: 'DEBIT', category: 'health', createdAt: new Date('2026-06-26') },
      { title: 'McDonalds', subtitle: 'Food & Beverages', amount: BigInt(145_000), type: 'DEBIT', category: 'food', createdAt: new Date('2026-06-22') },
    ];

    for (const t of txns) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          fromAccountId: t.type === 'DEBIT' || t.type === 'TRANSFER' ? primaryAcc.id : null,
          toAccountId: t.type === 'CREDIT' ? primaryAcc.id : null,
          ...t,
          type: t.type as any,
          status: 'COMPLETED',
          idempotencyKey: `seed-${t.title.toLowerCase().replace(/\s/g, '-')}-${Date.now()}-${Math.random()}`,
          createdAt: t.createdAt,
        },
      });
    }
    console.log('✅ Transactions seeded');
  }

  console.log('\n🎉 Seeding complete!');
  console.log(`📧 Login: ${email}`);
  console.log(`🔑 Password: ${rawPassword}`);
  console.log(`🔢 PIN: ${rawPin}`);
  if (process.env.DEMO_MODE === 'true') {
    console.log('\n⚠️  DEMO_MODE=true — OTP codes will be printed to server logs');
  }
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
