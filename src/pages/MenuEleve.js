import React, { useState, useContext, useEffect } from 'react';
import NavBar from '../component/NavBar';
import PopupWindow from '../component/PopupWindow';
import { DataContext } from "../DataProvider";
import { useNavigate } from 'react-router-dom';
import GameModeSelection from '../component/menu/GameModeSelection';
import Informatico from '../component/Informatico';


const MenuEleve = () => {
  const { userName, group, qcmDone, isConnected } = useContext(DataContext);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [action, setAction] = useState('');
  const [actionReturn, setActionReturn] = useState(() => {});
  const [messagebutton, setbuttonmessage] = useState('');
  const [showInformatico, setShowInformatico] = useState(false);
  const [informaticoMessage, setInformaticoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [gameMode, setGameMode] = useState('');
  const navigate = useNavigate();
/**
 * Vérifie si l'utilisateur a déjà terminé le QCM pour un jeu spécifique, puis effectue une action en conséquence.
 * @param {string} game - Le jeu pour lequel vérifier la complétion du QCM.
 */
    const qcmFait = (game) =>{     
      
      setLoading(true);

      qcmDone(game).then(result => {
        if (!result) {
          setLoading(false);
          setShowPopup(true);
          setPopupTitle("Attention !");
          setPopupMessage("Tu dois faire le QCM avant d'aller jouer !");
          setAction('button');
          setbuttonmessage('QCM')
          if(game === 'SQuisine' || game === 'SQuisineSolo'){
            setActionReturn(() => allerAQcmSQL);
          }
          else if(game === 'SQuisineSolo'){
            setActionReturn(() => allerAQcmSQL);
          }else if(game === 'Resofkingdom'){
            setActionReturn(() => allerAQcmResaux);
          }else if(game === 'ShellHunt'){
            setActionReturn(() => allerAQcmBash);
          }else if(game === 'TurtleGame'){
            setActionReturn(() => allerAQcmPython);
          }
        } else {
          setLoading(false);
          navigate('/' + game);
        }
      }).catch(error => {
        setLoading(false);
        setAction('');
        handleShowPopup("Erreur", 'Une erreur s\'est, produite, et le serveur à renvoyé le message suivant : ' + error.message);
      });            
    }
/**
 * Vérifie si l'utilisateur a déjà terminé le QCM sans passer par le jeu pour un jeu spécifique, puis effectue une action en conséquence.
 * @param {string} game - Le jeu pour lequel vérifier la complétion du QCM en mode solo.
 */
    const qcmSeulFait = (game) =>{      
      setLoading(true);
      qcmDone(game).then(result => {
        if (!result) {
          setLoading(false);
          if(game === 'SQuisine'){
             allerAQcmSQL();
          }
          else if(game === 'SQuisineSolo'){
            allerAQcmSQL();
         }else if(game === 'Resofkingdom'){
            allerAQcmResaux();
          }else if(game === 'ShellHunt'){
            allerAQcmBash();
          }else if(game === 'TurtleGame'){
            allerAQcmPython();
          }
        } else {
          setLoading(false);
          setShowPopup(true);
          setPopupTitle("Déja Fait");
          setAction('');
          setPopupMessage("Ton score est de: " + result + "/10");      
          }
      }).catch(error => {
        setLoading(false);
        setShowPopup(true);
        setPopupTitle("Erreur");
        setAction('');
        setPopupMessage("Une erreur est survenue dans la récuperation du QCM");
      });            
    }
    const allerAQcmSQL = () =>{
      navigate('/qcm?type=sql');
    }
    const allerAQcmBash = () =>{
      navigate('/qcm?type=bash');
    }   
    const allerAQcmResaux = () =>{
      navigate('/qcm?type=resaux');
    }
    const allerAQcmPython = () =>{
      navigate('/qcm?type=python');
    }
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleShowPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowPopup(true);
  }

  const handleCloseInformatico = () => {
    setShowInformatico(false);
  }


  const selectQCM = () => {
    setGameMode('QCM');
  }

  const selectGame = () => {
    if (window.innerWidth < 767) {
      setShowPopup(true);
      setPopupTitle('Attention');
      setPopupMessage('Il semble que vous soyez sur mobile. Malheuresement, les jeux ne sont pas adaptés pour les interfaces tactiles. Reconnecte toi sur un ordinateur pour jouer !');
    } else {
      setGameMode('game');
    }
    
  }

  const selectOnline = () => {

    setShowPopup(true);
    setPopupTitle("Erreur");
    setPopupMessage("La fonctionnalité de jeu en ligne n'est plus disponible pour le moment. Veuillez nous excuser pour la gêne occasionnée.");
  }

  const selectSolo = () => {
    setGameMode('solo');
  }

  const resetGameMode = () => {
    setGameMode('');
  }

  useEffect(() => {
    setShowInformatico(true);
    setInformaticoMessage('FirstConnect');
    
  }, []);


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

  return (
    <div className='MenuEleve'>
      <header className='App-header'>
        <NavBar />
      </header>

        {showPopup && <PopupWindow closePopup={handleClosePopup} title={popupTitle} message={popupMessage} action={action} returnAction={actionReturn} messagebutton={messagebutton} />}

        <h1 className='welcome'>Bienvenue, {userName}</h1>
        <p>Groupe actuel : {(group !=='null' && group !== 'undefined') ? group : "Aucun pour l'instant, vous ne pouvez jouer qu'en solo"}</p>    
        
        {gameMode==='' ? <GameModeSelection select1={selectQCM} message1={"QCM"} select2={selectGame} message2={"JEUX"} /> :

          gameMode ==='QCM' ? 
            
            <div className='game-selection'>
              <h1>Choisissez un QCM</h1>
              <button onClick={resetGameMode} className='small-button back'></button>
              <button className='button' onClick={() => qcmSeulFait('SQuisine')}>SQL</button>
              <button className='button' onClick={() => qcmSeulFait('Resofkingdom')}>Reseau</button>
              <button className='button' onClick={() => qcmSeulFait('ShellHunt')}>Bash</button>
              <button className='button' onClick={() => qcmSeulFait('TurtleGame')}>Python</button>

            </div>
          
          : gameMode === 'game' ?

            <div>
              <GameModeSelection select1={selectSolo} message1={"Jouer en solo"} select2={selectOnline} message2={"Jouer en ligne"} backAction={resetGameMode}/> 
            </div>

          
          : gameMode === 'solo' ?
          
            <div className='game-selection'>
              <button onClick={selectGame} className='small-button back'></button>
              <h1>Ici, vous pouvez jouer en solo</h1>
              <button className='button' onClick={() => qcmFait('SQuisineSolo')}>SQuisine Lite</button>
              <button className='button' onClick={() => qcmFait('Resofkingdom')}>Res'of Kingdom</button>
              <button className='button' onClick={() => qcmFait('ShellHunt')}>ShellHunt</button>
              <button className='button' onClick={() => qcmFait('TurtleGame')}>TurtleGame</button>
            </div>
          :

            //mettre ici les boutons pour acceder aux jeux en ligne
            <div className='game-selection'>
              <button onClick={selectGame} className='small-button back'></button>
              <h1>Ici, vous pouvez jouer en ligne</h1>
              <button className='button' onClick={() => qcmFait('SQuisine')}>SQuisine Lite</button>
              {/* <button className='button' onClick={() => qcmFait('Resofkingdom')}>Res'of Kingdom</button>
              <button className='button' onClick={() => qcmFait('ShellHunt')}>ShellHunt</button>
              <button className='button' onClick={() => qcmFait('TurtleGame')}>TurtleGame</button> */}
            </div>
          
        }
        {showInformatico && <Informatico page={'MenuEleve'} context={informaticoMessage} closeWindow={handleCloseInformatico} clickToShow={true}/> } 
        {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Chargement en cours...</span>
          </div>}
    </div>
  );
};

export default MenuEleve;
