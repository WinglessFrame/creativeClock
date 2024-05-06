export function areSameDates(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function parseDateFromParams(params: string[] | undefined) {
  if (!params) return new Date();

  const parsedDate = new Date(Date.parse(params.join("/")));
  if (!isNaN(parsedDate.getTime())) return parsedDate;
}

export function getShortDay(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  });
  return formatter.format(date);
}

export function getDateSlug(date: Date) {
  return `/${new Intl.DateTimeFormat("en-US").format(date)}`;
}

export function getPrevDay(date: Date) {
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);
  return prevDay;
}

export function getNextDay(date: Date) {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay;
}

export const convertMinutesToHours = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${padToTwoDigits(hours)}:${padToTwoDigits(minutes)}`;
};

function padToTwoDigits(num: number) {
  return num.toString().padStart(2, "0");
}

export function getWeekDates(startDate: Date, endDate: Date) {
  let dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function getWeekBoundaries(date: Date) {
  // Calculate start date of the week (Monday)
  let startDate = new Date(date);
  startDate.setDate(date.getDate() - ((date.getDay() + 6) % 7));

  // Set hours, minutes, seconds, and milliseconds to 0
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);

  // Calculate end date of the week (Sunday)
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  // Set hours to 23, minutes to 59, seconds to 59
  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);

  return { startDate, endDate };
}
