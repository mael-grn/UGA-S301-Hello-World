import React, { useState, useEffect, useContext } from 'react';
import '../styles/informatico.css';
import phrasesData from './phrasesInformatico.json';
import { ReactTyped } from 'react-typed';
import { DataContext } from '../DataProvider';

const Informatico = ({ page, context, closeWindow, clickToShow = false}) => {
  const phrases = phrasesData[page][context] || [];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [endOfDiscussion, setEndOfDiscussion] = useState(false);
  const [showContent, setShowContent] = useState(!clickToShow);
  const [closing, setClosing] = useState(false);
  const {addInformaticoSentence, checkInformaticoSentence} = useContext(DataContext);
  const [canDisplay, setCanDisplay] = useState(false);
  /**
   * Gère le clic sur le bouton.
   */
  const handleComprisClick = () => {
    // Si nous ne sommes pas à la dernière phrase, passez à la suivante
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    } else {
      setClosing(true);
    }

    //on change le bouton quand c'est la fin de la discussion
    if ((currentPhraseIndex+1) >= phrases.length-1) {
      setEndOfDiscussion(true);
      
    }

    // Mettre à jour la clé pour forcer un remontage de ReactTyped
    setKey(key + 1);
  };
/**
 * Affiche le contenu en mettant à jour le state.
 */
  const handleShowContent = () => {
    setShowContent(true);
  }
/**
 * Utilise le hook useEffect pour vérifier une phrase informatique dans le contexte.
 * Met à jour le state pour permettre ou non l'affichage.
 */
  useEffect(() => {
    checkInformaticoSentence(context).then(result => {
      setCanDisplay(result);
    }).catch(error => {
      setCanDisplay(false);
    }); 
  }, []);
/**
 * Utilise le hook useEffect pour réinitialiser la clé et le statut de fermeture à chaque changement de phrase.
 * @param {number} currentPhraseIndex - L'index de la phrase actuelle.
 */
  useEffect(() => {
    // Réinitialiser la clé à chaque changement de phrase
    setKey(0);
    setClosing(false);
  }, [currentPhraseIndex]);

/**
 * Utilise le hook useEffect pour effectuer des actions lorsque le statut de fermeture change.
 * @param {boolean} closing - Le statut de fermeture.
 */  
useEffect(()=> {
    if (closing) {
      setTimeout(() => {
        addInformaticoSentence(context);
        closeWindow();
      }, 500);
    }
  }, [closing])

  
  
  return (
    <>
    {canDisplay && (
    
    <div className={closing ? "closing-info Informatico" : "Informatico"}>
      {
        showContent &&
        <div className='message'>
          <p>
            {phrases.length > 0 ? (
              <ReactTyped key={key} strings={[phrases[currentPhraseIndex]]} typeSpeed={10} />
            ) : (
              <ReactTyped
                strings={[
                  'Oups, les développeurs ont mal fait leur travail, ils ne m\'ont pas dit quoi te raconter... Enfin bref, tu sais qu\'il faut empiler trois girafes pour faire la taille d\'un diplodocus ?'
                ]}
                typeSpeed={10}
              />
            )}
          </p>
          
          <button className='small-button next' onClick={handleComprisClick}>
            {(endOfDiscussion||(phrases.length <= 0)) ? "Fermer" : "suivant"}
          </button>
        </div>
      }
      

      <div className={'profile'}>
        {
          showContent &&
          <h2>Informatico</h2>
        }
        <button className={showContent ? page + '-talking picture-talking' : page + ' picture vibrate' } onClick={handleShowContent} ></button>
      </div>
    </div>
    )}
    </>
 
  );
};

export default Informatico;
