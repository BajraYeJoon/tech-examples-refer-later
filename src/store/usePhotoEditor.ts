import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Tool {
  name: string;
  size: number;
  color: string;
  opacity: number;
  style: "solid" | "dashed" | "dotted";
}

interface PhotoEditorStore {
  currentTool: string;
  tools: {
    brush: Tool;
  };
  mousePosition: {
    x: number;
    y: number;
  };

  //actions
  setCurrentTool: (tool: string) => void;
  updateTool: (toolName: string, property: keyof Tool, value: any) => void;
  setMousePosition: (x: number, y: number) => void;
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
      },
    },
    mousePosition: {
      x: 0,
      y: 0,
    },

    setCurrentTool: (tool) => {
      set((state) => {
        state.currentTool = tool;
      });
    },
    updateTool: (toolName: string, property: keyof Tool, value: any) =>
      set((state) => {
        state.tools[toolName as keyof PhotoEditorStore["tools"]][property] =
          value;
      }),

    setMousePosition(x, y) {
      set((state) => {
        state.mousePosition.x = x;
        state.mousePosition.y = y;
      });
    },
  }))
);
