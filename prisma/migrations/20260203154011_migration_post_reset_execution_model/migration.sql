/*
  Warnings:

  - The values [PENDING] on the enum `ExecutionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The required column `id` was added to the `Execution` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExecutionStatus_new" AS ENUM ('RUNNING', 'FAILED', 'SUCCESS');
ALTER TABLE "Execution" ALTER COLUMN "status" TYPE "ExecutionStatus_new" USING ("status"::text::"ExecutionStatus_new");
ALTER TYPE "ExecutionStatus" RENAME TO "ExecutionStatus_old";
ALTER TYPE "ExecutionStatus_new" RENAME TO "ExecutionStatus";
DROP TYPE "public"."ExecutionStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Execution" ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "output" JSONB,
ALTER COLUMN "status" SET DEFAULT 'RUNNING',
ADD CONSTRAINT "Execution_pkey" PRIMARY KEY ("id");
