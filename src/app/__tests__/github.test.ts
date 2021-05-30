import fetch from "node-fetch";
import * as Fetcher from "../fetcher";
import { getRecentPullRequests } from "../github";

describe("GitHub fetch test", () => {
  jest.spyOn(Fetcher, "default").mockImplementation(fetch);

  it("fetch recent pull requests", async () => {
    const result = await getRecentPullRequests();
    console.log(result);
    expect(result.length).toBeGreaterThan(0);
  });
});
