-- CreateTable
CREATE TABLE "Senior" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "hints" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Senior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Junior" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Junior_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Senior_studentId_key" ON "Senior"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Junior_studentId_key" ON "Junior"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Junior_seniorId_key" ON "Junior"("seniorId");

-- AddForeignKey
ALTER TABLE "Junior" ADD CONSTRAINT "Junior_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
