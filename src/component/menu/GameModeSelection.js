
import React, { useState, useContext } from 'react';
import { DataContext } from '../../DataProvider';

/**
 * component affichant la selection du profil de l'utilisateur. Les deux fonction en parametre servent a activer le type de profil selon la selection de l'utilisateur
 * @param {*} select1 l'action à executé si l'utilisateur selectionne la premiere option
 * @param {*} select2 l'action à executé si l'utilisateur selectionne la deuxieme option
 * @param {*} message1 le texte à aficher pour la premiere option
 * @param {*} message2 le texte à aficher pour la premiere option
 * @param {*} backAction l'action à executé si l'utilisateur selectionne le bouton pour retourner en arrière
 */
const ProfilSelection = ({select1, select2, message1, message2, backAction}) => {

    const  {group} = useContext(DataContext);

    return (
        <div className='game-mode'>
            {backAction && <button onClick={backAction} className='small-button back'></button>}
            <h1>
                Selectionnez votre mode de jeu
            </h1>
            <div className='button-profil-sel'>
            <button onClick={() => select1()} className='button'>{message1}</button>
            
            <button
                onClick={() => select2()}
                disabled={message2 === 'Jouer en ligne' && (group === 'undefined' || group === 'null')}
                className='button'
                >
                {message2}
            </button>


            </div>
      </div>
    )
}
export default ProfilSelection;