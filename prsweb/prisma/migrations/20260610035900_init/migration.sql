/*
  Warnings:

  - You are about to drop the `SystemConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SystemConfig";

-- CreateTable
CREATE TABLE "AdmissionYear" (
    "id" TEXT NOT NULL,
    "mentorYear" TEXT NOT NULL,
    "menteeYear" TEXT NOT NULL,

    CONSTRAINT "AdmissionYear_pkey" PRIMARY KEY ("id")
);
