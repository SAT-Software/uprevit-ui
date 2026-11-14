import { format } from "date-fns";

export const toLocalDayInterval = (date: string) => {
  const start = new Date(`${date}T00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return `${start.toISOString()}/${end.toISOString()}`;
};

export const fromLocalDayInterval = (value: string) => {
  const [start, end] = value.split("/").map((part) => new Date(part).getTime());
  return value.includes("/") && !Number.isNaN(start) && !Number.isNaN(end)
    ? format(new Date((start + end) / 2), "yyyy-MM-dd")
    : value;
};
