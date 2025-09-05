# 🚀 Production-Ready NestJS API

A comprehensive, production-ready NestJS backend service with JWT authentication, comprehensive testing, Docker support, and CI/CD pipeline.

## ✨ Features

### 🔐 Authentication & Security
- **JWT Access Tokens** (15-minute expiration) with refresh token rotation
- **HTTP-Only Cookies** for secure refresh token storage (7-day expiration)
- **Password Hashing** with bcrypt
- **Rate Limiting** with configurable limits per endpoint
- **Security Headers** with Helmet.js
- **Input Validation** with Zod schemas

### 🗄️ Database & Models
- **PostgreSQL** with Prisma ORM
- **User Management** with roles (USER, ADMIN)
- **Session Tracking** with IP and User-Agent logging
- **Audit Logging** for all user actions
- **Database Migrations** with version control

### 🛠️ Development & Testing
- **TypeScript** with strict type checking
- **Zod DTOs** for runtime validation
- **Jest + Supertest** for comprehensive testing
- **ESLint + Prettier** for code quality
- **Swagger/OpenAPI** documentation

### ⚙️ Production & Operations
- **Docker** containerization with multi-stage builds
- **Docker Compose** for local development
- **GitHub Actions** CI/CD pipeline
- **Health Checks** for monitoring
- **Structured Logging** with Winston
- **Database Seeding** scripts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start development server
npm run start:dev
```

### Docker Setup

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🗄️ Database

### Models
- **User**: Authentication and user management
- **Session**: Active user sessions with metadata
- **AuditLog**: Comprehensive audit trail

### Scripts
```bash
# Reset database and seed
npm run db:reset

# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run with coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format with Prettier

# Database
npm run db:seed            # Seed database
npm run db:reset           # Reset and seed database

# Docker
npm run docker:build       # Build Docker image
npm run docker:up          # Start with Docker Compose
npm run docker:down        # Stop Docker services
```

## 🏗️ Architecture

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── health/              # Health check endpoints
├── security/            # Security and rate limiting
├── logger/              # Logging service
├── schemas/             # Zod validation schemas
├── pipes/               # Custom validation pipes
├── decorators/          # Custom decorators
└── main.ts             # Application entry point
```

## 🔒 Security Features

- **JWT Token Rotation**: Refresh tokens are rotated on each use
- **Rate Limiting**: Configurable per endpoint (auth: 5/min, general: 100/min)
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Zod schemas for runtime validation
- **Audit Logging**: All actions are logged with metadata
- **Session Management**: Track active sessions with IP/User-Agent

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/trading
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend.com
LOG_LEVEL=info
```

### Docker Production
```bash
# Build production image
docker build -t trading-api .

# Run with environment
docker run -p 3000:3000 \
  -e DATABASE_URL=your-db-url \
  -e JWT_SECRET=your-secret \
  trading-api
```

## 📊 Monitoring

- **Health Checks**: `/health`, `/health/ready`, `/health/live`
- **Structured Logging**: JSON logs with Winston
- **Audit Trail**: Complete user action logging
- **Session Tracking**: Monitor active user sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.