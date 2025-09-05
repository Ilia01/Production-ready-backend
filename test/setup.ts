import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma.service';

let app: INestApplication;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [require('../src/app.module').AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  prisma = moduleFixture.get<PrismaService>(PrismaService);
  
  await app.init();
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

export { app, prisma };
