import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../component/NavBar';
import { DataContext } from '../DataProvider';


const SelectionNiv = () => {
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
          <NavBar/>
        </header>

        <main>
        <div className='Inscription'>
          <h2>Veuillez séléctionner un niveau.</h2>
        <div className='button-profil'>
          {/* Ajoutez ici les boutons pour rejoindre les groupes */}
          <Link to="/HomePage" className='button'>1</Link>
          <Link to="/HomePage" className='button'>2</Link>
          {/* Ajoutez autant de boutons que nécessaire */}
        </div>
        </div>
        </main>
        </div>
    );
}
export default SelectionNiv;