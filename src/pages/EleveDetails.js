import React, {useState,useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar';
import { Link } from "react-router-dom";
import PopupWindow from '../component/PopupWindow';
import { DataContext} from "../DataProvider";

const EleveDetails = () => {
  const { username } = useParams();
  const { getDetails, setLogin, isConnected, teacher } = useContext(DataContext);
  const [eleveDetails, setEleveDetails] = useState(null);
  const [newLogin, setNewLogin] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  
  useEffect(() => {
    const fetchEleveDetails = () => {
      // Faites une requête pour obtenir les détails de l'élève
      setLoading(true)
      getDetails(username).then(result =>{
        setLoading(false);
        result.data.qcm = result.data.qcm.split(',');
        setEleveDetails(result.data);
      }).catch(error=>{
        setLoading(false);
      })
    };
    // Appel de la fonction pour récupérer les détails de l'élève
    fetchEleveDetails();
  }, [getDetails, username]);

  const handleLoginChange = () => {
    if(newLogin !== ''){
      setLoading(true);
      setLogin(username,newLogin.toLowerCase()).then(result =>{
        setLoading(false);
        navigate(`/eleve/${newLogin.toLowerCase()}`);
      }).catch (error => {
        setLoading(false);
        if (error.response && error.response.request.status === 400) {
          setShowPopup(true);
          setPopupTitle('Erreur');
          setPopupMessage('Ce login existe déjà, veuillez en choisir un autre');
        } else {
          setShowPopup(true);
          setPopupTitle('Erreur');
          setPopupMessage('Une erreur s\'est produite dans le changement de login');
        }
      })
  
      
    } else{
      setShowPopup(true);
      setPopupTitle('Login vide !')
      setPopupMessage("Le nom d'utilisateur ne peut pas être vide. ")
    }
  };

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
    <div className='eleveDetail'>
      <header>
        <NavBar />
        {showPopup && <PopupWindow closePopup={handleClosePopup} title={popupTitle} message={popupMessage}/>}
      </header>
      <main>
        <div className='top-info'>
        <Link to={(eleveDetails === null || eleveDetails.group === null) ? "/MenuProf" : "/groupe/"+eleveDetails.group}>
                <button className='back button'></button>
        </Link>
        <h1>Information sur l'étudiant</h1>
        </div>
      
        {eleveDetails ? (
          <div className='student'>
            <div className='info'>
              <h2>{eleveDetails.login}</h2>
              <p>Groupe: {eleveDetails.group=== null ? 'Pas encore de groupe': eleveDetails.group}</p>
              <p>Nom: {eleveDetails.nom}</p>
              <p>Prénom: {eleveDetails.prenom}</p>
              <p>Date de naissance: {eleveDetails.dateNaiss}</p>
              <p>Note qcm SQL: {eleveDetails.qcm[0] === 'false' ? 'Non réalisé' : eleveDetails.qcm[0]}</p>      
              <p>Note qcm Réseau: {eleveDetails.qcm[1] === 'false' ? 'Non réalisé' : eleveDetails.qcm[1]}</p>
              <p>Note qcm Bash: {eleveDetails.qcm[2] === 'false' ? 'Non réalisé' : eleveDetails.qcm[2]}</p>
              <p>Note qcm Python: {eleveDetails.qcm[3] === 'false' ? 'Non réalisé' : eleveDetails.qcm[3]}</p>
            </div>
            
            <div className='form'>
              <h2>Changer le nom d'utilisateur de l'élève</h2>
              <label>Nouveau nom d'utilisateur :
                <input
                  type="text"
                  value={newLogin}
                  onChange={(e) => setNewLogin(e.target.value)}
                  placeholder='ex : Bastien'
                />
              </label>
              
              <button onClick={handleLoginChange} className='button'>Modifier</button>
            </div>
            
          </div>
        ) : (
          <div className="loading">
            <span className='bg'/>
            <span className='content'>Chargement en cours...</span>
          </div>
        )}
      </main>
      {loading && <div className="loading">
            <span className='bg'/>
            <span className='content'>Chargement en cours...</span>
          </div>}
    </div>
  );
};

export default EleveDetails;
