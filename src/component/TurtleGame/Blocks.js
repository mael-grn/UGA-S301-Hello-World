// Blocks.js
import React, { useState } from 'react';

const Block = ({ text, onDragStart, hasParameter, colorList }) => {
  const [parameter, setParameter] = useState('');
/**
 * Gère le changement de paramètre.
 * @param {Object} e - L'événement de changement de la valeur du paramètre.
 */
  const handleParameterChange = (e) => {
    setParameter(e.target.value);
  };
/**
 * Rendu de l'entrée de paramètre en fonction des conditions.
 * Si le paramètre existe et la liste des couleurs est disponible, affiche une liste déroulante.
 * Sinon, affiche une entrée de nombre avec des limites spécifiées.
 * @returns {JSX.Element} - Élément JSX représentant l'entrée de paramètre.
 */
  const renderParameterInput = () => {
    if (hasParameter && colorList) {
      return (
        <select className="bloc-list" value={parameter} onChange={handleParameterChange}>
          {colorList.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="number"
        value={parameter}
        onChange={handleParameterChange}
        placeholder="Parameter"
        min="1"
        max="360"
      />
    );
  };

  return (
    <div draggable onDragStart={(e) => onDragStart(e, hasParameter ? `${text}(${parameter})` : text)} className='block'>
      {hasParameter && (
        <label>
          {text} ({renderParameterInput()})
        </label>
      )}
      {!hasParameter && <span>{text}</span>}
    </div>
  );
};

export const ForwardBlock = ({ onDragStart }) => <Block text="turtle.forward" onDragStart={onDragStart} hasParameter />;
export const BackwardBlock = ({ onDragStart }) => <Block text="turtle.backward" onDragStart={onDragStart} hasParameter />;
export const RightBlock = ({ onDragStart }) => <Block text="turtle.right" onDragStart={onDragStart} hasParameter />;
export const LeftBlock = ({ onDragStart }) => <Block text="turtle.left" onDragStart={onDragStart} hasParameter />;
export const PenUpBlock = ({ onDragStart }) => <Block text="turtle.penup" onDragStart={onDragStart} />;
export const PenDownBlock = ({ onDragStart }) => <Block text="turtle.pendown" onDragStart={onDragStart} />;
export const Circle = ({ onDragStart }) => <Block text="turtle.circle" onDragStart={onDragStart} hasParameter />;
export const ColorBlock = ({ onDragStart }) => (
  <Block  text="turtle.color" onDragStart={onDragStart} hasParameter colorList={["Choisir",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "cyan",
  "magenta",
  "black",
  "white",
  "gray", 
  "orange",
  "brown",
  "pink",
  "lightgray", 
  "darkgray",]} />
);




