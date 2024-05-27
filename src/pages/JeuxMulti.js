import NavBar from '../component/NavBar';
import { DataContext } from '../DataProvider';
import React, { useState, useContext } from 'react';


const JeuxMulti = () => {
  const { isConnected } = useContext(DataContext);

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
    <div className='App'>
      <header className='App-header'>
        <NavBar showSignUpButton={false}/>
      </header>

      <main>
        <h2>Jeu Multijoueur</h2>
        {/* Ajoutez ici le contenu spécifique au jeu multijoueur */}
      </main>
    </div>
  );
};

export default JeuxMulti;
