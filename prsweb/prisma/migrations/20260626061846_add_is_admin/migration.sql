-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Update existing admin
UPDATE "Mentor" SET "isAdmin" = true WHERE "studentId" = '68090500429';
