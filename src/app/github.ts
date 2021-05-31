import dayjs, { Dayjs } from "dayjs";
import {
  PullRequestsBySearchQuery,
  PullRequestsBySearch,
  ReviewThreadsByIdsQuery,
  ReviewThreadsByIds,
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

export type ThreadInfo = {
  prNumber: number;
  url: string;
  threadTitle: string;
  author: string;
  commentCount: number;
  isResolved: boolean;
  fileType: string;
  createdAt: Dayjs;
  lastCommentAt: Dayjs;
};

export function getReviewThreads(
  pullRequestIds: string[]
): Promise<ThreadInfo[]> {
  return githubClient()
    .query<ReviewThreadsByIdsQuery>({
      query: ReviewThreadsByIds,
      variables: {
        ids: pullRequestIds,
      },
    })
    .then((result) => {
      const pullRequests = result.data.nodes
        .map((node) => {
          if (node.__typename === "PullRequest") {
            return node;
          } else {
            return null;
          }
        })
        .filter((node) => node !== null);
      return pullRequests
        .map((pr) => {
          const prNumber = pr.number;
          const threadInfos: ThreadInfo[] = pr.reviewThreads.nodes.map(
            (thread) => {
              const firstComment = thread.comments.nodes[0];
              const lastComment = thread.comments.nodes.slice(-1)[0];
              return {
                prNumber,
                url: firstComment.url,
                threadTitle: firstComment.body,
                author: firstComment.author?.login ?? "not logged in user",
                commentCount: thread.comments.totalCount,
                isResolved: thread.isResolved,
                fileType: thread.path.split(".").pop(),
                createdAt: dayjs(firstComment.createdAt),
                lastCommentAt: dayjs(lastComment.createdAt),
              };
            }
          );
          return threadInfos;
        })
        .reduce((prev, current) => [...prev, ...current]);
    });
}
