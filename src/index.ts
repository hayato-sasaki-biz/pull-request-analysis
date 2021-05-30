import { getRecentPullRequests } from "./app/github";

global.getRecentPullRequests = () => {
  getRecentPullRequests()
    .then((pullRequests) => {
      pullRequests.forEach((pr) => {
        Logger.log(pr);
      });
    })
    .catch((error) => {
      Logger.log(error);
    });
};
