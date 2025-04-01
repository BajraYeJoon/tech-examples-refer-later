import { useEffect, useRef, useState } from "react";
import { type Swapy as SwapyType, createSwapy } from "swapy";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { createBlendy } from "blendy";

const DASHBOARD_ITEMS = [
  {
    id: 1,
    title: "Active Users",
    value: "1,234",
    trend: "+12.5%",
    size: "large",
    gridClass: "md:col-span-2 md:row-span-2",
    description: "Real-time active users on the platform",
  },
  {
    id: 2,
    title: "Revenue",
    value: "$45,231",
    trend: "+8.2%",
    size: "small",
    gridClass: "md:col-span-1 md:row-span-1",
    description: "Monthly recurring revenue",
  },
  {
    id: 3,
    title: "Projects",
    value: "12",
    trend: "+2",
    size: "small",
    gridClass: "md:col-span-1 md:row-span-1",
    description: "Active projects this month",
  },
  {
    id: 4,
    title: "System Status",
    value: "98.2%",
    size: "wide",
    gridClass: "md:col-span-2 md:row-span-1",
    description: "Overall system uptime",
  },
  {
    id: 5,
    title: "Tasks",
    value: "89",
    trend: "+15",
    size: "tall",
    gridClass: "md:col-span-1 md:row-span-2",
    description: "Completed tasks this week",
  },
  {
    id: 6,
    title: "Analytics",
    value: "3.2K",
    trend: "+22%",
    size: "wide",
    gridClass: "md:col-span-3 md:row-span-2",
    description: "Weekly page views",
  },
];

const Swapy = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const swapyRef = useRef<SwapyType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const blendyRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        animation: "spring",
        swapMode: "hover",
        autoScrollOnDrag: true,
      });

      blendyRef.current = createBlendy({
        animation: "spring",
      });

      return () => {
        swapyRef.current?.destroy();
      };
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    blendyRef.current?.toggle("analytics-modal");
  };

  const hideModal = () => {
    blendyRef.current?.untoggle("analytics-modal", () => {
      setIsModalOpen(false);
    });
  };

  return (
    <div className="relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        <div
          className="grid grid-cols-1 md:grid-cols-4 p-8 gap-4 auto-rows-[minmax(120px,auto)]"
          ref={containerRef}
        >
          {DASHBOARD_ITEMS.map((item) => (
            <Card
              key={item.id}
              data-swapy-slot={`metric-${item.id}`}
              className={`cursor-move hover:shadow-lg p-4 transition-shadow border-4 ${item.gridClass}`}
              {...(item.id === 6
                ? { "data-blendy-from": "analytics-modal" }
                : {})}
              onClick={() => item.id === 6 && showModal()}
            >
              <div data-swapy-item={`metric-${item.id}`} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-gray-100">{item.title}</span>
                    {item.trend && (
                      <span
                        className={`text-sm ${
                          item.trend.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {item.trend}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-gray-100">
                      {item.value}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50" onClick={hideModal}>
          <div
            data-blendy-to="analytics-modal"
            className="fixed inset-10 bg-gray-800 rounded-lg p-8 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Analytics Details
                </h2>
                <button
                  onClick={hideModal}
                  className="text-gray-400 hover:text-white"
                  type="button"
                >
                  Close
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <h3 className="text-xl text-white mb-4">Weekly Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-gray-400">Page Views</p>
                      <p className="text-2xl text-white">3.2K</p>
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[88%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Unique Visitors</p>
                      <p className="text-2xl text-white">1.8K</p>
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[65%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Swapy;
