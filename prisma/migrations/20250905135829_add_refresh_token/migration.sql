-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';
