# MindMatch — Танилцуулга

---

## СЛАЙД 1 — Агуулга

**MindMatch**
*Сэтгэл зүйнд суурилсан ажил хайх платформ*

### Агуулгын жагсаалт

1. Төслийн Тойм
2. Системийн Архитектур
3. Мэдээллийн Сангийн Загвар
4. Аюулгүй Байдал
5. Гол Функцүүд
6. Gamification Систем
7. AI Integration
8. UI/UX Дизайн
9. Docker & Deployment
10. Дүгнэлт

---

## СЛАЙД 2 — Төслийн Тойм

### MindMatch гэж юу вэ?

MindMatch нь **Big Five (OCEAN) зан чанарын сэтгэл судлалд** тулгуурлан ажил хайгч болон ажил олгогчдыг оновчтой нийцүүлдэг Монгол хэлтэй цахим платформ юм.

### Зорилго

Уламжлалт ажил хайх платформуудаас ялгаатай нь MindMatch нь зөвхөн ур чадвар, туршлагыг биш — **хүний зан чанар, ажлын хэв маяг, хүрээлэн буй орчны хэрэгцээ** зэргийг харгалзан ажлын байртай тохируулдаг.

### Хэрэглэгчийн үүрэг

| Үүрэг | Тайлбар |
|---|---|
| **Ажил хайгч (JOBSEEKER)** | Big Five тест өгч, тохирох ажлаа хайж, өргөдөл гаргадаг |
| **Ажил олгогч (EMPLOYER)** | Ажлын байр нийтэлж, өргөдлийг харж, статус өөрчилдөг |
| **Админ (ADMIN)** | Системийн удирдлага (цаашид хэрэгжүүлэх) |

### Технологийн суурь

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Backend:** Next.js API Routes (fullstack)
- **Өгөгдлийн сан:** MySQL + Prisma ORM
- **Баталгаажуулалт:** NextAuth.js v4 (JWT)
- **AI:** Groq — Llama 3.3 70B

---

## СЛАЙД 3 — Системийн Архитектур

### Ерөнхий бүтэц

MindMatch нь **Next.js App Router** дээр суурилсан monolithic fullstack архитектуртай. Сервер болон клиент хоёулаа нэг code base-д байдаг тул deployment хялбар, хоорондын latency бага.

```
Хэрэглэгч (Browser)
        │
        ▼
   [ Navbar + Layout ]
        │
   ┌────┴────┐
   │  Pages  │  ← React Client Components ("use client")
   └────┬────┘
        │  fetch()
        ▼
  [ API Routes ]  ← Next.js Route Handlers (src/app/api/**)
        │
   ┌────┴────────────────┐
   │   Prisma ORM        │
   └────┬────────────────┘
        │
   [ MySQL Database ]
        
  AI хүсэлт:
  Pages → /api/ai → Groq Cloud → Streaming response
```

### Хуудасны бүтэц (App Router)

| Зам | Тайлбар |
|---|---|
| `/` | Нүүр хуудас |
| `/login`, `/register` | Нэвтрэх, бүртгэл |
| `/dashboard` | Ажил хайгчийн самбар |
| `/assessment` | Big Five тест |
| `/jobs`, `/jobs/[id]` | Ажлын жагсаалт, дэлгэрэнгүй |
| `/ai` | AI чат хуудас |
| `/profile` | Профайл засах |
| `/employer/dashboard` | Ажил олгогчийн самбар |
| `/employer/post-job` | Ажил нийтлэх |
| `/employer/edit-job/[id]` | Ажил засах |

### Өгөгдлийн урсгал

1. Хэрэглэгч хуудсанд орно → `useSession()` JWT шалгана
2. Үүргийн дагуу `/dashboard` эсвэл `/employer/dashboard` руу чиглүүлнэ
3. API дуусгаваруудад `getServerSession()` ашиглан серверт шалгалт хийнэ
4. Prisma ORM-оор MySQL-тэй холбогдоно

---

## СЛАЙД 4 — Мэдээллийн Сангийн Загвар

### Prisma Schema — MySQL

#### User загвар
```
id          String   @id @default(cuid())
name        String?
email       String   @unique
password    String               ← bcrypt хэш
role        Role                 ← JOBSEEKER | EMPLOYER | ADMIN
createdAt   DateTime
```
**Холбоо:** Profile (1:1), Job (1:N), Application (1:N), Assessment (1:1)

