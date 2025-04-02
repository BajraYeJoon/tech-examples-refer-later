import React, { useEffect, useRef } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const canvas2 = canvasRef2.current;
    const ctx2 = canvasRef2.current?.getContext("2d");
    if (!ctx2) return;

    function drawGrid() {
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;

      // Draw vertical lines every 100px
      for (let x = 0; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        // Add x-axis labels
        ctx.fillStyle = "#666";
        ctx.font = "14px Arial";
        ctx.fillText(x.toString(), x + 5, 15);
      }

      // Draw horizontal lines every 100px
      for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Add y-axis labels
        ctx.fillStyle = "#666";
        ctx.font = "14px Arial";
        ctx.fillText(y.toString(), 5, y + 15);
      }

      // Draw smaller grid lines
      ctx.strokeStyle = "#eee";
      ctx.lineWidth = 0.5;

      // Draw vertical lines every 20px
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines every 20px
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    drawGrid();

    canvas.addEventListener("mousemove", (e) => {
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Clear previous position
      ctx.fillStyle = "white";
      ctx.fillRect(0, 20, 100, 30);

      // Show current position
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.fillText(`X: ${Math.round(mouseX)}`, 10, 40);
      ctx.fillText(`Y: ${Math.round(mouseY)}`, 10, 60);
    });

    // triagne
    // ctx.beginPath();
    // ctx.moveTo(300, 100);
    // ctx.lineTo(200, 100);
    // ctx.lineTo(300, 200);
    // ctx.fill();

    // create a semi circle

    // ctx.beginPath();
    // ctx.arc(400, 500, 200, Math.PI, 0);
    // ctx.stroke();
    // ctx.fillStyle = "red";
    // ctx.fill();

    // ctx.beginPath();
    // ctx.arc(400, 400, 200, Math.PI, 0);

    // ctx.globalAlpha = 0.2;
    // for (let i = 0; i < 7; i++) {
    //   ctx.beginPath();
    //   ctx.arc(400, 500, 20 * i, 0, Math.PI, true);
    //   ctx.fillStyle = "blue";
    //   ctx.fill();
    // }

    // instagram logo
    ctx.beginPath();
    const width = 400;
    const height = 400;
    const x = 200;
    const y = 100;
    const radius = 50;

    ctx.moveTo(250, 100);

    // Top right corner
    ctx.arcTo(600, y, 600, y + radius, radius);

    // Bottom right corner
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);

    // Bottom left corner
    ctx.arcTo(x, y + height, x, y + height - radius, radius);

    // Top left corner
    ctx.arcTo(x, y, x + radius, y, radius);

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // //center lends
    // ctx.beginPath();
    // ctx.arc(400, 300, 100, 0, Math.PI * 2);
    // ctx.stroke();

    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.arc(400, 300, 80 + i * 40, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(520, 160, 20, 0, Math.PI * 2);
    ctx.stroke();

    const mouse = {
      x: undefined,
      y: undefined,
    };

    const rect = canvas2?.getBoundingClientRect();

    canvas2?.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      drawCircle();
    });

    function drawCircle() {
      const ctx2 = canvasRef2.current?.getContext("2d");
      if (!ctx2) return;

      // Clear the previous circle
      // ctx2.clearRect(0, 0, canvas2!.width, canvas2!.height);

      //draw a circle
      ctx2.beginPath();
      ctx2.arc(mouse.x, mouse.y, 41, 0, Math.PI * 2);
      ctx2.fillStyle = "red";
      ctx2.fill();
    }

    function animate() {
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      drawCircle();

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div>
      <p>Move your mouse over the canvas to see coordinates</p>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: "2px solid black",
          background: "white",
        }}
      />
      <canvas
        ref={canvasRef2}
        width={800}
        height={600}
        style={{
          border: "2px solid black",
          background: "white",
        }}
      />
    </div>
  );
};

export default Canvas;
