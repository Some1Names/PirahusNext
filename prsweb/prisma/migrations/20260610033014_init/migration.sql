-- DropForeignKey
ALTER TABLE "Hint" DROP CONSTRAINT "Hint_mentorId_fkey";

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "mentorYear" TEXT NOT NULL,
    "menteeYear" TEXT NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hint" ADD CONSTRAINT "Hint_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
