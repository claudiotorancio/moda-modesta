//filters.js

export function setFilters(
  filters,
  period,
  category,
  startDate = null,
  endDate = null
) {
  if (period !== null) filters.period = period;
  if (category !== null) filters.category = category;
  if (startDate !== null) filters.startDate = startDate;
  if (endDate !== null) filters.endDate = endDate;

  console.log("Filtros actualizados:", filters);
}
