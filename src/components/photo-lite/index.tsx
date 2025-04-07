import { useRef } from "react";
import { usePhotoEditorStore } from "../../store/usePhotoEditor";
import { useCanvas } from "../../hooks/useCanvas";

const PhotoLite = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTool, tools, mousePosition, setCurrentTool, updateTool } =
    usePhotoEditorStore();

  useCanvas(canvasRef as React.RefObject<HTMLCanvasElement>);

  // const getCursorStyles = () => {
  //   switch (currentTool) {
  //     case "brush":
  //       return "cursor-crosshair";
  //     case "eraser":
  //       return "cursor-cell";
  //     case "move":
  //       return "cursor-move";
  //     case "text":
  //       return "cursor-text";
  //     case "select":
  //       return "cursor-pointer";
  //     default:
  //       return "cursor-default";
  //   }
  // };

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
          <button
            type="button"
            className={`p-2 rounded ${
              currentTool === "eraser" ? "bg-blue-500" : "bg-gray-600"
            }`}
            onClick={() => setCurrentTool("eraser")}
          >
            Eraser
          </button>
        </div>
        <div>
          <input
            type="range"
            min={1}
            max={10}
            value={tools[currentTool as keyof typeof tools].size}
            onChange={(e) =>
              updateTool(currentTool, "size", Number(e.target.value))
            }
          />
          <span className="capitalize">
            {currentTool} Size: {tools[currentTool as keyof typeof tools].size}
          </span>

          {currentTool === "brush" && (
            <input
              type="color"
              value={tools.brush.color}
              onChange={(e) => updateTool("brush", "color", e.target.value)}
            />
          )}

          {currentTool === "brush" && (
            <div>
              <span>opacity</span>
              <input
                type="range"
                min={0}
                step={0.1}
                max={1}
                value={tools.brush.opacity}
                onChange={(e) =>
                  updateTool("brush", "opacity", Number(e.target.value))
                }
              />
            </div>
          )}

          {currentTool === "brush" && (
            <div>
              <span>Change Style:</span>
              <select
                name="brush-style"
                id="change-brush-style"
                className="*:text-black"
                onChange={(e) => updateTool("brush", "style", e.target.value)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          )}

          {currentTool === "brush" && (
            <div>
              <span>Change Shape: </span>
              <select
                name="brush-shape"
                id="change-brush-shape"
                className="*:text-black"
                onChange={(e) => updateTool("brush", "shape", e.target.value)}
              >
                <option value="none">None</option>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
                <option value="calligraphy">Calligraphy</option>
              </select>
            </div>
          )}

          {currentTool === "brush" && (
            <div>
              <span>Change Texture: </span>
              <select
                name="brush-texture"
                id="change-brush-texture"
                className="*:text-black"
                onChange={(e) => updateTool("brush", "texture", e.target.value)}
              >
                <option value="none">None</option>
                <option value="chalk">Chalk</option>
                <option value="pencil">Pencil</option>
                <option value="watercolor">Watercolor</option>
                <option value="spray">Spray</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
          )}
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
