// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';
// import config from './config'; // Assurez-vous de spécifier le chemin correct

/**
 * AuthProvider permet de gerer l'authentification d'un utilisateur. Il vas faire les requete vers le serveur pour authentifier le compte,
 * sauvegarder les données importantes dans un contexte qui restera global à l'application, et aussi dans les cookies.
 */

//créée un context, cela sauvegardera tous les useStates déclarés dans toutes l'application. Ainsi, ces données seront
//facilement récuperable pour verifier l'utilisateur, récuperer ses données.
export const DataContext = createContext();

/**
   * Mettre a jours les données de l'utilisateur
   * @param {*} userName le login
   * @param {*} name le prénom
   * @param {*} surName le nom
   * @param {*} group le groupe de l'utilisateur, si c'est un élève
   * @param {*} teacher true si l'utilisateur est un professeur
   * @param {*} isConnected true s'il l'utilisateur s'est correctement loggé
   */
export const setUserData = (userName, name, surName, group, teacher, isConnected) => {
  localStorage.setItem('userName', userName);
  localStorage.setItem('name', name);
  localStorage.setItem('surName', surName);
  localStorage.setItem('group', group);
  localStorage.setItem('teacher', teacher);
  localStorage.setItem('isConnected', isConnected);
  window.location.replace('/');
}


const logout = () => {
    
  localStorage.removeItem('userName');
  localStorage.removeItem('name');
  localStorage.removeItem('surName');
  localStorage.removeItem('group');
  localStorage.removeItem('teacher');
  localStorage.removeItem('isConnected');
  localStorage.removeItem('qcm')
  window.location.replace('/');
};

/**
   * Mettre a jour les données du groupe
   * @param {*} idGroupe l'identifiant du groupe
   * @param {*} niveau le niveau du groupe (par exemple terminal)
   * @param {*} dateCreation 
   * @param {*} professeur le professeur responsable du groupe
   */
const setGroupeData = (idGroupe,niveau,dateCreation,professeur) => {
  localStorage.setItem('idGroupe', idGroupe);
  localStorage.setItem('niveau', niveau);
  localStorage.setItem('dateCreation', dateCreation);
  localStorage.setItem('professeur', professeur);
  window.location.replace('/');
}

/**
   * rentre des données d'un nouvel utilisateur dans la base, et connecte l'utilisateur
   * @param {*} prenom 
   * @param {*} nom 
   * @param {*} dateNaiss 
   * @param {*} teacher 
   * @param {*} password 
   * @param {*} consentement
   * @returns 
   */
export const register = (prenom, nom, dateNaiss, teacher, password,accordParent) => {
  return new Promise((resolve, reject) => {
    resolve(true);
    setUserData(login, prenom, nom, null, teacher, true);
  });
};

/**
   * ajoute une phrase dite par informatico dans la base de données.
   * De cette manière, informatico ne dit jamais deux fois la meme phrase
   * @param {*} sentence 
   */
export const addInformaticoSentence = (sentence) => {
}

/**
 * return true si informatico à jamais une phrase
 * @param {*} sentence la phrase à verifier
 * @returns 
 */
export const checkInformaticoSentence = (sentence) => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

/**
   * Mettre a jours les données du groupe, SEULEMENT en local
   * @param {*} newGroup 
   */
export const updateGroup = (newGroup) => {
  localStorage.setItem('group', newGroup);
  //ajouter ici la mise a jours de la BD
};
/**
 * Verifier dans la base les données de connexion d'un utilisateur.
 * @param {*} userName son login
 * @param {*} password son mot de passe
 * @returns 
 */
export const login = (userName, password) => {

  return new Promise((resolve, reject) => {
    setUserData(userName, "John", "Doe", "Terminal", false, true);
    resolve(true);
  });
}

export const getGroupesProf = () => {
  return new Promise((resolve, reject) => {
    resolve(null);
  });
}


/**
 * Mets à jours le qcm pour un certain jeu, pour l'utilisateur courant
 * correspond à mettre l'attribut qcm sur true, pour dire que l'utilisateur à effectué le qcm pour un jours
 * @param {*} game 
 */
export const majQcm  =(game,note) =>{
  const userName = localStorage.getItem('userName');
  let qcmListe = [];
  localStorage.setItem('qcm_' + game, note);
  // Utiliser une promesse pour gérer de manière asynchrone la réponse axios
  const fetchData = () => {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  };
  
  // Utiliser fetchData
  fetchData()
    .then(result => {
      return true;
    })
}


/**
 * retourne si l'utilisateur à déjà fait le qcm pour un jeu donné
 * @param {*} game le jeu à verifier
 * @returns true si le joueur à deja fait le qcm
 */
export const qcmDone = (game) => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};


/**
 * Mets à jours le qcm pour un certain jeu, pour l'utilisateur courant
 * correspond à mettre l'attribut qcm sur true, pour dire que l'utilisateur à effectué le qcm pour un jours
 * @param {*} game 
 */
export const majTuto =(game,statut) =>{
    
  let tutoListe = [];

  // Utiliser une promesse pour gérer de manière asynchrone la réponse axios
  const fetchData = () => {
    const userName = localStorage.getItem('userName');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  };
}


/**
 * retourne si l'utilisateur à déjà fait le qcm pour un jeu donné
 * @param {*} game le jeu à verifier
 * @returns true si le joueur à deja fait le qcm
 */
export const getTuto = (game) => {
  const userName = localStorage.getItem('userName');
  return new Promise((resolve, reject) => {
    resolve(false);
  });
};

