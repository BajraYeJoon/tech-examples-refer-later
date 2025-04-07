import { useEffect, type RefObject } from "react";
import { usePhotoEditorStore } from "../store/usePhotoEditor";

const createPattern = (ctx: CanvasRenderingContext2D, type: string) => {
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 20;
  patternCanvas.height = 20;
  const patternCtx = patternCanvas.getContext("2d");
  if (!patternCtx) return null;

  // Clear the pattern canvas first
  patternCtx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);

  switch (type) {
    case "chalk":
      // Create chalk texture with more visible effect
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (Math.random() > 0.5) {
            // Increased density
            patternCtx.fillStyle = "rgba(255,255,255,0.4)"; // Increased opacity
            patternCtx.fillRect(i, j, 1, 1);
          }
        }
      }
      break;
    case "pencil":
      // Create pencil texture with more visible effect
      patternCtx.strokeStyle = "rgba(0,0,0,0.3)"; // Increased opacity
      patternCtx.lineWidth = 1;
      for (let i = 0; i < 20; i += 2) {
        patternCtx.beginPath();
        patternCtx.moveTo(i, 0);
        patternCtx.lineTo(i, 20);
        patternCtx.stroke();
      }
      // Add horizontal lines for more texture
      for (let i = 0; i < 20; i += 2) {
        patternCtx.beginPath();
        patternCtx.moveTo(0, i);
        patternCtx.lineTo(20, i);
        patternCtx.stroke();
      }
      break;
  }

  return ctx.createPattern(patternCanvas, "repeat");
};

