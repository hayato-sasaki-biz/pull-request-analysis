import fetch from "./fetcher";
import dayjs, { Dayjs } from "dayjs";
import { YMDString } from "./types/date";

type DateObjectType = {
  [date in YMDString]?: string;
};

export const getHolidays = () => {
  return fetch<DateObjectType>("https://holidays-jp.github.io/api/v1/date.json")
    .then((response) => response.json())
    .then((json) => Object.keys(json).map((key: YMDString) => dayjs(key)))
    .catch((error) => {
      Logger.log(error);
      return Promise.reject(error);
    });
};

export const isOnBusinessDay = (day: Dayjs, holidays: Dayjs[] = []) => {
  if (day.day() == 0 || day.day() == 6) {
    return false;
  }
  const dIsHoliday = holidays
    .map((holiday) => day.isSame(holiday, "day"))
    .some((value) => value);
  const dIsBusinessDay = !dIsHoliday;
  return dIsBusinessDay;
};

export const countDiffOfBusinessDay = (
  from: Dayjs,
  to: Dayjs,
  holidays: Dayjs[] = []
): number => {
  let count = 0;
  let current: Dayjs = dayjs(from);
  while (!to.isSame(current, "day") && count < 100) {
    // countが大きくなりすぎた場合はループを抜ける
    if (isOnBusinessDay(current, holidays)) {
      count += 1;
    }
    current = dayjs(current).add(1, "day");
  }
  return count;
};
