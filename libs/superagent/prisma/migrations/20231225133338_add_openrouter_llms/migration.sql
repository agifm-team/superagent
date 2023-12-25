-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LLMModel" ADD VALUE 'MISTRAL_7B_INSTRUCT';
ALTER TYPE "LLMModel" ADD VALUE 'ZEPHYR_7B_BETA';
ALTER TYPE "LLMModel" ADD VALUE 'OPENCHAT_7B';
ALTER TYPE "LLMModel" ADD VALUE 'MYTHOMIST_7B';
