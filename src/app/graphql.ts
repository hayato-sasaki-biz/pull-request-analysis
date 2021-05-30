import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import fetch from "./fetcher";

const ACCESS_TOKEN =
  PropertiesService.getScriptProperties().getProperty("accessToken");

export function githubClient(
  fetcher = fetch,
  accessToken: string = ACCESS_TOKEN
): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      headers: {
        authorization: `bearer ${accessToken}`,
      },
      fetch: fetcher,
    }),
    cache: new InMemoryCache(),
  });
}