export const useCanvas = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { tools, currentTool, setMousePosition } = usePhotoEditorStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!canvasRef?.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize canvas once
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!canvasRef?.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const currentToolSettings = tools[currentTool as keyof typeof tools];
    if ("color" in currentToolSettings) {
      ctx.strokeStyle = currentToolSettings.color;
    }
    ctx.lineWidth = currentToolSettings.size;
    if ("opacity" in currentToolSettings) {
      ctx.globalAlpha = currentToolSettings.opacity;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if ("style" in currentToolSettings)
      switch (currentToolSettings.style) {
        case "solid":
          ctx.setLineDash([]);
          break;

        case "dashed":
          ctx.setLineDash([
            currentToolSettings.size * 6,
            currentToolSettings.size * 2,
          ]);
          break;

        case "dotted":
          ctx.setLineDash([
            currentToolSettings.size - 2,
            currentToolSettings.size * 2,
          ]);
          break;
      }

    if ("shape" in currentToolSettings) {
      switch (currentToolSettings.shape) {
        case "circle":
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          break;

        case "square":
          ctx.lineCap = "square";
          ctx.lineJoin = "miter";
          ctx.miterLimit = 2;
          break;

        case "calligraphy":
          ctx.lineCap = "butt";
          ctx.lineJoin = "miter";
          ctx.setTransform(1, 0.5, -0.5, 1, 0, 0);
          break;
      }
    }
  }, [currentTool, tools]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!canvasRef?.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;

      const currentToolSettings = tools[currentTool as keyof typeof tools];
      if (
        "shape" in currentToolSettings &&
        currentToolSettings.shape === "calligraphy"
      ) {
        ctx.setTransform(1, 0.5, -0.5, 1, lastX, lastY);
      }

      // Update mouse position for UI
      setMousePosition(lastX, lastY);

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      setMousePosition(currentX, currentY);

      const currentToolSettings = tools[currentTool as keyof typeof tools];

      // Set line width for all tools
      ctx.lineWidth = currentToolSettings.size;

      if (currentTool === "eraser") {
        // Eraser settings
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 1; // Full opacity for eraser
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      } else {
        // Non-eraser tool settings
        ctx.globalCompositeOperation = "source-over";
        if ("color" in currentToolSettings) {
          ctx.strokeStyle = currentToolSettings.color;
        }
        if ("opacity" in currentToolSettings) {
          ctx.globalAlpha = currentToolSettings.opacity;
        }

        if ("texture" in currentToolSettings)
          switch (currentToolSettings.texture) {
            case "chalk": {
              // Chalk effect
              ctx.globalCompositeOperation = "source-over";
              ctx.strokeStyle = currentToolSettings.color;
              const pattern = createPattern(ctx, "chalk");
              if (pattern) {
                ctx.strokeStyle = pattern;
              }
              // Draw multiple lines with random offsets for a more textured effect
              for (let i = 0; i < 5; i++) {
                // Increased from 3 to 5
                ctx.beginPath();
                ctx.moveTo(
                  lastX + (Math.random() - 0.5) * 3, // Increased from 2 to 3
                  lastY + (Math.random() - 0.5) * 3
                );
                ctx.lineTo(
                  currentX + (Math.random() - 0.5) * 3,
                  currentY + (Math.random() - 0.5) * 3
                );
                ctx.stroke();
              }
              break;
            }

            case "pencil": {
              // Pencil effect
              ctx.globalCompositeOperation = "multiply";
              const pattern = createPattern(ctx, "pencil");
              if (pattern) {
                ctx.strokeStyle = pattern;
              }
              // Draw multiple lines for a more textured effect
              for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(
                  lastX + (Math.random() - 0.5) * 1,
                  lastY + (Math.random() - 0.5) * 1
                );
                ctx.lineTo(
                  currentX + (Math.random() - 0.5) * 1,
                  currentY + (Math.random() - 0.5) * 1
                );
                ctx.stroke();
              }
              break;
            }

            // case "watercolor": {
            //   // Watercolor effect
            //   ctx.globalCompositeOperation = "color";
            //   ctx.strokeStyle = currentToolSettings.color;
            //   ctx.globalAlpha = 0.1;
            //   for (let i = 0; i < 3; i++) {
            //     ctx.beginPath();
            //     ctx.moveTo(lastX, lastY);
            //     // Create irregular edges
            //     const cp1x = (lastX + currentX) / 2 + (Math.random() - 0.5) * 20;
            //     const cp1y = (lastY + currentY) / 2 + (Math.random() - 0.5) * 20;
            //     ctx.quadraticCurveTo(cp1x, cp1y, currentX, currentY);
            //     ctx.stroke();
            //   }
            //   break;
            // }

            // case "spray": {
            //   // Spray effect
            //   ctx.fillStyle = currentToolSettings.color;
            //   const density = currentToolSettings.size * 2;
            //   for (let i = 0; i < density; i++) {
            //     const radius = currentToolSettings.size * 2;
            //     const angle = Math.random() * Math.PI * 2;
            //     const distance = Math.random() * radius;
            //     ctx.beginPath();
            //     ctx.arc(
            //       currentX + distance * Math.cos(angle),
            //       currentY + distance * Math.sin(angle),
            //       0.5,
            //       0,
            //       Math.PI * 2
            //     );
            //     ctx.fill();
            //   }
            //   break;
            // }

            // case "gradient": {
            //   // Gradient effect
            //   const gradient = ctx.createLinearGradient(
            //     lastX,
            //     lastY,
            //     currentX,
            //     currentY
            //   );
            //   gradient.addColorStop(0, currentToolSettings.color);
            //   gradient.addColorStop(1, adjustColor(currentToolSettings.color, 20));
            //   ctx.strokeStyle = gradient;
            //   ctx.lineTo(currentX, currentY);
            //   ctx.stroke();
            //   break;
            // }

            default:
              // Default drawing
              ctx.lineTo(currentX, currentY);
              ctx.stroke();
          }

        lastX = currentX;
        lastY = currentY;
      }
    };

    const stopDrawing = () => {
      isDrawing = false;
      ctx.closePath();

      // Check if current tool is calligraphy and reset transform
      const tool = tools[currentTool as keyof typeof tools];
      if ("shape" in tool && tool.shape === "calligraphy") {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
    };

    const trackMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition(
        Math.round(e.clientX - rect.left),
        Math.round(e.clientY - rect.top)
      );
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", (e) => {
      trackMouse(e);
      draw(e);
    });
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, [setMousePosition, tools, currentTool]);

  // Helper function for gradient effect
};
