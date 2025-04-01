import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request, gql } from "graphql-request";

const endpoint = "https://spacex-production.up.railway.app/";

// Types
export interface Launch {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  rocket: {
    rocket_name: string;
  };
  launch_success: boolean;
}

export interface LaunchesData {
  launches: Launch[];
  launchesCount: Launch[];
}

export interface LaunchesVars {
  offset?: number;
  limit?: number;
  missionName?: string;
}

// GraphQL Documents
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

const UPDATE_LAUNCH_SUCCESS = gql`
  mutation UpdateLaunchSuccess($id: ID!, $success: Boolean!) {
    updateLaunch(id: $id, success: $success) {
      id
      launch_success
    }
  }
`;

export function useSpaceXLaunches(variables: LaunchesVars) {
  return useQuery<LaunchesData>({
    queryKey: ["launches", variables],
    queryFn: async () => request(endpoint, GET_LAUNCHES, variables),
  });
}

export function useUpdateLaunchSuccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, success }: { id: string; success: boolean }) => {
      return request(endpoint, UPDATE_LAUNCH_SUCCESS, { id, success });
    },
    // Optimistic update
    onMutate: async ({ id, success }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["launches"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<LaunchesData>(["launches"]);

      if (previousData) {
        // Optimistically update to the new value
        queryClient.setQueryData<LaunchesData>(["launches"], {
          ...previousData,
          launches: previousData.launches.map((launch) =>
            launch.id === id ? { ...launch, launch_success: success } : launch
          ),
        });
      }

      return { previousData };
    },
    // If mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<LaunchesData>(
          ["launches"],
          context.previousData
        );
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["launches"] });
    },
  });
}
