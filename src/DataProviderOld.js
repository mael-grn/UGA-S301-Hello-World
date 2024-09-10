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
export const setUserData = (userName, name, surName, group, teacher, isConnected, token) => {
  localStorage.setItem('userName', userName);
  localStorage.setItem('name', name);
  localStorage.setItem('surName', surName);
  localStorage.setItem('group', group);
  localStorage.setItem('teacher', teacher);
  localStorage.setItem('isConnected', isConnected);
  localStorage.setItem('authToken', token);
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
  localStorage.removeItem('authToken')
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
  console.log(process.env.REACT_APP_DB_URL);
  return new Promise((resolve, reject) => {

    axios.post(`${process.env.REACT_APP_DB_URL}/register`, {prenom:prenom, nom:nom,  password:password, dateNaiss:dateNaiss, teacher:teacher,accordParent:accordParent})
    .then(response => {
      const { message, login, token } = response.data;
      resolve(true);
      setUserData(login, prenom, nom, null, teacher, true, token);
    })
    .catch(error => {
      reject(error);
    });

  });

};

/**
   * ajoute une phrase dite par informatico dans la base de données.
   * De cette manière, informatico ne dit jamais deux fois la meme phrase
   * @param {*} sentence 
   */
export const addInformaticoSentence = (sentence) => {
  const userName = localStorage.getItem('userName');
  axios.post(`${process.env.REACT_APP_DB_URL}/addSentenceInformatico`, {login:userName, sentence:sentence}).then(response => {
    
  }).catch(error => {
    console.log(error);
  });
}

/**
 * return true si informatico à jamais une phrase
 * @param {*} sentence la phrase à verifier
 * @returns 
 */
