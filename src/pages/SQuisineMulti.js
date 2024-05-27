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
import SQuisineTutoMulti from '../component/SquisineTutoMulti';
import { DataContext } from '../DataProvider';
import Informatico from '../component/Informatico';

const SQuisineMulti = () => {
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
  const { isConnected, userName, majTuto,getTuto,recherchePartie,deleteGames,getCoop,getTourCoop,majTourSelf,chgmtEtatCoeq } = useContext(DataContext);
  const [loading, setLoading] = useState(false); // affichage écran de chargement
  const [coeqJoue, setCoeqJoue] = useState(false); // est-ce que le coéquipier joue
  const [coequipier, setCoequipier] = useState(''); // nom du coéquipier
  const [tour, setTour] = useState(''); // etat du tout actuel
  const [partieEnCours,setPartieEnCours] = useState(false); // est-ce qu'une partie est en cours
  const [showCoeqTrouve,setShowCoeqTrouve] = useState(false); // coéquipier trouvé durant le matchmaking ou non
  const [attendReception,setAttendReception] = useState(false); // est-ce qu'on attend la réception de la recette du coéquipier
  const [envoiRecette,setEnvoiRecette] = useState(false);  // est-ce qu'on doit envoyer sa recette au coéquipier


  // utilisation d'informatico
  const [showInformatico, setShowInformatico] = useState(true);
  const [informaticoMessage, setInformaticoMessage] = useState('Tuto');

  const nbErreursMax = 3; // nombre d'erreurs autorisé, parametrable

  /**
   * tourne en permanence quand le composante est utilisé
   */
  useEffect(() => {
    /**
     * consulte le tour actuel, si "oui", c'est que l'utilisateur joue, si "non", il attend l'action de son coéquipier,
     * si "valide", c'est que son coéquipier a validé une étape, si "échec", c'est que son coéquipier a dépassé le nombre max d'erreurs
     * si "temps", c'est que son coéquipier a dépassé le temps réglementaire, si "victoire", c'est que son coéquipier a fini la recette
     */
    const checkTour = async () => {
      try {
        const result = await getCoop();
        if(attendReception){
          const recipeListTemp = [recette1, recette2, recette3, recette4, recette5, recette6];
          for (const recette of recipeListTemp) {
          if(recette.nom===result.data.tour){
            setSelectedRecipe(recette);
            setAttendReception(false);
            }
          }
        }
        if (result.data.tour === 'oui') {
          setTour('oui');
          setCoeqJoue(false);
        }
        if (result.data.tour === 'valide') {
          setTour('oui');
          setCoeqJoue(false);
          setValidSteps([...validSteps, currentStep]); // Ajoute l'étape actuelle à la liste des étapes validées
          setCurrentStep(currentStep + 1);
        }
        else if (result.data.tour === 'echec') {
          setTour('oui');
          setCoeqJoue(false);
          handleShowEcranFin("Ton coéquipier s'est encore trompé, dommage...", "Relance et fais de ton mieux !");
        } 
        else if (result.data.tour === 'temps') {
          setTour('oui');
          setCoeqJoue(false);
          handleShowEcranFin("Ton coéquipier a dépassé le temps réglementaire...", "Relance et fais de ton mieux !");
        } 
        else if (result.data.tour === 'victoire') {
          setTour('oui');
          setCoeqJoue(false);
          handleShowEcranFin("Bravo apprenti cuistot !", `Tu viens de réussir la recette "${selectedRecipe.nom}"`);        
        } else {
          // Si le tour n'est pas encore 'oui', attendez un moment et vérifiez à nouveau
          setTimeout(checkTour, 1000); // Vérifier toutes les secondes (ajustez au besoin)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du tour du joueur:', error);
      }
    };


    // Vérifier le tour du joueur au chargement du composant
    if (tour === 'non') {
      checkTour();
    }

  

    if (genererRangements && compteAReboursActif) {
      const nettoyerCompteARebours = demarrerCompteARebours();
  
      // Nettoyer le compte à rebours lorsque le composant est démonté ou le jeu est fini
      return () => {
        nettoyerCompteARebours();
      };
    }
    const handleBeforeUnload = () => {
      // Appeler la fonction deleteGames
      deleteGames();
    };

    // Ajouter le gestionnaire d'événements beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Nettoyer le gestionnaire d'événements lorsque le composant est démonté
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    
  }, [genererRangements, compteAReboursActif,tour,attendReception]);

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
   * 
   * @returns le temps actualisé 
   */
  const demarrerCompteARebours = () => {
    const intervalId = setInterval(() => {
      setTempsRestant((prevTemps) => {
        const nouveauTemps = prevTemps - 1;
        if (nouveauTemps <= 0) {
          setCompteAReboursActif(false); // Arrêter le compte à rebours
          chgmtEtatCoeq(coequipier,'temps')
          .then(response => {
          console.log("Envoi de la fin temps avec succes");
          })
          .catch(error => {
          console.error("Erreur lors de l'envoi de la fin echec", error);
          });
          handleShowEcranFin("Dommage, temps écoulé", "Relance et fais de ton mieux");
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

  /**
   * 
   * @returns si le tutoriel a déja été fait ou non par l'utilisateur
   */
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
  
  /**
   * reprend le jeu et relance le chronometre a la fermeture du menu
   */
  const handleResume = async () => {
    setShowPause(false);
    setCompteAReboursActif(true);
  }

  /**
   * affiche le menu et met en pause le chrono
   */
  const handleShowPause = () => {
    setShowPause(true);
    setCompteAReboursActif(false); // Arrête le chronomètre lorsque le menu de pause est cliqué
  };


  /**
   * quand le joueur appuie sur "lancement" partie depuis l'écran titre.
   * cherche une partie ( matchmaking), reviens au menu principal si pas de partie trouvée
   */
  const handleNext = async () => {
    
    setLoading(true);
    recherchePartie().then(result => {
      setLoading(false);
      setPartieEnCours(true);
      setShowCoeqTrouve(true);
    }).catch(error => {
      setLoading(false);
    }); 
    
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

  /**
   * initialise le coéquipier trouvé, commence à jouer ou non selon le tour de base
   * et envoie ou attend la reception d'une recette selon le tour de base
   */
  const handleCoeq = async () =>{
    getCoop().then(result =>{
      setCoequipier(result.data.coequipier);
      setTour(result.data.tour);
      if(result.data.tour==='non'){
        setCoeqJoue(true);
        //reception recette
        setAttendReception(true);
      }
      else{
        //envoi recette
        setEnvoiRecette(true);
       
      }
    }).catch (error => {
      console.log('erreur coequpier non trouvé');
    });
    
    setShowCoeqTrouve(false);
  }

  // fermture du rangement cliqué 
  const handleQuitRangements =() => {
    setGenererRangements(true);
    setShowTitle(false);
    setShowRangementContenu(false);
  }
  
  // lancement après le tuto
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

  // affichage du tuto depuis le menu
  const tutoGame = () => {
    setShowPause(false);
    setShowTuto(true);
  }

  // génération de la liste de recette, et ajout des images correspondant aux différents ingrédients
  const generateRecipeList = () => {
    const recipeListTemp = [recette1, recette2, recette3, recette4, recette5, recette6];
    
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




  
  // choix d'une recette au hasard dans la liste
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

  /*    Validation de la requete de l'utilisateur*/
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

    const changeTour = () => {
      if (coequipier && !showEcranFin) {
    setCoeqJoue('true');
    setTour('non');
    majTourSelf(coequipier)
      .then(response => {
        console.log("Tour mis à jour pour le coéquipier avec succès");
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour du tour pour le coéquipier:", error);
      });
  }

  }
   if(envoiRecette){
    chgmtEtatCoeq(coequipier,selectedRecipe.nom)
    .then(response => {
      console.log(`envoi de la recette ${selectedRecipe.nom} avec success`);
    })
    .catch(error => {
      console.log(`erreur d'envoi de la recette ${selectedRecipe.nom}`);
    });
    setEnvoiRecette(false);
   }

    /* si erreur détectée */
      setTimeout(() => {
    // La suite du code ici
    /* si erreur détectée */
    if (errorMessage.includes('Erreur')) {
      console.log(errorMessage);
      setScore(erreur + 1);
      setScoreAfficher(erreurAfficher + 1);

      if (erreur + 1 === nbErreursMax) {
        // Affiche l'écran de fin après x erreurs
        chgmtEtatCoeq(coequipier, 'echec')
          .then(response => {
            console.log("Envoi de la fin échec avec succès");
          })
          .catch(error => {
            console.error("Erreur lors de l'envoi de la fin échec", error);
          });
        handleShowEcranFin("Dommage... nombre d'erreurs max atteint", "Relance et fais de ton mieux !");
      } else {
        changeTour();
      }
      LogError.push(errorMessage);
    }
    /* sinon si validé*/ 
    else {
      setDroppedItems([]);
      setCorrectedBlocks([]);
      setValidSteps([...validSteps, currentStep]); // Ajoute l'étape actuelle à la liste des étapes validées
      if (selectedRecipe.etapes.length === currentStep) {
        chgmtEtatCoeq(coequipier, 'victoire')
          .then(response => {
            console.log("Envoi de la fin victoire avec succès");
          })
          .catch(error => {
            console.error("Erreur lors de l'envoi de la fin victoire", error);
          });
        handleShowEcranFin("Bravo apprenti cuistot !", `Tu viens de réussir la recette "${selectedRecipe.nom}"`);
      } else {
        chgmtEtatCoeq(coequipier, 'valide')
          .then(response => {
            console.log("Envoi de la validation avec succès");
          })
          .catch(error => {
            console.error("Erreur lors de l'envoi de la validation", error);
          });
          setTimeout(() => {

          changeTour();
          }, 1500); 

      }
      setCurrentStep(currentStep + 1);
    }
  }, 1500); 
    
  };

  // bouton annuler qui vide le champ requete de droite
  const resetField= () => {
    setDroppedItems([]);
    setCorrectedBlocks([]);
  }

  /**
   * 
   * @param {*} clickedItem 
   * supression du bloc cliqué de la requête de droite
   */
  const OnClickRequete = (clickedItem) => {
    // Copier les tableaux pour pouvoir les modifier
    const newDroppedItems = [...droppedItems];
    const newCorrectedBlocks = [...correctedBlocks];

    // Trouver l'index de l'élément cliqué
    const index = newDroppedItems.indexOf(clickedItem);

    // Vérifier si l'élément existe dans le tableau
    if (index !== -1) {
      // Supprimer l'élément correspondant des deux tableaux
      newDroppedItems.splice(index, 1);
      newCorrectedBlocks.splice(index, 1);

      // Metter à jour les états avec les nouveaux tableaux
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

  /**
   * fermeture des popup et reset du journal de log
   */
  const handleClosePopup = () => {
    setShowErrorLog(false);
    // Effacer le contenu de LogError après avoir fermé la fenêtre PopupWindow
    LogError.splice(0, LogError.length);
    setScoreAfficher(0);
  };

  /**
   * affichage de l'écran de fin
   */  
    const handleShowEcranFin = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowEcranFin(true);
    setCompteAReboursActif(false); // Arrêter le compte à rebours lorsque le jeu est fini
  };

  /**
   * fermeture de l'écran de fin
   */
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

/**
 * 
 * @param {*} bloc 
 * affichage du contenu du rangement cliqué
 */
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
  
    
  };

  /**
   * 
   * @param {*} item
   * ajout du bloc cliqué à la requête de droite 
   */
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

  // Vérifier le type du bloc
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
          <p>
            Coéquipier : {coequipier}
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
                  numero={selectedRecipe.numero}
                  nom={selectedRecipe.nom}
                  etapes={selectedRecipe.etapes || []}
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

      

        <button className='pause-button' onClick={() => handleShowPause()}>||</button>
        {showTitle && <TitleScreen resumeGame={handleNext} saveData={saveData} nomjeu={'SQuisine Lite'}/>}
        {showCoeqTrouve && <PopupWindow closePopup={handleCoeq} title={'Partie trouvée'} message={'Vous avez trouvé un coéquipier'}/>}
        {showPause && <PauseMenu resumeGame={handleResume} saveData={saveData} tutoGame={tutoGame}/>}
        {showErrorLog && <PopupWindow closePopup={handleClosePopup} title={popupTitle} message={popupMessage}/>}
        {showEcranFin && <PopupWindow closePopup={handleCloseEcranFin} title={popupTitle} message={popupMessage}/>}
        {showRangementContenu && <RangementWindow resumeGame={handleQuitRangements} listeIngredients={ingredientsInRangement} selectedRecipe={selectedRecipe}/>}
        {showTuto && <SQuisineTutoMulti resumeGame={handleLancer} saveData={saveData}/>}
        {showInformatico && <Informatico page={'SQuisine'} context={informaticoMessage} closeWindow={handleCloseInformatico} clickToShow={true} /> } 
        {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Recherche de partie en cours...</span>
          </div>}
          {coeqJoue && <div className="loading">
            <span className='bg'/>
            <span className='content'>Ton coéquipier est en train de jouer...</span>
          </div>}
      </div>
       
      </main>
    </div>
  );
};

export default SQuisineMulti;
