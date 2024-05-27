import React, { useState, useEffect, useContext } from 'react';
import * as Blocks from '../component/TurtleGame/Blocks';
import ForBlock from '../component/TurtleGame/ForBlock'; 
import GoToBlock from '../component/TurtleGame/GoToBlock'; 
import Informatico from '../component/Informatico';
import PauseMenu from '../component/PauseMenu';
import { useNavigate } from 'react-router-dom';
import PopupWindow from '../component/PopupWindow';


import CodeArea from '../component/TurtleGame/CodeArea';
import DrawingArea from '../component/TurtleGame/DrawingArea';
import interpretBlocks from '../component/TurtleGame/TurtleInterpreter'; 
import { DataContext } from '../DataProvider';
import NavBar from '../component/NavBar';


import '../styles/TurtleGame.css'; 

const TurtleGame = () => {
  const [code, setCode] = useState('');
  const [drawingLines, setDrawingLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [autoExecute, setAutoExecute] = useState(true); 
  const { isConnected } = useContext(DataContext);
  const [showInformatico, setShowInformatico] = useState(true);
  const [informaticoMessage, setInformaticoMessage] = useState('Tuto');
  const [showPause, setShowPause] = useState(false);
  const [compteAReboursActif, setCompteAReboursActif] = useState(true);
  const [tempsRestant, setTempsRestant] = useState(180);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState([]);
  const [showEcranFin, setShowEcranFin] = useState(false);
  const navigate = useNavigate();


  //Gestion Reponse//

  const [reponse, setReponse] = useState('');
  const [afficherReponse, setAfficherReponse] = useState(false);
  const [affichageTemporaireReponse, setAffichageTemporaireReponse] = useState(false);
  const [saisieReponse, setSaisieReponse] = useState('');
  const [messageErreur, setMessageErreur] = useState('');
  const [erreur, setErreur] = useState(1);
  //  const dessins = ['fleur','voiture','étoile','soleil','arbre','oiseau','maison','porte','ballon','glace','visage','bateau','verre'];

  const dessins = ['glace'];
  const dessinAleatoire = dessins[Math.floor(Math.random() * dessins.length)];

  const handleAfficherReponse = () => {
    setAffichageTemporaireReponse(!affichageTemporaireReponse);
  };

  const handleVerifierReponse = () => {
    if (saisieReponse.toLowerCase().includes(reponse.toLowerCase())) {
      // La réponse est correcte, affichez une pop-up de partie gagnée
      handleShowEcranFin("Partie gagnée!", "Félicitations!");
    } else {
      // La réponse est incorrecte, affichez un message d'erreur
      setErreur(erreur + 1);

      setMessageErreur('Erreur(s) : '+erreur);
    }
  };
  //Gestion reponse//

//Informatico//
  const handleCloseInformatico = () => {
    setShowInformatico(false);
  }
//Fin Informatico//

  //Menu Pause//
  const handleShowPause = () => {
    setShowPause(true);
    setCompteAReboursActif(false); 
  };

  const handleResume = () => {
    setShowPause(false);
    setCompteAReboursActif(true);
  };

  const handleQuitGame = () => {
    navigate(`/JeuxSolo`);
  };

  const saveData = () => {
    // code osef
  }
  //Fin Menu Pause//
 
// Debut Popup //
/**
 * Affiche l'écran de fin avec le titre et le message spécifiés, arrête le compte à rebours actif le cas échéant.
 * @param {string} title - Le titre de l'écran de fin.
 * @param {string} message - Le message à afficher sur l'écran de fin.
 */
  const handleShowEcranFin = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowEcranFin(true);
    setCompteAReboursActif(false); 
  };

  const handleCloseEcranFin = () => {
    const currentPathname = window.location.pathname;
    const newPathname = currentPathname.substring(0, currentPathname.lastIndexOf('/')) + '/MenuEleve';
  
    window.location.pathname = newPathname;
    setShowEcranFin(true);
    
  };
//Fin Popup de fin//

/**
 * Gère le démarrage de l'opération de glisser-déposer en configurant les données à transférer.
 * @param {Object} e - L'événement de démarrage du glisser-déposer.
 * @param {string} text - Le texte à transférer lors de l'opération de glisser-déposer.
 */
  const handleDragStart = (e, text) => {
    e.dataTransfer.setData('text/plain', text);
  };
/**
 * Gère le largage d'un bloc de texte dans un composant, en ajoutant le texte à l'état du code.
 * @param {string} text - Le bloc de texte à ajouter.
 */
  const handleDropBlock = (text) => {
    setCode((prevCode) => prevCode + text + '\n');
  };
/**
 * Gère l'événement de largage d'un élément dans un composant, en ajoutant le texte transféré à l'état du code.
 * @param {Object} e - L'événement de largage.
 */
  const handleDrop = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    setCode((prevCode) => prevCode + text + '\n');
  };
