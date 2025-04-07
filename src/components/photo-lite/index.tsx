import { useRef } from "react";
import { usePhotoEditorStore } from "../../store/usePhotoEditor";
import { useCanvas } from "../../hooks/useCanvas";

const PhotoLite = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTool, tools, mousePosition, setCurrentTool, updateTool } =
    usePhotoEditorStore();

  useCanvas(canvasRef as React.RefObject<HTMLCanvasElement>);

  return (
    <div className="flex flex-col gap-4">
      <div>
        Photo Lite -{" "}
        {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}
      </div>
      <div className="flex items-center justify-between  gap-2">
        <div>
          <button
            type="button"
            className={`p-2 rounded ${
              currentTool === "brush" ? "bg-blue-500" : "bg-gray-600"
            }`}
            onClick={() => setCurrentTool("brush")}
          >
            Brush
          </button>
        </div>
        <div>
          <input
            type="range"
            min={1}
            max={10}
            value={tools.brush.size}
            onChange={(e) =>
              updateTool("brush", "size", Number(e.target.value))
            }
          />
          <span className="capitalize">
            {currentTool} Size: {tools.brush.size}
          </span>

          <input
            type="color"
            value={tools.brush.color}
            onChange={(e) => updateTool("brush", "color", e.target.value)}
          />
        </div>
      </div>
      <div className="h-[100vh] relative  border bg-gray-200 flex items-center justify-center p-4">
        <div className="absolute  top-4 right-4 text-black  p-2 rounded shadow">
          Mouse Position - X: {mousePosition.x} Y: {mousePosition.y}
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          className="bg-white border border-gray-300"
        >
          Canvas not supported
        </canvas>
      </div>
    </div>
  );
};

export default PhotoLite;
