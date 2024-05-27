// Qcm.js
import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../component/NavBar';
import PopupWindow from '../component/PopupWindow';
import questionsDataBash from '../component/Qcm/questions.json';
import questionsDataSQL from '../component/Qcm/sqlQuestions.json';
import questionsDataResaux from '../component/Qcm/questionsResaux.json';
import questionsDataPython from '../component/Qcm/questionsPython.json';
import correctImage from '../img/valider.png';
import incorrectImage from '../img/croixRouge.png';
import "../styles/qcm.css";
import { useNavigate } from 'react-router-dom';
import { DataContext} from "../DataProvider";
import Informatico from '../component/Informatico';


const Qcm = () => {
  // Utilisez useLocation pour accéder aux paramètres de l'URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qcmType = queryParams.get('type'); //change en fonction de l'url qui donne la matiere
  const [questionsGenere, setQuestionsGenere] = useState(true);

  let questionsData;
  if (qcmType === 'sql') {
    questionsData = questionsDataSQL;
  } else if (qcmType === 'resaux') {
    questionsData = questionsDataResaux;
  } else if (qcmType === 'bash'){
    questionsData = questionsDataBash;
  }else if(qcmType === 'python'){
    questionsData = questionsDataPython;
  }

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [action, setAction] = useState('');
  const [actionReturn, setActionReturn] = useState(() => {});
  const [closePopup, setClosePopup] = useState(() => {});
  const [messagebutton, setbuttonmessage] = useState('');
  const [showCorrection, setShowCorrection] = useState(false);
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState(Array(questionsData.length).fill(null));
  const[QcmFait,setQcmFait] = useState(false);
  const { majQcm, isConnected } = useContext(DataContext);
  // Utilisez le type de QCM pour déterminer quelle source de données utiliser
  const [showInformatico, setShowInformatico] = useState(false);
  const [informaticoContext, setInformaticoContext] = useState('');
/**
 * Gère la fermeture de la fenêtre contextuelle.
 */
  const handleClosePopup = () => {
    setShowPopup(false);
  };
/**
 * Gère la fermeture de la fenêtre de informatico.
 */
  const handleCloseInformatico = () => {
    setShowInformatico(false);
  }
/**
 * Gère la fermeture de la pop up.
 * si la correction est false alors remonte en haut de la page et mets la correction a true.
 */
  const handleClosePopupCorrection = () => {
    setShowPopup(false);
    if(!showCorrection){
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShowCorrection(true);
    }
  }
/**
 * Gère la fermeture de la pop up.
 * si la correction est false alors remonte en haut de la page et mets la correction a true.
 */
  const handlePopupButtonClick = () => {
    setShowPopup(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowCorrection(true);
  };
/**
 * Affiche une fenêtre contextuelle avec le titre et le message spécifiés.
 * @param {string} title - Le titre de la fenêtre contextuelle.
 * @param {string} message - Le message à afficher dans la fenêtre contextuelle.
 */
  const handleShowPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setAction("button");
    setShowPopup(true);
  };
/**
 * Gère le changement de réponse pour une question spécifique.
 * @param {number} index - L'index de la question dont la réponse est modifiée.
 * @param {string} answer - La nouvelle réponse à attribuer à la question.
 */
  const handleAnswerChange = (index, answer) => {
    if(!showCorrection){
      setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = answer;
      return newAnswers;
    });
    }
  };
/**
 * Gère l'ouverture de la pop up.
 */
  const handleQuit = () => {
    setPopupTitle('Attention');
    setPopupMessage('Vous êtes sur le point de quitter ce qcm. Voulez-vous vraiment continuer ?')
    setAction('button-red');
    setbuttonmessage('Quitter');
    setActionReturn(()=>quitter);
    setClosePopup(()=>handleClosePopup);
    setShowPopup(true);
  }
