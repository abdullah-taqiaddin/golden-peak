import { Prisma } from "@prisma/client";

export function toDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toISODateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatProgressRows(
  rows: Array<{ entryDate: Date; revenue: Prisma.Decimal | number }>
) {
  return rows.map((row) => ({
    entryDate: toISODateOnly(row.entryDate),
    revenue: Number(row.revenue)
  }));
}
