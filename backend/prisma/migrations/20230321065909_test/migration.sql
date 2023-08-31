/*
  Warnings:

  - A unique constraint covering the columns `[product_id,category_id]` on the table `product_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_categories_product_id_category_id_key" ON "product_categories"("product_id", "category_id");