#### Profile загвар
```
bio         String?   ← Товч танилцуулга
phone       String?
location    String?
skills      String?   ← Ажил хайгчид
experience  String?   ← Ажил хайгчид
companyName String?   ← Ажил олгогчид
industry    String?   ← Ажил олгогчид
```

#### Job загвар
```
title             String
description       LongText
location          String
salary            String?
jobType           String     ← FULL_TIME | PART_TIME | CONTRACT
category          String
openness          Int        ← OCEAN оноо (0–100)
conscientiousness Int
extraversion      Int
agreeableness     Int
neuroticism       Int
isActive          Boolean
```

#### Assessment загвар (1:1 — User-тай)
```
openness          Int        ← Тестийн дүн
conscientiousness Int
extraversion      Int
agreeableness     Int
neuroticism       Int
workStyle         String?    ← AI-аар үүсгэсэн дүгнэлт
strengths         String?
idealEnvironment  String?
completedAt       DateTime
```

#### Application загвар
```
jobId       String
userId      String
coverLetter String?
cvUrl       String?           ← PDF файлын зам
status      ApplicationStatus ← PENDING | REVIEWED | ACCEPTED | REJECTED
matchScore  Int?              ← OCEAN тохирлын хувь (0–100%)

@@unique([jobId, userId])     ← Давхардлаас хамгаалах
```

### Харилцаа диаграм
```
User ──┬── Profile      (1:1, cascade delete)
       ├── Assessment   (1:1, cascade delete)
       ├── Job[]        (1:N, employer)
       └── Application[] (1:N, jobseeker)

Job ───── Application[] (1:N, cascade delete)
```

---

## СЛАЙД 5 — Аюулгүй Байдал

### Баталгаажуулалт (Authentication)

**NextAuth.js v4** — JWT стратеги ашигладаг.

- Нэвтрэх үед `bcryptjs.compare()` нууц үгийг шалгана
- JWT токенд `id`, `role` хадгална
- `session.user.role` client болон server аль алинд нь боломжтой

```typescript
// JWT callback — role-ийг токенд хадгалах
callbacks: {
  jwt: async ({ token, user }) => {
    if (user) token.role = user.role;
    return token;
  },
  session: ({ session, token }) => {
    session.user.id   = token.sub!;
    session.user.role = token.role;
    return session;
  }
}
```

### Зөвшөөрлийн шалгалт (Authorization)

**Клиент талд:**
```typescript
useEffect(() => {
  if (status === "unauthenticated") router.push("/login");
  if (session?.user.role !== "EMPLOYER") router.push("/dashboard");
}, [status, session]);
```

**Сервер талд (API Routes):**
```typescript
const session = await getServerSession(authOptions);
if (!session) return Response("Unauthorized", { status: 401 });
if (session.user.role !== "EMPLOYER") return Response("Forbidden", { status: 403 });
```

### Өмчлөлийн шалгалт

Ажил олгогч зөвхөн **өөрийнхөө** ажлыг засах/устгах боломжтой:

```typescript
const job = await prisma.job.findUnique({ where: { id } });
if (job.employerId !== session.user.id)
  return Response("Forbidden", { status: 403 });
```

### Өргөдлийн статусын шалгалт

Зөвхөн тодорхой утгуудыг зөвшөөрдөг:
```typescript
const VALID = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"];
if (!VALID.includes(status)) return Response("Bad Request", { status: 400 });
```

### CV Upload аюулгүй байдал

- Зөвхөн `application/pdf` MIME төрөл
- Хэмжээний хязгаар: **5MB**
- Файлын нэрийг `crypto.randomUUID()` ашиглан өөрчилдөг
- `public/uploads/cvs/` хавтаст хадгалдаг

### Нууц үгийн аюулгүй байдал

```typescript
// Бүртгэлийн үед
const hashed = await bcrypt.hash(password, 12);

// Нэвтрэх үед
const valid = await bcrypt.compare(password, user.password);
```

---

## СЛАЙД 6 — Гол Функцүүд

### 1. Big Five (OCEAN) Тест

15 асуулт бүхий сэтгэл зүйн тест — 5 шинж тэмдэг тус бүрт 3 асуулт:

