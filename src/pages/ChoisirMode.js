import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../component/NavBar';
import PopupWindow from '../component/PopupWindow';
import { DataContext } from '../DataProvider';



const ChoisirMode = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { isConnected } = useContext(DataContext);


  const handleClosePopup = () => {
    setShowPopup(false);
  };

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
    <div className='ChoisirMode'>
      <header className='App-header'>
        <NavBar showSignUpButton={false}/>
      </header>

      {showPopup && (
        <PopupWindow
          closePopup={handleClosePopup}
          title="Erreur"
          message="Cette fonctionnalité n'est pas encore implémentée. Celle-ci sera disponible dans une prochaine mise à jour."
        />
      )}

      <main>
        <div className='choose-mode'>
        <Link to="/JeuxMulti"><button className='modeButton'>Multijoueur</button></Link>
        <Link to="/JeuxSolo"><button className='modeButton'>Solo</button></Link>
        </div>
      </main>
    </div>
  );
};

export default ChoisirMode;
