import dayjs from "dayjs";
import fetch from "node-fetch";
import * as Fetcher from "../fetcher";
import {
  generateSearchQuery,
  getReviewThreads,
  searchPullRequests,
} from "../github";

describe("GitHub fetch test", () => {
  jest.spyOn(Fetcher, "default").mockImplementation(fetch);

  it("fetch by search query", async () => {
    const createdAfter = dayjs("2021-05-28");
    const searchQuery = generateSearchQuery(createdAfter);
    const result = await searchPullRequests(searchQuery);
    console.log(result);
    expect(result.length).toBeGreaterThan(0);
  });

  it("fetch threads", async () => {
    const createdAfter = dayjs("2021-05-20");
    const searchQuery = generateSearchQuery(createdAfter);
    const pullRequests = await searchPullRequests(searchQuery);
    const ids = pullRequests.map((pr) => pr.nodeId);
    const result = await getReviewThreads(ids);
    console.log(result);
    expect(result.length).toBeGreaterThan(0);
  });
});
