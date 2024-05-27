import React, { useState,useEffect } from 'react';
import '../styles/TutoWindow.css';
import recetteFeuille1 from '../img/feuilletuto1.png';
import recetteFeuille2 from '../img/feuilletuto2.png';
import whereButton from '../img/where-button.png';
import requeteEx from '../img/requete-ex.png';
import journalButton from '../img/journal-button.png';
import rangementButton from '../img/rangement-button.png';
import contenuRangement from '../img/contenu-rangement.png';

const SQuisineTuto = ({ resumeGame, saveData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [imageSource, setImageSource] = useState(recetteFeuille1);
  const [whereButtonOpacity, setWhereButtonOpacity] = useState(1);
  const [requeteExOpacity, setRequeteExOpacity] = useState(0);
  const [rangementButtonOpacity, setRangementButtonOpacity] = useState(1);
  const [contenuRangementOpacity, setContenuRangementOpacity] = useState(0);
  useEffect(() => {
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        // Changez l'image après une seconde
        setImageSource(recetteFeuille2);
      }, 2500);

      // Assurez-vous de nettoyer le timer lors du démontage du composant
      return () => clearTimeout(timer);
    }
    else if (currentStep === 1) {
      const timer = setInterval(() => {
        setWhereButtonOpacity((prevOpacity) => (prevOpacity === 1 ? 0 : 1));
        setRequeteExOpacity((prevOpacity) => (prevOpacity === 0 ? 1 : 0));
      }, 2000);
  
      return () => clearInterval(timer);
    }
    else if (currentStep === 3) {
      const timer = setInterval(() => {
        setRangementButtonOpacity((prevOpacity) => (prevOpacity === 1 ? 0 : 1));
        setContenuRangementOpacity((prevOpacity) => (prevOpacity === 0 ? 1 : 0));
      }, 2000);
  
      return () => clearInterval(timer);
    }
  }, [currentStep]);
/**
 * Fonction pour gérer le clic sur le bouton de reprise du tutoriel.
 */
  const handleButtonResumeClick = () => {
    if (currentStep === 0) {
      // Si currentStep est 0, passer à l'étape suivante
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Si currentStep est 1, passer à l'étape suivante
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Si currentStep est 2,  passer à l'étape suivante
      setCurrentStep(3);
    }
    else if (currentStep === 3) {
      // Si currentStep est 3,  passer à l'étape suivante
      setCurrentStep(4);
    }
    else if (currentStep === 4) {
      // Si currentStep est 4, déclencher handleButtonResumeClick
      resumeGame();
    }
  };
/**
 * renvoie a MenuEleve.
 */
  const handleButtonQuitClick = () => {
    saveData();
    window.location.replace('/MenuEleve');
  };
/**
 * Obtient le texte du tutoriel en fonction de l'étape actuelle.
 * @returns {string} Texte du tutoriel.
 */
  const getTutorialText = () => {
    if (currentStep === 0) {
      return "Suis les étapes de la feuille de recette.";
    } else if (currentStep === 1) {
      return "Récupère des blocs dans chaque catégorie.";
    } else if (currentStep === 2) {
      return "Rectifie tes erreurs grâce au journal d'erreurs.";
    }
    else if (currentStep === 3) {
      return "Clique sur les rangements pour consulter leur contenu.";
    }
    else if (currentStep === 4) {
      return "Toi et ton coéquipier jouez chacun votre tour.";
    }
  };
/**
 * Obtient le texte du tutoriel en fonction de l'étape actuelle.
 * @returns {string} Texte du tutoriel.
 */
  const getTutorialText2 = () => {
    if (currentStep === 0) {
      return "Le texte de l'étape passe en vert quand elle est validée.";
    } else if (currentStep === 1) {
      return "Forme grâce à eux une requête pour chaque étape.";
    } else if (currentStep === 2) {
      return "Attention, c'est l'échec si trop d'erreurs !";
    }
    else if (currentStep === 3) {
      return "Les ingrédients ne sont pas des colonnes mais des valeurs de la colonne nom ! Ex : SELECT * FROM tiroir WHERE nom=farine;";
    }
    else if (currentStep === 4) {
      return "Si tu vois un écran d'attente, c'est au tour de ton coéquipier. Sinon, c'est que tu peux foncer !";
    }
  };
/**
 * Obtient l'image correspondante à l'étape actuelle.
 * @returns {string} Chemin de l'image.
 */
  const getImage1 = () => {
    if (currentStep === 0) {
      return recetteFeuille1;
    }
    else if(currentStep===1){
      return whereButton;
    }
    else if(currentStep===2){
      return journalButton;
    }
    else if(currentStep===3){
      return rangementButton;
    }
    else if (currentStep === 4) {
      return null; // Retourner null si l'étape est égale à 4
    }
  };

  /**
 * Obtient l'image correspondante à l'étape actuelle.
 * @returns {string} Chemin de l'image.
 */
  const getImage2 = () => {
    if (currentStep === 0) {
      return imageSource;
    }
    else if(currentStep===1){
      return requeteEx;
    }
    else if(currentStep===2){
      return journalButton;
    }
    else if(currentStep===3){
      return contenuRangement;
    }
    else if (currentStep === 4) {
      return null; // Retourner null si l'étape est égale à 4
    }
  };
/**
 * Obtient la classe CSS correspondante à l'image de l'étape actuelle.
 * @returns {string} Classe CSS.
 */
  const getImage1class = () => {
    if (currentStep === 0) {
      return 'tuto-feuille';
    } 
    else if (currentStep===1){
      return `whereButton ${whereButtonOpacity === 1 ? 'visible' : 'hidden'}`;
    }
    else if (currentStep===3){
      return `whereButton ${rangementButtonOpacity === 1 ? 'visible' : 'hidden'}`;
    }
  };
/**
 * Obtient la classe CSS correspondante à l'image de l'étape actuelle.
 * @returns {string} Classe CSS.
 */
  const getImage2class = () => {
    if (currentStep === 0) {
        if(imageSource===recetteFeuille1){
            return 'tuto-feuille2-base';
        }
        else{
            return 'tuto-feuille2-act';
        }
    } 
    else if (currentStep===1){
      return `requete-ex ${requeteExOpacity === 1 ? 'visible' : 'hidden'}`;
    }
    else if(currentStep===2){
      return 'journal-abs';
    }
    else if (currentStep===3){
      return `contenu-rangement ${contenuRangementOpacity === 1 ? 'visible' : 'hidden'}`;
    }
  };
/**
 * Fonction pour afficher les images du tutoriel en fonction de l'étape actuelle.
 */
  const TutorialImages = () => {
  if(currentStep===0 |currentStep===1 |currentStep===2 |currentStep===3 ){
    return (<><img
      src={getImage1()}
      className={`${getImage1class()}`}
      alt="Tutorial"
    />
    <img
      src={getImage2()}
      className={`${getImage2class()}`}
      alt="Tutorial"
    /></> );
  }
  }

  return (
    <div className='tuto'>
      <div className='background'></div>
      <div className='window big'>
        <h1>TUTORIEL</h1>
        <h2 className='text-tuto'>{getTutorialText()}</h2>
        <TutorialImages />
        <h2 className='text-tuto'>{getTutorialText2()}</h2>
        <button className='button' onClick={handleButtonResumeClick}>
          {currentStep === 4 ? "GO !" : "SUIVANT"}
        </button>
        
        <button className='button' onClick={handleButtonQuitClick}>
            QUITTER
        </button>
        
      </div>
    </div>
  );
};

export default SQuisineTuto;
