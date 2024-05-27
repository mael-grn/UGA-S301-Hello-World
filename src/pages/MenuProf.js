import React, { useState, useEffect,useContext } from 'react';

import NavBar from '../component/NavBar';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DataContext } from "./../DataProvider";


const MenuProf = () => {
  const [profGroups, setProfGroups] = useState([]);
  const { userName, updateGroup, getGroupesProf, isConnected, teacher } = useContext(DataContext);
  const [mainMessage, setMainMessage] = useState('Vos groupes : ');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

/**
 * Gère la sélection d'un groupe spécifique.
 * @param {string} selectedGroup - Le groupe sélectionné.
 */
  const handleGroupSelection = (selectedGroup) => {
    updateGroup(selectedGroup);
  };


  useEffect(() => {
    // Effectuer la requête pour récupérer les groupes du professeur actuellement connecté
    setLoading(true);
    getGroupesProf().then(result =>{
      setLoading(false);
      setProfGroups(result);
      if (result.length === 0) {
        setMainMessage('Vous n\'avez créé aucun groupe pour le moment');
      }
    }).catch(error => {
      setLoading(false);
      setMainMessage('Une erreur est survenue dans la récupération des groupes');
      setProfGroups([]);
    });  
  }, [getGroupesProf]); // Le tableau vide en tant que dépendance signifie que cet effet ne s'exécute qu'une fois après le montage

  console.log(teacher);
  if (!isConnected  || !teacher) {

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
    <div className='menuProf'>
      <header className='App-header'>
        <NavBar/>
      </header>
      <h1 className='welcome'>Bienvenue, {userName}</h1>
      <p>En tant que professeur, vous pouvez gerer vos groupes-classe ici.</p>
      <div className='group-list'>
        <p>{mainMessage}</p>
        <ul>
          {profGroups.map(group => (
            <li key={group} onClick={() => handleGroupSelection(group)} className='space'>
              <Link to={`/groupe/${group}`} ><button className='button'>{group}</button></Link>
                
            </li>
          ))}
          
        </ul>
        <Link to="/CreerGroupe">
                <button className='button'>
                  Créer un groupe
                </button>
        </Link>
      </div>
      {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Chargement en cours...</span>
          </div>}
    </div>
  );
}

export default MenuProf;
