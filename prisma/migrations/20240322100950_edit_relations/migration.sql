/*
  Warnings:

  - You are about to drop the `repo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "repo" DROP CONSTRAINT "repo_userId_fkey";

-- DropTable
DROP TABLE "repo";

-- CreateTable
CREATE TABLE "readme" (
    "userId" UUID NOT NULL,
    "repoId" STRING NOT NULL,
    "repoName" STRING NOT NULL,
    "readmeText" STRING NOT NULL,

    CONSTRAINT "readme_pkey" PRIMARY KEY ("repoId")
);

-- AddForeignKey
ALTER TABLE "readme" ADD CONSTRAINT "readme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
