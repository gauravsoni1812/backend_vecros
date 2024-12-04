-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "attemptDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuizAttemptToUser" (
    "A" UUID NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_QuizAttemptToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_userId_quizId_key" ON "QuizAttempt"("userId", "quizId");

-- CreateIndex
CREATE INDEX "_QuizAttemptToUser_B_index" ON "_QuizAttemptToUser"("B");

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizAttemptToUser" ADD CONSTRAINT "_QuizAttemptToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizAttemptToUser" ADD CONSTRAINT "_QuizAttemptToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
