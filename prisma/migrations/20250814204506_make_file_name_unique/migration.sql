/*
  Warnings:

  - A unique constraint covering the columns `[file_name]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_file_name_key" ON "public"."File"("file_name");
