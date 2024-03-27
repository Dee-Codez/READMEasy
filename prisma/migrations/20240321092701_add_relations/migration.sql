/*
  Warnings:

  - You are about to drop the `readmes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdAt` on the `repo` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `repo` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `repo` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `repo` table. All the data in the column will be lost.
  - Added the required column `readmeText` to the `repo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoName` to the `repo` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
DROP TABLE "readmes";
DROP TABLE "repo";

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- RedefineTables
CREATE TABLE "_prisma_new_repo" (
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "repoName" STRING NOT NULL,
    "readmeText" STRING NOT NULL,

    CONSTRAINT "repo_pkey" PRIMARY KEY ("userId")
);

ALTER TABLE "_prisma_new_repo" RENAME TO "repo";
ALTER TABLE "repo" ADD CONSTRAINT "repo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
