import dayjs from "dayjs";
import { PullRequest } from "../github";
import { convertPullRequstsTo2dArray } from "../sheet";

describe("write pull requests info to spreadsheet", () => {
  it("convert pullRequest array to string 2d array", () => {
    const pullRequests: PullRequest[] = [
      {
        number: 1,
        title: "not merged pull request",
        state: "open",
        url: "https://example.com/1",
        reviewThreadCount: 3,
        createdAt: dayjs("2021-05-30 21:18:01"),
        mergetAt: null,
      },
      {
        number: 2,
        title: "merged pull request",
        state: "merged",
        url: "https://example.com/2",
        reviewThreadCount: 30,
        createdAt: dayjs("2021-05-30 21:18:01"),
        mergetAt: dayjs("2021-05-31 22:18:53"),
      },
    ];
    const strArray = convertPullRequstsTo2dArray(pullRequests);
    expect(strArray).toEqual([
      [
        "number",
        "title",
        "url",
        "state",
        "reviewThreadCount",
        "createdAt",
        "mergetAt",
      ],
      [
        "#1",
        "not merged pull request",
        "https://example.com/1",
        "open",
        "3",
        "2021/05/30 21:18",
        "-",
      ],
      [
        "#2",
        "merged pull request",
        "https://example.com/2",
        "merged",
        "30",
        "2021/05/30 21:18",
        "2021/05/31 22:18",
      ],
    ]);
  });
});
