import dayjs, { Dayjs } from "dayjs";
import {
  PullRequestsBySearchQuery,
  PullRequestsBySearch,
} from "../graphql/generated/graphql";
import { githubClient } from "./graphql";

export type PullRequest = {
  nodeId: string;
  number: number;
  title: string;
  state: string;
  mergetAt: Dayjs | null;
  createdAt: Dayjs;
  url: string;
  reviewThreadCount: number;
};

export function searchPullRequests(query: String): Promise<PullRequest[]> {
  return githubClient()
    .query<PullRequestsBySearchQuery>({
      query: PullRequestsBySearch,
      variables: {
        query,
      },
    })
    .then((result) => {
      const pullRequests: PullRequest[] = result.data.search.nodes
        .map((node) => {
          if (node.__typename === "PullRequest") {
            return {
              nodeId: node.id,
              number: node.number,
              title: node.title,
              state: node.state,
              createdAt: dayjs(node.createdAt),
              mergetAt: node.mergedAt != null ? dayjs(node.mergedAt) : null,
              url: node.permalink,
              reviewThreadCount: node.reviewThreads.totalCount,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null);
      return pullRequests;
    });
}

export function generateSearchQuery(createdAfter: Dayjs): string {
  const repositoryOwner =
    PropertiesService.getScriptProperties().getProperty("repositoryOwner");
  const repositoryName =
    PropertiesService.getScriptProperties().getProperty("repositoryName");
  const label = PropertiesService.getScriptProperties().getProperty("prLabel");

  return `repo:${repositoryOwner}/${repositoryName} is:pr created:>${createdAfter.toISOString()}`;
}
