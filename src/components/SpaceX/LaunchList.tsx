import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Add mutation definition
const UPDATE_LAUNCH_SUCCESS = gql`
  mutation UpdateLaunchSuccess($id: ID!, $success: Boolean!) {
    updateLaunch(id: $id, success: $success) {
      id
      launch_success
    }
  }
`;

// Add fragment for reusable launch fields
const LAUNCH_FRAGMENT = gql`
  fragment LaunchFields on Launch {
    id
    mission_name
    launch_date_utc
    rocket {
      rocket_name
    }
    launch_success
  }
`;

// Update query to use fragment
const GET_LAUNCHES = gql`
  ${LAUNCH_FRAGMENT}
  query GetLaunches($offset: Int, $limit: Int, $missionName: String) {
    launches(
      offset: $offset
      limit: $limit
      find: { mission_name: $missionName }
    ) {
      ...LaunchFields
    }
    launchesCount: launches {
      id
    }
  }
`;

// TypeScript interfaces
interface Launch {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  rocket: {
    rocket_name: string;
  };
  launch_success: boolean;
}

interface LaunchesData {
  launches: Launch[];
  launchesCount: Launch[];
}

interface LaunchesVars {
  offset?: number;
  limit?: number;
  missionName?: string;
}

const ITEMS_PER_PAGE = 10;

export function LaunchList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [successFilter, setSuccessFilter] = useState<string>("all");

  // Add mutation hook
  const [updateLaunchSuccess, { loading: mutationLoading }] = useMutation(
    UPDATE_LAUNCH_SUCCESS,
    {
      // Update cache after mutation
      update(cache, { data: { updateLaunch } }) {
        // Read existing launches from cache
        const { launches } = cache.readQuery({
          query: GET_LAUNCHES,
          variables: {
            offset: page * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
          },
        }) || { launches: [] };

        // Update cache with new data
        cache.writeQuery({
          query: GET_LAUNCHES,
          variables: {
            offset: page * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
          },
          data: {
            launches: launches.map((launch: Launch) =>
              launch.id === updateLaunch.id
                ? { ...launch, launch_success: updateLaunch.launch_success }
                : launch
            ),
          },
        });
      },
      // Handle errors
      onError: (error) => {
        console.error("Failed to update launch:", error);
      },
    }
  );

  // Enhanced query with better error handling and retry policy
  const { loading, error, data, refetch, fetchMore } = useQuery<
    LaunchesData,
    LaunchesVars
  >(GET_LAUNCHES, {
    variables: {
      offset: page * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
      missionName: searchTerm || undefined,
    },
    pollInterval: 30000,
    fetchPolicy: "cache-and-network",
    // Add retry policy
    onError: (error) => {
      console.error("Failed to fetch launches:", error);
    },
    onCompleted: (data) => {
      console.log("Launches fetched successfully:", data);
    },
    // Add error retry policy
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  const totalPages = data
    ? Math.ceil(data.launchesCount.length / ITEMS_PER_PAGE)
    : 0;

  const handleViewDetails = (id: string) => {
    navigate(`/spacex/launch/${id}`);
  };

  // Filter launches based on success status client-side
  const filteredLaunches =
    data?.launches.filter((launch) => {
      if (successFilter === "all") return true;
      return successFilter === "true"
        ? launch.launch_success
        : !launch.launch_success;
    }) || [];

  // Function to toggle launch success status
  const handleToggleSuccess = async (id: string, currentSuccess: boolean) => {
    try {
      await updateLaunchSuccess({
        variables: { id, success: !currentSuccess },
        // Optimistic update
        optimisticResponse: {
          updateLaunch: {
            __typename: "Launch",
            id,
            launch_success: !currentSuccess,
          },
        },
      });
    } catch (error) {
      console.error("Failed to toggle launch success:", error);
    }
  };

  // Add refresh button with loading state
  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh:", error);
    }
  };

  // Enhanced load more function with merge function
  const handleLoadMore = async () => {
    try {
      await fetchMore({
        variables: {
          offset: (page + 1) * ITEMS_PER_PAGE,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            launches: [...prev.launches, ...fetchMoreResult.launches],
          };
        },
      });
    } catch (error) {
      console.error("Failed to load more:", error);
    }
  };

  if (error) return <div>Error loading launches: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            SpaceX Launches
          </h1>
          <Button onClick={handleRefresh} disabled={loading} variant="outline">
            {loading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by mission name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={successFilter} onValueChange={setSuccessFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Launches</SelectItem>
              <SelectItem value="true">Successful</SelectItem>
              <SelectItem value="false">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="text-foreground">Loading launches...</div>}

      {/* Launch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLaunches.map((launch) => (
          <Card key={launch.id} className="p-4">
            <h2 className="text-xl font-semibold text-foreground">
              {launch.mission_name}
            </h2>
            <p className="text-muted-foreground">
              {new Date(launch.launch_date_utc).toLocaleDateString()}
            </p>
            <p className="text-muted-foreground">
              Rocket: {launch.rocket.rocket_name}
            </p>
            <div className="flex justify-between items-center mt-4">
              <p
                className={
                  launch.launch_success ? "text-green-600" : "text-red-600"
                }
              >
                Status: {launch.launch_success ? "Successful" : "Failed"}
              </p>
              <Button
                onClick={() =>
                  handleToggleSuccess(launch.id, launch.launch_success)
                }
                variant="outline"
                size="sm"
                disabled={mutationLoading}
              >
                Toggle Status
              </Button>
            </div>
            <Button
              onClick={() => handleViewDetails(launch.id)}
              className="mt-4 w-full"
              variant="outline"
            >
              View Details
            </Button>
          </Card>
        ))}
      </div>

      {/* Load More button */}
      {data?.launches.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleLoadMore} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            variant="outline"
          >
            Previous
          </Button>
          <span className="py-2 px-4 text-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
