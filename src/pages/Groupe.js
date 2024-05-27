import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../DataProvider';
import NavBar from '../component/NavBar';
import { Link, useParams } from "react-router-dom";

const Groupe = (props) => {
  const { joinGroupe, getEleveGroupe, isConnected, getElevesSansGroupe,getDetails,getDifficulte,majDifficulte, teacher } = useContext(DataContext);
  const [studentName, setStudentName] = useState('');
  const [studentsInGroup, setStudentsInGroup] = useState([]);
  const [students, setstudents] = useState([]);
  const [sortedStudent, setSortedStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sqlDifficulte, setSqlDifficulte] = useState([]);
  const [resofDifficulte, setResofDifficulte] = useState([]);
  const [shellDifficulte, setShellDifficulte] = useState([]);
  const [turtleDifficulte, setTurtleDifficulte] = useState([]);
  const [sqlNewDifficulte, setSqlNewDifficulte] = useState([]);
  const [resofNewDifficulte, setResofNewDifficulte] = useState([]);
  const [shellNewDifficulte, setShellNewDifficulte] = useState([]);
  const [turtleNewDifficulte, setTurtleNewDifficulte] = useState([]);

  const {group} = useParams();
/**
 * Ajoute un étudiant à un groupe spécifié.
 * @param {Object} student - Les informations de l'étudiant à ajouter.
 */
  const handleAddStudent = (student) => {
    setLoading(true);
    joinGroupe(student, group).then(result => {
      setLoading(false);
      setLoading(true);
      // Faites une requête pour obtenir la liste des élèves dans le groupe actuel
      getEleveGroupe(group).then(result =>{
        setLoading(false);
        setStudentsInGroup(result.data.eleves);
      }).catch (error => {
        setLoading(false);
        setStudentsInGroup(['Une erreur est survenue dans la recupération des élèves']);
      })
      getElevesSansGroupe().then(result =>{
        setSortedStudent(result.data.eleves);
        setstudents(result.data.eleves);
        setStudentName('');
      })
    }).catch (error => {
      setLoading(false);
    });
  };

  /**
 * Modifie une difficulte
 * @param game - Le jeu à modifier
 */
  const handleMajDifficulte = (game) => {
    setLoading(true);
    if(game==='SQuisine'){
      majDifficulte(game,sqlNewDifficulte);
      setLoading(false);
    }
    else if(game==='Resof'){
      majDifficulte(game,resofNewDifficulte);
      setLoading(false);
    }
    else if(game==='shellHunt'){
      majDifficulte(game,shellNewDifficulte);
      setLoading(false);
    }
    else if(game==='TurtleGame'){
      majDifficulte(game,turtleNewDifficulte);
      setLoading(false);
    }
    
    
  };

  /**
 * supprime un étudiant à un groupe spécifié.
 * @param {Object} student - Les informations de l'étudiant à supprimer.
 */
  const handlesupprStudent = (student) => {
    setLoading(true);
    joinGroupe(student,null).then(result => {
      setLoading(false);
      setLoading(true);
      // Faites une requête pour obtenir la liste des élèves dans le groupe actuel
      getEleveGroupe(group).then(result =>{
        setLoading(false);
        setStudentsInGroup(result.data.eleves);
      }).catch (error => {
        setLoading(false);
        setStudentsInGroup(['Une erreur est survenue dans la recupération des élèves']);
      })
      getElevesSansGroupe().then(result =>{
        setSortedStudent(result.data.eleves);
        setstudents(result.data.eleves);
        setStudentName('');
      })
    }).catch (error => {
      setLoading(false);
    });
  };
  const fetchStudentsInGroup = () => {
    setLoading(true);
    // Faites une requête pour obtenir la liste des élèves dans le groupe actuel
    getEleveGroupe(group).then(result =>{
      setLoading(false);
      setStudentsInGroup(result.data.eleves);
    }).catch (error => {
      setLoading(false);
      setStudentsInGroup(['Une erreur est survenue dans la recupération des élèves']);
    })
};
const fetchStudents = () =>{
  getElevesSansGroupe().then(result =>{
    setstudents(result.data.eleves);
    setSortedStudent(result.data.eleves);
  })
}
const fetchDifficulte = () =>{
  getDifficulte('SQuisine').then(result =>{
    setSqlDifficulte(result);
  }).catch(error => {
    console.log(error)
  });
  getDifficulte('Resof').then(result =>{
    setResofDifficulte(result);
  }).catch(error => {
    console.log(error)
  });
  getDifficulte('ShellHunt').then(result =>{
    setShellDifficulte(result);
  }).catch(error => {
    console.log(error)
  });
  getDifficulte('TurtleGame').then(result =>{
    setTurtleDifficulte(result);
  }).catch(error => {
    console.log(error)
  });
}
  // Au chargement initial du composant, récupérez la liste des élèves dans le groupe
  useEffect(() => {
    fetchStudents();
    fetchDifficulte();
    fetchStudentsInGroup();
  }, [getEleveGroupe, group]); // La dépendance group assure que cela se produit chaque fois que le groupe change
/**
 * Met à jour la liste des étudiants filtrés en fonction du nom saisi.
 * @param {string} e - Le nom saisi pour filtrer la liste des étudiants.
 */
const updateSortedStudent = (e) => {
  setStudentName(e);
  setSortedStudent(students.filter(item => item.startsWith(e)));
}

/**
 * Met à jour la difficulte sql
 * @param {string} e - La difficulté
 */
const updateDifficulteSQL = (e) => {
  setSqlNewDifficulte(e);
}
/**
 * Met à jour la difficulte sql
 * @param {string} e - La difficulté
 */
const updateDifficulteResof = (e) => {
  setResofNewDifficulte(e);
}
/**
 * Met à jour la difficulte sql
 * @param {string} e - La difficulté
 */
const updateDifficulteShell = (e) => {
  setShellNewDifficulte(e);
}
/**
 * Met à jour la difficulte sql
 * @param {string} e - La difficulté
 */
const updateDifficulteTurtle = (e) => {
  setTurtleNewDifficulte(e);
}

  if (!isConnected || !teacher) {
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
    <div className='groupe'>
      <header>
        <NavBar />
      </header>
      <main>
      
        <div className='addStudent'>
          <div className='top-info'>
          <Link to="/MenuProf">
        <button className='back button'></button>
      </Link>
      <h1>Informations sur le groupe {group}</h1>

          </div>
          {/* Formulaire pour ajouter un élève au groupe */}
          <div className='form'>
          <h1>Élèves disponibles</h1>
            <input
              type='text'
              placeholder='Rechercher un élève'
              value={studentName}
              onChange={(e) => updateSortedStudent(e.target.value)}
            />
          
          <div className='student-list'>
          {
            sortedStudent.length>0 ?
            <ul>
            {sortedStudent.map((student) => (
            <li key={student}>
                {student} 
                <Link to={`/eleve/${student}`} className='small-button'>Voir plus</Link>
                <button onClick={() => handleAddStudent(student)} className='small-button'>Ajouter</button>
              </li>
            ))}
          </ul> 
          :
          <p>Aucun élève disponible</p>
          }          
          
          </div>
          </div>

          <div className='form'>
          <h1>Difficulté des jeux</h1>
          <div className='student-list'>
          {
            <ul>
            <li> SQuisine Lite : 
              <input
              className='difficulte'
              type='text'
              placeholder={sqlDifficulte}
              value={sqlNewDifficulte}
              onChange={(e) => updateDifficulteSQL(e.target.value)}
            /> 
            <button onClick={() => handleMajDifficulte('SQuisine')} className='small-button'>Modifier</button>
            </li>

            <li> Res'of Kingdom : 
            <input
              className='difficulte'
              type='text'
              placeholder={resofDifficulte}
              value={resofNewDifficulte}
              onChange={(e) => updateDifficulteResof(e.target.value)}
            /> 
            <button onClick={() => handleMajDifficulte('Resof')} className='small-button'>Modifier</button>
            </li>

            <li> ShellHunt :  
            <input
              className='difficulte'
              type='text'
              placeholder={shellDifficulte}
              value={shellNewDifficulte}
              onChange={(e) => updateDifficulteShell(e.target.value)}
            />
            <button onClick={() => handleMajDifficulte('shellHunt')} className='small-button'>Modifier</button>
            </li>

            <li> Turtle Game :
            <input
              className='difficulte'
              type='text'
              placeholder={turtleDifficulte}
              value={turtleNewDifficulte}
              onChange={(e) => updateDifficulteTurtle(e.target.value)}
            />
            <button onClick={() => handleMajDifficulte('TurtleGame')} className='small-button'>Modifier</button>
               </li>
          </ul> 
         
          }          
          
          </div>
          </div>
        </div>
      
        {/* Afficher la liste des élèves dans le groupe */}
        <div className='student-list'>
          <h1>Élèves dans le groupe :</h1>
          <ul>
            {studentsInGroup.map((student) => (
            <li key={student}>
                {student} 
                <Link to={`/eleve/${student}`} className='small-button'>Voir plus</Link>
                <button onClick={() => handlesupprStudent(student)} className='small-button'>supprimer</button>
              </li>
            ))}
          </ul>
        </div>
        </main>
        {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Chargement en cours...</span>
          </div>}
    </div>
  );
};

export default Groupe;
