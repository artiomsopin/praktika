export interface ContentQueryParams {
  contentFields?: string; // Comma-separated list of fields to select
  fromTimestamp?: string; // Format: 'dd-MMM-yy h:mm:ss a z' (e.g. 21-Feb-25 12:54:05 AM EET)
  toTimestamp?: string; // Same format as fromTimestamp
}
