# MindMatch - Setup Guide

## 1. Configure `.env`

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
NEXTAUTH_SECRET="generate-a-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 2. Apply the Neon baseline migration

```bash
npx prisma db execute --file prisma/migrations/20260518061000_neon_postgres_init/migration.sql --schema prisma/schema.prisma
```

## 3. Generate Prisma Client

```bash
npx prisma generate
```

## 4. Start the app

```bash
npm run dev
```