| Шинж тэмдэг | Монголоор | Жишээ асуулт |
|---|---|---|
| **O** Openness | Нээлттэй байдал | "Урлаг, хөгжим, уран зохиолд дуртай" |
| **C** Conscientiousness | Хариуцлагатай байдал | "Ажлаа цагт нь, нарийн гүйцэтгэдэг" |
| **E** Extraversion | Нийгэмшил | "Олон хүнтэй байхад эрч хүч нэмэгддэг" |
| **A** Agreeableness | Нийцтэй байдал | "Бусдыг анхааран сонсдог" |
| **N** Neuroticism | Сэтгэл хөдлөл | "Стрессд өртөмтгий" |

**Тохирлын тооцоолол:**
```typescript
function calculateMatchScore(userOcean, jobOcean): number {
  const weights = { openness: 1, conscientiousness: 1.2,
                    extraversion: 0.8, agreeableness: 0.9, neuroticism: 1.1 };
  // Эвклидын жинлэсэн зай → 0–100% хувь
}
```

### 2. Ажлын байрны удирдлага

- Ажил нийтлэх: гарчиг, тайлбар, шаардлага, цалин, OCEAN оноо
- Засах, устгах (өмчлөлийн шалгалттай)
- Идэвхтэй/идэвхгүй статус

### 3. Өргөдлийн систем

- CV (PDF) upload + cover letter
- Статусын урсгал: PENDING → REVIEWED → ACCEPTED/REJECTED
- matchScore автоматаар тооцоологдоно

### 4. Профайл засах

- Ажил хайгч: нэр, утас, байршил, ур чадвар, туршлага
- Ажил олгогч: компанийн нэр, салбар

### 5. Ажлын жагсаалт

- Хайлт (гарчиг, байршил)
- Ангилалаар шүүлт
- Тохирлын хувь харуулах (тест өгсөн бол)

---

## СЛАЙД 7 — Gamification Систем

### Ойлголт

MindMatch-д **gamification** элементүүдийг нэвтрүүлснээр хэрэглэгчдийн оролцоо, идэвхийг нэмэгдүүлэх зорилготой.

### Хэрэгжүүлсэн элементүүд

#### Тохирлын оноо (Match Score Badge)
- Ажлын байр бүр дээр **0–100%** тохирлын хувь харуулна
- Өнгө: 80%+ ногоон, 60–79% шар, 60%- улаан
- Хэрэглэгчийг тест өгөхөд урамшуулна

#### Тестийн дэвшилтийн мөрдөлт
- Big Five тест дуусмагц **ажлын хэв маяг, давуу талууд, тохиромжтой орчин** гэсэн 3 хэсэг бүхий персонал дүгнэлт гарна
- "Таны зан чанарт тохирох ажлууд" хэсэг шууд dashboard-д харагдана

### Цаашид нэмэх боломжтой элементүүд

| Элемент | Тайлбар |
|---|---|
| **XP / Оноо** | Тест өгөх, өргөдөл гаргах, профайл бөглөхөд оноо нэмнэ |
| **Badge / Тэмдэглэгээ** | "Анхны өргөдөл", "Тест дүүргэгч", "Идэвхтэй хайгч" |
| **Streak / Тасралтгүй байдал** | 7 хоног дараалан нэвтэрвэл урамшуулал |
| **Leaderboard** | Ижил ангиллаар хамгийн их тохирдог хайгчдын жагсаалт |
| **Дэвшилтийн хэмжүүр** | Профайл бөглөлтийн % харуулах (LinkedIn загвар) |
| **AI санал** | "Таны оноо 85% болвол энэ ажилд тохирно" гэх санамж |

### Зорилтот үр дүн

- Хэрэглэгчийн платформд зарцуулах хугацаа **+40%** нэмэгдэнэ
- Тест өгөгчдийн тоо **+60%** өснө (одоогоор заавал биш)
- Өргөдлийн чанар дээшилнэ (профайлыг бүрэн бөглөхийг дэмжинэ)

---

## СЛАЙД 8 — AI Integration

### Groq + Llama 3.3 70B

MindMatch нь **Groq Cloud**-ийн дэд бүтцийг ашиглан Llama 3.3 70B загварыг хэрэглэж, **карьерын AI зөвлөгч** функцийг хэрэгжүүлсэн.

