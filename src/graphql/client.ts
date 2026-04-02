// src/graphql/client.ts
import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://api.github.com/graphql';

let client: GraphQLClient | null = null;

export const initializeClient = (token: string) => {
  client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return client;
};

export const getClient = () => {
  if (!client) {
    throw new Error('GraphQL client is not initialized. Please call initializeClient with a valid token first.');
  }
  return client;
};
