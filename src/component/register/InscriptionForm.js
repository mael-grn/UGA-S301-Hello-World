import React, { useState, useContext } from 'react';
import PopupWindow from '../PopupWindow';
import { DataContext } from "../../DataProvider";
import { useNavigate, Link  } from 'react-router-dom';
import emailjs from '@emailjs/browser';

/**
 * formulaire d'inscription. 
 * isTeacher est un parametre permettant d'indiquer si le profil est professeur. 
 * Le formulaire s'adaptera à cette variable.
 * Go back corresponds à l'action du bouton retours
 * @param {*} param0 
 */
const InscriptionForm = ({ isTeacher, goBack }) => {

  //on récupère la fonction permettant d'envoyer la demande d'inscription au serveur
  const { register } = useContext(DataContext);

  const navigate = useNavigate();

  //permet de stocker les données du formulaire. Ces données sont mises à jours à l'instant ou l'utilisateur appuis sur une touche
  const [formData, setFormData] = useState({
    prenom: '',
    nom:'',
    dateNaiss: '',
    password: '',
    passwordconf: '',
    ageLegal: false,
  });

  //variable d'etat permettant de controler si la fenetre popup doit etre affichée. D'autre variable d'etat permettent de stocker le message
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupMail, setShowPopupMail] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [action, setAction] = useState('');
  const [actionReturn, setActionReturn] = useState(() => {});
  const [messagebutton, setbuttonmessage] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwdVisib, setPasswdVisib] = useState('password');



  //permet de mettre à jour instantanement les données du formulaire (formData) avec la donnée contenue dans event (l'element appelant, ici input)
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleChangebox = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  /**
   * permet d'envoyer un mail à une certaine adresse mail
   * @param {*} input l'addresse mail a qui on veux envoyer un mail
   */
  const envoiMail = (input) => {
    setLoading(true);
    const nom = formData.prenom + ' ' + formData.nom;
    var templateParams = {
      to_mail:input,
      name: nom,
      notes: 'Check this out!'
  };
  
    emailjs.send('service_6sfd35c','template_c9byvcf',templateParams,'z4N-Mi6CR_n1wWq9-') 
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      setLoading(false);
      setAction('');
      setPopupTitle('Vérification parentale');
      setPopupMessage('Email envoyé !');
      setShowPopup(true);  
      setTimeout(function() {
        setShowPopup(false);
        navigate('/');
       }, 2000);
          
   }, function(error) {
      console.log('FAILED...', error);
      setLoading(false);
      setAction('');
      setPopupTitle('Vérification parentale');
      setPopupMessage('Email incorrect');
      setShowPopup(true);  
      setTimeout(function() {
        setShowPopup(false);
       }, 2000);
   });
   setShowPopup(false);
  
  }

 
  

