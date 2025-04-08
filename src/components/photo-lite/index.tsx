import { useRef } from "react";
import { usePhotoEditorStore } from "../../store/usePhotoEditor";
import { useCanvas } from "../../hooks/useCanvas";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Card } from "../ui/card";
import { Brush, Delete, Eraser } from "lucide-react";

const PhotoLite = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    currentTool,
    tools,
    mousePosition,
    setCurrentTool,
    updateTool,
    clearCanvas,
  } = usePhotoEditorStore();

  useCanvas(canvasRef as React.RefObject<HTMLCanvasElement>);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Left Toolbar */}
        <div className="w-16 bg-muted p-2 flex flex-col gap-2 border-r">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={currentTool === "brush" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentTool("brush")}
                >
                  <Brush className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Brush Tool (B)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={currentTool === "eraser" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentTool("eraser")}
                >
                  <Eraser className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Eraser Tool (E)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" onClick={() => clearCanvas()}>
                  <Delete className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Clear Canvas (J)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Canvas Area */}
          <div className="flex-1 relative bg-[#1e1e1e] flex items-center justify-center p-4">
            <Card className="absolute top-4 right-4 px-3 py-2 text-sm">
              Position: {mousePosition.x}, {mousePosition.y}
            </Card>
            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              className="bg-white border border-border shadow-lg"
            >
              Canvas not supported
            </canvas>
          </div>

          {/* Right Sidebar */}
          <div className="w-64 bg-muted p-4 border-l space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Tool Size</h3>
              <Slider
                min={1}
                max={50}
                step={1}
                value={[tools[currentTool as keyof typeof tools].size]}
                onValueChange={(value) =>
                  updateTool(currentTool, "size", value[0])
                }
                className="w-full"
              />
            </div>

            {currentTool === "brush" && (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-2">Color</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tools.brush.color}
                      onChange={(e) =>
                        updateTool("brush", "color", e.target.value)
                      }
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-sm">{tools.brush.color}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Opacity</h3>
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={[tools.brush.opacity]}
                    onValueChange={(value) =>
                      updateTool("brush", "opacity", value[0])
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Style</h3>
                  <Select
                    value={tools.brush.style}
                    onValueChange={(value: "solid" | "dashed" | "dotted") =>
                      updateTool("brush", "style", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Shape</h3>
                  <Select
                    value={tools.brush.shape}
                    onValueChange={(
                      value: "none" | "circle" | "square" | "calligraphy"
                    ) => updateTool("brush", "shape", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="calligraphy">Calligraphy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Texture</h3>
                  <Select
                    value={tools.brush.texture}
                    onValueChange={(
                      value:
                        | "none"
                        | "chalk"
                        | "pencil"
                        | "watercolor"
                        | "spray"
                        | "gradient"
                    ) => updateTool("brush", "texture", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select texture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="chalk">Chalk</SelectItem>
                      <SelectItem value="pencil">Pencil</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                      <SelectItem value="spray">Spray</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PhotoLite;
