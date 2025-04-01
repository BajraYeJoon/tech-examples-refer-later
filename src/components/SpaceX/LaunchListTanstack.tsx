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
import {
  useSpaceXLaunches,
  useUpdateLaunchSuccess,
} from "../../hooks/useSpaceX";

const ITEMS_PER_PAGE = 10;

export function LaunchListTanstack() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [successFilter, setSuccessFilter] = useState<string>("all");

  // Use custom hooks
  const { data, isLoading, error } = useSpaceXLaunches({
    offset: page * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    missionName: searchTerm || undefined,
  });

  const { mutate: updateLaunchSuccess, isPending: isMutating } =
    useUpdateLaunchSuccess();

  const totalPages = data
    ? Math.ceil(data.launchesCount.length / ITEMS_PER_PAGE)
    : 0;

  const handleViewDetails = (id: string) => {
    navigate(`/spacex/launch/${id}`);
  };

  const handleToggleSuccess = (id: string, currentSuccess: boolean) => {
    updateLaunchSuccess({ id, success: !currentSuccess });
  };

  // Filter launches based on success status client-side
  const filteredLaunches =
    data?.launches.filter((launch) => {
      if (successFilter === "all") return true;
      return successFilter === "true"
        ? launch.launch_success
        : !launch.launch_success;
    }) || [];

  if (error) return <div>Error loading launches: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            SpaceX Launches (TanStack)
          </h1>
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
      {isLoading && <div className="text-foreground">Loading launches...</div>}

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
                disabled={isMutating}
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
