/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "reference" VARCHAR(10) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_reference_key" ON "Item"("reference");
