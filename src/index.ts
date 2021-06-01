import dayjs from "dayjs";
import { getHolidays, getPreviousWeekday } from "./app/holiday";
import {
  searchPullRequests,
  generateSearchQuery,
  getReviewThreads,
} from "./app/github";
import {
  getNewSheet,
  writePullRequestsToSheet,
  writeResolveTypeCount,
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
    const sheetName = `PR Info from ${createdAfter.format("YY/MM/DD")}`;
    const sheet = getNewSheet(sheetName);
    writePullRequestsToSheet(pullRequests, sheet);
    const threadAnalysesRange = writeThreadAnalysesToSheet(
      threadAnalyses,
      sheet
    );
    writeResolveTypeCount(
      threadAnalysesRange,
      pullRequests.map((pr) => pr.number),
      sheet
    );
  } catch (error) {
    Logger.log(error);
  }
};
