# MindMatch - Суулгах заавар

## 1. MySQL database үүсгэх

```sql
CREATE DATABASE setgelzui_hiring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. .env файл тохируулах

```env
DATABASE_URL="mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/setgelzui_hiring"
NEXTAUTH_SECRET="generate-a-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Migration ажиллуулах

```bash
npx prisma migrate dev --name init
```

## 4. Dev server эхлүүлэх

```bash
npm run dev
```

## Хуудсуудын жагсаалт

| Хуудас | URL | Тайлбар |
|--------|-----|---------|
| Нүүр хуудас | / | Hero, features |
| Бүртгүүлэх | /register | Ажил хайгч / Ажил олгогч |
| Нэвтрэх | /login | |
| Ажлын байрууд | /jobs | Хайх, шүүх |
| Ажлын дэлгэрэнгүй | /jobs/[id] | Өргөдөл гаргах |
| Тест өгөх | /assessment | Big Five 15 асуулт |
| Миний хуудас | /dashboard | Профайл, өргөдлүүд |
| Ажил нийтлэх | /employer/post-job | Психологийн шаардлага |
| Ажил олгогчийн самбар | /employer/dashboard | Өргөдөл хянах |
