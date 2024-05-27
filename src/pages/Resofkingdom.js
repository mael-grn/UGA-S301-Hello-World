import React, { useState, useEffect, useContext } from 'react';
import '../styles/Kingdom.css';
import 'leaflet/dist/leaflet.css';
import Map from '../component/resofkingdom/Map';
import SetItem from '../component/resofkingdom/SetItem';
import ItemList from '../component/resofkingdom/ItemList';
import PauseMenuResof from '../component/PauseMenuResof';
import SideBar from '../component/resofkingdom/SideBar';
import Informatico from '../component/Informatico';
import NavBar from '../component/NavBar';
import { DataContext } from "../DataProvider";
import ResofTuto from '../component/resofkingdom/ResofTuto';
import PopupWindow from '../component/PopupWindow';
import DeviceList from '../component/resofkingdom/DeviceList';
import TitleScreen from '../component/TitleScreen';

 const Resofkingdom = () => {
  //affichage des fenetres de config
  const [showSetItem, setShowSetItem] = useState(false);
  const [elementClicked, setElementClicked] = useState('');

  //menu de pause
  const [showPause, setShowPause] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [action, setAction] = useState('');
  const [actionReturn, setActionReturn] = useState(() => {});
  const [messagebutton, setbuttonmessage] = useState('');
  const { isConnected,majTuto,getTuto } = useContext(DataContext);

  //données de progression
  const [showPopup, setShowPopup] = useState(false);
  const [level, setLevel] = useState(0);
  const [exp, setExp] = useState(0);
  const [dataCollected, setDataCollected] = useState(500);
  const [resourcesCollected, setResourcesCollected] = useState(500);
  const expPerLevel = [
    {level:0, exp:100},
    {level:1, exp:500},
    {level:2, exp:1300},
    {level:3, exp:3000},
    {level:4, exp:7000},
    {level:5, exp:15000},
  ];

  //element selectionné dans la liste d'item
  const [selectedItem, setSelectedItem] = useState('');

  //liste des elements a placer
  const [computerList, setComputerList] = useState([]);
  const [switchList, setSwitchList] = useState([]);
  const [routerList, setRouterList] = useState([]);
  const [serverList, setServerList] = useState([]);
  const [linesList, setLinesList] = useState([]);

  //toutes les cases dans lequelles miner des données
  const [dataBlock, setDataBlock] = useState([]);
  //toutes les cases dans lesquelles miner des ressources
  const [resourcesBlock, setResourcesBlock] = useState([]);
  //gestion de informatico.
  const [showInformatico, setShowInformatico] = useState(false);
  const [informaticoMessage, setInformaticoMessage] = useState('');
  //gestions des attaques.
  const [computersAttaque, setComputersAttaque] = useState([]);
  const [infectionCountDown, setInfectionCountDown] = useState(40);

  //affichage menus
  const [showTitle, setShowTitle] = useState(true);
  const [showTuto, setShowTuto] = useState(false);

   //fonction pour fermer la fenetre popup
   const closePopup = () => {
    setShowPopup(false);
  };

  const handleResume =() => {
    setShowPause(false);
  }

  const tutoFait = async () => {
    try {
      const result = await getTuto('Resof');
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
  const saveData = () => {
    setShowPause(false);
    setAction('');
      setPopupTitle('Partie terminée');
      setPopupMessage(`Merci d\'avoir joué ! Tu as atteint le niveau ${level}`);
      setShowPopup(true);  
      setTimeout(function() {
      setShowPopup(false);
      window.location.replace('/MenuEleve');
      }, 3000);
  }

  const handleCloseInformatico = () => {
    setShowInformatico(false);
  }

  const handleShowTuto = () =>{
    setShowPause(false);
    setShowTuto(true);
  }

  const handleLancer = async () => {
    try {
      const tutofait = await tutoFait();
  
      if (!tutofait) {
        await majTuto('Resof', 'true'); // Attendre la résolution de la promesse
      }
  
      setShowTuto(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tutoriel:', error);
    }
  };

  const handleNext = async () => {
  
    setShowTitle(false);
  
    const tutofait = await tutoFait(); // Utiliser await pour attendre la résolution de la promesse
  
    if (!tutofait) {
      setShowTuto(true);
    }
    
    };

/**
 * Vérifie si les coordonnées spécifiées (x, y) sont disponibles sur la carte en vérifiant chaque type d'élément.
 * @param {number} x - Coordonnée x de l'emplacement à vérifier.
 * @param {number} y - Coordonnée y de l'emplacement à vérifier.
 * @returns {boolean} - True si les coordonnées sont disponibles, sinon False.
 */
  const checkCoordinates = (x, y) => {

    const checkInComputer = computerList.findIndex((item) => item.x === x && item.y === y);
    const checkInSwitch = switchList.findIndex((item) => item.x === x && item.y === y);
    const checkInRouter = routerList.findIndex((item) => item.x === x && item.y === y);
    const checkInServer = serverList.findIndex((item) => item.x === x && item.y === y);

    if (checkInComputer===-1 && checkInSwitch===-1 && checkInRouter===-1 && checkInServer===-1) {
      return true;
    } else {
      return false;
    }
  }
/**
 * Génère un nombre aléatoire entre les bornes spécifiées, inclusivement.
 * @param {number} borneMin - La borne minimale (inclus).
 * @param {number} borneMax - La borne maximale (inclus).
 * @returns {number} - Le nombre aléatoire généré.
 */
  const genererNombreAleatoire = (borneMin,borneMax) => {
    const nouveauNombre = Math.floor(Math.random() * (borneMax - borneMin + 1)) + borneMin;
    return nouveauNombre;
  };
  /**
   * ajout d'un element sur la carte, entre les different type d'item
   * @param {*} item valeur entre computer, switch, router ou server
   * @param {*} pos les coordonées de l'item a placer
   */
  const addItem = (item, pos) => {

    if (checkCoordinates(pos.x, pos.y)) {
      if (item === 'computer') {
      // Trouver le numéro du dernier ordinateur
      const lastComputerNumber = computerList.reduce((max, computer) => {
        const currentNumber = parseInt(computer.nom.split(' ')[1], 10) || 0;
        return currentNumber > max ? currentNumber : max;
      }, 0);
        setComputerList([
          ...computerList,
          {
            nom: `PC ${lastComputerNumber + 1}`,
            ip: '',
            masque: '',
            x:pos.x,
            y:pos.y,
            canCollect: false,
            attaque: false,
          },
        ]);
        // genere un nombre aleatoire et attaque ou non un pc selon ce nombre. 
      } else if (item === 'switch') {
        const lastSwitchNumber = switchList.reduce((max, unswitch) => {
          const currentNumber = parseInt(unswitch.nom.split(' ')[1], 10) || 0;
          return currentNumber > max ? currentNumber : max;
        }, 0);
        setSwitchList([
          ...switchList,
          {
            nom: `Switch ${lastSwitchNumber +1}`,
            ip: '',
            masque: '',
            x:pos.x,
            y:pos.y,
          },
        ]);
      } else if (item === 'router') {
        const lastRouterNumber = routerList.reduce((max, router) => {
          const currentNumber = parseInt(router.nom.split(' ')[1], 10) || 0;
          return currentNumber > max ? currentNumber : max;
        }, 0);
        setRouterList([
          ...routerList,
          {
            nom: `Routeur ${lastRouterNumber +1}`,
            ip: '',
            masque: '',
            x:pos.x,
            y:pos.y,
          },
        ]);
      } else if (item === 'server') {
        const lastserverNumber = serverList.reduce((max, server) => {
          const currentNumber = parseInt(server.nom.split(' ')[1], 10) || 0;
          return currentNumber > max ? currentNumber : max;
        }, 0);
        setServerList([
          ...serverList,
          {
            nom: `Serveur ${lastserverNumber +1}`,
            ip: '',
            masque: '',
            x:pos.x,
            y:pos.y,
            canCollect: false,
            attaque: false,
          },
        ]);        
      }
    }
    
    
  };

  /**
   * Initialise la liste des blocs de ressources sur la carte en générant des coordonnées aléatoires.
   */
  const initialiserResourcesBlock = () => {
    const nombreDeRessources = 30; // Choisissez le nombre souhaité d'objets dans la liste
  
    const nouvelleListe = Array.from({ length: nombreDeRessources }, () => ({
      x: Math.floor(Math.random() * 45) - 22, // Valeurs entre -24 et 24 inclus
      y: Math.floor(Math.random() * 25) - 12, // Valeurs entre -14 et 14 inclus
    }));
  
    setResourcesBlock(nouvelleListe);
  };

  /**
   * Initialise la liste des blocs de données sur la carte en générant des coordonnées aléatoires.
   */
  const initialiserDataBlock = () => {
    const nombreDeRessources = 30;
    const nouvelleListe = [];
  
    for (let i = 0; i < nombreDeRessources; i++) {
      let nouvelElement;
      do {
        nouvelElement = {
          x: Math.floor(Math.random() * 45) - 22,
          y: Math.floor(Math.random() * 25) - 12,
        };
      } while (
        resourcesBlock.some(
          (resource) =>
            resource.x === nouvelElement.x && resource.y === nouvelElement.y
        )
      );
  
      nouvelleListe.push(nouvelElement);
    }
  
    setDataBlock(nouvelleListe);
  };
/**
 * Vérifie si l'adresse IP d'un élément spécifié est unique dans une liste donnée.
 * @param {string} targetname - Le nom de l'élément dont on vérifie l'adresse IP.
 * @param {Array} liste - La liste d'éléments parmi lesquels vérifier l'unicité de l'adresse IP.
 * @returns {boolean} - Renvoie true si l'adresse IP est unique, sinon false.
 */
  const checkUniqueIp = (targetname, liste) => {
    const targetIp = liste.find(item => item.nom === targetname)?.ip;
  
    if (!targetIp) {
      // L'élément avec l'ID spécifié n'a pas été trouvé
      return false;
    }
    
    for (const item of liste) {
      if (item.nom === targetname) {
        continue; // Ignore l'élément actuel s'il a l'ID spécifié
      }
  
      if (item.ip === targetIp) {
        return false; // L'IP n'est pas unique
      }
    }
    return true; // L'IP est unique
  };
/**
 * Vérifie si l'adresse IP et le masque d'un élément spécifié sont différents de ceux des autres éléments dans une liste donnée.
 * @param {string} targetname - Le nom de l'élément dont on vérifie l'adresse IP et le masque.
 * @param {Array} liste - La liste d'éléments parmi lesquels vérifier la différence d'adresse IP et de masque.
 * @returns {boolean} - Renvoie true si l'adresse IP et le masque sont différents, sinon false.
 */
  const checkDifferentResaux = (targetname, liste) => {
    const targetmasque = liste.find(item => item.nom === targetname)?.masque;
    const targetIp = liste.find(item => item.nom === targetname)?.ip;
  
    if (!targetIp || !targetmasque) {
      // L'élément avec l'ID spécifié n'a pas été trouvé
      return false;
    }
    for (const item of liste) {
      const targetMasqueSplit = targetmasque.split('.');
      const itemMasqueSplit = item.masque.split('.');
      const targetIpSplit = targetIp.split('.');
      const itemIpSplit = item.ip.split('.');
      let i=0;
      if (item.nom === targetname) {
        continue; // Ignore l'élément actuel s'il a l'ID spécifié
      }

      if(item.masque !== targetmasque){ //si les masques ne sont pas égaux return true
        return true;
      }
      if (item.ip === targetIp) {
        return false; // L'IP n'est pas unique
      }
      for(const chiffres of targetMasqueSplit){
        if(chiffres !== '0'){
          if(targetIpSplit[i]!== itemIpSplit[i]){
            return true;
          }
        }
        i= i+1;
      }
      return false;
    }
    return true; // L'IP est unique
  };
  /**
   * ajoute à une liste toutes lignes existantes pouvant relier les appareils suivant leurs adresses et leurs masques
   */
  const drawLines = () => {
    // Réinitialiser la liste des lignes
    setLinesList([]);
  
    // Fonction pour vérifier si deux éléments peuvent être connectés. elem1 est le parent de elem2
    const canConnect = (elem1, elem2) => {

      const masque1 = elem1.masque.split('.').map(element => parseInt(element, 10));
      const masque2 = elem2.masque.split('.').map(element => parseInt(element, 10));
      const ip1 = elem1.ip.split('.').map(element => parseInt(element, 10));
      const ip2 = elem2.ip.split('.').map(element => parseInt(element, 10));

      //on compte le nombre de parties réseau 
      if (masque1.length !== 4 || masque2.length !== 4 || ip1.length!== 4 || ip2.length!==4) {
        return false;
      }

      // variables permettant de verifier la continuité des bits
      let masque1WentTo0 = false;
      let masque2WentTo0 = false;
      //on compare les masques, partie par partie
      for (let i = 0; i < 4; i++) {

        //On verifie que la partie réseau du masque parent est egale ou plus courte que que la partie réseau enfant
        if (masque1[i] > masque2[i]) {
          return false; // Les parties réseau ne correspondent pas
        }
        
        //on signifie que les bits sont passés à 0, pour verifier la continuité des bits
        if (masque1[i] === 0) {
          masque1WentTo0 = true;
        }
        if (masque2[i] === 0) {
          masque2WentTo0 = true;
        }

        //Si les bits sont déjà passés à 0 et ne valent plus 0, alors retours d'erreur
        if ((masque1WentTo0 && masque1[i] === 255) || (masque2WentTo0 && masque2[i] === 255)) {
          return false;
        }

        //on verifie que tous les bits d'une partie valent 1 ou 0
        if (masque1[i] !== 255 && masque1[i] !== 0) {
          return false;
        }
      }

      let blocIdentique = true;  // Initialisez une variable pour suivre si les blocs sont identiques

      for (let i = 0; i < 4; i++) {
        // Si les deux adresses IP sont identiques jusqu'à ce bloc et le masque est 255, retourner false
        if (masque1[i] === 255 && ip1[i] !== ip2[i]) {
          return false; // Les parties réseau ne correspondent pas
        }
      
        // Si le bloc est identique jusqu'à présent
        if (blocIdentique) {
          // Si les deux adresses IP sont identiques jusqu'à ce bloc, continuer la vérification
          if (ip1[i] !== ip2[i]) {
            blocIdentique = false;  // Le bloc n'est plus identique
          }
        }
      
        // Si les IP ne sont pas comprises entre 0 et 255, erreur
        if (ip1[i] > 255 || ip1[i] < 0 || ip2[i] > 255 || ip2[i] < 0) {
          return false;
        }
      
        // Vérifier qu'il n'y ait pas de zéros non significatifs
        const regex = /^[1-9]\d*$/;
        if (ip1[i] !== 0 && !regex.test(ip1[i])) {
          return false;
        }
        if (ip2[i] !== 0 && !regex.test(ip2[i])) {
          return false;
        }
      }

      //on regarde si la distance entre les deux elements corresponds au critère (pas plus de 10 blocks)
      //pour cela, on utilise la formule de distance euclidienne
      const distance = Math.sqrt(Math.pow(elem2.x-elem1.x, 2)+Math.pow(elem2.y-elem1.y, 2))
      if (distance>10 || distance<-10) {
        return false;
      }
      return !blocIdentique;
    };
  
/**
 * Ajoute une ligne à la liste des lignes avec les coordonnées spécifiées.
 * @param {number} fromX - Coordonnée X du point de départ de la ligne.
 * @param {number} fromY - Coordonnée Y du point de départ de la ligne.
 * @param {number} toX - Coordonnée X du point d'arrivée de la ligne.
 * @param {number} toY - Coordonnée Y du point d'arrivée de la ligne.
 */    
    const addLine = (fromX, fromY, toX, toY) => {
      console.log('appel addline');
      setLinesList((prevLines) => [
        ...prevLines,
        { fromX, fromY, toX, toY }
      ]);
    };
  
    // Connecter les ordinateurs aux switchs
    computerList.forEach((computer) => {
      switchList.forEach((switchElem) => {
        if (canConnect(switchElem, computer) && checkUniqueIp(computer.nom,computerList) && checkDifferentResaux(switchElem.nom,switchList)) {
          computer.attaque = false;
          computer.canCollect = true;
          console.log('test boucle 1');
          addLine(computer.x, computer.y, switchElem.x, switchElem.y);
        } else {
          computer.canCollect = false;
        }
      });
    });

    // Connecter les routeurs aux switchs
    routerList.forEach((router) => {
      switchList.forEach((switchElem) => {
        if (canConnect(router, switchElem)) {
          console.log('test boucle 2');
          addLine(router.x, router.y, switchElem.x, switchElem.y);
        }
      });
    });
  
    // Connecter les serveurs aux routeurs
    serverList.forEach((server) => {
      routerList.forEach((router) => {
        if (canConnect(router, server) && checkUniqueIp(server.nom,serverList)) {
          console.log('test boucle 3');
          server.canCollect = true;
          addLine(server.x, server.y, router.x, router.y);
        } else {
          server.canCollect = false;
        }
      });
    });
  };

  /**
   * permet de gerer le compte a rebours des infections, et genere la liste d'ordinateurs infectés a la fin du compte
   * a rebours.
   * Les ordinateurs infectés des ordinateurs séléctionnés aléatoirement. Le nombre d'ordinateurs infecté est choisi aléatoirement entre 0 et un quart du nombre total d'ordinateur.
   */
  const updateInfection = () => {
    if (infectionCountDown === 0) {
      const quarterOfComputers = Math.floor(computerList.length / 4);
      const numberOfInfectedComputers = genererNombreAleatoire(1, quarterOfComputers);

      const infectedComputers = [];
      while (infectedComputers.length < numberOfInfectedComputers) {
        const randomIndex = genererNombreAleatoire(0, computerList.length - 1);
        if (!infectedComputers.includes(randomIndex)) {
          infectedComputers.push(randomIndex);
        }
      }

      setComputersAttaque(infectedComputers);
      setInfectionCountDown(60);
    } else {
      setInfectionCountDown((prev) => prev - 1);
    }
  };

  /**
   * Verifie tous les elements placées sur la map, et incrémente les données collectées en fonction du nombre d'elements sur les cases
   */
  const updateScore = () => {

    // Liste des coordonnées des dataBlock
  const dataBlockCoordinates = dataBlock.map((block) => ({ x: block.x, y: block.y }));

  // Vérifier si un ordinateur est attaqué
  if (computersAttaque.length > 0) {
    const updatedComputers = computerList.map((computer, index) => {
      if (computersAttaque.includes(index)) {
        // L'ordinateur est attaqué
        return {
          ...computer,
          canCollect: false,
          attaque: true,
          ip: '',
          masque: '',
        };
      }
      return computer;
    });

    setComputerList(updatedComputers);
    setComputersAttaque([]);
  }

  // Filtrer les PC qui ont les mêmes coordonnées que les dataBlock
  const serversOnDataBlocks = serverList.filter((server) =>
    dataBlockCoordinates.some((dataCoordinates) =>
    server.x === dataCoordinates.x && server.y === dataCoordinates.y && server.canCollect
    )
  );
  
  const resourcesBlockCoordinates = resourcesBlock.map((block) => ({ x: block.x, y: block.y }));

  // Filtrer les PC qui ont les mêmes coordonnées que les dataBlock
  const computersOnResourcesBlocks = computerList.filter((computer) =>
  resourcesBlockCoordinates.some((resourcesCoordinates) =>
      computer.x === resourcesCoordinates.x && computer.y === resourcesCoordinates.y && computer.canCollect
    )
  );

  setDataCollected(prevData => prevData + serversOnDataBlocks.length);
  setResourcesCollected(prevResources => prevResources + computersOnResourcesBlocks.length);
  setExp(prevExp => prevExp + serversOnDataBlocks.length*4 + computersOnResourcesBlocks.length*4);

  if (expPerLevel.find((levelInfo) => levelInfo.level === level).exp <= exp) {
    if(level===0){
      setShowInformatico(true);
      setInformaticoMessage('lvl1');
    }else if(level === 1){
      setShowInformatico(true);
      setInformaticoMessage('lvl2');
    }
    setLevel((prevLevel) => {
      const nextLevel = expPerLevel.find((levelInfo) => levelInfo.exp > exp);
      return nextLevel ? nextLevel.level : prevLevel;
    });
  }  
  }
  
  /**
   * initialiser les listes au chargement
   */
  useEffect(() => {
    initialiserResourcesBlock();
    initialiserDataBlock();
    setShowInformatico(true);
    setInformaticoMessage('connexion');
  }, []);

  useEffect(() => {
    // Appeler checkData toutes les secondes

    if (computerList.length === 1) {
      setShowInformatico(true)
      setInformaticoMessage('firstComputer');
    }
    
    if (computerList.length>0 && computersAttaque.length === 1) {
      setShowInformatico(true)
      setInformaticoMessage('firstInfected');
    }

    if (switchList.length === 1) {
      setShowInformatico(true)
      setInformaticoMessage('firstSwitch');
    }

    if (routerList.length === 1) {
      setShowInformatico(true)
      setInformaticoMessage('firstRouter');
    }

    const intervalId = setInterval(updateScore, 1000);

    drawLines();
    
    
    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, [computerList, serverList, switchList, routerList, showSetItem, resourcesCollected, dataCollected, computersAttaque]);

  useEffect(() => {
    // Appeler checkData toutes les secondes
    const intervalId = setInterval(updateInfection, 1000);    
    
    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, [infectionCountDown, computersAttaque]);

  const supprimerItem = (nom) => {
    const item = nom.slice(0, -2);
    if (item==='PC') {
      setComputerList((prevList) => prevList.filter((computer) => computer.nom !== nom));
      setDataCollected(prev => prev+50);
    } else if (item==='Switch') {
      setDataCollected(prev => prev+100);
      setSwitchList((prevList) => prevList.filter((unswitch) => unswitch.nom !== nom));
    } else if (item==='Serveur') {
      setServerList((prevList) => prevList.filter((server) => server.nom !== nom));
      setResourcesCollected(prev => prev+50);
    } else if (item==='Routeur') {
      setRouterList((prevList) => prevList.filter((router) => router.nom !== nom));
      setResourcesCollected(prev => prev+300);
      setDataCollected(prev =>prev+100);
    }
  };
  const handleShowSetItem = (elem) => {
    if(showSetItem){
      setShowSetItem(false);
    }else{
          var elemIndex = computerList.findIndex((item) => item.nom === elem);
    setElementClicked(computerList[elemIndex]);
    if (elemIndex === -1) {
      elemIndex = switchList.findIndex((item) => item.nom === elem);
      setElementClicked(switchList[elemIndex]);
    }

    if (elemIndex === -1) {
      elemIndex = routerList.findIndex((item) => item.nom === elem);
      setElementClicked(routerList[elemIndex]);

    }

    if (elemIndex === -1) {
      elemIndex = serverList.findIndex((item) => item.nom === elem);
      setElementClicked(serverList[elemIndex]);
    }    
  }
    setShowSetItem(true);
  }

  const handleCloseSetItem = () => {
    setElementClicked('');
    setShowSetItem(false);
  }

/**
 * Gère la sélection et la désélection d'un élément.
 * @param {string} item - Le type d'élément sélectionné (computer, switch, router, server).
 */
  const handleSetSelectedItem = (item) => {

    if (selectedItem === item ){
      //si on clique une deuxieme fois sur l'item, on reinitialise
      setSelectedItem('');
      //rendre l'argent
      if (item === 'computer') {
        setDataCollected(prevData => prevData+50);
      } else if (item==='switch') {
        setDataCollected(prevData => prevData+100);
      } else if (item==='router') {
        setDataCollected(prevData => prevData+100);
        setResourcesCollected(prevResources => prevResources+300);
      } else if (item==='server') {
        setResourcesCollected(prevResources => prevResources+50);
      }
    }else if(selectedItem !==item && item !== ''){
      if (selectedItem === 'computer') {
        setDataCollected(prevData => prevData+50);
      } else if (selectedItem==='switch') {
        setDataCollected(prevData => prevData+100);
      } else if (selectedItem==='router') {
        setDataCollected(prevData => prevData+100);
        setResourcesCollected(prevResources => prevResources+300);
      } else if (selectedItem==='server') {
        setResourcesCollected(prevResources => prevResources+50);
      }
      setSelectedItem(item);
      if (item === 'computer') {
        setDataCollected(prevData => prevData-50);
      } else if (item==='switch') {
        setDataCollected(prevData => prevData-100);
      } else if (item==='router') {
        setDataCollected(prevData => prevData-100);
        setResourcesCollected(prevResources => prevResources-300);
      } else if (item==='server') {
        setResourcesCollected(prevResources => prevResources-50);
      }
    }else {
      setSelectedItem(item);
      //prendre l'argent
      if (item === 'computer') {
        setDataCollected(prevData => prevData-50);
      } else if (item==='switch') {
        setDataCollected(prevData => prevData-100);
      } else if (item==='router') {
        setDataCollected(prevData => prevData-100);
        setResourcesCollected(prevResources => prevResources-300);
      } else if (item==='server') {
        setResourcesCollected(prevResources => prevResources-50);
      }
    }
    
  }

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
    <div className='resofkingdom'>

      <main>

        <Map showSetItem={handleShowSetItem} computerList={computerList} switchList={switchList} routerList={routerList} serverList={serverList} addItem={addItem} selectedItem={selectedItem} setSelectedItem={handleSetSelectedItem} ressourcesBlock={resourcesBlock} dataBlock={dataBlock} linesList={linesList}/>

      </main>
      <DeviceList computerList={computerList} switchList={switchList} routerList={routerList} serverList={serverList} />
      <ItemList selectedItem={selectedItem} setSelectedItem={handleSetSelectedItem} resources={resourcesCollected} data={dataCollected}/>
      <SideBar level={level} exp={exp} expGoal={expPerLevel.find((levelInfo) => levelInfo.level === level).exp} data={dataCollected} resources={resourcesCollected} countDown={infectionCountDown}/>
      <button className='pause-button' onClick={() => setShowPause(true)}></button>
      {showTitle && <TitleScreen resumeGame={handleNext} saveData={saveData} nomjeu={'Res\'of Kingdom'}/>}
      {showSetItem && <SetItem onCloseSetItem={handleCloseSetItem} infoItem={elementClicked} deleteItem={supprimerItem}/>}
      {showPause && <PauseMenuResof resumeGame={handleResume} saveData={saveData} tutoGame={handleShowTuto}/>}
      {showInformatico && <Informatico page={'Resof'} context={informaticoMessage} closeWindow={handleCloseInformatico}/> } 
      {showTuto && <ResofTuto resumeGame={ handleLancer}/>}
      {showPopup && <PopupWindow closePopup={closePopup} title={popupTitle} message={popupMessage} action={action} returnAction={actionReturn} messagebutton={messagebutton}/>}
    </div>
  );
};

export default Resofkingdom;