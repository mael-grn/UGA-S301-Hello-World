import React, { useState } from 'react';
import '../styles/PopupWindow.css';

const PopupWindow = ({ resumeGame, listeIngredients, selectedRecipe }) => {
/**
 * Gère le clic sur le bouton de reprise du jeu.
 * Appelle la fonction `resumeGame`.
 */
  const handleButtonResumeClick = () => {
    resumeGame();
  };

  return (
    <div className='popup'>
      <div className='background'></div>
      <div className='window big'>
        <h1>Contenu</h1>
        {listeIngredients.map((ingredient, index) => {
          const matchingBlock = selectedRecipe.etapes
            .flatMap(etape => etape.reponses)
            .find(response => response.nom === ingredient);

          if (matchingBlock) {
            return (
              <button key={index} className='game-button'>
                {matchingBlock.nom}
                <img src={matchingBlock.image} alt={matchingBlock.nom} className='image-food'/>
              </button>
            );
          } else {
            return null; // Ne rien afficher si le bloc correspondant n'est pas trouvé
          }
        })}
        
        
        <button className='button' onClick={handleButtonResumeClick}>RESUME</button>
      </div>
    </div>
  );
};

export default PopupWindow;
