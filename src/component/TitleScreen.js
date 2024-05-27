import React, { useState } from 'react';
import '../styles/PopupWindow.css';

const PopupWindow = ({resumeGame, saveData,nomjeu}) => {
/**
 * Gère le clic sur le bouton de reprise du jeu.
 */
  const handleButtonResumeClick = () => {
    resumeGame();
  };
/**
 * Gère le clic sur le bouton de quitter du jeu.
 * redirige vers la page du menu de l'élève.
 */
  const handleButtonQuitClick = () => {
    saveData();
    window.location.replace('/MenuEleve');
  };

  return (
    <div className='popup'>
      <div className='background'></div>
        <div className='window '>
            <h1>{nomjeu}</h1>
            <button className='button' onClick={handleButtonResumeClick}>LANCER PARTIE</button>
            <button className='button' onClick={handleButtonQuitClick}>QUITTER</button>
      </div>
        
    </div>
  );
};

export default PopupWindow;
