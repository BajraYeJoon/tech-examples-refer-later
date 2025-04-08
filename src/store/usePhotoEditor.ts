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

interface ImageObject {
  id: string;
  element: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
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

  images: ImageObject[];
  selectedImage: string | null;

  clearCanvasFlag: number;

  // image
  addImage: (image: HTMLImageElement) => void;
  selectImage: (id: string | null) => void;
  updateImagePosition: (id: string, x: number, y: number) => void;
  updateImageSize: (id: string, width: number, height: number) => void;

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

    images: [],
    selectedImage: null,

    addImage: (image: HTMLImageElement) => {
      set((state) => {
        const id = crypto.randomUUID();
        state.images.push({
          id,
          element: image,
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
          selected: true,
        });

        state.selectedImage = id;
      });
    },

    selectImage: (id: string | null) =>
      set((state) => {
        state.images.forEach((img) => (img.selected = img.id === id));
        state.selectedImage = id;
      }),

    updateImagePosition: (id: string, x: number, y: number) => {
      set((state) => {
        const image = state.images.find((img) => img.id === id);
        if (image) {
          image.x = x;
          image.y = y;
        }
      });
    },

    updateImageSize: (id: string, width: number, height: number) => {
      set((state) => {
        const image = state.images.find((img) => img.id === id);
        if (image) {
          image.width = width;
          image.height = height;
        }
      });
    },
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
