import { Dayjs } from "dayjs";
import { ThreadInfo } from "./github";
import { countDiffOfBusinessDay } from "./holiday";

const resolveAnalysisTypes = [
  "within30min",
  "within1hour",
  "within3hours",
  "within6hours",
  "within1day",
  "over1day",
  "onlyAuthorComment",
  "notResolved",
] as const;
type ResolveAnalysisType = typeof resolveAnalysisTypes[number];

export type ThreadAnalysisType = {
  daysToBeResolved: number | null;
  minutesToBeResolved: number | null;
  resolveAnalysisType: ResolveAnalysisType;
} & ThreadInfo;

export const analyzeThreads = (
  threadInfos: ThreadInfo[],
  holidays: Dayjs[]
): ThreadAnalysisType[] => {
  return threadInfos.map((threadInfo) => analyzeThread(threadInfo, holidays));
};

const analyzeThread = (
  threadInfo: ThreadInfo,
  holidays: Dayjs[]
): ThreadAnalysisType => {
  const daysToBeResolved = countDiffOfBusinessDay(
    threadInfo.createdAt,
    threadInfo.lastCommentAt,
    holidays
  );
  const minutesToBeResolved = threadInfo.lastCommentAt.diff(
    threadInfo.createdAt,
    "minutes"
  );
  return {
    ...threadInfo,
    daysToBeResolved,
    minutesToBeResolved,
    resolveAnalysisType: analyzeDiff(
      daysToBeResolved,
      minutesToBeResolved,
      threadInfo.isResolved,
      threadInfo.commentCount
    ),
  };
};

export const analyzeDiff = (
  daysToBeResolved: number | null,
  minutesToBeResolved: number | null,
  isResolved: boolean,
  commentCount: number
): ResolveAnalysisType => {
  if (!isResolved || daysToBeResolved === null || minutesToBeResolved === null)
    return "notResolved";
  if (commentCount === 1) return "onlyAuthorComment";
  if (daysToBeResolved >= 1) return "over1day";
  if (minutesToBeResolved <= 30) return "within30min";
  if (minutesToBeResolved <= 60) return "within1hour";
  if (minutesToBeResolved <= 60 * 3) return "within3hours";
  if (minutesToBeResolved <= 60 * 6) return "within6hours";
  return "within1day";
};
