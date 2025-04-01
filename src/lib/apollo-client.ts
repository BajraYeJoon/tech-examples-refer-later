import { ApolloClient, InMemoryCache } from "@apollo/client";

// Create an Apollo Client instance
export const client = new ApolloClient({
  // The SpaceX API endpoint
  uri: "https://spacex-production.up.railway.app/",

  // InMemoryCache is used to cache query results
  cache: new InMemoryCache(),
  // Additional options for better developer experience
  defaultOptions: {
    watchQuery: {
      // Fetch new data when component mounts
      fetchPolicy: "cache-and-network",
      // Return data from cache while fetching
      nextFetchPolicy: "cache-first",
    },
  },
});
