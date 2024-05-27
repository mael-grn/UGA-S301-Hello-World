  import React from 'react';
  import Bloc from './Bloc'; // Import du composant Bloc

  const Recette = ({ numero, nom, etapes, validSteps }) => {
    return (
      <div className='recette'>
        <h2 className='titre-recette'> Recette-requête {numero} | {nom} </h2>
        <div className='etapes'>
          {etapes.map((etape, index) => (
            <div key={index} >
              <h3 className={`etape ${validSteps.includes(etape.numero) ? 'etape-valide' : ''}`}> {etape.numero}: {etape.intitule}</h3>
              {/*<div className='blocs-container'>
                <ul>
                  {etape.reponses.map((bloc, idx) => (
                    <Bloc key={idx} nom={bloc.nom} type={bloc.type} />
                  ))}
                </ul>
              </div>*/}
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Recette;
