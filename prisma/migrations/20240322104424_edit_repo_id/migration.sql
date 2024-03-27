/*
  Warnings:

  - You are about to drop the column `repoId` on the `readme` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `readme` table. All the data in the column will be lost.
  - Added the required column `repoID` to the `readme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `readme` table without a default value. This is not possible if the table is not empty.

*/
DROP TABLE "readme";

-- RedefineTables
CREATE TABLE "_prisma_new_readme" (
    "userID" UUID NOT NULL,
    "repoID" INT4 NOT NULL,
    "repoName" STRING NOT NULL,
    "readmeText" STRING NOT NULL,

    CONSTRAINT "readme_pkey" PRIMARY KEY ("repoID")
);
ALTER TABLE "_prisma_new_readme" RENAME TO "readme";
ALTER TABLE "readme" ADD CONSTRAINT "readme_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
