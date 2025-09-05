import { PrismaClient, UserRole } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trading.com' },
    update: {},
    create: {
      email: 'admin@trading.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@trading.com' },
    update: {},
    create: {
      email: 'user@trading.com',
      passwordHash: userPassword,
      role: UserRole.USER,
    },
  });

  // Create test users
  for (let i = 1; i <= 5; i++) {
    const testPassword = await bcrypt.hash(`test${i}123`, 10);
    await prisma.user.upsert({
      where: { email: `test${i}@trading.com` },
      update: {},
      create: {
        email: `test${i}@trading.com`,
        passwordHash: testPassword,
        role: UserRole.USER,
      },
    });
  }

  // Create sample audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'LOGIN',
        resource: 'User',
        resourceId: admin.id,
        details: { loginMethod: 'email' },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Test Browser)',
      },
      {
        userId: user.id,
        action: 'REGISTER',
        resource: 'User',
        resourceId: user.id,
        details: { registrationMethod: 'email' },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Test Browser)',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: admin@trading.com / admin123`);
  console.log(`👤 Regular user: user@trading.com / user123`);
  console.log(`👤 Test users: test1@trading.com / test1123, test2@trading.com / test2123, etc.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
