/*
  Warnings:

  - The values [FILL_IN_THE_BLANK] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Lesson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Lesson` table. All the data in the column will be lost.
  - The `id` column on the `Lesson` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `lessonId` on the `LessonProgress` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lessonId` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('MULTIPLE_CHOICE_IMAGE', 'MULTIPLE_CHOICE', 'REARRANGE', 'TRUE_FALSE');
ALTER TABLE "Question" ALTER COLUMN "type" TYPE "QuestionType_new" USING ("type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_lessonId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_pkey",
DROP COLUMN "description",
DROP COLUMN "title",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LessonProgress" DROP COLUMN "lessonId",
ADD COLUMN     "lessonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "lessonId",
ADD COLUMN     "lessonId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