/**
 * Gère l'événement de survol lors du déplacement d'un élément au-dessus du composant.
 * @param {Object} e - L'événement de survol.
 */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Blocs Drags and Drop //

  // Code Area //
  const handleReset = () => {
    setCode('');
    setDrawingLines([]);
  };

  const handleExecute = () => {
    setIsDrawing(true);
    const lines = interpretBlocks(code);
    setDrawingLines([...drawingLines, ...lines]); // Ajoutez les nouvelles lignes à l'ancien dessin
    setIsDrawing(false);
  };

  const handleToggleAutoExecute = () => {
    setAutoExecute(!autoExecute);
  };

  const handleDeleteBlock = (index) => {
    const lines = code.split('\n');
    lines.splice(index, 1);
    setCode(lines.join('\n'));
    const updatedLines = interpretBlocks(lines.join('\n'));
    setDrawingLines([...updatedLines]);
  };
    // Fin code Area //


  useEffect(() => {
    if(reponse===''){
      setReponse(dessinAleatoire);
    }
    if (autoExecute) {
      handleExecute();
    }
    if (compteAReboursActif && tempsRestant > 0) {
      const intervalId = setInterval(() => {
        setTempsRestant((prevTemps) => {
          const nouveauTemps = prevTemps - 1;
          if (nouveauTemps <= 0) {
            setCompteAReboursActif(false); // Arrêter le compte à rebours
            handleShowEcranFin("Temps écoulé", "La réponse était : "+reponse);
          }
          return nouveauTemps;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [code, autoExecute,compteAReboursActif, tempsRestant]);  

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
    <div className="TurtleGame">
      <button className="pause-button" onClick={handleShowPause}></button> 
      <div className="left-section">
        <Blocks.ForwardBlock onDragStart={handleDragStart} />
        <Blocks.BackwardBlock onDragStart={handleDragStart} />
        <Blocks.RightBlock onDragStart={handleDragStart} />
        <Blocks.LeftBlock onDragStart={handleDragStart} />
        <Blocks.PenDownBlock onDragStart={handleDragStart} />
        <Blocks.PenUpBlock onDragStart={handleDragStart} />
        <Blocks.Circle onDragStart={handleDragStart} />
        <Blocks.ColorBlock onDragStart={handleDragStart} />
        <ForBlock onDragStart={handleDragStart} onDropBlock={handleDropBlock} />
        <GoToBlock onDragStart={handleDragStart} onDropBlock={handleDropBlock} />
      </div>
      <div className="middle-section" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className='midmid'>Deposez vos blocs ici</div>

        <CodeArea code={code} onReset={handleReset} onExecute={handleExecute} onDeleteBlock={handleDeleteBlock}  />
        <button className='small-button' onClick={handleToggleAutoExecute}>
        {autoExecute ? 'Auto-Exécution Activée' : 'Auto-Exécution Désactivée'} 
      </button>
        <p>{tempsRestant} secondes</p>
        <button className='small-button afficher-button' onClick={handleAfficherReponse}>
        {affichageTemporaireReponse ? 'Masquer la réponse' : 'Afficher la réponse'}
        </button>
        {afficherReponse && <div>Réponse: {reponse}</div>}
        {affichageTemporaireReponse && <div>Réponse: {reponse}</div>}        
        <div className='verifier'>
        <button className='small-button' onClick={handleVerifierReponse}>Vérifier la réponse</button>
        <input className='saisir-valeur'
        type="text"
        placeholder="Entrez votre réponse"
        value={saisieReponse}
        onChange={(e) => setSaisieReponse(e.target.value)}/>
                {messageErreur && <div className="erreur-message">{messageErreur}</div>}

        </div>
      </div>
      <div className="right-section">
        <DrawingArea lines={drawingLines} isDrawing={isDrawing} /> 
      </div>
      {showPause && (
        <PauseMenu resumeGame={handleResume} quitGame={handleQuitGame} saveData={saveData}/>)}     
        {showInformatico && <Informatico page={'TurtleGame'} context={informaticoMessage} closeWindow={handleCloseInformatico} clickToShow={true} /> } 
        {showEcranFin && <PopupWindow closePopup={handleCloseEcranFin} title={popupTitle} message={popupMessage} />}
    </div>
  );
};

export default TurtleGame;
