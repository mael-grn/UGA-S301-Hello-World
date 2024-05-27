import React from 'react';

const EcranGauche = () => {
  return (
    <div className="w-1/5 h-1/5 sm:w-1/5 sm:h-1/5 lg:w-1/5 lg:h-1/5 xl:w-1/5 xl:h-1/5 mx-auto my-4 rounded-lg p-4" style={{ backgroundColor: 'white' }}>
      <h1 className="text-2xl font-bold mb-4">Titre de la boîte</h1>
      <p>Contenu de la boîte...</p>
      {/* Ajoutez d'autres éléments HTML avec les classes Tailwind selon vos besoins */}
    </div>
  );
};

export default EcranGauche;
