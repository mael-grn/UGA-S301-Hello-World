import React, { useState, useEffect, useContext } from 'react';
import '../styles/ShellHunt.css';
import Informatico from '../component/Informatico';
import { DataContext } from '../DataProvider';
import PauseMenu from '../component/PauseMenu';
import PopupWindow from '../component/PopupWindow';




//dosier virus
//perdre la partie
//

const ShellHunt = () => {



    //-------------------------------------------------------------------------------------------------------------------------------- Variables
    //Variables
    const { isConnected } = useContext(DataContext);


    const suspect = ['Chloé', 'Yoann', 'Maxime', 'Mael', 'Titou', 'Jules','Joelle','Laurent','Deborah','Christophe','Patrick','Sophie','Corinne','Philipe','Marcelo','Frederique','Ayoub','Bénédicte','Olivier'];
    const lieu = ["Tram", "IUT 2", "Boulangerie", "Bar", "Appartement", "Victor Hugo", "Bastille"];
      const sousLieux = {
        Tram: ["A", "E","B","C"],
        IUT: ["Salle Info", "Amphi", "Labo"],
        Boulangerie: ["Caisse", "Arrière boutique"],
        Bar: ["Comptoir", "Coin Salon"],
        Appartement: ["Chambre", "Cuisine", "Salle de bain"],
        VH: ["Burger King", "Parc"],
        Bastille: ["Restaurant", "Bulles"]

      };
      const arme = [
        'Couteau',
        'Barre de fer',
        'Fusil',
        'Cutter',
        'Sabre à canne',
        'Poison',
        'Acide',
        'Babouche',
        'Bombe',
        'Arbalète',
        'Grenade',
        'Marteau',
        'Matraque',
        'Hache',
        'Katana',
        'Mitraillette',
        'Pistolet',
        'Épée',
        'Lance'
      ];
      
    //chemin
    const [cheminActuel, setCheminActuel] = useState('Grenoble/');
    const [cheminDossierActuel, setCheminDossierActuel] = useState('~/');

    const [pieceActuelle, setPieceActuelle] = useState(null);
    


    //Constante des commandes
    const [cdSelectionne, setCdSelectionne] = useState(false);
    const [cdDossierSelectionne, setCdDossierSelectionne] = useState(false);

    const [lsDossierSelectionne, setLsDossierSelectionne] = useState(false);
    const [lsSelectionne, setLsSelectionne] = useState(false);
    //cd ..
    const [historiqueEmplacements, setHistoriqueEmplacements] = useState([]);
    const [psSelectionne, setPsSelectionne] = useState(false)
    //mkdir
    const [dossierActuel, setDossierActuel] = useState("");
    const [listeDossiers, setListeDossiers] = useState([]);
    const [mkdirDossier, setMkdirDossier] = useState({
      nom: "",
      dossier: "",
      contenu:""
    });
    //touch
    const [actionEnCours, setActionEnCours] = useState(null);
    const [champVisible, setChampVisible] = useState(false);
    const [fichierSelectionne, setFichierSelectionne] = useState(null);
    const [listeFichiers, setListeFichiers] = useState([]);
    //cat
    const [nouveauContenu, setNouveauContenu] = useState('');
    const [catSelectionne, setCatSelectionne] = useState(false);
    const [zoneContenu, setZoneContenu] = useState(false);
    //exec
    const [execSelectionne, setExecSeletionne] = useState(false);
    const [estJuste, setEstJuste] = useState(false);
    const [reponse, setReponse] = useState(false);
    const [nbTentative, setNbTentative] = useState(0);
    //cp
    const [cheminSaisi, setCheminSaisi] = useState('');
    const [cpSelectionne, setCpSelectionne] = useState(false);
    const [soumettre, setSoumettre] = useState(false);


    

    
    // utilisation d'informatico
    const [showInformatico, setShowInformatico] = useState(true);
    const [informaticoMessage, setInformaticoMessage] = useState('Tuto');

// Debut Popup //

const [popupTitle, setPopupTitle] = useState('');
const [popupMessage, setPopupMessage] = useState([]);
const [showEcranFin, setShowEcranFin] = useState(false);
const [showPause, setShowPause] = useState(false);


  const handleShowEcranFin = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowEcranFin(true);
    
  };

  const handleCloseEcranFin = () => {
    const currentPathname = window.location.pathname;
    const newPathname = currentPathname.substring(0, currentPathname.lastIndexOf('/')) + '/MenuEleve';
  
    window.location.pathname = newPathname;
    setShowEcranFin(true);
    
  };
