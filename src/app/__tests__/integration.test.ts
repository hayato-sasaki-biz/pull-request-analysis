import dayjs from "dayjs";
import fetch from "node-fetch";
import { analyzeThreads } from "../analysis";
import {
  generateSearchQuery,
  getReviewThreads,
  searchPullRequests,
} from "../github";
import { getHolidays } from "../holiday";
import * as Fetcher from "../fetcher";

describe("integration test", () => {
  jest.spyOn(Fetcher, "default").mockImplementation(fetch);
  it("get PullRequests and analyze review comments", async () => {
    const createdAfter = dayjs("2021-05-24");
    const searchQuery = generateSearchQuery(createdAfter);
    const pullRequests = await searchPullRequests(searchQuery);
    const threads = await getReviewThreads(pullRequests.map((pr) => pr.nodeId));
    const holidays = await getHolidays();
    const threadAnalyses = analyzeThreads(threads, holidays);
    console.log(threadAnalyses); // APIコールのモックはせず実際のデータを使うのでassertによる確認はしない
  });
});
