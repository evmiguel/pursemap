-- CreateTable
CREATE TABLE "Purchase" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "cost" FLOAT8 NOT NULL,
    "category" STRING,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);
