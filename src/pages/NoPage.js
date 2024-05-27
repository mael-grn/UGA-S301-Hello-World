import React from 'react';
import NavBar from '../component/NavBar';


const NoPage = () => {

return (
    <div className='notFound'>
    <header className='App-header'>
    <NavBar showSignUpButton={false}/>
    </header>
    <main>
    <h1>Oups... La page demandée n'existe pas</h1>
    </main>
    </div>
);
};

export default NoPage;
