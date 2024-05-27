
import React, { useState, useContext } from 'react';

//component affichant la selection du profil de l'utilisateur. Les deux fonction en parametre servent a activer le type de profil selon la selection de l'utilisateur

const SetItem = ({ onCloseSetItem, infoItem, deleteItem}) => {



  const handleButtonCloseClick = () => {
    onCloseSetItem();
  }

  const [formData, setFormData] = useState({
    ip: infoItem.ip,
    masque: infoItem.masque,
});
/**
 * Gère le changement de valeur dans les champs de formulaire.
 * @param {Object} event - L'événement de changement.
 */
const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
/**
 * Gère la définition des informations (IP, masque, attaque, etc.) pour un élément.
 * @param {Object} event - L'événement de soumission du formulaire.
 */
const handleSetInfo = async (event) => {
  event.preventDefault();
  infoItem.ip = formData.ip;
  infoItem.masque = formData.masque;
  infoItem.attaque = false;
  onCloseSetItem();
}
/**
 * Gère la suppression d'un élément.
 * @param {Object} event - L'événement de soumission du formulaire.
 */
const handleDeleteItem = async (event) => {
  event.preventDefault();
  deleteItem(infoItem.nom);
  onCloseSetItem();
}
  return (
    <div className='setPC'>
      <div className='close-button'>
          <button onClick={handleButtonCloseClick}></button>
        </div>
      <h2>Configuration de {infoItem.nom}</h2>
      <form className='form appears'>
        <label>
          IP :
          <br/>
          <input type="text" placeholder='192.168.1.1' name="ip" value={formData.ip} onChange={handleChange} />
        </label>
        <br />
        <label>
          Masque réseau :
          <br/>
          <input type="text" placeholder='255.255.255.192' name="masque" value={formData.masque} onChange={handleChange} />
        </label>
        <br />
        <button onClick={handleSetInfo} className='button'>Valider</button>
        <button onClick={handleDeleteItem} className='button-red'>Supprimer</button>
      </form>
    </div>
  );
};
export default SetItem;