import dayjs from "dayjs";
import { getHolidays, getPreviousWeekday } from "./app/holiday";
import {
  searchPullRequests,
  generateSearchQuery,
  getReviewThreads,
} from "./app/github";
import {
  writePullRequestsToSheet,
  writeThreadAnalysesToSheet,
} from "./app/sheet";
import { analyzeThreads } from "./app/analysis";

global.writeRecentPullRequestInfoToSheet = async () => {
  try {
    const createdAfter = getPreviousWeekday(dayjs(), 4); // 直近の木曜日(4)から現在までに作られたPRの情報を取得
    const searchQuery = generateSearchQuery(createdAfter);
    const pullRequests = await searchPullRequests(searchQuery);
    const threads = await getReviewThreads(pullRequests.map((pr) => pr.nodeId));
    const holidays = await getHolidays();
    const threadAnalyses = analyzeThreads(threads, holidays);
    const sheetName = `PR Info ${createdAfter.format("YY/MM/DD")}`;
    writePullRequestsToSheet(pullRequests, sheetName);
    writeThreadAnalysesToSheet(threadAnalyses, sheetName);
  } catch (error) {
    Logger.log(error);
  }
};
