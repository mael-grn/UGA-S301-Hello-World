import React, { useState, useContext } from 'react';
import PopupWindow from '../PopupWindow';
import { DataContext } from "../../DataProvider";
import { useNavigate, Link } from 'react-router-dom';

/**
 * 
 *  Component consistant en un formulaire de création de groupe
 */
const CreateGroupForm = () => {
  const { userName, addGroup } = useContext(DataContext);
  const [formGroupe, setFormData] = useState({
    nomGroupe: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupAction, setPopupAction] = useState(false);
  const [popupReturnAction, setPopupReturnAction] = useState(false);
  const [popupMessageButton, setPopupMessageButton] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * permet de mettre a jours les données du formulaire, dès que des informations sont rentrées dans les inputs
   * @param {*} event corresponds à l'input depuis laquelle la fonction est appelée. Le texte est directement récupéré 
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formGroupe, [name]: value });
  };

  const retourMenu = () => {
    navigate('/MenuProf');
  }

  /**
   * Permet d'envoyer les données au serveur (via DataProvider)
   * Traitement des erreurs de saisie ou du serveur.
   * @param {*} event corresponds à l'element appelant la fonction. Permet d'empecher l'envoie du formulaire par défaut.
   */
  const handleSubmit = (event) => {
    //empeche le traitement par defaut. Notament utile pour firefox, qui annule les requetes suivant l'envoi du formulaire
    event.preventDefault();
    setLoading(true);

    //reception de la promesse
    addGroup(formGroupe.nomGroupe).then(result => {
      //on arrete le chargement
      setLoading(false);
      if (result) {
        setShowPopup(true);
        setPopupTitle('Groupe créé');
        setPopupMessage('Votre groupe à été créé avec succès ! Vous pouvez dès maintenant de retrouver dans votre liste de groupe');
        setPopupAction('button');
        setPopupMessageButton('Retourner au menu');
        setPopupReturnAction(() => retourMenu);

      }
    }).catch(error => {
      //traitement du cas d'erreur, et envoi d'une popup contenant des informations pertinentes suivant l'erreur
      setLoading(false);
      if (error.response && error.response.request.status === 500) {
        setShowPopup(true);
        setPopupTitle('Erreur');
        setPopupMessage('Ce groupe existe déjà, veuillez choisir un autre nom');
      } else {
        setShowPopup(true);
        setPopupTitle('Erreur');
        setPopupMessage('Une erreur s\'est produite dans la création du groupe');
      }
    });  
    
  };

  //simple fonction permettant de fermet la fenetre popup
  const closePopup = () => {
    setShowPopup(false);
    formGroupe.nomGroupe = '';
  };

  return (
    <div className='createGroupForm'>
      <div className='top-info'>
      <Link to="/MenuProf">
                <button className='back button'></button>
        </Link>
        <h1>Créer un groupe</h1>
      </div>
      <p className='message'>Merci de saisir les informations :</p>
        
        <form onSubmit={handleSubmit} className='form'>
          <label>
            Nom groupe* :
            <br/>
            <input type="text" name="nomGroupe" value={formGroupe.nomGroupe} onChange={handleChange} placeholder='ex: terminal A' required />
          </label>
          <br />

          <p>* champ obligatoire</p>
        
          <button type="submit" className='button'>Créer</button>
        </form>
        {showPopup && <PopupWindow closePopup={closePopup} title={popupTitle} message={popupMessage} action={popupAction} returnAction={popupReturnAction} messagebutton={popupMessageButton}/>}
        {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Chargement en cours...</span>
          </div>}
    </div>
  );
}

export default CreateGroupForm;
