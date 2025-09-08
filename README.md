# (WIP)

NestJS + Prisma backend service.  
**Work in progress** — endpoints work, Swagger docs live, but parts are incomplete or broken.  

## Features
- JWT auth with refresh tokens (HttpOnly cookies)
- Prisma ORM (PostgreSQL)
- Swagger at `/api/docs`
- Docker + GitHub Actions (CI/CD not stable)

## Status
- Endpoints: working
- Auth/session: needs refactor
- CI/CD + Docker: partial, unreliable
- Logging: incomplete

## Quickstart
```bash
npm install
npx prisma migrate dev
npm run start:dev
