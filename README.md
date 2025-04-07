# PhotoLite - A Simple Online Photo Editor

PhotoLite is a lightweight, browser-based photo editing application inspired by Photopea. It provides basic image editing capabilities with a clean, intuitive interface.

## Features

- **Drawing Tools**: Brush tool with adjustable size and color
- **Eraser Tool**: Remove parts of your drawing
- **Line Tool**: Draw straight lines
- **Color Picker**: Choose any color for your brush
- **Size Adjustment**: Control the brush/eraser/line thickness
- **Clear Canvas**: Start over with a fresh white canvas
- **Save Image**: Download your creation as a PNG file

## How to Use

1. **Select a Tool**: Choose between Brush, Eraser, or Line tool from the left sidebar
2. **Adjust Settings**: Set your preferred color and brush size from the top toolbar
3. **Draw on Canvas**: Click and drag on the white canvas to create your artwork
4. **Save Your Work**: Click the "Save" button to download your image

## Implementation Details

PhotoLite is built with React and TypeScript, using HTML5 Canvas for the drawing functionality. The application uses:

- React hooks for state management
- Canvas API for drawing operations
- CSS for styling the interface

## Technical Stack

- React + TypeScript + Vite
- HTML5 Canvas API
- TailwindCSS for styling

## Future Enhancements

- Layer support
- Image import/upload
- More tools (shapes, text, filters)
- Undo/redo functionality
- Zoom and pan capabilities

## Getting Started

To run PhotoLite locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to the local development URL

Enjoy creating with PhotoLite!
