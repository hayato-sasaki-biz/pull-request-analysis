import dayjs from "dayjs";
import fetch from "node-fetch";
import * as Fetcher from "../fetcher";
import {
  isOnBusinessDay,
  countDiffOfBusinessDay,
  getHolidays,
  getPreviousWeekday,
} from "../holiday";

describe("isOnBuinessDay", () => {
  it("sunday is not business day", () => {
    const day = dayjs("2021-05-30");
    expect(isOnBusinessDay(day)).toBeFalsy();
  });

  it("saturday is not business day", () => {
    const day = dayjs("2021-05-29");
    expect(isOnBusinessDay(day)).toBeFalsy();
  });

  it("friday is not business day", () => {
    const day = dayjs("2021-05-28");
    expect(isOnBusinessDay(day)).toBeTruthy();
  });

  it("holiday is not business day", () => {
    const day = dayjs("2021-05-28");
    const holidays = [dayjs("2021-05-28")];
    expect(isOnBusinessDay(day, holidays)).toBeFalsy();
  });
});

describe("countBusinessDay", () => {
  it("from and to are the same day", () => {
    const from = dayjs("2021-05-28"); // Friday
    const to = dayjs("2021-05-28");
    expect(countDiffOfBusinessDay(from, to)).toBe(0);
  });

  it("both from and to are the same day and not on business day", () => {
    const from = dayjs("2021-05-29"); // Saturday
    const to = dayjs("2021-05-29");
    expect(countDiffOfBusinessDay(from, to)).toBe(0);
  });

  it("every date between from and to is on business day", () => {
    const from = dayjs("2021-05-24"); // Monday
    const to = dayjs("2021-05-28"); // Friday
    expect(countDiffOfBusinessDay(from, to)).toBe(4);
  });

  it("holidays between from and to", () => {
    const from = dayjs("2021-05-27"); // Thursday
    const to = dayjs("2021-05-31"); // Monday
    expect(countDiffOfBusinessDay(from, to)).toBe(2);
  });
});

describe("getHolidays", () => {
  jest.spyOn(Fetcher, "default").mockImplementation(fetch);
  it("json can be fetched", () => {
    return getHolidays().then((holidays) => {
      console.log(holidays);
      expect(holidays.length).toBeGreaterThan(0);
    });
  });
});

describe("weekday", () => {
  it("last thursday is in the same week when current is friday", () => {
    const current = dayjs("2021/05/28"); // Friday
    const thursday = 4;
    expect(getPreviousWeekday(current, thursday).format("YYYY/MM/DD")).toBe(
      "2021/05/27"
    );
  });

  it("last thursday is previous week when current is sunday", () => {
    const current = dayjs("2021/05/23"); // Sunday
    const thursday = 4;
    expect(getPreviousWeekday(current, thursday).format("YYYY/MM/DD")).toBe(
      "2021/05/20"
    );
  });

  it("last thursday is previous week when current is thursday", () => {
    const current = dayjs("2021/05/27"); // Thursday
    const thursday = 4;
    expect(getPreviousWeekday(current, thursday).format("YYYY/MM/DD")).toBe(
      "2021/05/20"
    );
  });
});
