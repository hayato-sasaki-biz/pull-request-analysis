import dayjs from "dayjs";
import fetch from "node-fetch";
import * as Fetcher from "../fetcher";
import { generateSearchQuery, searchPullRequests } from "../github";

describe("GitHub fetch test", () => {
  jest.spyOn(Fetcher, "default").mockImplementation(fetch);

  it("fetch by search query", async () => {
    const createdAfter = dayjs("2021-05-28");
    const searchQuery = generateSearchQuery(createdAfter);
    const result = await searchPullRequests(searchQuery);
    console.log(result);
    expect(result.length).toBeGreaterThan(0);
  });
});
