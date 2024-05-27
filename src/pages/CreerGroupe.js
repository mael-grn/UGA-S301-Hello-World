import NavBar from '../component/NavBar';
import React, { useState, useContext } from 'react';
import CreateGroupForm from '../component/menu/CreateGroupForm';
import { Link } from "react-router-dom";
import { DataContext } from '../DataProvider';



const CreerGroupe = () => {

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
    <div className='groupCreation'>
      <header className='App-header'>
        <NavBar/>
      </header>
      
        <CreateGroupForm/>
        
    </div>
  );
}
export default CreerGroupe;
