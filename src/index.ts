import dayjs from "dayjs";
import { searchPullRequests, generateSearchQuery } from "./app/github";
import { writePullRequestsToSheet } from "./app/sheet";

global.writeRecentPullRequestsToSheet = () => {
  const now = dayjs();
  const searchQuery = generateSearchQuery(now.subtract(7, "d"));
  searchPullRequests(searchQuery)
    .then((pullRequests) => {
      const sheetName = "Pull Request Info";
      writePullRequestsToSheet(pullRequests, sheetName);
    })
    .catch((error) => {
      Logger.log(error);
    });
};
