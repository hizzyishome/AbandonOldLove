// src/graphql/mutations.ts
import { gql } from 'graphql-request';

export const REMOVE_STAR_MUTATION = gql`
  mutation RemoveStar($starrableId: ID!) {
    removeStar(input: {starrableId: $starrableId}) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;
