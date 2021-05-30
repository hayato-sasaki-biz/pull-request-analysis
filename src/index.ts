import { getRecentPullRequests } from "./app/github";
import { writePullRequestsToSheet } from "./app/sheet";

global.writeRecentPullRequestsToSheet = () => {
  getRecentPullRequests()
    .then((pullRequests) => {
      writePullRequestsToSheet(pullRequests, "Pull Request Info");
    })
    .catch((error) => {
      Logger.log(error);
    });
};
