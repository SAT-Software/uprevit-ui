import { format } from "ssf";

export function formatWorkbookDate(
  dateFormat: string,
  serial: number,
  date1904?: boolean,
): string {
  return format(dateFormat, serial, { date1904 });
}
