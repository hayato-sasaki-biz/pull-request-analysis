import type { PullRequest } from "./github";

export function convertPullRequstsTo2dArray(
  pullRequests: PullRequest[]
): string[][] {
  const columnNames = [
    "number",
    "title",
    "url",
    "state",
    "reviewThreadCount",
    "createdAt",
    "mergetAt",
  ];
  const title = new Array<string>(columnNames.length).fill("");
  title[0] = "Pull Requests";
  const values = pullRequests.map((pr) => [
    `#${pr.number}`,
    pr.title,
    pr.url,
    pr.state,
    pr.reviewThreadCount.toString(),
    pr.createdAt.format("YYYY/MM/DD HH:mm"),
    pr.mergetAt?.format("YYYY/MM/DD HH:mm") ?? "-",
  ]);
  return [title, columnNames, ...values];
}

export function writePullRequestsToSheet(
  pullRequests: PullRequest[],
  sheetName: string
): void {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet(sheetName);
  const values = convertPullRequstsTo2dArray(pullRequests);
  const numberOfRows = values.length;
  const numberOfColumns = values[0].length;
  sheet.getRange(1, 1, numberOfRows, numberOfColumns).setValues(values);
}