/**
 * Gère la soumission du QCM.
 * Si le QCM n'a pas encore été complété, calcule le score, met à jour le statut du QCM et affiche un message approprié.
 * Si le QCM a déjà été complété, affiche un message de confirmation pour quitter la correction.
 */
  const handleSubmit = () => {
    if(!QcmFait){
    setQcmFait(true);
    const correctAnswers = questionsData.map((question) => question.correctIndex);
    const score = userAnswers.reduce((totalScore, userAnswer, index) => {
      return userAnswer === correctAnswers[index] ? totalScore + 1 : totalScore;
    }, 0);
    if(qcmType === 'sql'){
      majQcm('SQuisine',score);
    }else if(qcmType === 'bash'){
      majQcm('shellHunt',score);
    }else if(qcmType === 'resaux'){
      majQcm('resofkingdom',score);
    }else if(qcmType === 'python'){
      majQcm('TurtleGame',score);
    }
    if (score >= 5) {
      handleShowPopup("Bravo", "Tu as eu: " + score + " sur 10.");
      setbuttonmessage("Correction");
      setAction('button');
      setClosePopup(()=>handleClosePopupCorrection);
      setActionReturn(() => handlePopupButtonClick);
      setShowInformatico(true)
      setInformaticoContext('highScore');
    } else {
      handleShowPopup("Dommage", "Tu as eu: " + score + " sur 10.");
      setbuttonmessage("Correction");
      setAction('button');
      setClosePopup(()=>handleClosePopupCorrection);
      setActionReturn(() => handlePopupButtonClick);
      setShowInformatico(true)
      setInformaticoContext('lowScore');
    }
  }else{
    handleShowPopup("Quitter");
    setPopupMessage("Voulez-vous vraiment quitter la correction et retourner à l'accueil ?")
    setbuttonmessage("Quitter");
    setAction('button-red');
    setClosePopup(()=>handleClosePopupCorrection);
    setActionReturn(() => quitter);
  }
  };
/**
 * Renvoie au MenuEleve.
 */
  const quitter = () =>{
    navigate('/MenuEleve');
  }
  //empeche l'accés si deconecté.
  if (!isConnected) {
    return (
      <div className='unauthorized'>
        <header className='App-header'>
        <NavBar showSignUpButton={false}/>
      </header>
      <main>
        <h1>Vous n'avez pas accès à cette page</h1>
      </main>
      </div>
    );
  }

/**
 * Génère aléatoirement un ensemble de questions à partir des données disponibles si les questions ont été générées.
 */
  const GenereQuestions = () =>{
    if(questionsGenere){
      const getRandomQuestions = (questionsArray, count) => {
        const shuffled = questionsArray.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };
      questionsData = getRandomQuestions(questionsData, 10);
    }
  }

  return (
    <div className='QCM'>
      <header>
        <NavBar />
      </header>
      <div className='title'>
      <button className='small-button back' onClick={handleQuit}></button>
      <h1>Quiz</h1>
      </div>
      

      {showPopup && (
        <PopupWindow closePopup={closePopup} title={popupTitle} message={popupMessage} action={action} returnAction={actionReturn} messagebutton={messagebutton}/>
      )}

      {questionsData.map((question, index) => (
        <div className='question' key={index}>
          <p>
            {question.question}
            {showCorrection && userAnswers[index] !== null && (
              <img
                src={userAnswers[index] === question.correctIndex ? correctImage : incorrectImage} //affiche une image selon la reponse
                alt={userAnswers[index] === question.correctIndex ? 'Correct' : 'Incorrect'} 
                className='correction-image'
              />
            )}
          </p>
          <div className='options-container'>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className='option' onClick={() => handleAnswerChange(index, optionIndex)}
              >
                <input
                  type='radio'
                  id={`option-${index}-${optionIndex}`}
                  name={`question-${index}`} 
                  onChange={() => handleAnswerChange(index, optionIndex)}
                  checked={userAnswers[index] === optionIndex} // Cochez le bouton radio si la réponse est sélectionnée
                  disabled={showCorrection} //rends inutilisable pendant la correction
                />
                <label htmlFor={`option-${index}-${optionIndex}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
          {showCorrection && userAnswers[index] !== null && ( //affiche la correction
            <span className={`correction-text ${userAnswers[index] === question.correctIndex ? 'correct' : 'incorrect'}`}>
              {userAnswers[index] === question.correctIndex ? '' : 'La bonne reponse était : ' + question.options[question.correctIndex]}
            </span>
          )}
        </div>
      ))}

      <button className='button' onClick={handleSubmit}>
        {showCorrection ? 'Retour' : 'Valider'}
      </button>
      {showInformatico && <Informatico closeWindow={handleCloseInformatico} page={'QCM'} context={informaticoContext} clickToShow={true}/>}
    </div>
  );
};

export default Qcm;

