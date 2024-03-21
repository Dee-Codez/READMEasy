-- CreateTable
CREATE TABLE "readme" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "repoName" STRING NOT NULL,
    "text" STRING NOT NULL,

    CONSTRAINT "readme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "data" JSONB,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
