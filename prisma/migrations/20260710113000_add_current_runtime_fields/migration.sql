-- Bring the deployed database in line with the current Prisma schema.
-- Keep old "name" columns intact, but copy their values into "nickname" when present.

ALTER TABLE "Mentor" ADD COLUMN IF NOT EXISTS "nickname" TEXT;
ALTER TABLE "Mentor" ADD COLUMN IF NOT EXISTS "point" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Mentor" ADD COLUMN IF NOT EXISTS "unlockedCosmetics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Mentor" ADD COLUMN IF NOT EXISTS "equippedEffect" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Mentor'
      AND column_name = 'name'
  ) THEN
    EXECUTE 'UPDATE "Mentor" SET "nickname" = "name" WHERE "nickname" IS NULL';
  END IF;
END $$;

ALTER TABLE "Mentee" ADD COLUMN IF NOT EXISTS "nickname" TEXT;
ALTER TABLE "Mentee" ADD COLUMN IF NOT EXISTS "point" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Mentee" ADD COLUMN IF NOT EXISTS "unlockedHintLevels" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];
ALTER TABLE "Mentee" ADD COLUMN IF NOT EXISTS "unlockedCosmetics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Mentee" ADD COLUMN IF NOT EXISTS "equippedEffect" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Mentee'
      AND column_name = 'name'
  ) THEN
    EXECUTE 'UPDATE "Mentee" SET "nickname" = "name" WHERE "nickname" IS NULL';
  END IF;
END $$;

ALTER TABLE "Hint" ADD COLUMN IF NOT EXISTS "level" INTEGER;

WITH ranked_hints AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (PARTITION BY "mentorId" ORDER BY "createdAt", "id") AS generated_level
  FROM "Hint"
  WHERE "level" IS NULL
)
UPDATE "Hint"
SET "level" = ranked_hints.generated_level
FROM ranked_hints
WHERE "Hint"."id" = ranked_hints."id";

ALTER TABLE "Hint" ALTER COLUMN "level" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Hint_mentorId_level_key" ON "Hint"("mentorId", "level");

CREATE TABLE IF NOT EXISTS "ShopItem" (
  "id" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "icon" TEXT NOT NULL,
  "disabled" BOOLEAN NOT NULL DEFAULT false,
  "effectKey" TEXT,
  "hintLevel" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "price" INTEGER;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "icon" TEXT;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "disabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "effectKey" TEXT;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "hintLevel" INTEGER;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "ShopItem" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "ShopItem"
SET
  "category" = COALESCE("category", 'general'),
  "name" = COALESCE("name", 'Untitled'),
  "description" = COALESCE("description", ''),
  "price" = COALESCE("price", 0),
  "icon" = COALESCE("icon", ''),
  "updatedAt" = COALESCE("updatedAt", CURRENT_TIMESTAMP);

ALTER TABLE "ShopItem" ALTER COLUMN "category" SET NOT NULL;
ALTER TABLE "ShopItem" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "ShopItem" ALTER COLUMN "description" SET NOT NULL;
ALTER TABLE "ShopItem" ALTER COLUMN "price" SET NOT NULL;
ALTER TABLE "ShopItem" ALTER COLUMN "icon" SET NOT NULL;
ALTER TABLE "ShopItem" ALTER COLUMN "updatedAt" SET NOT NULL;

CREATE TABLE IF NOT EXISTS "MinigameRecord" (
  "id" TEXT NOT NULL,
  "gameName" TEXT NOT NULL,
  "timeTaken" INTEGER NOT NULL,
  "score" DOUBLE PRECISION,
  "correctAnswers" INTEGER,
  "totalAnswers" INTEGER,
  "menteeId" TEXT,
  "mentorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MinigameRecord_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "gameName" TEXT;
ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "timeTaken" INTEGER;
ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "score" DOUBLE PRECISION;
ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "correctAnswers" INTEGER;
ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "totalAnswers" INTEGER;
ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "menteeId" TEXT;
ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "mentorId" TEXT;
ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "MinigameRecord" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "MinigameRecord"
SET
  "gameName" = COALESCE("gameName", 'unknown'),
  "timeTaken" = COALESCE("timeTaken", 0),
  "updatedAt" = COALESCE("updatedAt", CURRENT_TIMESTAMP);

ALTER TABLE "MinigameRecord" ALTER COLUMN "gameName" SET NOT NULL;
ALTER TABLE "MinigameRecord" ALTER COLUMN "timeTaken" SET NOT NULL;
ALTER TABLE "MinigameRecord" ALTER COLUMN "updatedAt" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "MinigameRecord_gameName_menteeId_key" ON "MinigameRecord"("gameName", "menteeId");
CREATE UNIQUE INDEX IF NOT EXISTS "MinigameRecord_gameName_mentorId_key" ON "MinigameRecord"("gameName", "mentorId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'MinigameRecord_menteeId_fkey'
  ) THEN
    ALTER TABLE "MinigameRecord"
      ADD CONSTRAINT "MinigameRecord_menteeId_fkey"
      FOREIGN KEY ("menteeId") REFERENCES "Mentee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'MinigameRecord_mentorId_fkey'
  ) THEN
    ALTER TABLE "MinigameRecord"
      ADD CONSTRAINT "MinigameRecord_mentorId_fkey"
      FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