/**
 * Gère la soumission du formulaire d'inscription.
 * @param {Event} event - L'événement de soumission du formulaire.
 */
  const handleSubmit = (event) => {
    //empecher le rechargement de la page
    event.preventDefault();

    // Traitement des données du formulaire

    //calcul de l'age selon la date de naissance
    const birthDate = new Date(formData.dateNaiss);
    const currentDate = new Date();
    const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
        //traitement des cas généraux (professeur et étudiant) :
    if(formData.prenom.length<1){
      setAction('');
      setShowPopup(true);
      setPopupTitle('Erreur de prénom');
      setPopupMessage('Le prénom ne peut pas être vide.');
      return;
    }
    if (formData.nom.length <1){
      setAction('');
      setShowPopup(true);
      setPopupTitle('Erreur de nom');
      setPopupMessage('Le nom ne peut pas être vide.');
      return;
    }
    //traitement du cas ou le profil est professeur
    if (isTeacher) {
      //affichage d'un message s'il a moins de 18 ans
      if (ageDifference < 18) {
        setShowPopup(true);
        setPopupTitle("Erreur d'âge");
        setPopupMessage('Vous devez avoir au moins 18 ans pour vous inscrire en tant que professeur.');
        return;
      }

    } else {
      //traitement du cas ou le profil est étudiant

      //affichage d'un message s'il a moins de 15 ans (plus tard deviendra l'envoie d'un email aux parents)
      if (ageDifference < 15 || !formData.ageLegal) {
        setAction('input');
        setActionReturn(() => envoiMail);
        setbuttonmessage('Valider');
        setShowPopup(true);
        setPopupTitle("Erreur d'âge");
        setPopupMessage('Vous avez moins de 15 ans. L\'accord parental est obligatoire. Merci de saisir l\'email d\'un responsable légal :');
        return;
      }
    }


    if(formData.dateNaiss.length<1){
      setAction('');
      setShowPopup(true);
      setPopupTitle('Erreur de date de naissance');
      setPopupMessage('La date de naissance ne peut pas être vide.');
      return;
    }
    // Vérifier si le mot de passe fait au moins 5 caratères
    if (formData.password.length < 5) {
      setAction('');
      setShowPopup(true);
      setPopupTitle('Erreur de mot de passe');
      setPopupMessage('Le mot de passe doit faire au moins 5 caractères.');
      return;
    }

    // Vérifier si les mots de passe correspondent
    if (formData.password !== formData.passwordconf) {
      setAction('');
      setShowPopup(true);
      setPopupTitle('Erreur de mot de passe');
      setPopupMessage('Les mots de passe ne correspondent pas.');
      return;
    }


    setLoading(true);
    register(formData.prenom, formData.nom, formData.dateNaiss, isTeacher, formData.password,true).then(result => {

      if (!result) {
        setLoading(false);
        setShowPopup(true);
        setPopupTitle('Erreur');
        setPopupMessage('Une erreur s\'est produite lors de l\'inscription. Veuillez nous excuser pour la gêne occasionnée.');
      }
    
    }).catch(error => {
      setLoading(false);
      setShowPopup(true);
      if (error.code === "ERR_NETWORK") {
        
        setPopupTitle('Erreur');
        setPopupMessage('Une erreur s\'est produite lors de la connexion au serveur');
      } else {
        setPopupTitle('Erreur');
        setPopupMessage('Une erreur s\'est, produite, et le serveur à renvoyé le message suivant : ' + error.message);
      }
      
    });  
  };
  
  
  
  //fonction pour fermer la fenetre popup
  const closePopup = () => {
    setShowPopup(false);
  };

  //permet de rendre le mot de passe visible ou invisible
  const togglePasswdVisibility = () => {
    if (passwdVisib === 'password') {
      setPasswdVisib('test');
    } else {
      setPasswdVisib('password');
    }
  }

  return (
    <div className='inscriptionForm'>
      <div className='top-info'>
        <button className='back' onClick={() => goBack()}></button>
        <h1 className='message'>Merci de saisir vos informations :</h1>
      </div>
      
      
      <form className='form appears' onSubmit={handleSubmit}>
        <label>
          Prénom* :
          {/* Ajout de la classe invalid-input si le prénom est vide */}
          <input
            type="text"
            placeholder='ex: Laurent'
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Nom* :
          {/* Ajout de la classe invalid-input si le nom est vide */}
          <input
            type="text"
            placeholder='ex: Bonnaud'
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Date de naissance* :
          {/* Ajout de la classe invalid-input si la date de naissance est vide */}
          <input
            type="date"
            placeholder='ex: 01/01/1970'
            name="dateNaiss"
            value={formData.dateNaiss}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Mot de passe* :
          {/* Ajout de la classe invalid-input si le mot de passe est vide */}
          <input
            type={passwdVisib}
            placeholder='ex: JaimeLeReso123'
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type='button' className={passwdVisib === 'password' ? 'small-button hide-btn' : 'small-button view-btn'} onClick={togglePasswdVisibility}></button>
          
        </label>
        <br/>
        <label>
          Confirmer mot de passe* :
          {/* Ajout de la classe invalid-input si la confirmation du mot de passe est vide */}
          <input
            type={passwdVisib}
            placeholder='ex: JaimeLeReso123'
            name="passwordconf"
            value={formData.passwordconf}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        {/* affichage de la case permettant à l'utilisateur d'indiquer qu'il a plus de 15 ans seulement s'il n'est pas un professeur */}
        {!isTeacher && (
          <label>
            Je certifie avoir plus de 15 ans :
            <input
              type="checkbox"
              name="ageLegal"
              checked={formData.ageLegal}
              onChange={handleChangebox}
            />
          </label>
        )}
        <br/>
        <p>Les champs munis d'un * sont obligatoires</p>
        <p>En vous inscrivant, vous acceptez notre <Link to="/confidentiality">politique de confidentialité</Link> </p>
        <br />
        <button onClick={handleSubmit} className='button'>Inscription</button>
      </form>
      {/* Affichage de la fenêtre popup en fonction de la variable d'état showPopup */}
      {showPopup && <PopupWindow closePopup={closePopup} title={popupTitle} message={popupMessage} action={action} returnAction={actionReturn} messagebutton={messagebutton}/>}
      {showPopupMail && <PopupWindow closePopup={closePopup} title={popupTitle} message={popupMessage} action={action} returnAction={actionReturn} messagebutton={messagebutton}/>}
      {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Chargement en cours...</span>
          </div>}
    </div>
  );
};

export default InscriptionForm;