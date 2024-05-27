
import React, { useState } from 'react';
import { Link } from "react-router-dom";


//component affichant la selection du profil de l'utilisateur. Les deux fonction en parametre servent a activer le type de profil selon la selection de l'utilisateur

const ProfilSelection = ({activateStudent, activateTeacher}) => {

    return (
        <div className='profileSelection'>
            
            <div className='top-info'>
            <Link to="/">
                <button className='back'></button>
            </Link>
            <h1>
                Veuillez selectionner votre profil :
            </h1>
            </div>
            
            <div className='button-profil'>
            <button onClick={activateTeacher} className=''>Professeur</button>
            <button onClick={activateStudent} className=''>Elève</button>
            </div>
      </div>
    )
}
export default ProfilSelection;