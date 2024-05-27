import React, { useState, useEffect,useContext } from 'react';
import NavBar from '../component/NavBar';
import '../styles/Games.css';
import PopupWindow from '../component/PopupWindow';
import logo from '../img/logo_hello-world.png';
import Recette from '../component/squisine/Recette'; // Import du composant Recette avec un chemin relatif
import { recette1, recette2, recette3,recette4, recette5,recette6} from '../component/squisine/recettes'; // Import des données de recette avec un chemin relatif 
import { compareBlockTypes,correctsBlocksFun, LogError } from '../component/squisine/LogError';
import feuilleRecette from '../img/recette.png';
import planTravail from '../img/plantravail.jpg';
import PauseMenu from '../component/PauseMenu';
import TitleScreen from '../component/TitleScreen';
import RangementWindow from '../component/RangementWindow';
import SQuisineTuto from '../component/SquisineTuto';
import { DataContext } from '../DataProvider';
import Informatico from '../component/Informatico';

const SQuisine = () => {
  const [displayMode, setDisplayMode] = useState('base'); // etat du menu des boutons de gauche : base, syntaxe, ingrédients,...
  const [droppedItems, setDroppedItems] = useState([]); // blocs déposés dans la requete à droite
  const [currentStep, setCurrentStep] = useState(1); // etape actuelle de la recette
  const [selectedRecipe, setSelectedRecipe] = useState({}); // Pour stocker la recette sélectionnée
  const [shouldUpdateRecipe, setShouldUpdateRecipe] = useState(true); // Nouvel état pour gérer la mise à jour de la recette
  const [erreur, setScore] = useState(0); //Implémentation d'un score erreur
  const [erreurAfficher, setScoreAfficher] = useState(0); //Implémentation d'un score erreur après modifs 
  const [showErrorLog, setShowErrorLog] = useState(false); // affichage journal d'erreurs
  const [showEcranFin, setShowEcranFin] = useState(false); // afichage écran de fin
  const [popupTitle, setPopupTitle] = useState(''); // affichage de popups diverses
  const [popupMessage, setPopupMessage] = useState([]); // message de la popup
  const [correctedBlocks, setCorrectedBlocks] = useState([]); // Exemple de déclaration de correctedBlocks
  const [validSteps, setValidSteps] = useState([]); // étapes de la recette validées
  const [draggedItemImage, setDraggedItemImage] = useState(null); // image correspondante a un bloc déplacé
  const [showPause, setShowPause] = useState(false); // affichage menu pause
  const [showTitle, setShowTitle] = useState(true); // afichage écran de démarrage
  const [genererRangements, setGenererRangements] = useState(false); // génération des rangements à afficher à droite
  const [tempsRestant, setTempsRestant] = useState(500); // en secondes, temps du jeu
  const [compteAReboursActif, setCompteAReboursActif] = useState(false); // état du compte à rebours
  const [ingredientsInRangement, setIngredientsInRangement] = useState([]); // les ingrédients contenus dans chaque rangement
  const [showRangementContenu, setShowRangementContenu] = useState(false); // affichage du contenu d'un rangement
  const [showTuto, setShowTuto] = useState(false); // affichage du tutoriel
  // variables et fonction pour requêtes serveur 
  const { isConnected, userName, majTuto,getTuto,getDifficulte } = useContext(DataContext);
  const [loading, setLoading] = useState(false); // affichage écran de chargement

  // utilisation d'informatico
  const [showInformatico, setShowInformatico] = useState(true);
  const [informaticoMessage, setInformaticoMessage] = useState('Tuto');

  const nbErreursMax = 3;

  useEffect(() => {
    if (genererRangements && compteAReboursActif) {
      const nettoyerCompteARebours = demarrerCompteARebours();
  
      // Nettoyer le compte à rebours lorsque le composant est démonté ou le jeu est fini
      return () => {
        nettoyerCompteARebours();
      };
    }
   
    
  }, [genererRangements, compteAReboursActif]);

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
  

  const demarrerCompteARebours = () => {
    const intervalId = setInterval(() => {
      setTempsRestant((prevTemps) => {
        const nouveauTemps = prevTemps - 1;
        if (nouveauTemps <= 0) {
          setCompteAReboursActif(false); // Arrêter le compte à rebours
          handleShowEcranFin("Dommage, temps écoulé", "Relance et bat ton pb");
          return 0; // Assurez-vous que le temps ne devient pas négatif
        }
        return nouveauTemps;
      });
    }, 1000);
  
    // Retourne la fonction de nettoyage pour arrêter le compte à rebours lorsque nécessaire
    return () => clearInterval(intervalId);
  };

  // fermeture informatico
  const handleCloseInformatico = () => {
    setShowInformatico(false);
  }


  const tutoFait = async () => {
    try {
      const result = await getTuto('SQuisine');
      if (!result) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Erreur:', error);
      return false; // En cas d'erreur, retourner false
    }
  };
  
  
  const handleResume =() => {
    setShowPause(false);
    setCompteAReboursActif(true);
  }

  const handleShowPause = () => {
    setShowPause(true);
    setCompteAReboursActif(false); // Arrête le chronomètre lorsque le menu de pause est cliqué
  };

  const handleNext = async () => {
  
    setGenererRangements(true);
    setShowTitle(false);
  
    const tutofait = await tutoFait(); // Utiliser await pour attendre la résolution de la promesse
  
    if (!tutofait) {
      setShowTuto(true);
    }
    else{
      setCompteAReboursActif(true);
    }
  
    setShowRangementContenu(false);
  };

  const handleQuitRangements =() => {
    setGenererRangements(true);
    setShowTitle(false);
    setShowRangementContenu(false);
  }
  

  const handleLancer = async () => {
    try {
      const tutofait = await tutoFait();
  
      if (!tutofait) {
        await majTuto('SQuisine', 'true'); // Attendre la résolution de la promesse
      }
  
      setShowTuto(false);
      setCompteAReboursActif(true);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tutoriel:', error);
    }
  };
  

  const saveData = () => {
    //charger ici les données du jeu sur le serveur
  }

  const tutoGame = () => {
    setShowPause(false);
    setShowTuto(true);
  }

  const generateRecipeList = () => {
    const recipeListTemp = [recette1, recette2, recette3, recette4, recette5];

  /*getDifficulte('SQuisine').then(result =>{
    if(result==='1'){
      recipeListTemp = [recette1, recette2];
    }
    else if(result==='3'){
      recipeListTemp = [recette3, recette4, recette5];
      
    }
   
  });*/

    for (const recette of recipeListTemp) {
      for (const etape of recette.etapes) {
        for (const reponse of etape.reponses) {
          if (reponse.type === "ingredient" || reponse.type === "rangement") {
            const image = require(`../img/${reponse.nom}.png`);
            reponse.image = image;
          }
        }
      }
    }
  
    return recipeListTemp;
  };
  
      const recipeList = generateRecipeList();


  const types = ['ingrédient', 'syntaxe', 'rangement', 'attributs', 'valeur'];




  

  const GenereRecette = () =>{
    if (shouldUpdateRecipe) {
      // Fonction pour choisir une recette aléatoirement entre recette1, recette2 et recette3
      const chooseRandomRecipe = () => {
        const randomRecipeIndex = Math.floor(Math.random() * recipeList.length);
        const randomRecipe = recipeList[randomRecipeIndex];
        setSelectedRecipe(randomRecipe);
      };

      chooseRandomRecipe(); // Appeler la fonction pour choisir une recette aléatoire au chargement de la page
      setShouldUpdateRecipe(false); // Mettre à jour l'état pour éviter les changements imprévus
    }
  }

  /*    VALIDATION*/
  const validateSelection = () => {
    const currentStepData = selectedRecipe.etapes.find((etape) => etape.numero === currentStep);

    if (!currentStepData) {
      console.error('Étape non trouvée');
      return;
    }

    /* VERICATION POUR AFFICHER LES BLOCS CORRECTS ET INCCORRECTS */
    const expectedBlocks = currentStepData.reponses;
    const droppedBlocks = droppedItems.map((item) => {
      // Recherche de l'élément dans les réponses de la recette
      let type = ''; // Initialisation du type à une chaîne vide par défaut
      for (const etape of selectedRecipe.etapes) {
        for (const reponse of etape.reponses) {
          if (reponse.nom === item) {
            type = reponse.type; // Si le nom correspond, met à jour le type
            break; // Sortie de la boucle une fois que le type est trouvé
          }
        }
        if (type !== '') {
          break; // Sortie de la boucle externe si le type est trouvé
        }
      }
  
      return {
        nom: item,
        type: type
      };
    });
    setCorrectedBlocks(correctsBlocksFun(expectedBlocks, droppedBlocks));
   
  
    /* VERICATION POUR PASSER ETAPE ET FAIRE LES LOGS */
    const errorMessage = compareBlockTypes(expectedBlocks, droppedBlocks);

    /* si erreur détectée */
    if (errorMessage.includes('Erreur')) {
      setScore(erreur + 1);
      setScoreAfficher(erreurAfficher +1);

      if (erreur + 1 === nbErreursMax) {
        // Affiche l'écran de fin après 10 erreurs
        handleShowEcranFin("Dommage...", "Relance et fais de ton mieux !");
      }
      LogError.push(errorMessage);
    }
    /* sinon si validé*/ 
    else {
      setDroppedItems([]);
      setCorrectedBlocks([]);
      setValidSteps([...validSteps, currentStep]); // Ajoute l'étape actuelle à la liste des étapes validées
      if(selectedRecipe.etapes.length==currentStep){
        handleShowEcranFin("Bravo apprenti cuistot !", `Tu viens de réussieur la recette "${selectedRecipe.nom}"`);        
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const resetField= () => {
    setDroppedItems([]);
    setCorrectedBlocks([]);
  }
  
  const OnClickRequete = (clickedItem) => {
    // Copiez les tableaux pour pouvoir les modifier
    const newDroppedItems = [...droppedItems];
    const newCorrectedBlocks = [...correctedBlocks];

    // Trouvez l'index de l'élément cliqué
    const index = newDroppedItems.indexOf(clickedItem);

    // Vérifiez si l'élément existe dans le tableau
    if (index !== -1) {
      // Supprimez l'élément correspondant des deux tableaux
      newDroppedItems.splice(index, 1);
      newCorrectedBlocks.splice(index, 1);

      // Mettez à jour les états avec les nouveaux tableaux
      setDroppedItems(newDroppedItems);
      setCorrectedBlocks(newCorrectedBlocks);
    }
  };


  /* AFFICHAGE JOURNAL DERREUR*/
  const handleShowPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowErrorLog(true);

  }

  const handleClosePopup = () => {
    setShowErrorLog(false);
    // Effacer le contenu de LogError après avoir fermé la fenêtre PopupWindow
    LogError.splice(0, LogError.length);
    setScoreAfficher(0);
  };

  /* AFFICHAGE ECRAN FIN*/

  const handleShowEcranFin = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowEcranFin(true);
    setCompteAReboursActif(false); // Arrêter le compte à rebours lorsque le jeu est fini
  };

  const handleCloseEcranFin = () => {
    const currentPathname = window.location.pathname;
    const newPathname = currentPathname.substring(0, currentPathname.lastIndexOf('/')) + '/MenuEleve';
  
    window.location.pathname = newPathname;
    setShowEcranFin(true);
    // Effacer le contenu de LogError après avoir fermé la fenêtre PopupWindow
    LogError.splice(0, LogError.length);
    setScoreAfficher(0);
    setScore(0);
    
  };



  /* BOUTONS GENERES POUR LA RECETTE */
  const generateButtonsByType = (type) => {      const namesSet = new Set(); // Créer un ensemble pour stocker les noms uniques
  
    return selectedRecipe.etapes.flatMap((etape) =>
      etape.reponses
        .filter((bloc) => bloc.type === type)
        .map((bloc, idx) => {
          if (!namesSet.has(bloc.nom)) { // Vérifier si le nom du bloc n'est pas déjà dans l'ensemble
            namesSet.add(bloc.nom); // Ajouter le nom du bloc à l'ensemble
            return (
              <button
                key={`${bloc.nom}_${idx}`}
                draggable
                onClick={() => onClickButton(bloc.nom)} // Ajoutez cet attribut onClick
                  onDragStart={(e) => onDragStart(e, bloc.nom)}
                className={'game-button'}
              >
                {bloc.nom}
                {bloc.type === 'ingredient' || bloc.type === 'rangement' ? (
                    <img className='image-food' src={bloc.image} alt={bloc.nom}></img>
                  ) : null}
                 
                
              </button>
            );
          }
          return null; // Retourner null pour les doublons afin de ne pas créer de bouton supplémentaire
        })
    );
  };

  /* GENERATION DES RANGEMENTS A DROITE */
  const generateRangementsDroite = () => {
    const namesSet = new Set(); // Créer un ensemble pour stocker les noms uniques
  
    return selectedRecipe.etapes.flatMap((etape) =>
      etape.reponses
        .filter((bloc) => bloc.type === 'rangement')
        .map((bloc, idx) => {
          if (!namesSet.has(bloc.nom)) {
            namesSet.add(bloc.nom);
            return (
              <img
                key={`${bloc.nom}_${idx}`}
                className='image-rangement'
                src={bloc.image}
                alt={bloc.nom}
                onClick={() => afficherDetailsRangement(bloc)}
              />
            );
          }
          return null;
        })
    );

  };

  const afficherDetailsRangement = (bloc) => {
    const rangementNom = bloc.nom; // Nom du rangement
    const currentStepData = selectedRecipe.etapes.find((etape) => etape.numero === currentStep);
  
    if (!currentStepData) {
      console.error('Étape non trouvée');
      return;
    }
  
    // Recherche du bloc de rangement dans les réponses de la recette
    const rangementBlock = selectedRecipe.rangements.find((rangement) => rangement.nom === rangementNom);
    if (rangementBlock && rangementBlock.contenu) {
      const ingredientsList = rangementBlock.contenu.map((ingredient) => ingredient.nom);
      
  
      // Stockage de la liste des ingrédients dans l'état
      setIngredientsInRangement(ingredientsList);
      setShowRangementContenu(true);  
      }
  
    return;
  };
  
  
  

  /* GENERATION DES BOUTONS DANS LES BOX*/
  const getDisplayButtons = () => {
    switch (displayMode) {
      case 'base':
        return (
          <div className='box-white'>
            <div className='content-button'>
              <button onClick={showSyntaxe} className='syntaxe-button game-button'>
                Syntaxe
              </button>
              <button onClick={showIngredients} className='ingredients-button game-button'>
                Ingrédients
              </button>
              <button onClick={showRangements} className='rangements-button game-button'>
                Rangements
              </button>
              <button onClick={showAttributs} className='attribut-button game-button'>
                Attributs
              </button>
              <button onClick={showValeurs} className='valeur-button game-button'>
                Valeurs
              </button>
            </div>
            <div className='action-button'>
            {/* Boutons pour Valider, Journal, Effacer */}
            <button onClick={validateSelection} className='validate-button small-game-button'>
              Valider
            </button>
            <button onClick={() => handleShowPopup("Journal d'erreur", LogError)} className='journal-button small-game-button'>
            Journal
            {erreurAfficher > 0 && <div className='error-circle'>{erreurAfficher}</div>}
          </button>
            <button onClick={resetField} className='erase-button small-game-button'>
              Effacer
            </button>
          </div>
        </div>
        
      );
      case 'syntaxe':
        return (
          <div className='box-white'>
          <div className='content-menu'> 
          <div className='topmenu'>
          <button onClick={resetDisplay} className='back-button'>&lt; SYNTAXE</button>
          </div>
          <div className='content-button'>
            {generateButtonsByType('syntaxe')}
          </div>
        </div>
        </div>
        );
      case 'ingredients':
        return (
          <div className='box-white'>
            <div className='content-menu'> 
            <div className='topmenu'>
            <button onClick={resetDisplay} className='back-button'>&lt; INGREDIENTS</button>
            </div>
            <div className='content-button'>
              {generateButtonsByType('ingredient')}
            </div>
          </div>
          </div>
        );
      case 'rangements':
        return (
          <div className='box-white'>
            <div className='content-menu'> 
            <div className='topmenu'>
              <button onClick={resetDisplay} className='back-button'>&lt; RANGEMENTS</button>
            </div>
            <div className='content-button'>
              {generateButtonsByType('rangement')}
            </div>
            </div>
            

          </div>
        );
      default:
        case 'attribut':
        return (
          <div className='box-white'>
            <div className='content-menu'> 
            <div className='topmenu'>
              <button onClick={resetDisplay} className='back-button'>&lt; ATTRIBUTS</button>
            </div>
            <div className='content-button'>
            {generateButtonsByType('attribut')}     
            </div>
          </div>
          </div>
        );
        case 'valeur':
        return (
          <div className='box-white'>
            <div className='content-menu'> 
            <div className='topmenu'>
            <button onClick={resetDisplay} className='back-button'>&lt; VALEURS</button>
            </div>
            <div className='content-button'>{generateButtonsByType('valeur')}</div> 
            </div>
          </div>
        );
    }
  };

  /* POUR LE DEPLACEMENT DE BLOCS ET LAFFICHAGE */
  const showSyntaxe = () => {
    setDisplayMode('syntaxe');
    setShouldUpdateRecipe(false); // Éviter la mise à jour de la recette après un drop
  };

  const showIngredients = () => {
    setDisplayMode('ingredients');
    setShouldUpdateRecipe(false); // Éviter la mise à jour de la recette après un drop
  };

  const showRangements = () => {
    setDisplayMode('rangements');
    setShouldUpdateRecipe(false); // Éviter la mise à jour de la recette après un drop
  };

  const showAttributs = () => {
    setDisplayMode('attribut');
    setShouldUpdateRecipe(false); // Éviter la mise à jour de la recette après un drop
  };

  const showValeurs = () => {
    setDisplayMode('valeur');
    setShouldUpdateRecipe(false); // Éviter la mise à jour de la recette après un drop
  };

  const resetDisplay = () => {
    setDisplayMode('base');
    setShouldUpdateRecipe(false); // Éviter la mise à jour de la recette après le retour
    // Effacer les éléments glissés lors du retour au mode de base
  
    // Assurez-vous de réinitialiser la visibilité des boutons dans la partie action-button
    
  };

  const onClickButton = (item) => {
    setDroppedItems([...droppedItems, item]);
    setShouldUpdateRecipe(false); // Éviter la mise à jour de la recette après un clic
    const draggedBlock = selectedRecipe.etapes
    .flatMap((etape) => etape.reponses)
    .find((reponse) => reponse.nom === item);

  // Vérifiez le type du bloc
  if (draggedBlock && (draggedBlock.type === 'ingredient')) {
    setDraggedItemImage(draggedBlock.image);
  } else {
    setDraggedItemImage(null);
  }
  };


  const onDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item);

  };
  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    for (const etape of selectedRecipe.etapes) {
      for (const reponse of etape.reponses) {
        if (reponse.nom === item) {
          setDroppedItems([...droppedItems, item]);
          break; // Sortie de la boucle une fois que le type est trouvé
        }
      }
      }
    setShouldUpdateRecipe(false); // Éviter la mise à jour de la recette après un drop

    const draggedBlock = selectedRecipe.etapes
    .flatMap((etape) => etape.reponses)
    .find((reponse) => reponse.nom === item);

  // Vérifiez le type du bloc
  if (draggedBlock && (draggedBlock.type === 'ingredient')) {
    setDraggedItemImage(draggedBlock.image);
  } else {
    setDraggedItemImage(null);
  }
  };

  /* CODE PRINCIPAL DE LA PAGE */
  return (  
    <div className='App'>

      <main>
        {GenereRecette()}
      <div className='main-game'>
      <h3 className='titre-jeu'>SQUISINE LITE : UNE CUISINE DE REQUÊTES</h3>
      <div className='score-container'>
          <p>Nombre d'erreurs : {erreur}</p>
          <p className={tempsRestant > 0 && tempsRestant < 15 ? 'clignote' : ''}>
            Temps restant : {tempsRestant} seconde{tempsRestant !== 1 ? 's' : ''}
          </p>
        </div>
        <div className='boxes-container'>
          
        {getDisplayButtons()}

          {/* Deuxième box-white avec la zone de drop */}
          <div className='box-white' onDragOver={onDragOver} onDrop={onDrop}>
            <div className='content-button-droite'>
               <div className='recette-box' >
                <img className='feuille-recette' src={feuilleRecette}></img>
                
                <Recette
                    numero={selectedRecipe ? selectedRecipe.numero : null}
                    nom={selectedRecipe ? selectedRecipe.nom : null}
                    etapes={selectedRecipe ? selectedRecipe.etapes || [] : []}
                    validSteps={validSteps}
                  />        
                </div>
                <div className='plan-box'>
                    <img src={planTravail} className='plan-travail'></img>
                    {draggedItemImage && <img className='food-plan' src={draggedItemImage} alt='Dragged Item'></img>}
                </div>
                <div className='image-rangement-conteneur'>
                {genererRangements && generateRangementsDroite()}
                </div>
            </div> 
         
          <div className='requete'>
            <ul>
              {droppedItems.map((item, index) => {
                let className = 'requete-list small-game-button'; // Classe par défaut
                if (correctedBlocks[index] === 'correct') {
                  className += ' validate-button'; // Ajoute la classe pour les éléments corrects
                } else if  (correctedBlocks[index] === 'incorrect') {
                  className += ' erase-button'; // Ajoute la classe pour les éléments incorrects
                }
                return (
                  <li className={className} key={index} onClick={() => OnClickRequete(item)}>
                    {item}
                  </li>
                );
              })}
            </ul>
            {/* ... Autres éléments à afficher */}
          </div>
          </div>  
        </div>

      

        <button className='pause-button' onClick={() => handleShowPause()}></button>
        {showTitle && <TitleScreen resumeGame={handleNext} saveData={saveData} nomjeu={'SQuisine Lite'}/>}
        {showPause && <PauseMenu resumeGame={handleResume} saveData={saveData} tutoGame={tutoGame}/>}
        {showErrorLog && <PopupWindow closePopup={handleClosePopup} title={popupTitle} message={popupMessage}/>}
        {showEcranFin && <PopupWindow closePopup={handleCloseEcranFin} title={popupTitle} message={popupMessage}/>}
        {showRangementContenu && <RangementWindow resumeGame={handleQuitRangements} listeIngredients={ingredientsInRangement} selectedRecipe={selectedRecipe}/>}
        {showTuto && <SQuisineTuto resumeGame={handleLancer} saveData={saveData}/>}
        {showInformatico && <Informatico page={'SQuisine'} context={informaticoMessage} closeWindow={handleCloseInformatico} clickToShow={true} /> } 
        {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Recherche de partie en cours...</span>
          </div>}
      </div>
       
      </main>
    </div>
  );
};

export default SQuisine;