export const checkInformaticoSentence = (sentence) => {
  return new Promise((resolve, reject) => {
    const userName = localStorage.getItem('userName');
    axios.get(`${process.env.REACT_APP_DB_URL}/getSentencesInformatico?login=${userName}`)
      .then(response => {
        const sentences = response.data.sentences.split(',');
        resolve(!sentences.includes(sentence));
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          resolve(true);
        } else {
          reject(error); // Vous devriez rejeter l'erreur ici pour la capturer en dehors
        }
      });
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
  
  //requete vers la base de données pour chercher l'utilisateur. Appel la fonction login coté serveur

  //return "Le serveur est indisponible pour le moment";

  return new Promise((resolve, reject) => {
    const teacher = JSON.parse( localStorage.getItem('teacher'));
    console.log(`${process.env.REACT_APP_DB_URL}/user?login=${userName}&password=${password}&teacher=${teacher}`);
    axios.get(`${process.env.REACT_APP_DB_URL}/user?login=${userName}&password=${password}&teacher=${teacher}`).then(response => {
      setUserData(response.data.login, response.data.prenom, response.data.nom, response.data.group, response.data.teacher, true, response.data.token);
      resolve(true);
    }).catch(error => {
      reject(error);
    });
  });
}

export const getGroupesProf = () => {
  //requete vers la base de données pour chercher l'utilisateur. Appel la fonction groupes coté serv
  return new Promise((resolve, reject) => {
  const userName = localStorage.getItem('userName');
  axios.get(`${process.env.REACT_APP_DB_URL}/getGroupesDuProf?prof=${userName}`)
    .then(response => {
      resolve(response.data.groupes);
    })
    .catch(error => {
      reject(error);
    });
  });
    // return "Le serveur est indisponible pour le moment";
}


/**
 * Mets à jours le qcm pour un certain jeu, pour l'utilisateur courant
 * correspond à mettre l'attribut qcm sur true, pour dire que l'utilisateur à effectué le qcm pour un jours
 * @param {*} game 
 */
export const majQcm  =(game,note) =>{
  const userName = localStorage.getItem('userName');
  let qcmListe = [];

  // Utiliser une promesse pour gérer de manière asynchrone la réponse axios
  const fetchData = () => {
    return new Promise((resolve, reject) => {
      
      axios.get(`${process.env.REACT_APP_DB_URL}/hasDoneQcm?login=${userName}&game=${game}`)
        .then(response => {
          const { message, qcm } = response.data;
          if (message === 'success') {
            qcmListe = qcm.split(',');
            if (qcmListe[qcmListe.length - 1] === '') {
              qcmListe.pop(); // Retire le dernier élément s'il est vide
            }
            resolve(qcmListe); // Résoudre la promesse avec qcmListe
          } else {
            reject(new Error('Erreur lors de la récupération des données'));
          }
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout de QCM:', error);
          reject(error);
        });
    });
  };
  
  // Utiliser fetchData
  fetchData()
    .then(result => {
      // Maintenant, vous pouvez utiliser qcmListe en dehors du bloc axios.get
      if(game==='SQuisine'){
          result[0]=note;
        }
      else if(game==='resofkingdom'){
        result[1]=note;
      }
      else if(game ==='shellHunt'){
        result[2]=note;
      }
      else if(game === 'TurtleGame'){
        result[3]=note;
      }
      const qcmNew=result.join(',');
      
      axios.post(`${process.env.REACT_APP_DB_URL}/majQcm?login=${userName}&qcmNew=${qcmNew}`)      
      .then(response => {
        const { message} = response.data;
        if (message === 'success') {
          return true;
        } else {
          return false;
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de QCM:', error);
      });
    })
    .catch(error => {
      console.error('Une erreur s\'est produite:', error);
    });
}


/**
 * retourne si l'utilisateur à déjà fait le qcm pour un jeu donné
 * @param {*} game le jeu à verifier
 * @returns true si le joueur à deja fait le qcm
 */
export const qcmDone = (game) => {
  const userName = localStorage.getItem('userName');
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_DB_URL}/hasDoneQcm?login=${userName}&game=${game}`)
      .then(response => {
        const qcmListe = response.data.qcm.split(',');
        if (qcmListe[qcmListe.length - 1] === '') {
          qcmListe.pop(); // Retire le dernier élément s'il est vide
        } 
        if (game==='SQuisine' && qcmListe[0]!=='false'){
          resolve(qcmListe[0]);
        }
        else if (game==='SQuisineSolo' && qcmListe[0]!=='false'){
          resolve(qcmListe[0]);
        }
        else if(game==='Resofkingdom' && qcmListe[1]!=='false'){
          resolve(qcmListe[1]);
        }
        else if(game==='ShellHunt' && qcmListe[2]!=='false'){
          resolve(qcmListe[2]);
        }
        else if(game==='TurtleGame' && qcmListe[3]!=='false'){
          resolve(qcmListe[3]);
        }
        else{
          resolve(false);
        }
        
      })
      .catch(error => {
        reject(error);
      });
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
      axios.get(`${process.env.REACT_APP_DB_URL}/hasDoneTuto?login=${userName}&game=${game}`)
      .then(response => {
          const { tuto } = response.data;
          
          tutoListe = tuto.split(',');
          if (tutoListe[tutoListe.length - 1] === '') {
            tutoListe.pop(); // Retire le dernier élément s'il est vide
          }
          resolve(tutoListe); // Résoudre la promesse avec qcmListe
        
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  
  // Utiliser fetchData
  fetchData()
    .then(result => {
      // Maintenant, vous pouvez utiliser qcmListe en dehors du bloc axios.get
      if(game==='SQuisine'){
          result[0]=statut;
        }
      else if(game==='Resof'){
        result[1]=statut;
      }
      else if(game ==='shellHunt'){
        result[2]=statut;
      }
      const tutoNew=result.join(',');
      const userName = localStorage.getItem('userName');
      axios.post(`${process.env.REACT_APP_DB_URL}/majTuto?login=${userName}&tutoNew=${tutoNew}`)      
      .then(response => {
        return true;
      })
      .catch(error => {
        return false;
      });
    })
    .catch(error => {
      return false;
    });
}


/**
 * retourne si l'utilisateur à déjà fait le qcm pour un jeu donné
 * @param {*} game le jeu à verifier
 * @returns true si le joueur à deja fait le qcm
 */
export const getTuto = (game) => {
  const userName = localStorage.getItem('userName');
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_DB_URL}/hasDoneTuto?login=${userName}&game=${game}`)
      .then(response => {
        const { message, tuto } = response.data;
          const tutoListe = response.data.tuto.split(',');
          if (tutoListe[tutoListe.length - 1] === '') {
            tutoListe.pop(); // Retire le dernier élément s'il est vide
          } 
          if (game==='SQuisine' && tutoListe[0]!=='false'){
            resolve(tutoListe[0]);
          }
          else if(game==='Resof' && tutoListe[1]!=='false'){
            resolve(tutoListe[1]);
          }
          else if(game==='ShellHunt' && tutoListe[2]!=='false'){
            resolve(tutoListe[2]);
          }
          else{
            resolve(false);
          }
        
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Permet de recuperer les details d'un eleve en fonction de son login
 * @param {*} userName le nom de l'eleve dont on souhaite recuperer les infos
 * @returns 
 */
export const getDetails = (userName) => {
  return new Promise((resolve,reject) => {
  axios.get(`${process.env.REACT_APP_DB_URL}/getEleveDetails?login=${userName}`)
  .then(response => {
      
      resolve(response);
    })
    .catch(error => {
      reject(error);
    });
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
    axios.get(`${process.env.REACT_APP_DB_URL}/getGroupesDuProf?prof=${userName}`)
    .then(response => {
      resolve(response);

    })
    .catch(error => {
      reject(error)
    });
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
    axios.post(`${process.env.REACT_APP_DB_URL}/updateEleveLogin`, {
      currentLogin: username,
      newLogin: newUserName,
    }).then(response => {
      resolve(true);
    }).catch(error => {
      reject(error)
    });
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
axios.post(`${process.env.REACT_APP_DB_URL}/addStudentGroup`, { login:userName, groupe:nomGroupe, }).then(response => {
  resolve(true);
}).catch(error => {
  reject(error);
});
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
axios.post(`${process.env.REACT_APP_DB_URL}/addGroup`, { professeur:userName, id:nomGroupe, }).then(response => {
  resolve(response);
}).catch(error => {
  reject(error);
});
});
}

/**
* @param {*} groupe le groupe dont on souhaite recuperer des informations
* @returns une liste de login d'eleves d'un groupe
*/
export const getEleveGroupe = (groupe)=>{
return new Promise((resolve,reject) => {
  axios.get(`${process.env.REACT_APP_DB_URL}/getElevesDuGroupe?groupe=${groupe}`)
  .then(response => {
    resolve(response);
  })
  .catch(error => {
    reject(error);
  });
})
}

export const getElevesSansGroupe = ()=>{
return new Promise((resolve,reject) => {
  axios.get(`${process.env.REACT_APP_DB_URL}/getElevesSansGroupe`)
  .then(response => {
    resolve(response);
  })
  .catch(error => {
    reject(error);
  });
})
}

export const recherchePartie = () => {
  const userName = localStorage.getItem('userName');
  const group = localStorage.getItem('group');
return new Promise((resolve, reject) => {
  axios.post(`${process.env.REACT_APP_DB_URL}/recherchePartie`, {
    login: userName,
    groupeId: group,
  })
  .then(response => {
    const { message, data } = response.data;
    if (message === 'success') {
      resolve(data);
    } else if(message=== 'Nombre maximum de tentatives atteint'){
      window.location.replace('/');
    }
    else {
      reject(message);
    }
  })
  .catch(error => {
    reject(error);
  });
});
};

export const deleteGames = () => {
  const userName = localStorage.getItem('userName');
return new Promise((resolve, reject) => {
  axios.post(`${process.env.REACT_APP_DB_URL}/clearGames`, {
    login: userName,
  })
  .then(response => {
    const { message, data } = response.data;
    if (message === 'success') {
      resolve(data);
    } else {
      reject(message);
    }
  })
  .catch(error => {
    reject(error);
  });
});
};

export const deleteUserAcc = () => {
  const userName = localStorage.getItem('userName');
  const teacher = JSON.parse( localStorage.getItem('teacher'));
return new Promise((resolve,reject) => {
  axios.post(`${process.env.REACT_APP_DB_URL}/deleteUser`, {
    login: userName,
    teacher: teacher
  })
  .then(response => {
    logout();
    resolve(response);
  }).catch(error => {
    reject(error);
  });
});
};

export const getCoop = ()=>{
  const userName = localStorage.getItem('userName');
return new Promise((resolve,reject) => {
  axios.get(`${process.env.REACT_APP_DB_URL}/getCoequipier?login=${userName}`)
  .then(response => {
    resolve(response);
  })
  .catch(error => {
    reject(error);
  });
})
}

export const getTourCoop = (coop)=>{
return new Promise((resolve,reject) => {
  axios.get(`${process.env.REACT_APP_DB_URL}/getTour?coop=${coop}`)
  .then(response => {
    resolve(response);
  })
  .catch(error => {
    reject(error);
  });
})
}

export const majTourSelf = (coequipier) => {
  const userName = localStorage.getItem('userName');
return new Promise((resolve,reject) => {
  axios.post(`${process.env.REACT_APP_DB_URL}/majTour`, {
    login: userName, 
    coeq: coequipier
  })
  .then(response => {
    resolve(response);
  }).catch(error => {
    reject(error);
  });
});
};

export const chgmtEtatCoeq = (coequipier,fin) => {
return new Promise((resolve,reject) => {
  axios.post(`${process.env.REACT_APP_DB_URL}/finJeu`, {
    login: coequipier, 
    typefin: fin
  })
  .then(response => {
    resolve(response);
  }).catch(error => {
    reject(error);
  });
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

  /**
   * Verification de la session de l'utilisateur à l'aide d'un token. Sera appelé à chaque fois que des données sensibles sont changées
   */
  useEffect(() => {
    const token = localStorage.getItem('authToken') || null;
  
    // Créer une source d'annulation  
    if (token !== null && isConnected) {
      axios.get(`${process.env.REACT_APP_DB_URL}/checkToken?token=${token}`).then(response => {
        if (!isConnected) {
          setIsConnected(true);
        }
      }).catch(error => {
        console.log(error);
      });
    } else if (token === null && isConnected) {
      // Déconnectez l'utilisateur si le token est null et isConnected est vrai
      logout();
    }
  
  }, [isConnected, logout, teacher]);
 
  const getDifficulte = (game) => {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_DB_URL}/getDifficulteGame?group=${group}&game=${game}`)
        .then(response => {
          const { message, difficulte } = response.data;
            const difficulteListe = response.data.difficulte.split(',');
            if (difficulteListe[difficulteListe.length - 1] === '') {
              difficulteListe.pop(); // Retire le dernier élément s'il est vide
            } 
            if (game==='SQuisine'){
              resolve(difficulteListe[0]);
            }
            else if(game==='Resof'){
              resolve(difficulteListe[1]);
            }
            else if(game==='ShellHunt'){
              resolve(difficulteListe[2]);
            }
            else if(game==='TurtleGame'){
              resolve(difficulteListe[3]);
            }
            else{
              resolve(false);
            }
          
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  
   /**
     * Mets à jours le qcm pour un certain jeu, pour l'utilisateur courant
     * correspond à mettre l'attribut qcm sur true, pour dire que l'utilisateur à effectué le qcm pour un jours
     * @param {*} game 
     */
   const majDifficulte  =(game,difficulte) =>{
        
    let difficulteListe = [];
  
    // Utiliser une promesse pour gérer de manière asynchrone la réponse axios
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.REACT_APP_DB_URL}/getDifficulteGame?group=${group}&game=${game}`)
          .then(response => {
            const { message, difficulte } = response.data;
            if (message === 'success') {
              difficulteListe = difficulte.split(',');
              if (difficulteListe[difficulteListe.length - 1] === '') {
                difficulteListe.pop(); // Retire le dernier élément s'il est vide
              }
              resolve(difficulteListe); // Résoudre la promesse avec difficulteListe
            } else {
              reject(new Error('Erreur lors de la récupération des données'));
            }
          })
          .catch(error => {
            console.error('Erreur lors de la maj de difficulte:', error);
            reject(error);
          });
      });
    };
    
    // Utiliser fetchData
    fetchData()
      .then(result => {
        // Maintenant, vous pouvez utiliser difficulteListe en dehors du bloc axios.get
        if(game==='SQuisine'){
            result[0]=difficulte;
          }
        else if(game==='Resof'){
          result[1]=difficulte;
        }
        else if(game ==='shellHunt'){
          result[2]=difficulte;
        }
        else if(game === 'TurtleGame'){
          result[3]=difficulte;
        }
        const difficulteNew=result.join(',');
        
        axios.post(`${process.env.REACT_APP_DB_URL}/majDifficulte?group=${group}&qcmNew=${difficulteNew}`)      
        .then(response => {
          const { message} = response.data;
          if (message === 'success') {
            return true;
          } else {
            return false;
          }
        })
        .catch(error => {
          console.error('Erreur lors de la maj de difficulte:', error);
        });
      })
      .catch(error => {
        console.error('Une erreur s\'est produite:', error);
      });
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
