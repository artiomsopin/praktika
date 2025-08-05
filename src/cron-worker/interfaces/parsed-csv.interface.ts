export interface ParsedCSV {
  timestamp: Date;
  'Uzd_Temp_value (°C)': number;
  'Sildymas_value (%)': number;
  Rekuperatorius_value: number;
  Temp_Rezimas_value: string;
  'Istraukiama_Temp_value (°C)': number;
  'Tiekiama_Temp_value (°C)': number;
  'Ismetama_Temp_value (°C)': number;
  'Griztamo_V_temp_value (°C)': number;
  'Lauko_Temp_value (°C)': number;
  'Saldymas_value (%)': number;
  'Istraukiamas_Srautas_value (m³/hr)': number;
  'Tiekimo_Vent_value (%)': number;
  'Tiekimas_Srautas_value (m³/hr)': number;
  'Istraukimo_Vent_value (%)': number;
}
