import { useEffect, useRef, useState } from "react";

const PhotoLite = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  //state brush
  const [tool, setTool] = useState<string>("brush");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [canvasHeight, setCanvasHeight] = useState<number>(
    window.innerHeight - 500
  );
  const [canvasWidth, setCanvasWidth] = useState<number>(
    window.innerWidth - 500
  );

  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth - 500);
      setCanvasHeight(window.innerHeight - 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("Brush size changed:", brushSize);
    console.log(canvasHeight, canvasWidth);
  }, [brushSize, canvasHeight, canvasWidth]); // Only runs when brushSize changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // this is the main point
    if (!canvasRef?.current) return;

    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffff";
      ctx.fillRect(0, 0, canvasRef?.current?.width, canvasRef?.current?.height);

      ctx.strokeStyle = "#000";
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    const mouseTrack = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      setMouseX(Math.round(e.clientX - rect.left));
      setMouseY(Math.round(e.clientY - rect.top));
    };

    canvasRef.current.addEventListener("mousemove", mouseTrack);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      canvasRef.current?.removeEventListener("mousemove", mouseTrack);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!canvasRef?.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;
      tempCtx?.drawImage(canvasRef.current, 0, 0);

      canvasRef.current.width = canvasWidth;
      canvasRef.current.height = canvasHeight;

      ctx.fillStyle = "#ffff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.drawImage(tempCanvas, 0, 0);
    }
  }, [brushSize, canvasHeight, canvasWidth]);

  useEffect(() => {
    // firsty intialize
    if (!canvasRef?.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    //variable init
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      //to calcualte the exact positon mouse
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      // console.log("Start position:", { lastX, lastY });
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      //same as stratr
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      //here comes the thing
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      // console.log("Current mouse position:", { currentX, currentY });
      // console.log("Drawing line from:", { lastX, lastY }, "to:", {
      //   currentX,
      //   currentY,
      // });

      //  to start new postion for conintous
      lastX = currentX;
      lastY = currentY;
      // console.log("Updated last position:", { lastX, lastY });
    };

    const stopDrawing = () => {
      isDrawing = false;
      // console.log("Stopped drawing");
    };

    // to add event
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // cleanrup is very important
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>Photo Lite - Brush Tool</div>
      <div className="flex items-center justify-between  gap-2">
        <div>
          <button
            type="button"
            className={`p-2 rounded ${
              tool === "brush" ? "bg-blue-500" : "bg-gray-600"
            }`}
            onClick={() => setTool("brush")}
          >
            Brush
          </button>
        </div>
        <div>
          <input
            type="range"
            min={1}
            max={10}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
          <span className="capitalize">
            {tool} Size: {brushSize}
          </span>
        </div>
      </div>
      <div
        ref={wrapperRef}
        className="h-[100vh] relative  border bg-gray-200 flex items-center justify-center p-4"
      >
        <div className="absolute  top-4 right-4 text-black  p-2 rounded shadow">
          Mouse Position - X: {mouseX} Y: {mouseY}
        </div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="bg-white border border-gray-300"
        >
          Canvas not supported
        </canvas>
      </div>
    </div>
  );
};

export default PhotoLite;
