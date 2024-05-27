import React, { useState, useEffect } from 'react';
import '../styles/PopupWindow.css';

const PopupWindow = ({ closePopup, title, message, action, returnAction, messagebutton }) => {

  const [input, setInput] = useState('');
  const [closing, setClosing] = useState(false);

/**
 * Gère le changement de valeur de l'input.
 * Met à jour la variable d'état 'input' avec la nouvelle valeur.
 * @param {*} event - L'événement de changement de l'input.
 */
  const handleChange = (event) => {
    const { value } = event.target;
    setInput(value);
  };
/**
 * Soumet le formulaire en appelant la fonction 'returnAction' avec la valeur actuelle de l'input.
 * @returns {void}
 */
  const handleSubmit = () => {
    returnAction(input);
  };
/**
 * Initialise le processus de fermeture.
 * @returns {void}
 */
  const handleQuit = () => {
    setClosing(true);
  }

/**
 * Gère le processus de fermeture de la fenêtre contextuelle.
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

          {action === 'input' && (
            <form onSubmit={handleSubmit}>
              <input type="text" value={input} onChange={handleChange} placeholder='Saisir ici' required />
              <br />
              <button type="submit" className='button'>Envoyer</button>
            </form>
          )}

          {(action === 'button'||action === 'button-red') && (
            <div>
              <button className={action} onClick={returnAction}>{messagebutton}</button>
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

export default PopupWindow;
