/*
  Warnings:

  - You are about to drop the `QuizAttempt` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_userId_fkey";

-- DropTable
DROP TABLE "QuizAttempt";

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