### Техникийн хэрэгжилт

**API маршрут** (`/api/ai`):
```typescript
const stream = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content: "You are MindMatch AI, a career advisor... 
                Respond in Mongolian when user writes Mongolian."
    },
    ...userMessages
  ],
  stream: true,
  max_tokens: 1024,
});

// ReadableStream буцаана → клиент дэлгэцэнд шууд харуулна
```

**Клиент дэлгэц** — streaming reader:
```typescript
const reader = res.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  full += decoder.decode(value, { stream: true });
  setMessages([...prev, { role: "assistant", content: full }]);
}
```

### AI Drawer (Popup Самбар)

Navbar дээрх **AI** товч дарахад баруун талаас хажуугийн самбар гарч ирнэ:

- Хуудас солихгүйгээр ямар ч хуудсанд ашиглах боломжтой
- Backdrop товших эсвэл **Escape** дарахад хаана
- **Санал хэллэгүүд** — шууд дарж асуух боломж:
  - "Ярилцлагад хэрхэн бэлдэх вэ?"
  - "CV-гээ яаж сайжруулах вэ?"
  - "Big Five тестийн тухай тайлбарлаач"
  - "Цалин хэлэлцэх зөвлөгөө"

### AI Чатын функцүүд

| Функц | Тайлбар |
|---|---|
| **Streaming** | Текст бичигдэж байхад шууд харагдана |
| **Reply / Хариулах** | Мессежэн дээр hover → хариулах товч → quote preview |
| **Copy / Хуулах** | Мессежийг clipboard-д хуулах |
| **Clear / Цэвэрлэх** | Бүх чатыг устгах (баталгаажуулалттай) |
| **Typing indicator** | AI боловсруулж байх үед 3 цэг анивчна |
| **Олон хэлт** | Монгол бичвэл монголоор, англиар бичвэл англиар хариулна |

### Ирээдүйн боломж

- Хэрэглэгчийн OCEAN оноог системийн мессежэнд оруулж **персонал зөвлөгөө** өгүүлэх
- "Энэ ажилд яагаад тохирдог вэ?" гэсэн тайлбар үүсгэх
- CV текст оруулан дүгнэлт гаргуулах

---

## СЛАЙД 9 — UI/UX Дизайн

### Дизайны философи

**"Цэвэр, хялбар, мэдрэмжтэй"** — MindMatch-ийн UI нь хэт нарийн биш, ойлгомжтой, монгол хэрэглэгчид зориулсан.

### Өнгөний систем

| Нэр | Утга | Хэрэглэгддэг газар |
|---|---|---|
| `#4B7BF5` | Accent цэнхэр | Товч, холбоос, идэвхтэй төлөв |
| `#111827` | Харанхуй | Гарчиг, чухал текст |
| `#F7F8FA` | Цайвар саарал | Дэвсгэр |
| `#FFFFFF` | Цагаан | Картууд, самбарууд |
| `#E2E7EF` | Хил | Хүрээ, хэсэгчлэл |
| `#6B7280` | Дундаж саарал | Туслах текст |

### Бүрэлдэхүүн хэсгүүд

#### Navbar
- **Шилэн (glass) эффект** — нүүр хуудсанд дэвсгэр ил харагдана
- Гүйлгэлтэд blur + цагаан дэвсгэр болж хувирна
- Үүргийн дагуу өөр өөр холбоосууд харагдана

#### Kartууд
- `border-radius: 16px` — дугуй булантай
- `box-shadow: 0 4px 16px rgba(0,0,0,0.05)` — нимгэн сүүдэр
- Hover дээр opacity буурна

#### Товчлуурууд
- Анхдагч: `background: linear-gradient(135deg, #4B7BF5, #0F766E)`
- Hover: `opacity: 0.9`
- Disabled: `opacity: 0.5`

#### Оролтын талбарууд
- Дэвсгэр: `#F7F8FA`, хил: `#E2E7EF`
- Focus дээр цэнхэр хилтэй болно
- `border-radius: 12px`

### Хариу үйлдэл (Responsive)

- Бүх хуудас `max-w-6xl mx-auto px-4 sm:px-6` хүрээтэй
- Grid: `grid-cols-1 → grid-cols-2 → grid-cols-3` дэлгэцийн хэмжээгээр
- Navbar мобайлд ажиллагаатай

