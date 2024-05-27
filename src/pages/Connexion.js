
import React, { useState, useContext } from 'react';
import NavBar from '../component/NavBar';
import { DataContext } from "../DataProvider";
import PopupWindow from '../component/PopupWindow';
import { Link  } from "react-router-dom";


/**
 * cette page connecte un utilisateur déjà existant coté serveur. Le fonctionnement est similaire à celui de InscriptionForm,
 * s'y referrer en cas de probleme
 */

//Cette page gère l'inscription d'un utilisateur. Elle affiche au besoins la selection du profil, puis le formulaire en fonction du profil.

const Connexion = () => {

  const { login } = useContext(DataContext);

      //variable d'etat permettant de controler si la fenetre popup doit etre affichée. D'autre variable d'etat permettent de stocker le message
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [action] = useState('');
    const [actionReturn] = useState(() => {});
    const [loading, setLoading] = useState(false);
    const [passwdVisib, setPasswdVisib] = useState('password');
  

//permet de stocker les données du formulaire. Ces données sont mises à jours à l'instant ou l'utilisateur appuis sur une touche
/**
 * État contenant les données du formulaire.
 * @type {Object} formData - Objet représentant les données du formulaire.
 * @property {string} userName - Le nom d'utilisateur.
 * @property {string} password - Le mot de passe.
 * @type {function} setFormData - Fonction pour mettre à jour les données du formulaire.
 */
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
    });

    /**
     * @returns caca
     * ici il y a un caca
     */
    const closePopup = () => {
      setShowPopup(false);
    };
/**
 * change la visibilité du mot de passe entre masqué et affiché.
 */
    const togglePasswdVisibility = () => {
      if (passwdVisib === 'password') {
        setPasswdVisib('test');
      } else {
        setPasswdVisib('password');
      }
    }
/**
 * Gère les changements dans les champs du formulaire en mettant à jour les données du formulaire.
 * @param {Object} event - L'événement de changement déclenché par la saisie de l'utilisateur.
 */
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
/**
 * Gère la soumission du formulaire de connexion.
 * @param {Object} event - L'événement de soumission du formulaire.
 */
    const handleLogin = (event) => {
        event.preventDefault();

        if (formData.userName.length < 1) {
            setShowPopup(true);
            setPopupTitle("Erreur");
            setPopupMessage('Le nom d\'utilisateur ne doit pas être vide.');
            return;
        }

        if (formData.password.length < 1) {
            setShowPopup(true);
            setPopupTitle("Erreur");
            setPopupMessage('Le mot de passe ne doit pas être vide.');
            return;
        }

        setLoading(true);
        login(formData.userName, formData.password).then(result => {
          if (result) {
            setLoading(false);
          }
        }).catch(error => {
          setLoading(false);
          setShowPopup(true);
          setPopupTitle("Erreur");

          //si le code d'erreur est 401, alors cela veut dire que la connexion à été refusé pour de mauvais credentials.
          //Sinon, on affiche l'erreur
          if (error.response) {
            if (error.response.request.status  === 401) {
              setPopupMessage('Mot de passe ou nom d\'utilisateur incorrect');
            } else {
              setPopupMessage('Une erreur s\'est produite : \n' + (error.response.request.statusText || 'Not available'));
            }
          } else {
            if (error.code === 'ERR_NETWORK') {
              setPopupMessage('Une erreur s\'est produite lors de la connexion au serveur');
            } else {
              setPopupMessage(error.message);

            }
          }
        });
    }

    return (
        <div className='Connexion'>
        <header className='App-header'>
          <NavBar/>
        </header>
        
        <main>
          <div className='top-info'>
            <Link to="/">
              <button className='back'></button>
            </Link>
            <h1 className='message'>Merci de saisir vos informations  :</h1>
          </div>
        
      <form className='form appears' onSubmit={handleLogin}>
        <label>
          Login :
          <br/>
          {/* value contient les données mis à jours avec les données du formulaire. handleChange permets de automatiquement mettre a jours les données du formulaire lorsque l'utilisateur rentre de nouvelles données */}
          <input type="text" placeholder="nom d'utilisateur" name="userName" value={formData.userName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Mot de passe :
          <br/>
          <input type={passwdVisib} placeholder='mot de passe' name="password" value={formData.password} onChange={handleChange} required />
          <button type='button' className={passwdVisib === 'password' ? 'small-button hide-btn' : 'small-button view-btn'} onClick={togglePasswdVisibility}></button>
        </label>
        <br />
        <button onClick={handleLogin} className='button'>Connexion</button>
      </form>
      {/* Affichage de la fenetre popup en fonction de la variable d'etat showPopup */}
      {showPopup && <PopupWindow closePopup={closePopup} title={popupTitle} message={popupMessage} action={action} returnAction={actionReturn}/>}
      {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Chargement en cours...</span>
          </div>}
        </main>
      </div>
    )
}
export default Connexion;