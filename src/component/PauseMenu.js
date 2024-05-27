import React, { useState } from 'react';
import '../styles/PopupWindow.css';

const PopupWindow = ({resumeGame, saveData,tutoGame}) => {
/**
 * Affiche la popup de suppression après avoir caché la popup principale.
 */
  const handleButtonResumeClick = () => {
    resumeGame();
  };
/**
 * Gère le clic sur le bouton de quitter le jeu.
 * redirige vers la page du menu de l'élève.
 */
  const handleButtonQuitClick = () => {
    //saveData();
    window.location.replace('/MenuEleve');
  };
/**
 * Gère le clic sur le bouton du tutoriel du jeu.
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
