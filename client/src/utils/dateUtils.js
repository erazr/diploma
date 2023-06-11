import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(calendar);
dayjs.extend(timezone);

const tz = dayjs.tz.guess();

export function getTime(createdAt) {
  return dayjs(createdAt).calendar(null, {
    sameDay: "[Today at] HH:mm",
  });
}

export function getShortenedTime(createdAt) {
  return dayjs(createdAt).format("HH:mm");
}

export function getTimeDifference(date1, date2) {
  return dayjs(date1).diff(dayjs(date2), "minutes");
}

export function checkNewDay(date1, date2) {
  return !dayjs(date1).isSame(dayjs(date2), "day");
}

export function formatDivider(date) {
  return dayjs(date).format("MMMM D, YYYY");
}