//Fin Popup de fin//

    //-------------------------------------------------------------------------------------------------------------------------------- Génération d'une solution
    
    //permets de reprendre le jeu pour le menu pause
    const handleResume =() => {
      setShowPause(false);
    }
    
    //Aleatoire: 
      function aleatoire(liste){
        const indiceAleatoire = Math.floor(Math.random() * liste.length);
        return liste[indiceAleatoire];
      }
  
      // Générer une solution au hasard au début de la partie
      const [solution, setSolution] = useState({
        coupable: aleatoire(suspect),
        armeCoupable: aleatoire(arme),
        lieuCoupable: aleatoire(lieu)
      });
  
      
      // fermeture informatico
     const handleCloseInformatico = () => {
      setShowInformatico(false);
      }  


    //--------------------------------------------------------------------------------------------------------------------------------

    //-------------------------------------------------------------------------------------------------------------------------------- Génération d'un plan de Jeu

    const [dynamicLocationsData, setDynamicLocationsData] = useState(() => {
      const planDeJeu = {};
    
      // Extract the remaining suspects and weapons excluding the actual culprit
      const suspectsRestants = suspect.filter(suspectName => suspectName !== solution.coupable);
      const armesRestantes = arme.filter(armeName => armeName !== solution.armeCoupable);
    
      // Shuffle the suspects and weapons
      const shuffledSuspects = suspectsRestants.sort(() => Math.random() - 0.5);
      const shuffledArmes = armesRestantes.sort(() => Math.random() - 0.5);
    
      // Assign suspects and weapons to different locations
      lieu.forEach((lieuName) => {
        planDeJeu[lieuName] = {};
    
        const sousLieuxForLocation = sousLieux[lieuName];
        if (sousLieuxForLocation) {
          sousLieuxForLocation.forEach((sousLieuName) => {
            // Assign suspects to the sous-lieu (excluding the actual culprit)
            const suspectsForSousLieu = shuffledSuspects.pop();
            planDeJeu[sousLieuName] = { suspects: [], armes: [] };
            if (suspectsForSousLieu) {
              planDeJeu[sousLieuName].suspects.push(suspectsForSousLieu);
            }
    
            // Assign weapons to the sous-lieu (excluding the actual weapon)
            const armesForSousLieu = shuffledArmes.pop();
            if (armesForSousLieu) {
              planDeJeu[sousLieuName].armes.push(armesForSousLieu);
            }
          });
        }
      });
    
      return planDeJeu;
    });
    
    



    //--------------------------------------------------------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------------------------------------------------------- Foncitons des commandes 
    //Fonctions des commandes
    //CD
    const seDeplacer = (nom, type) => {
      if (type === 'lieu' && cdSelectionne) {
        setPieceActuelle(nom);
        setCdSelectionne(false);
        setLsSelectionne(false);
    
        // Ajouter le nouvel emplacement à l'historique
        setHistoriqueEmplacements([...historiqueEmplacements, cheminActuel]);
        setCheminActuel(`${cheminActuel}${nom}/`);
      }
      
      if (type === 'dossier' && cdDossierSelectionne) {
          setDossierActuel(nom)
          setCheminDossierActuel(`${cheminDossierActuel}${nom}/`);
          setLsDossierSelectionne(false);
      }
    };

    if (!isConnected) {
      return (
        <div className='unauthorized'>
          <header className='App-header'>
        </header>
        <main>
          <h1>Vous n'avez pas accès à cette page</h1>
        </main>
        
        </div>
      );
    }
  
  
    //LS
    //Affichage des lieux  
    const listerLieux = () => {
      //Liste de lieux s'affiche si : lsSecltionne == true et on est dans Grenoble
      if(lsSelectionne && pieceActuelle == null){
        return lieu.map((lieu) => (
          //Lieux séléctionnable que si cdSelectionne == true
          cdSelectionne ? (
            <div key={lieu}>
              <button className= "small-button" key={lieu} onClick={() => seDeplacer(lieu , 'lieu')}>
                {lieu}
              </button>
            </div>
            
          ) 
          ://Sinon juste un liste
          (
            <div key={lieu}>
              <span key={lieu}>{lieu}</span>
            </div>
          )
      ))};
    }

    const listerSousLieux = (piece) => {
      //affiche les sous-lieux si lsSlecionne == true et le lieux a des sous-lieux
      return lsSelectionne ? sousLieux[piece]?.map((sousLieu) => (
        cdSelectionne ? (
          <div key={sousLieu}>
            <button className= "small-button" onClick={() => seDeplacer(sousLieu, 'lieu')}>
              {sousLieu}
            </button>
          </div>
        ) : (
          <div key={sousLieu}>
            <span>{sousLieu}</span>
          </div>
        )
      )) : null;
    };

    //lister les dossiers
    const listerDossiers = () => {
      if (lsDossierSelectionne && cheminDossierActuel === '~/') {
        return (
          <ul>
            {listeDossiers.map((dossier, index) => (
              <li key={index}>
                {cdDossierSelectionne ? (
                  <button className= "dossier" onClick={() => seDeplacer(dossier.nom, 'dossier')}>
                    {dossier.nom}
                  </button>
                ) : (
                  <span>{dossier.nom}</span>
                )}
              </li>
            ))}
          </ul>
        );
      } else {
        return null; // Ne rien afficher si lsDossierSelectionne est faux
      }
    };

    const listerFichier = () => {
      const fichiersDuDossier = listeFichiers.filter((fichier) => fichier.dossier === dossierActuel);
    
      if (lsDossierSelectionne && fichiersDuDossier.length > 0) {
        return (
          <ul>
            {fichiersDuDossier.map((fichier) => (
              <li key={fichier.id}>
                {catSelectionne ? (
                  <button className= "small-button" onClick={() => selectionnerFichier(fichier)}>{fichier.nom}</button>
                ) : (
                  <span>{fichier.nom}</span>
                )}
              </li>
            ))}
          </ul>
        );
      } else {
        return null;
      }
    };
    



    //CD ..
    const retour = (type) => {
      if(type === 'dossier') {
        setDossierActuel("");
        setCheminDossierActuel('~/');

      }

      if (historiqueEmplacements.length > 0) {
        const dernierEmplacement = historiqueEmplacements.pop();
        
        // Mettez à jour le chemin actuel
        setCheminActuel(dernierEmplacement);
    
        // Séparez le chemin en segments
        const segments = dernierEmplacement.split('/');
    
        // Obtenez le dernier segment non vide (avant-dernier élément)
        const pieceActuelle = segments[segments.length - 2] || null;
    
        if (type === 'lieu') {
          // Si on revient d'un lieu, mettez à jour la pièce actuelle
          setPieceActuelle(dernierEmplacement === 'Grenoble/' ? null : pieceActuelle);          
          setHistoriqueEmplacements([...historiqueEmplacements]);
        
        } 
      }
      setPsSelectionne(false);
    };

    
    const afficherChampSaisie = (action) => {
      setChampVisible(true);
      setActionEnCours(action);
    };
    

    function verifieDoublon(nom, liste) {
      for (let i = 0; i < liste.length; i++) {
        if (liste[i].nom === nom) {
          // Le nom est trouvé dans la liste, renvoie true pour indiquer un doublon
          return true;
        }
      }
      // Si la boucle se termine sans retourner true, cela signifie qu'aucun doublon n'a été trouvé
      return false;
    }

    //mkdir
    const creerNouveauDossier = (nomDossier) => {
      if (mkdirDossier.nom.trim() !== "" && !verifieDoublon(nomDossier, listeDossiers)) {
        if(actionEnCours ==='mkdir'){
          // Ajoutez le nouveau dossier à l'état des nouveaux dossiers
          setListeDossiers([...listeDossiers, mkdirDossier]);
          setChampVisible(false);
          setActionEnCours(null);

        }else if(actionEnCours === 'touch' && !verifieDoublon(nomDossier, listeFichiers)){
          
          setListeFichiers([...listeFichiers, {nom : mkdirDossier.nom, dossier: dossierActuel}]);
          setChampVisible(false);
          setActionEnCours(null);

        }
      } else {
      }
    };
    
    //rm
    const supprimerDossier = (nom) => {
      if(nom !== ''){
        
        //suppime dossier et fichier appartenant au dossier
        if(verifieDoublon(nom, listeDossiers)){
          const nouveauxDossiers = listeDossiers.filter((dossier) => dossier.nom !== nom);
          setListeDossiers(nouveauxDossiers);
          const nouveauxFichiers = listeFichiers.filter((fichier) => fichier.dossier !== nom);
          setListeFichiers(nouveauxFichiers);

        }else if(verifieDoublon(nom, listeFichiers)){
          const nouveauxFichiers = listeFichiers.filter((fichier) => fichier.nom !== nom);
          setListeFichiers(nouveauxFichiers);
        }

        // Si le dossier supprimé est actuellement ouvert, réinitialiser le chemin du dossier actuel
        if (cheminDossierActuel.startsWith(`~/${nom}/`)) {
          setCheminDossierActuel('~/');
        }

        setChampVisible(false);
        setActionEnCours(null);

      }

    };

   
    const selectionnerFichier = (fichier) => {
      setFichierSelectionne(fichier);
      setNouveauContenu(fichier.contenu);
      setCatSelectionne(false);
      setZoneContenu(true);
    };
    
    const catFichier = () => {
      if (fichierSelectionne) {
        setListeFichiers((ancienneListe) =>
          ancienneListe.map((fichier) =>
            fichier.nom === fichierSelectionne.nom
              ? { ...fichier, contenu: nouveauContenu }
              : fichier
          )
        );
        setFichierSelectionne('');
        setZoneContenu(false);
      }
    };

    const soumettreReponse = () => {
      // Vérifiez que le nom du fichier est fourni
      if (fichierSelectionne.trim() === '') {
        console.log('Veuillez entrer un nom de fichier valide.');
        return;
      }
    
      // Recherchez le fichier correspondant dans la liste
      const fichierSoumis = listeFichiers.find((fichier) => fichier.nom === fichierSelectionne);
    
              if (fichierSoumis) {
          const reponseUtilisateur = fichierSoumis.contenu.split(';');
          
  
      
          // Vérifiez la réponse utilisateur par rapport à la solution
      const estCoupableCorrect = reponseUtilisateur[0].toLowerCase() === solution.coupable.toLowerCase();
      const estArmeCorrect = reponseUtilisateur[1].toLowerCase() === solution.armeCoupable.toLowerCase();
      const estLieuCorrect = reponseUtilisateur[2].toLowerCase() === solution.lieuCoupable.toLowerCase();

    
        if (estCoupableCorrect && estArmeCorrect && estLieuCorrect) {
            setEstJuste(true);
            setReponse(true);
          } else {
            setEstJuste(false);
            setReponse(true);
          }
        } else {
          console.log('Fichier non trouvé.');
        }
          
      setSoumettre(true);
      setExecSeletionne(false);
      setFichierSelectionne('');
      setNbTentative(prevNbTentative => prevNbTentative + 1); // Utilisez une fonction de rappel pour éviter la boucle infinie

    };
    
    

    const copierFichier = () => {
      // Vérifiez que le chemin entré par les joueurs est correct
      if (cheminSaisi === "~/./meurtre/lieu.txt") {
        // Créez un nouveau fichier avec le contenu spécifié
        const nouveauFichier = {
          nom: 'lieu.txt',
          dossier: "", // Vous pouvez ajuster cela selon vos besoins
          contenu: `Le meurtre s'est produit à: ${solution.lieuCoupable}.`
        };
    
        // Ajoutez le nouveau fichier à la liste des fichiers
        setListeFichiers([...listeFichiers, nouveauFichier]);
    
        // Réinitialisez l'état du chemin saisi
        setCheminSaisi('');
      } else if(cheminSaisi === "~/./suspects/allsuspects.txt") {
        const nouveauFichier = {
          nom: 'suspects.txt',
          dossier: "", // Vous pouvez ajuster cela selon vos besoins
          contenu: `Liste des suspects : ${suspect.join(', ')}.`
        };
        setListeFichiers([...listeFichiers, nouveauFichier]);
        setCheminSaisi('');
        
      } else if(cheminSaisi === "~/./armes/allarmes.txt") {
        const nouveauFichier = {
          nom: 'armes.txt',
          dossier: "", // Vous pouvez ajuster cela selon vos besoins
          contenu: `Liste des suspects : ${arme.join(', ')}.`
        };
        setListeFichiers([...listeFichiers, nouveauFichier]);
        setCheminSaisi('');
        
      }else{
        return ( 
          <p>Chemin incorrect. </p>
        );
      }
      setLsSelectionne(false);
      setCpSelectionne(false);
    };
    

    //--------------------------------------------------------------------------------------------------------------------------------
    
  
  
  return (
    <div className='ShellHunt'>
      {showPause && <PauseMenu resumeGame={handleResume}/>}
        <button className='pause-button' onClick={() => setShowPause(true)}></button>

      <main>

        <div className='game-part'>

        

      <h3>Partie jeu : </h3>
      
      <div className='btn-lst'>
      <button className="command-block small-button" onClick={(e) => { e.preventDefault(); setCdSelectionne(!cdSelectionne); }}>cd</button>
      <button className="command-block small-button" onClick={(e) => { e.preventDefault(); setLsSelectionne(!lsSelectionne); }}>ls</button>
      <button className="command-block small-button" onClick={(e) => { e.preventDefault(); setPsSelectionne(!psSelectionne) }}>ls -l</button>
      <button className="command-block small-button" onClick={(e) => { e.preventDefault(); retour('lieu'); }}>cd ..</button>
      </div>
     
      
      <div className='game-info'>
      <p>Le chemin actuel : {cheminActuel}</p>
      <p>La pièce actuelle : {pieceActuelle}</p>
      <p>SOLUTION</p>
      <p>suspect : {solution.coupable} / arme : {solution.armeCoupable} / lieu : {solution.lieuCoupable}</p>
      </div>
        
        
        <div>
        {listerLieux()}
        {listerSousLieux(pieceActuelle)}
        </div>

        
        {pieceActuelle && psSelectionne && dynamicLocationsData[pieceActuelle] && (
          <div>
            <h3>Informations sur le lieu actuel : {pieceActuelle}</h3>
            <h4>Suspect présent : {Array.isArray(dynamicLocationsData[pieceActuelle]?.suspects) ? dynamicLocationsData[pieceActuelle]?.suspects.join(', ') || 'Aucun suspect' : 'Aucun suspect'}</h4>
            <h4>Arme disponible : {Array.isArray(dynamicLocationsData[pieceActuelle]?.armes) ? dynamicLocationsData[pieceActuelle]?.armes.join(', ') || 'Aucune arme' : 'Aucune arme'}</h4>
          </div>
        )}

       


        </div>
        <div className='file-part'>

        <h3>Partie dossier : </h3>
        <p>Chemin actuel : { cheminDossierActuel}</p>

        <div className='btn-lst'>
        <button className="command-block small-button" onClick={(e) => { e.preventDefault(); retour('dossier'); }}>cd ..</button>
        <button className="command-block small-button" onClick={(e) => { e.preventDefault(); setCdDossierSelectionne(!cdDossierSelectionne); }}>cd</button>
        <button className="command-block small-button" onClick={(e) => { e.preventDefault(); setLsDossierSelectionne(!lsDossierSelectionne); }}>ls</button>
        <button className=' small-button' onClick={() => afficherChampSaisie('mkdir')} disabled = {cheminDossierActuel !== '~/'}>mkdir</button>
        <button className=' small-button' onClick={() => afficherChampSaisie('rm')}>rm</button>
        <button className=' small-button' onClick={() => afficherChampSaisie('touch')}>mkdir -r</button>
        <button  className="command-block  small-button" onClick={(e) => { e.preventDefault(); setCatSelectionne(!catSelectionne); }}>nano</button>
        <button className=' small-button' onClick={() => setExecSeletionne(!execSelectionne)}>exec</button>
        <button className=' small-button' onClick={(e) => { e.preventDefault(); setCpSelectionne(!cpSelectionne)}}>cp</button>
        </div>
        
        <div className='file-info'>
          <p>Dossier atuel : {dossierActuel}</p>
          <p>Chemin à copier : 
            <ul>
            <li>~/./meurtre/lieu.txt</li>
            <li>~/./suspects/allsuspects.txt</li>
            <li>~/./armes/allarmes.txt</li>
            </ul>
          </p>
          {listerDossiers()}
          {listerFichier()}

        <div>

        <div>
        {champVisible && (
          <div>
            <input
              type="text"
              value={mkdirDossier.nom}
              onChange={(e) => setMkdirDossier({ ...mkdirDossier, nom: e.target.value })}
            />
            {(actionEnCours === 'mkdir'|| actionEnCours === 'touch') && (
            <button onClick={() => creerNouveauDossier(mkdirDossier.nom)}>Créer</button>
            )}
            {actionEnCours === 'rm' && (
             <button onClick={() => supprimerDossier(mkdirDossier.nom)}>Supprimer</button> 
            )}
          </div>
        )}
        </div>


        {cpSelectionne && (
          <div>
            <input
              type="text"
              placeholder="Entrez le chemin"
              value={cheminSaisi}
              onChange={(e) => setCheminSaisi(e.target.value)}
            />
            <button onClick={copierFichier}>Copier</button>
            </div>
          )}



        

    {execSelectionne && (
      <div>
        <input
          type="text"
          placeholder="Nom du fichier"
          value={fichierSelectionne}
          onChange={(e) => setFichierSelectionne(e.target.value)}
        />
        <button onClick={soumettreReponse}>Soumettre</button>
        
      </div>
    )}

    
    {soumettre && (
      <div>
        <p>{` ${estJuste
          ? 'Bravo ! La réponse est correcte.'
          : 'Dommage, la réponse est incorrecte.'}`}</p>
        {nbTentative === 3 && <p>Vous avez utilisé vos trois chances :/ . </p>}
      </div>
    )}




      {zoneContenu && fichierSelectionne && (
        <div>
          <h3>Fichier sélectionné : {fichierSelectionne.nom}</h3>
          <textarea className='textareaGrande'
            value={nouveauContenu}
            onChange={(e) => setNouveauContenu(e.target.value)}
          />
          <button onClick={catFichier}>Modifier Contenu</button>
          <button onClick={() => setZoneContenu(false)}>Annuler</button>       
        </div>
      )}
    </div>

        </div>   
        </div>

         

        {showInformatico && <Informatico page={'ShellHunt'} context={informaticoMessage} closeWindow={handleCloseInformatico}/> } 
        {estJuste && <PopupWindow closePopup={handleCloseEcranFin} title="Victoire" message="Bravo ! La réponse est correcte." />}
        {nbTentative === 3 && <PopupWindow closePopup={handleCloseEcranFin} title="Défaite" message="Vous avez utilisé vos trois chances :/ ."  />}


      </main>

    </div>
    
  );
};

export default ShellHunt