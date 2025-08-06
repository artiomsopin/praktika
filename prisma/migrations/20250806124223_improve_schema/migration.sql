-- CreateTable
CREATE TABLE "public"."File" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "modified" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Content" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "uzd_temp_value_celsius" DOUBLE PRECISION NOT NULL,
    "sildymas_value_perc" DOUBLE PRECISION NOT NULL,
    "rekuperatorius_value_perc" DOUBLE PRECISION NOT NULL,
    "temp_rezimas_value" DOUBLE PRECISION NOT NULL,
    "istraukiama_temp_value_celsius" DOUBLE PRECISION NOT NULL,
    "tiekiama_temp_value_celsius" DOUBLE PRECISION NOT NULL,
    "ismetama_temp_value_celsius" DOUBLE PRECISION NOT NULL,
    "griztamo_v_temp_value_celsius" DOUBLE PRECISION NOT NULL,
    "lauko_temp_value_celsius" DOUBLE PRECISION NOT NULL,
    "saldymas_value_perc" DOUBLE PRECISION NOT NULL,
    "istraukiamas_srautas_value_m3_hr" DOUBLE PRECISION NOT NULL,
    "tiekimo_vent_value_perc" DOUBLE PRECISION NOT NULL,
    "tiekimas_srautas_value_m3_hr" DOUBLE PRECISION NOT NULL,
    "istraukimo_vent_value_perc" DOUBLE PRECISION NOT NULL,
    "file_id" INTEGER NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_file_id_key" ON "public"."Content"("file_id");

-- AddForeignKey
ALTER TABLE "public"."Content" ADD CONSTRAINT "Content_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
