/*
  Warnings:

  - You are about to drop the `Junior` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Senior` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Junior" DROP CONSTRAINT "Junior_seniorId_fkey";

-- DropTable
DROP TABLE "Junior";

-- DropTable
DROP TABLE "Senior";

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "hints" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentee" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_studentId_key" ON "Mentor"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Mentee_studentId_key" ON "Mentee"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Mentee_mentorId_key" ON "Mentee"("mentorId");

-- AddForeignKey
ALTER TABLE "Mentee" ADD CONSTRAINT "Mentee_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
