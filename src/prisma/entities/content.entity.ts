export interface ContentEntity {
  timestamp: Date;
  uzd_temp_value_celsius: number | null;
  sildymas_value_perc: number | null;
  rekuperatorius_value_perc: number | null;
  temp_rezimas_value: number | null;
  istraukiama_temp_value_celsius: number | null;
  tiekiama_temp_value_celsius: number | null;
  ismetama_temp_value_celsius: number | null;
  griztamo_v_temp_value_celsius: number | null;
  lauko_temp_value_celsius: number | null;
  saldymas_value_perc: number | null;
  istraukiamas_srautas_value_m3_hr: number | null;
  tiekimo_vent_value_perc: number | null;
  tiekimas_srautas_value_m3_hr: number | null;
  istraukimo_vent_value_perc: number | null;
}
