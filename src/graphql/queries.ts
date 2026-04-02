// src/graphql/queries.ts
import { gql } from 'graphql-request';

export const VIEWER_QUERY = gql`
  query GetViewer {
    viewer {
      login
      avatarUrl
      name
    }
  }
`;

export const GET_STARRED_REPOSITORIES = gql`
  query GetStarredRepositories($cursor: String) {
    viewer {
      starredRepositories(first: 100, after: $cursor, orderBy: {field: STARRED_AT, direction: DESC}) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          name
          url
          pushedAt
          updatedAt
          stargazerCount
          description
          owner {
            login
          }
        }
      }
    }
  }
`;
