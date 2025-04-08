import { useEffect, useRef, useState } from "react";
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
import { Brush, Delete, Eraser, ImagePlus } from "lucide-react";

const PhotoLite = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const {
    currentTool,
    tools,
    mousePosition,
    setCurrentTool,
    updateTool,
    images,
    addImage,
    selectImage,
    selectedImage,
    updateImagePosition,
    updateImageSize,
    clearCanvas,
  } = usePhotoEditorStore();

  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });

  useCanvas(canvasRef as React.RefObject<HTMLCanvasElement>, isImageMode);

  const handleImageClick = () => {
    fileInputRef?.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("File selected:", file);

    //read the files first
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (event) => {
      if (!event?.target?.result) return;

      img.onload = () => {
        const canvas = canvasRef?.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        img.width = img.width * scale;
        img.height = img.height * scale;

        addImage(img);
        // const x = (canvas.width - img.width * scale) / 2;
        // const y = (canvas.height - img.height * scale) / 2;

        // ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };

      img.src = event.target.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // First check if we clicked on a resize handle of the selected image
    if (selectedImage) {
      const selectedImg = images.find((img) => img.id === selectedImage);
      if (selectedImg) {
        const handleSize = 10;
        const isOnHandle =
          x >= selectedImg.x + selectedImg.width - handleSize &&
          x <= selectedImg.x + selectedImg.width + handleSize &&
          y >= selectedImg.y + selectedImg.height - handleSize &&
          y <= selectedImg.y + selectedImg.height + handleSize;

        if (isOnHandle) {
          // If clicking on handle, keep the image selected
          return;
        }
      }
    }

    // Then check if clicking on any image
    const clickedImage = images.find(
      (img) =>
        x >= img.x &&
        x <= img.x + img.width &&
        y >= img.y &&
        y <= img.y + img.height
    );

    if (clickedImage) {
      selectImage(clickedImage.id);
      setIsImageMode(true);
    } else {
      setIsImageMode(false);
      selectImage(null);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImage) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const selectedImg = images.find((img) => img.id === selectedImage);
    if (selectedImg) {
      const handleSize = 10;
      const isOnHandle =
        x >= selectedImg.x + selectedImg.width - handleSize &&
        x <= selectedImg.x + selectedImg.width + handleSize &&
        y >= selectedImg.y + selectedImg.height - handleSize &&
        y <= selectedImg.y + selectedImg.height + handleSize;

      if (isOnHandle) {
        setIsResizing(true);
        setIsImageMode(true);
        setResizeStart({ x, y });
        setInitialSize({
          width: selectedImg.width,
          height: selectedImg.height,
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !selectedImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - resizeStart.x;
    const dy = y - resizeStart.y;

    const ratio = initialSize.width / initialSize.height;
    const newWidth = initialSize.width + dx;
    const newHeight = newWidth / ratio;

    updateImageSize(selectedImage, newWidth, newHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setIsImageMode(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    images.forEach((img) => {
      ctx.drawImage(img.element, img.x, img.y, img.width, img.height);

      if (img.selected) {
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.strokeRect(img.x, img.y, img.width, img.height);

        const handleSize = 10;
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(
          img.x + img.width - handleSize / 2,
          img.y + img.height - handleSize / 2,
          handleSize * 2,
          handleSize * 2
        );
      }
    });
  }, [images, selectedImage]);

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
                  size="icon"
                  variant={"ghost"}
                  onClick={handleImageClick}
                >
                  <ImagePlus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Add Image (I)</p>
              </TooltipContent>
            </Tooltip>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

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
              onClick={(e: React.MouseEvent<HTMLCanvasElement>) => {
                handleCanvasClick(e.nativeEvent);
              }}
              width={800}
              height={800}
              className="bg-white border border-border shadow-lg"
              onMouseDown={(e: React.MouseEvent<HTMLCanvasElement>) => {
                if (!isImageMode) {
                  handleMouseDown(e.nativeEvent);
                }
              }}
              onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => {
                if (isResizing) {
                  handleMouseMove(e.nativeEvent);
                }
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
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
