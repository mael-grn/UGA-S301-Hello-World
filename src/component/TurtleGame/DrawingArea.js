// DrawingArea.js
import React from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

const DrawingArea = ({ lines, isDrawing }) => {
  console.log('Lines in DrawingArea:', lines);

/**
 * Génère et retourne une liste d'éléments de ligne représentant les lignes de la grille.
 * Utilise une grille de taille fixe avec des lignes espacées régulièrement sur la scène.
 * @returns {JSX.Element[]} - Liste d'éléments JSX représentant les lignes de la grille.
 */
  const generateGridLines = () => {
    const gridLines = [];
    const gridSize = 100;
    const stageWidth = 800;
    const stageHeight = 600;

    for (let x = 0; x <= stageWidth; x += gridSize) {
      gridLines.push(
        <Line
          key={`gridX-${x}`}
          points={[x, 0, x, stageHeight]}
          stroke="lightgray"
          strokeWidth={1}
        />
      );
    }

    for (let y = 0; y <= stageHeight; y += gridSize) {
      gridLines.push(
        <Line
          key={`gridY-${y}`}
          points={[0, y, stageWidth, y]}
          stroke="lightgray"
          strokeWidth={1}
        />
      );
    }

    return gridLines;
  };

  return (
    <Stage width={800} height={600}>
      <Layer>
        {/* Cadre gris */}
        <Rect
          width={800}
          height={600}
          stroke="gray"
          strokeWidth={1}
        />

        {/* Lignes de repères */}
        {generateGridLines()}

        {/* Lignes du dessin */}
        {lines.map((line, index) => (
          <Line
            key={index}
            points={[line.x1, line.y1, line.x2, line.y2]}
            stroke={line.color}
            strokeWidth={4}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default DrawingArea;
