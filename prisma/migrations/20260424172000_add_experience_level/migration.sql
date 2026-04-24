-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'BEGINNER';