### Анимейшн

- Navbar blur transition: `duration-300`
- AI Drawer: `cubic-bezier(0.4, 0, 0.2, 1)` — жигд нээлт/хаалт
- Spinning loader: `animate-spin`
- Typing dots: `animate-bounce` + animationDelay

### Хэл

Бүх UI **монгол хэлтэй** — нэвтрэх, бүртгэл, тест, самбар, өргөдөл, мессеж бүр монголоор байна.

---

## СЛАЙД 10 — Docker & Deployment

### Одоогийн орчин

MindMatch одоогоор **localhost (development)** дээр ажиллаж байна:

```
DATABASE_URL = mysql://root:****@localhost:3306/setgelzui_hiring
NEXTAUTH_URL = http://localhost:3000
GROQ_API_KEY = gsk_****
```

### Docker-жуулах төлөвлөгөө

#### Dockerfile (Next.js)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://root:password@db:3306/mindmatch
      - NEXTAUTH_SECRET=production-secret
      - NEXTAUTH_URL=https://mindmatch.mn
      - GROQ_API_KEY=gsk_****
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: mindmatch
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

### Deployment сонголтууд

| Платформ | Давуу тал | Хэрэглэх тохиолдол |
|---|---|---|
| **Vercel** | Next.js-д оновчилсон, автомат CI/CD | Хялбар, хурдан |
| **Railway** | MySQL + App нэг дор | Хямд, бага хэмжээний prod |
| **AWS EC2 + RDS** | Бүрэн хяналт | Том хэмжээний ачаалал |
| **Docker + VPS** | Уян хатан, өртөг бага | Дунд түвшний prod |

### CI/CD Урсгал (GitHub Actions)

```yaml
on: [push]
jobs:
  deploy:
    steps:
      - npm run lint
      - npm run build
      - prisma migrate deploy
      - docker build & push
      - SSH → docker-compose up -d
```

### Орчны хувьсагчид (Production)

```env
DATABASE_URL        = mysql://user:pass@prod-db:3306/mindmatch
NEXTAUTH_SECRET     = [криптографийн хүчтэй мөр]
NEXTAUTH_URL        = https://mindmatch.mn
GROQ_API_KEY        = gsk_****
NODE_ENV            = production
```

---

## СЛАЙД 11 — Дүгнэлт

### Юу бүтээлээ?

MindMatch нь **зан чанарт суурилсан** ажил хайх цоо шинэ туршлага бүтээсэн — ажил хайгч зөвхөн ур чадвараараа биш, **хэн болохоороо** ажлаа олдог систем.

### Гол амжилтууд

✓ **Big Five OCEAN** зан чанарын тест + тохирлын тооцоолол хэрэгжүүлсэн
✓ **Бүрэн баталгаажуулалт** — JWT, bcrypt, үүрэгт суурилсан хандалт
✓ **Ажил олгогч** — нийтлэх, засах, устгах, өргөдөл удирдах
✓ **Ажил хайгч** — тест, өргөдөл, тохирлын %, профайл
✓ **Groq AI зөвлөгч** — streaming, popup drawer, олон хэлт
✓ **CV upload** — PDF баримт илгээх систем
✓ **Бүрэн монгол хэлтэй** UI/UX

### Техникийн чанар

- TypeScript бүрэн хамрагдсан
- Сервер болон клиент талд authorization шалгалт
- Cascade delete, unique constraint, enum шалгалтууд
- Streaming AI хариулт — latency бага, туршлага сайн

### Цаашдын хөгжлийн зам

| Тэргүүлэх | Боломж |
|---|---|
| 🚀 Хурдан | Docker + Railway deployment |
| 📊 Дунд | Gamification (XP, badge, streak) |
| 🤖 Урт хугацаа | OCEAN-аар персонал AI зөвлөгөө |
| 🌐 Өргөтгөл | Админ самбар, analytics, мобайл апп |

### Эцсийн үг

> *"Ажил хайх нь зөвхөн ур чадвар биш — хэн болохоо мэдэх нь хамгийн чухал."*
>
> — MindMatch, 2026

---

*MindMatch © 2026 · Next.js 16 · React 19 · Prisma · MySQL · Groq AI*
