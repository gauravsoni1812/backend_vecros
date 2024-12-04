/*
  Warnings:

  - Added the required column `UserName` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "UserName" TEXT NOT NULL;
