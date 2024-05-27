// GoToBlock.js
import React, { useState } from 'react';

const GoToBlock = ({ onDragStart }) => {
  const [gotoX, setGotoX] = useState(''); // Nouveau state pour la coordonnée X
  const [gotoY, setGotoY] = useState(''); // Nouveau state pour la coordonnée Y
/**
 * Manipule l'événement de largage d'un bloc, empêche le comportement par défaut
 * et crée une chaîne de texte représentant une commande "turtle.goto" avec les
 * coordonnées spécifiées.
 * @param {DragEvent} e - L'événement de largage.
 */
  const handleDropBlock = (e) => {
    e.preventDefault();
    const text = `turtle.goto(${gotoX || 0}, ${gotoY || 0})`;
  };
/**
 * Met à jour la valeur de la coordonnée X pour la commande "turtle.goto"
 * en fonction de l'événement de changement.
 * @param {ChangeEvent} e - L'événement de changement de la valeur X.
 */
  const handleGotoXChange = (e) => {
    setGotoX(e.target.value);
  };
/**
 * Met à jour la valeur de la coordonnée Y pour la commande "turtle.goto"
 * en fonction de l'événement de changement.
 * @param {ChangeEvent} e - L'événement de changement de la valeur Y.
 */
  const handleGotoYChange = (e) => {
    setGotoY(e.target.value);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, `turtle.goto(${gotoX || 0}, ${gotoY || 0})`)}
      className='block'
      onDragOver={(e) => e.preventDefault()}
    >
      <label>
        turtle.goto (
        <input
          type="number"
          value={gotoX}
          onChange={handleGotoXChange}
          placeholder="X"
          min="0"
        />
        , 
        <input
          type="number"
          value={gotoY}
          onChange={handleGotoYChange}
          placeholder="Y"
          min="0"
        />
        )
      </label>
    </div>
  );
};

export default GoToBlock;
