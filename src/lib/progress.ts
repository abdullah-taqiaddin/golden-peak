export function toDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toISODateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatProgressRows(
  rows: Array<{ entryDate: Date | string; revenue: { toString(): string } | number }>
) {
  return rows.map((row) => ({
    entryDate:
      row.entryDate instanceof Date
        ? toISODateOnly(row.entryDate)
        : String(row.entryDate).slice(0, 10),
    revenue: Number(row.revenue)
  }));
}
