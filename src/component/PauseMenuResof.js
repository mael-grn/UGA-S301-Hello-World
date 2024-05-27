import React, { useState } from 'react';
import '../styles/PopupWindow.css';

const PopupWindow = ({resumeGame, saveData,tutoGame}) => {
  /**
 * Gère le clic sur le bouton de reprise du jeu.
 * Déclenche la fonction de reprise du jeu.
 */
  const handleButtonResumeClick = () => {
    resumeGame();
  };
/**
 * Gère le clic sur le bouton de quitter.
 * 
 */
  const handleButtonQuitClick = () => {
    saveData();
  };
/**
 * Gère le clic sur le bouton du tutoriel.
 * Déclenche la fonction du tutoriel du jeu.
 */
  const handleButtonTutoClick = () => {
    tutoGame();
  };
  return (
    <div className='popup'>
      <div className='background'></div>
        <div className='window'>
            <h1>Pause</h1>
            <button className='button' onClick={handleButtonResumeClick}>RESUME</button>
            {tutoGame && ( // Vérifie si tutoGame est fourni
              <button className='button' onClick={handleButtonTutoClick}>
                TUTO
              </button>
              )}
            <button className='button-red' onClick={handleButtonQuitClick}>QUITTER</button>

        </div>
    </div>
  );
};

export default PopupWindow;
