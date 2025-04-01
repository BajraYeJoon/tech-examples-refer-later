import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";

// Updated query to match the SpaceX API schema
const GET_LAUNCH_DETAILS = gql`
  query GetLaunchDetails($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      launch_date_utc
      launch_success
      details
      rocket {
        rocket_name
        rocket {
          name
          company
          cost_per_launch
          success_rate_pct
          description
        }
      }
      links {
        article_link
        video_link
        flickr_images
      }
      launch_site {
        site_name_long
      }
    }
  }
`;

// TypeScript interfaces for our detailed data
interface RocketInfo {
  rocket_name: string;
  rocket: {
    name: string;
    company: string;
    cost_per_launch: number;
    success_rate_pct: number;
    description: string;
  };
}

interface LaunchLinks {
  article_link: string | null;
  video_link: string | null;
  flickr_images: string[];
}

interface LaunchSite {
  site_name_long: string | null;
}

interface LaunchDetails {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  launch_success: boolean;
  details: string | null;
  rocket: RocketInfo;
  links: LaunchLinks;
  launch_site: LaunchSite;
}

interface LaunchDetailData {
  launch: LaunchDetails;
}

export function LaunchDetail() {
  // Get the launch ID from URL parameters
  const { id } = useParams<{ id: string }>();

  // Use useQuery with variables
  const { loading, error, data } = useQuery<LaunchDetailData>(
    GET_LAUNCH_DETAILS,
    {
      variables: { id },
      // Skip the query if no ID is provided
      skip: !id,
    }
  );

  if (loading) return <div>Loading launch details...</div>;
  if (error) return <div>Error loading launch: {error.message}</div>;
  if (!data?.launch) return <div>Launch not found</div>;

  const { launch } = data;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{launch.mission_name}</CardTitle>
              <CardDescription>
                {new Date(launch.launch_date_utc).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant={launch.launch_success ? "default" : "destructive"}>
              {launch.launch_success ? "Successful" : "Failed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mission Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Mission Details</h3>
            <p className="text-gray-600">
              {launch.details || "No details available"}
            </p>
          </div>

          {/* Rocket Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Rocket Information</h3>
            <div className="space-y-2">
              <p className="text-foreground">
                <span className="font-medium">Name:</span>{" "}
                {launch.rocket.rocket.name}
              </p>
              <p className="text-foreground">
                <span className="font-medium">Company:</span>{" "}
                {launch.rocket.rocket.company}
              </p>
              <p className="text-foreground">
                <span className="font-medium">Cost per Launch:</span> $
                {launch.rocket.rocket.cost_per_launch.toLocaleString()}
              </p>
              <p className="text-foreground">
                <span className="font-medium">Success Rate:</span>{" "}
                {launch.rocket.rocket.success_rate_pct}%
              </p>
              <p className="text-foreground">
                <span className="font-medium">Description:</span>{" "}
                {launch.rocket.rocket.description}
              </p>
            </div>
          </div>

          {/* Launch Site */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Launch Site</h3>
            <p>
              {launch.launch_site?.site_name_long ||
                "Launch site information not available"}
            </p>
          </div>

          {/* Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Media</h3>
            <div className="space-y-2">
              {launch.links.article_link && (
                <a
                  href={launch.links.article_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  Read Article
                </a>
              )}
              {launch.links.video_link && (
                <a
                  href={launch.links.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  Watch Video
                </a>
              )}
            </div>
          </div>

          {/* Images */}
          {launch.links.flickr_images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {launch.links.flickr_images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${launch.mission_name} - ${index + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
