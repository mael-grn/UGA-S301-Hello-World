import React from 'react';

const Etape = ({ numero, intitule, reponses }) => {
  return (
    <div className='etape'>
      <h3>Étape {numero}: {intitule}</h3>
      <ul>
        {reponses.map((reponse, index) => (
          <li key={index}>{reponse}</li>
        ))}
      </ul>
    </div>
  );
};

export default Etape;
