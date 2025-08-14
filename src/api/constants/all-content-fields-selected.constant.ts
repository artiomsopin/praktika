import { ContentSelector } from 'src/prisma/interfaces/content-selector.interface';

export const AllContentFieldsSelected: ContentSelector = {
  timestamp: true,
  uzd_temp_value_celsius: true,
  sildymas_value_perc: true,
  rekuperatorius_value_perc: true,
  temp_rezimas_value: true,
  istraukiama_temp_value_celsius: true,
  tiekiama_temp_value_celsius: true,
  ismetama_temp_value_celsius: true,
  griztamo_v_temp_value_celsius: true,
  lauko_temp_value_celsius: true,
  saldymas_value_perc: true,
  istraukiamas_srautas_value_m3_hr: true,
  tiekimo_vent_value_perc: true,
  tiekimas_srautas_value_m3_hr: true,
  istraukimo_vent_value_perc: true,
};
