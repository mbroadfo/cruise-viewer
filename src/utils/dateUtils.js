// src/utils/dateUtils.js

export function parseShortMonthDate(str) {
  if (!str || typeof str !== 'string') return null;

  const [year, monthAbbr, day] = str.split(" ");
  const month = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].indexOf(monthAbbr);
  if (month === -1 || isNaN(year) || isNaN(day)) return null;

  return new Date(Date.UTC(+year, month, +day));
}

