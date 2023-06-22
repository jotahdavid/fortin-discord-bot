-- AlterTable
ALTER TABLE "User" ADD COLUMN     "epic_username" TEXT,
ADD COLUMN     "wins_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
