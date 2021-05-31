import dayjs from "dayjs";
import { getPreviousWeekday } from "./app/holiday";
import { searchPullRequests, generateSearchQuery } from "./app/github";
import { writePullRequestsToSheet } from "./app/sheet";

global.writeRecentPullRequestsToSheet = () => {
  const createdAfter = getPreviousWeekday(dayjs(), 4); // 直近の木曜日(4)から現在までに作られたPRの情報を取得
  const searchQuery = generateSearchQuery(createdAfter);
  searchPullRequests(searchQuery)
    .then((pullRequests) => {
      const sheetName = `PR Info ${createdAfter.format("YY/MM/DD")}`;
      writePullRequestsToSheet(pullRequests, sheetName);
    })
    .catch((error) => {
      Logger.log(error);
    });
};
