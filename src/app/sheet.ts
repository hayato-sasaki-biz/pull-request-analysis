import dayjs from "dayjs";
import { resolveAnalysisTypes, ThreadAnalysisType } from "./analysis";
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
): GoogleAppsScript.Spreadsheet.Range {
  const values = convertPullRequstsTo2dArray(pullRequests);
  const numberOfRows = values.length;
  const numberOfColumns = values[0].length;
  return sheet
    .getRange(sheet.getLastRow() + 2, 1, numberOfRows, numberOfColumns)
    .setValues(values);
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
): GoogleAppsScript.Spreadsheet.Range {
  const values = convertThreadAnalysesTo2dArray(threadAnalyses);
  const numberOfRows = values.length;
  const numberOfColumns = values[0].length;
  return sheet
    .getRange(sheet.getLastRow() + 2, 1, numberOfRows, numberOfColumns)
    .setValues(values);
}

export function writeResolveTypeCount(
  threadAnalysisRange: GoogleAppsScript.Spreadsheet.Range,
  pullRequestNumbers: number[],
  sheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  const columnNames: string[] = [...resolveAnalysisTypes];
  const firstRow = sheet.getLastRow() + 2;
  const firstColumn = 1;
  sheet
    .getRange(firstRow, firstColumn + 1, 1, columnNames.length)
    .setValues([columnNames]);
  sheet
    .getRange(firstRow + 1, firstColumn, pullRequestNumbers.length, 1)
    .setValues(pullRequestNumbers.map((num) => [`#${num}`]));
  const prNumbersR1C1 = `R${
    threadAnalysisRange.getRow() + 2
  }C1:R${threadAnalysisRange.getLastRow()}C1`;
  // resolveAnalysisTypeが最終列にあると仮定
  // TODO TextFinderで列を特定する
  const resolveAnalysisTypeR1C1 = `R${
    threadAnalysisRange.getRow() + 2
  }C${threadAnalysisRange.getLastColumn()}:R${threadAnalysisRange.getLastRow()}C${threadAnalysisRange.getLastColumn()}`;
  sheet
    .getRange(
      firstRow + 1,
      firstColumn + 1,
      pullRequestNumbers.length,
      columnNames.length
    )
    .setFormulaR1C1(
      `=COUNTIFS(${prNumbersR1C1}, RC1, ${resolveAnalysisTypeR1C1}, R${firstRow}C)`
    );
}

function doesSheetExist(sheetName: string) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  return !!sheet;
}

export function getNewSheet(sheetName: string) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet: GoogleAppsScript.Spreadsheet.Sheet;
  if (doesSheetExist(sheetName)) {
    sheet = ss.getSheetByName(sheetName);
    sheet.clear();
  } else {
    sheet = ss.insertSheet(sheetName);
  }
  sheet
    .getRange(1, 1)
    .setValue("this sheet is generated at " + dayjs().format("YYYY/MM/DD"));
  return sheet;
}
