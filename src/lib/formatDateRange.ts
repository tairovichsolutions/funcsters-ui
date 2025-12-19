export const formatDateRange = (start?: string | null, end?: string | null) => {
  if (!start || !end) return "00";

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid date";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const startStr = new Intl.DateTimeFormat("en-US", options).format(startDate);
  const endStr = new Intl.DateTimeFormat("en-US", options).format(endDate);

  return `${startStr} - ${endStr}`;
};
