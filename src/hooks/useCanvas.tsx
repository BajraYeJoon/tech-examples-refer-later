import { useEffect, type RefObject } from "react";
import { usePhotoEditorStore } from "../store/usePhotoEditor";

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
    ctx.strokeStyle = currentToolSettings.color;
    ctx.lineWidth = currentToolSettings.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
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
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      lastX = currentX;
      lastY = currentY;
    };

    const stopDrawing = () => {
      isDrawing = false;
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
  }, [setMousePosition]);
};
