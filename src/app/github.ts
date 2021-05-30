import dayjs, { Dayjs } from "dayjs";
import {
  RecentPullRequestsQuery,
  RecentPullRequests,
  RecentPullRequestsQueryVariables,
} from "../graphql/generated/graphql";
import { githubClient } from "./graphql";

type PullRequest = {
  number: number;
  title: string;
  state: string;
  mergetAt: Dayjs | null;
  createdAt: Dayjs;
  url: string;
  reviewThreadCount: number;
};

export function getRecentPullRequests(): Promise<PullRequest[]> {
  const variables: RecentPullRequestsQueryVariables = {
    repositoryOwner:
      PropertiesService.getScriptProperties().getProperty("repositoryOwner"),
    repositoryName:
      PropertiesService.getScriptProperties().getProperty("repositoryName"),
    label: PropertiesService.getScriptProperties().getProperty("prLabel"),
  };
  return githubClient()
    .query<RecentPullRequestsQuery>({
      query: RecentPullRequests,
      variables,
    })
    .then((result) => {
      if (!result.data.repository) {
        throw new Error("Not found repository");
      }
      return result.data.repository;
    })
    .then((repository): PullRequest[] => {
      return repository.pullRequests.nodes.map((pr) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        createdAt: dayjs(pr.createdAt),
        mergetAt: pr.mergedAt != null ? dayjs(pr.mergedAt) : null,
        url: pr.permalink,
        reviewThreadCount: pr.reviewThreads.totalCount,
      }));
    });
}
