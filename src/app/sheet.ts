import { ThreadAnalysisType } from "./analysis";
import type { PullRequest } from "./github";

const FORMAT = "YYYY/MM/DD HH:mm";
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
    pr.createdAt.format(FORMAT),
    pr.mergetAt?.format(FORMAT) ?? "-",
  ]);
  return [title, columnNames, ...values];
}

export function writePullRequestsToSheet(
  pullRequests: PullRequest[],
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): void {
  const values = convertPullRequstsTo2dArray(pullRequests);
  const numberOfRows = values.length;
  const numberOfColumns = values[0].length;
  sheet.getRange(1, 1, numberOfRows, numberOfColumns).setValues(values);
}

function convertThreadAnalysesTo2dArray(
  threadAnalyses: ThreadAnalysisType[]
): string[][] {
  const columnNames = [
    "prNumber",
    "threadUrl",
    "threadTitle",
    "author",
    "commentCount",
    "isResolved",
    "fileType",
    "createdAt",
    "lastCommentAt",
    "daysToBeResolved",
    "minutesToBeResolved",
    "resolveAnalysisType",
  ];
  const title = new Array<string>(columnNames.length).fill("");
  title[0] = "Thread Analysis";
  const values: string[][] = threadAnalyses.map((threadAnalysis) => [
    `#${threadAnalysis.prNumber}`,
    threadAnalysis.url,
    threadAnalysis.threadTitle,
    threadAnalysis.author,
    threadAnalysis.commentCount.toString(),
    threadAnalysis.isResolved.toString(),
    threadAnalysis.fileType,
    threadAnalysis.createdAt.format(FORMAT),
    threadAnalysis.lastCommentAt.format(FORMAT),
    threadAnalysis.daysToBeResolved.toString(),
    threadAnalysis.minutesToBeResolved.toString(),
    threadAnalysis.resolveAnalysisType,
  ]);
  return [title, columnNames, ...values];
}

export function writeThreadAnalysesToSheet(
  threadAnalyses: ThreadAnalysisType[],
  sheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  const values = convertThreadAnalysesTo2dArray(threadAnalyses);
  const numberOfRows = values.length;
  const numberOfColumns = values[0].length;
  sheet
    .getRange(sheet.getLastRow() + 2, 1, numberOfRows, numberOfColumns)
    .setValues(values);
}

function doesSheetExist(sheetName: string) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  return !!sheet;
}

export function getNewSheet(sheetName: string) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (doesSheetExist(sheetName)) {
    ss.getSheetByName(sheetName);
  }
  return ss.insertSheet(sheetName);
}
