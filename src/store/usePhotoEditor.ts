import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Tool {
  name: string;
  size: number;
  color: string;
  opacity: number;
  style: "solid" | "dashed" | "dotted";
  shape: "none" | "circle" | "square" | "calligraphy";
  texture: "none" | "chalk" | "pencil" | "watercolor" | "spray" | "gradient";
}

type EraserTool = Pick<Tool, "name" | "size">;

type Tools = {
  brush: Tool;
  eraser: EraserTool;
};

type ToolName = keyof Tools;
type ToolProperty<T extends ToolName> = keyof Tools[T];

interface PhotoEditorStore {
  currentTool: ToolName;
  tools: Tools;
  mousePosition: {
    x: number;
    y: number;
  };
  clearCanvasFlag: number;

  //actions
  setCurrentTool: (tool: ToolName) => void;
  updateTool: <T extends ToolName>(
    toolName: T,
    property: ToolProperty<T>,
    value: Tools[T][ToolProperty<T>]
  ) => void;
  setMousePosition: (x: number, y: number) => void;
  clearCanvas: () => void;
}

export const usePhotoEditorStore = create<PhotoEditorStore>()(
  immer((set) => ({
    currentTool: "brush",
    tools: {
      brush: {
        name: "brush",
        size: 5,
        color: "#000000",
        opacity: 1,
        style: "solid",
        shape: "none",
        texture: "none",
      },
      eraser: {
        name: "eraser",
        size: 20,
      },
    },
    mousePosition: {
      x: 0,
      y: 0,
    },
    clearCanvasFlag: 0,

    setCurrentTool: (tool) => {
      set((state) => {
        state.currentTool = tool;
      });
    },
    updateTool: <T extends ToolName>(
      toolName: T,
      property: ToolProperty<T>,
      value: Tools[T][ToolProperty<T>]
    ) =>
      set((state) => {
        state.tools[toolName][property] = value;
      }),

    setMousePosition(x, y) {
      set((state) => {
        state.mousePosition.x = x;
        state.mousePosition.y = y;
      });
    },

    clearCanvas() {
      set((state) => {
        state.clearCanvasFlag += 1;
        state.tools.brush.color = "#000000";
        state.tools.brush.opacity = 1;
        state.tools.brush.style = "solid";
        state.tools.brush.shape = "none";
        state.tools.brush.texture = "none";
      });
    },
  }))
);
