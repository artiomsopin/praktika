/*
  Warnings:

  - Added the required column `file_type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "file_type" TEXT NOT NULL;
