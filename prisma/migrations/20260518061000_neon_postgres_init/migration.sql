-- MindMatch baseline schema for Neon Postgres
-- Safe to re-run in non-empty environments.

BEGIN;

-- Remove demo tables from the earlier Neon smoke test.
DROP TABLE IF EXISTS public.exam_results CASCADE;
DROP TABLE IF EXISTS public.exams CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM ('JOBSEEKER', 'EMPLOYER', 'ADMIN');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ApplicationStatus') THEN
    CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'JOBSEEKER',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "User_email_key" UNIQUE ("email")
);

CREATE TABLE IF NOT EXISTS "Profile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "bio" TEXT NULL,
  "phone" TEXT NULL,
  "location" TEXT NULL,
  "skills" TEXT NULL,
  "experience" TEXT NULL,
  "companyName" TEXT NULL,
  "industry" TEXT NULL,
  CONSTRAINT "Profile_userId_key" UNIQUE ("userId"),
  CONSTRAINT "Profile_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Job" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "requirements" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "salary" TEXT NULL,
  "jobType" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "employerId" TEXT NOT NULL,
  "openness" INTEGER NOT NULL DEFAULT 50,
  "conscientiousness" INTEGER NOT NULL DEFAULT 50,
  "extraversion" INTEGER NOT NULL DEFAULT 50,
  "agreeableness" INTEGER NOT NULL DEFAULT 50,
  "neuroticism" INTEGER NOT NULL DEFAULT 50,
  CONSTRAINT "Job_employerId_fkey"
    FOREIGN KEY ("employerId") REFERENCES "User" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Job_openness_check" CHECK ("openness" BETWEEN 0 AND 100),
  CONSTRAINT "Job_conscientiousness_check" CHECK ("conscientiousness" BETWEEN 0 AND 100),
  CONSTRAINT "Job_extraversion_check" CHECK ("extraversion" BETWEEN 0 AND 100),
  CONSTRAINT "Job_agreeableness_check" CHECK ("agreeableness" BETWEEN 0 AND 100),
  CONSTRAINT "Job_neuroticism_check" CHECK ("neuroticism" BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS "Assessment" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "completedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "openness" INTEGER NOT NULL,
  "conscientiousness" INTEGER NOT NULL,
  "extraversion" INTEGER NOT NULL,
  "agreeableness" INTEGER NOT NULL,
  "neuroticism" INTEGER NOT NULL,
  "workStyle" TEXT NULL,
  "strengths" TEXT NULL,
  "idealEnvironment" TEXT NULL,
  CONSTRAINT "Assessment_userId_key" UNIQUE ("userId"),
  CONSTRAINT "Assessment_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Assessment_openness_check" CHECK ("openness" BETWEEN 0 AND 100),
  CONSTRAINT "Assessment_conscientiousness_check" CHECK ("conscientiousness" BETWEEN 0 AND 100),
  CONSTRAINT "Assessment_extraversion_check" CHECK ("extraversion" BETWEEN 0 AND 100),
  CONSTRAINT "Assessment_agreeableness_check" CHECK ("agreeableness" BETWEEN 0 AND 100),
  CONSTRAINT "Assessment_neuroticism_check" CHECK ("neuroticism" BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS "Application" (
  "id" TEXT PRIMARY KEY,
  "jobId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "coverLetter" TEXT NULL,
  "cvUrl" TEXT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
  "matchScore" INTEGER NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Application_jobId_userId_key" UNIQUE ("jobId", "userId"),
  CONSTRAINT "Application_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "Job" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Application_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Application_matchScore_check" CHECK ("matchScore" IS NULL OR "matchScore" BETWEEN 0 AND 100)
);

-- Query-driven indexes from the current API usage.
CREATE INDEX IF NOT EXISTS "Job_isActive_createdAt_idx"
  ON "Job" ("isActive", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Job_isActive_category_createdAt_idx"
  ON "Job" ("isActive", "category", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Job_employerId_createdAt_idx"
  ON "Job" ("employerId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Application_userId_createdAt_idx"
  ON "Application" ("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Application_jobId_createdAt_idx"
  ON "Application" ("jobId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Application_status_createdAt_idx"
  ON "Application" ("status", "createdAt" DESC);

-- Trigram indexes for contains search on jobs endpoint.
CREATE INDEX IF NOT EXISTS "Job_title_trgm_idx"
  ON "Job" USING GIN ("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Job_description_trgm_idx"
  ON "Job" USING GIN ("description" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Job_location_trgm_idx"
  ON "Job" USING GIN ("location" gin_trgm_ops);

-- Seed users.
INSERT INTO "User" ("id", "name", "email", "password", "role")
VALUES
  ('u_emp_tech', 'MindMatch Tech', 'hr@mindmatch.mn', '$2b$10$fsZgsKURCPyCOilY4ewDfefqV57U0iiKNL9ud4dD5I/xs0ipScNCS', 'EMPLOYER'),
  ('u_emp_edu', 'Erdem Surgalt', 'hr@erdem.mn', '$2b$10$fsZgsKURCPyCOilY4ewDfefqV57U0iiKNL9ud4dD5I/xs0ipScNCS', 'EMPLOYER'),
  ('u_seek_1', 'Batbayar', 'seeker@test.mn', '$2b$10$fsZgsKURCPyCOilY4ewDfefqV57U0iiKNL9ud4dD5I/xs0ipScNCS', 'JOBSEEKER')
ON CONFLICT ("email") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "password" = EXCLUDED."password",
  "role" = EXCLUDED."role";

-- Seed profiles.
INSERT INTO "Profile" ("id", "userId", "bio", "companyName", "industry")
SELECT 'p_emp_tech', u."id", 'MindMatch Tech LLC recruitment profile', 'MindMatch Tech LLC', 'IT & Technology'
FROM "User" u
WHERE u."email" = 'hr@mindmatch.mn'
ON CONFLICT ("userId") DO UPDATE
SET
  "bio" = EXCLUDED."bio",
  "companyName" = EXCLUDED."companyName",
  "industry" = EXCLUDED."industry";

INSERT INTO "Profile" ("id", "userId", "bio", "companyName", "industry")
SELECT 'p_emp_edu', u."id", 'Erdem Surgalt LLC recruitment profile', 'Erdem Surgalt LLC', 'Education'
FROM "User" u
WHERE u."email" = 'hr@erdem.mn'
ON CONFLICT ("userId") DO UPDATE
SET
  "bio" = EXCLUDED."bio",
  "companyName" = EXCLUDED."companyName",
  "industry" = EXCLUDED."industry";

INSERT INTO "Profile" ("id", "userId", "bio", "location", "skills", "experience")
SELECT 'p_seek_1', u."id", 'Test job seeker account', 'Ulaanbaatar', 'Next.js, TypeScript, SQL', '2 years of full-stack development'
FROM "User" u
WHERE u."email" = 'seeker@test.mn'
ON CONFLICT ("userId") DO UPDATE
SET
  "bio" = EXCLUDED."bio",
  "location" = EXCLUDED."location",
  "skills" = EXCLUDED."skills",
  "experience" = EXCLUDED."experience";

-- Seed assessment.
INSERT INTO "Assessment" (
  "id", "userId", "openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism",
  "workStyle", "strengths", "idealEnvironment"
)
SELECT
  'a_seek_1', u."id", 72, 68, 55, 70, 32,
  'Balanced collaborative problem-solver',
  'Strong communication, ownership, and structured thinking',
  'Hybrid environment with clear goals and autonomy'
FROM "User" u
WHERE u."email" = 'seeker@test.mn'
ON CONFLICT ("userId") DO UPDATE
SET
  "openness" = EXCLUDED."openness",
  "conscientiousness" = EXCLUDED."conscientiousness",
  "extraversion" = EXCLUDED."extraversion",
  "agreeableness" = EXCLUDED."agreeableness",
  "neuroticism" = EXCLUDED."neuroticism",
  "workStyle" = EXCLUDED."workStyle",
  "strengths" = EXCLUDED."strengths",
  "idealEnvironment" = EXCLUDED."idealEnvironment";

-- Seed jobs.
INSERT INTO "Job" (
  "id", "title", "description", "requirements", "location", "salary", "jobType", "category",
  "isActive", "employerId", "openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"
)
SELECT
  'j_fs_dev',
  'Senior Full-Stack Developer',
  'Build and maintain Next.js and Node.js products for fast-moving teams.',
  'Next.js, TypeScript, PostgreSQL, production API design experience.',
  'Ulaanbaatar / Remote',
  '3,500,000 MNT',
  'Remote',
  'IT & Technology',
  true,
  u."id",
  75, 65, 45, 68, 30
FROM "User" u
WHERE u."email" = 'hr@mindmatch.mn'
ON CONFLICT ("id") DO UPDATE
SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "requirements" = EXCLUDED."requirements",
  "location" = EXCLUDED."location",
  "salary" = EXCLUDED."salary",
  "jobType" = EXCLUDED."jobType",
  "category" = EXCLUDED."category",
  "isActive" = EXCLUDED."isActive",
  "employerId" = EXCLUDED."employerId",
  "openness" = EXCLUDED."openness",
  "conscientiousness" = EXCLUDED."conscientiousness",
  "extraversion" = EXCLUDED."extraversion",
  "agreeableness" = EXCLUDED."agreeableness",
  "neuroticism" = EXCLUDED."neuroticism",
  "updatedAt" = now();

INSERT INTO "Job" (
  "id", "title", "description", "requirements", "location", "salary", "jobType", "category",
  "isActive", "employerId", "openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"
)
SELECT
  'j_ui_ux',
  'UI/UX Designer',
  'Design product interfaces and iterate from user research feedback.',
  'Figma, usability testing, and design system experience.',
  'Ulaanbaatar',
  '2,500,000 MNT',
  'Full-time',
  'IT & Technology',
  true,
  u."id",
  84, 60, 58, 72, 34
FROM "User" u
WHERE u."email" = 'hr@mindmatch.mn'
ON CONFLICT ("id") DO UPDATE
SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "requirements" = EXCLUDED."requirements",
  "location" = EXCLUDED."location",
  "salary" = EXCLUDED."salary",
  "jobType" = EXCLUDED."jobType",
  "category" = EXCLUDED."category",
  "isActive" = EXCLUDED."isActive",
  "employerId" = EXCLUDED."employerId",
  "openness" = EXCLUDED."openness",
  "conscientiousness" = EXCLUDED."conscientiousness",
  "extraversion" = EXCLUDED."extraversion",
  "agreeableness" = EXCLUDED."agreeableness",
  "neuroticism" = EXCLUDED."neuroticism",
  "updatedAt" = now();

INSERT INTO "Job" (
  "id", "title", "description", "requirements", "location", "salary", "jobType", "category",
  "isActive", "employerId", "openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"
)
SELECT
  'j_math_teacher',
  'Mathematics Teacher (10-12)',
  'Teach high-school mathematics and prepare students for university entrance exams.',
  'Education degree, curriculum planning, and classroom management.',
  'Ulaanbaatar',
  '2,000,000 MNT',
  'Full-time',
  'Education',
  true,
  u."id",
  62, 78, 52, 74, 28
FROM "User" u
WHERE u."email" = 'hr@erdem.mn'
ON CONFLICT ("id") DO UPDATE
SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "requirements" = EXCLUDED."requirements",
  "location" = EXCLUDED."location",
  "salary" = EXCLUDED."salary",
  "jobType" = EXCLUDED."jobType",
  "category" = EXCLUDED."category",
  "isActive" = EXCLUDED."isActive",
  "employerId" = EXCLUDED."employerId",
  "openness" = EXCLUDED."openness",
  "conscientiousness" = EXCLUDED."conscientiousness",
  "extraversion" = EXCLUDED."extraversion",
  "agreeableness" = EXCLUDED."agreeableness",
  "neuroticism" = EXCLUDED."neuroticism",
  "updatedAt" = now();

-- Seed application.
INSERT INTO "Application" ("id", "jobId", "userId", "coverLetter", "status", "matchScore")
SELECT
  'app_1',
  j."id",
  u."id",
  'I am excited to contribute to your team and apply my skills in production systems.',
  'PENDING',
  82
FROM "User" u
JOIN "Job" j ON j."id" = 'j_fs_dev'
WHERE u."email" = 'seeker@test.mn'
ON CONFLICT ("jobId", "userId") DO UPDATE
SET
  "coverLetter" = EXCLUDED."coverLetter",
  "status" = EXCLUDED."status",
  "matchScore" = EXCLUDED."matchScore",
  "updatedAt" = now();

COMMIT;
