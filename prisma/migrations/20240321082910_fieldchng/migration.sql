/*
  Warnings:

  - You are about to drop the `readme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "readme";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "repo" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "data" JSONB,

    CONSTRAINT "repo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readmes" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "repoName" STRING NOT NULL,
    "text" STRING NOT NULL,

    CONSTRAINT "readmes_pkey" PRIMARY KEY ("id")
);
