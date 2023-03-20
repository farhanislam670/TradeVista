/*
  Warnings:

  - You are about to drop the column `product_categories` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `_categoryToproduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_categoryToproduct" DROP CONSTRAINT "_categoryToproduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_categoryToproduct" DROP CONSTRAINT "_categoryToproduct_B_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "product_categories";

-- DropTable
DROP TABLE "_categoryToproduct";

-- CreateTable
CREATE TABLE "product_categories" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_product_categories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_product_categories_AB_unique" ON "_product_categories"("A", "B");

-- CreateIndex
CREATE INDEX "_product_categories_B_index" ON "_product_categories"("B");

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_product_categories" ADD CONSTRAINT "_product_categories_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_product_categories" ADD CONSTRAINT "_product_categories_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
