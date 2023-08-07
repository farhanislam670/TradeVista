/*
  Warnings:

  - You are about to drop the `_product_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_product_categories" DROP CONSTRAINT "_product_categories_A_fkey";

-- DropForeignKey
ALTER TABLE "_product_categories" DROP CONSTRAINT "_product_categories_B_fkey";

-- DropTable
DROP TABLE "_product_categories";