/**
 * Permet de recuperer les details d'un eleve en fonction de son login
 * @param {*} userName le nom de l'eleve dont on souhaite recuperer les infos
 * @returns 
 */
export const getDetails = (userName) => {
  return new Promise((resolve,reject) => {
  resolve(null);
  })
  //requete vers la base de données pour chercher l'utilisateur. Appel la fonction groupes coté serv
}

/**
 * permet de recuperer la liste de groupes appartenant à un certain professeur
 * @param {*} userName le nom du professeur dont on souhaite recuperer les groupes
 * @returns 
 */
export const getGroupeEleve = (userName) => {
  return new Promise((resolve,reject) => {
    resolve("Terminal");
  })
}

/**
 * Permet de changer le login d'un utilisateur de type eleve
 * @param {*} username le nom d'utilisateur courant
 * @param {*} newUserName le nouveau nom d'utilisateur
 * @returns 
 */
export const setLogin = (username, newUserName) => {
  return new Promise((resolve,reject) => {
    resolve(true);
});
}

/**
* Permet d'ajouter un eleve à un groupe
* @param {*} userName le nom de l'eleve
* @param {*} nomGroupe le nom du groupe auquel ajouter l'eleve
* @returns 
*/
export const joinGroupe = (userName,nomGroupe)=>{
return new Promise((resolve,reject) => {
  resolve(true);
});
}

/**
* permet de creer un nouveau groupe dans la base de donnée
* Le proprietaire du groupe est l'utilisateur courant
* @param {*} nomGroupe le nom du nouveau groupe
* @returns 
*/
export const addGroup = (nomGroupe)=>{
  const userName = localStorage.getItem('userName');
return new Promise((resolve,reject) => {
resolve(null);
});
}

/**
* @param {*} groupe le groupe dont on souhaite recuperer des informations
* @returns une liste de login d'eleves d'un groupe
*/
export const getEleveGroupe = (groupe)=>{
return new Promise((resolve,reject) => {
resolve(null);
})
}

export const getElevesSansGroupe = ()=>{
return new Promise((resolve,reject) => {
  resolve(null);
})
}

export const recherchePartie = () => {
  const userName = localStorage.getItem('userName');
  const group = localStorage.getItem('group');
return new Promise((resolve, reject) => {
  reject("Le serveur est hors ligne");
});
};

export const deleteGames = () => {
  const userName = localStorage.getItem('userName');
return new Promise((resolve, reject) => {
  resolve(null);
});
};

export const deleteUserAcc = () => {
  const userName = localStorage.getItem('userName');
  const teacher = JSON.parse( localStorage.getItem('teacher'));
return new Promise((resolve,reject) => {
  resolve(null);
});
};

export const getCoop = ()=>{
  const userName = localStorage.getItem('userName');
return new Promise((resolve,reject) => {
  reject("Le serveur est hors ligne");
})
}

export const getTourCoop = (coop)=>{
return new Promise((resolve,reject) => {
  reject("Le serveur est hors ligne");
})
}

export const majTourSelf = (coequipier) => {
  const userName = localStorage.getItem('userName');
return new Promise((resolve,reject) => {
  reject("Le serveur est hors ligne");
});
};

export const chgmtEtatCoeq = (coequipier,fin) => {
return new Promise((resolve,reject) => {
  reject("Le serveur est hors ligne");
});
};


export const DataProvider = ({ children }) => {

  //toutes les données de l'utilisateur
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  const [name, setName] = useState(localStorage.getItem('name') || null);
  const [surName, setSurName] = useState(localStorage.getItem('surName') || null);
  const [group, setGroup] = useState(localStorage.getItem('group') || null);
  const [teacher, setTeacher] = useState(JSON.parse(localStorage.getItem('teacher')));
  const [isConnected, setIsConnected] = useState((localStorage.getItem('isConnected'))); 

  //les données du groupe
  const [idGroupe, setIdGroupe] = useState(localStorage.getItem('idGroupe') || null);
  const [niveau, setNiveau] = useState(localStorage.getItem('niveau') || null);
  const [dateCreation, setDateCreation] = useState(localStorage.getItem('dateCreation') || null);
  const [professeur, setProfesseur] = useState(localStorage.getItem('professeur') || null);
 
  const getDifficulte = (game) => {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  };
  
   /**
     * Mets à jours le qcm pour un certain jeu, pour l'utilisateur courant
     * correspond à mettre l'attribut qcm sur true, pour dire que l'utilisateur à effectué le qcm pour un jours
     * @param {*} game 
     */
   const majDifficulte  =(game,difficulte) => {

     let difficulteListe = [];

     // Utiliser une promesse pour gérer de manière asynchrone la réponse axios
     const fetchData = () => {
       return new Promise((resolve, reject) => {
         resolve(false);
       });
     };

   }
  //juste pour integrer l'authentification à l'application globale.
  return (
    <DataContext.Provider value={{
      name, surName,group, userName, teacher, isConnected,idGroupe,niveau,dateCreation,professeur,
      majQcm, login, getGroupesProf, register, logout,updateGroup, 
      qcmDone,getDetails,getGroupeEleve,setLogin, joinGroupe,getEleveGroupe,getElevesSansGroupe,getTuto,majTuto,recherchePartie, addGroup,
      deleteGames, deleteUserAcc, addInformaticoSentence, checkInformaticoSentence,majTourSelf,getTourCoop,getCoop,chgmtEtatCoeq,
      getDifficulte,majDifficulte
      }}>
      {children}
    </DataContext.Provider>
  );
};
