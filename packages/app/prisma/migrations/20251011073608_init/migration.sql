-- CreateTable
CREATE TABLE "asset" (
    "id" UUID NOT NULL,
    "project_id" UUID,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tree" (
    "id" UUID NOT NULL,
    "tree" JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT "project_tree_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asset_project_id_idx" ON "asset"("project_id");

-- AddForeignKey
ALTER TABLE
    "asset"
ADD
    CONSTRAINT "asset_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "project_tree"
ADD
    CONSTRAINT "project_tree_id_fkey" FOREIGN KEY ("id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
