import React, { useState, useEffect,useContext } from 'react';
import '../styles/PopupWindow.css';
import { DataContext } from "../DataProvider";

const ProfilWindow = ({ closePopup, title, message, action, returnAction, messagebutton,supprCompte }) => {

  const [input, setInput] = useState('');
  const [closing, setClosing] = useState(false);
  const { deleteUserAcc } = useContext(DataContext);
/**
 * Met à jour la valeur de l'entrée en fonction de l'événement de changement.
 * @param {*} event L'événement de changement de saisie.
 */
  const handleChange = (event) => {
    const { value } = event.target;
    setInput(value);
  };
/**
 * Déclenche le processus de fermeture de la fenêtre contextuelle.
 */
  const handleQuit = () => {
    setClosing(true);
  }
/**
 * Supprime le compte de l'utilisateur.
 */
  const handleSupprimer = () => {
    supprCompte();
  }

/**
 * Si la fermeture est activée, attend 300 millisecondes, puis ferme la fenêtre contextuelle.
 */
  useEffect(()=> {
    if (closing) {
      setTimeout(() => {
        closePopup();
      }, 300);
    }
  }, [closing])

  return (
    <div className="popup">
      <div className={closing ? "closing-background" : "background"}></div>
      <div className={closing ? "closing-window" : "window"}>
        
        <h1>{title}</h1>

        <div className='content'>
          {Array.isArray(message) ? (
            <ul className='message-list'>
              {message.map((item, index) => (
                <li key={index}>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>{message}</p>
          )}


          {action === 'button' && (
            <div>
              <button className='button' onClick={returnAction}>{messagebutton}</button>
              {messagebutton === "Déconnexion" && (
                <button className='button-red' onClick={handleSupprimer}>Supprimer votre compte</button>
              )}
            </div>
            
          )}
        </div>
        <div className='close-button'>
          <button onClick={handleQuit}></button>
        </div>
      </div>
    </div>
  );
};

export default ProfilWindow;
