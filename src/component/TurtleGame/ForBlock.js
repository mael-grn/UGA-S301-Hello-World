// Dans ForBlock.js

import React, { useState } from 'react';

const ForBlock = ({ onDragStart, onDropBlock }) => {
  const [loopValue, setLoopValue] = useState(''); // Nouveau state pour la valeur de la boucle
  const [blockList, setBlockList] = useState([]); // Nouveau state pour la liste de blocs
/**
 * Gère l'événement de dépôt d'un bloc.
 * Ajoute le bloc au bloc actuel en utilisant les données transférées.
 * @param {DragEvent} e - L'événement de glisser-déposer.
 */
  const handleDropBlock = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    setBlockList((prevList) => [...prevList, text]);
  };
/**
 * Gère le changement de valeur de la boucle.
 * Met à jour la valeur de la boucle en fonction de la saisie utilisateur.
 * @param {ChangeEvent} e - L'événement de changement de valeur.
 */
  const handleLoopValueChange = (e) => {
    setLoopValue(e.target.value);
  };
/**
 * Réinitialise la valeur de la boucle et la liste des blocs.
 */
  const handleReset = () => {
    setLoopValue('');
    setBlockList([]);
  };


return (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, `turtle.for i in range(${loopValue}):\n${blockList.join('\n')}\nend for`)}
    className='block'
    onDrop={handleDropBlock}
    onDragOver={(e) => e.preventDefault()}
  >
    <label>
      for i in range (
      <input
        type="number"
        value={loopValue}
        onChange={handleLoopValueChange}
        placeholder="loop value"
        min="1"
      />
      ):
    </label>
    <button className="small-button small-reset-button" onClick={handleReset}>
      Reset
    </button>
    {blockList.map((block, index) => (
      <div key={index} onClick={() => onDropBlock(block)}>
        {block}
      </div>
    ))}
  </div>
);

};

export default ForBlock;
