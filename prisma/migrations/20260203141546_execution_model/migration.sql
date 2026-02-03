-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- CreateTable
CREATE TABLE "Execution" (
    "inngestEventId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "workflowId" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL,
    "error" TEXT,
    "errorStack" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Execution_inngestEventId_key" ON "Execution"("inngestEventId");

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
