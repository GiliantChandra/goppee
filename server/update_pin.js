const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('123456', 12);
  const res = await prisma.user.updateMany({
    where: { pinHash: null },
    data: { pinHash: hash }
  });
  console.log('Updated ' + res.count + ' users.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
