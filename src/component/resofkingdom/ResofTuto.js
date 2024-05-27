import React, { useState,useEffect } from 'react';
import '../../styles/TutoWindow.css';
import computer from '../../img/computer.png';
import server from '../../img/server.png';
import comm from '../../img/switch.png';
import requeteEx from '../../img/requete-ex.png';
import computerCorrupted from '../../img/computerCorrupted.png';

const ResofTuto = ({ resumeGame, saveData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [whereButtonOpacity, setWhereButtonOpacity] = useState(1);
  const [requeteExOpacity, setRequeteExOpacity] = useState(0);
  

/**
 * Gère le clic sur le bouton de reprise du jeu.
 */
  const handleButtonResumeClick = () => {
    if (currentStep === 0) {
      // Si currentStep est 0, passer à l'étape suivante
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Si currentStep est 1, passer à l'étape suivante
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Si currentStep est 2, déclencher handleButtonResumeClick
      setCurrentStep(3);
    } else if (currentStep === 3) {
        // Si currentStep est 2, déclencher handleButtonResumeClick
        resumeGame();
      }
  };


  const getTutorialText = () => {
    if (currentStep === 0) {
      return "Tu peux acheter des ordinateurs pour une certaine quantité de données.";
    } else if (currentStep === 1) {
      return "Tu peux acheter des serveurs pour une certaine quantité de ressources.";
    } else if (currentStep === 2) {
      return "Pour fonctionner, les ordinateurs et les serveurs doivent être reliés au réseau.";
    } else if (currentStep === 3) {
        return "Attention aux attaques !";
    }
  };

  const getTutorialText2 = () => {
    if (currentStep === 0) {
      return "Une fois placés sur les cases bleues, ceux-ci permettent de miner des ressources.";
    } else if (currentStep === 1) {
      return "Une fois placés sur les cases vertes, ceux-ci permettent de miner des données.";
    } else if (currentStep === 2) {
      return "Pour cela, achète des switch et des routeurs. Place-les sur la carte, puis clique sur les éléments que tu souhaites configurer. En rentrant correctement l'adresse IP et le masque pour chaque élément, ceux-ci sont reliés et peuvent ainsi fonctionner.";
    } else if (currentStep === 3) {
        return "À la fin du compte à rebours, jusqu'à un quart de tes ordinateurs sont réinitialisés. Tu devras donc les reconfigurer pour qu'ils puissent fonctionner de nouveau.";
    }
  };

  const getImage1 = () => {
    if (currentStep === 0) {
      return computer;
    }
    else if(currentStep===1){
      return server;
    }
    else if(currentStep===2){
      return comm;
    }
    else if(currentStep===3){
        return computerCorrupted;
      }
  };




  

  return (
    <div className='tuto'>
      <div className='background'></div>
      <div className='window big'>
        <h1>TUTORIEL</h1>
        <h2 className='text-tuto'>{getTutorialText()}</h2>
        <img
          src={getImage1()}
          alt="Tutorial"
          className='resofImg'
        />
        <p className='text-tuto'>{getTutorialText2()}</p>
        <button className='button' onClick={handleButtonResumeClick}>
          {currentStep === 3 ? "PARTEZ !" : "SUIVANT"}
        </button>
        
      </div>
    </div>
  );
};

export default ResofTuto;
