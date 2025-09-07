import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean database
    await prisma.auditLog.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.accessToken).toBeDefined();
        });
    });

    it('should not register user with existing email', async () => {
      // First registration
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        role: 'USER',
      });

      // Second registration with same email
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        role: 'USER',
      });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.accessToken).toBeDefined();
        });
    });

    it('should not login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        });

      const setCookieHeader = response.headers['set-cookie'];
      let refreshCookie: string | undefined;
      if (Array.isArray(setCookieHeader)) {
        refreshCookie = setCookieHeader.find((cookie: string) =>
          cookie.startsWith('refresh_token'),
        );
      } else if (typeof setCookieHeader === 'string') {
        refreshCookie = setCookieHeader.startsWith('refresh_token')
          ? setCookieHeader
          : undefined;
      }
      refreshToken = refreshCookie?.split(';')[0].split('=')[1] ?? '';
    });
    it('should refresh access token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', `refresh_token=${refreshToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
        });
    });

    it('should not refresh with invalid token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', 'refresh_token=invalid')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        });
      const setCookieHeader = response.headers['set-cookie'];
      let refreshCookie: string | undefined;
      if (Array.isArray(setCookieHeader)) {
        refreshCookie = setCookieHeader.find((cookie: string) =>
          cookie.startsWith('refresh_token'),
        );
      } else if (typeof setCookieHeader === 'string') {
        refreshCookie = setCookieHeader.startsWith('refresh_token')
          ? setCookieHeader
          : undefined;
      }
      refreshToken = refreshCookie?.split(';')[0].split('=')[1] ?? '';
    });
    it('should logout successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', `refresh_token=${refreshToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });
});
