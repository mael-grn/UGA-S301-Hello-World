import React from 'react';

const GridBlock = ({ hasObject }) => {
  return (
    <div className={`grid-block ${hasObject ? 'has-object' : ''}`}>
      {/* Vous pouvez ajouter du contenu supplémentaire ici */}
    </div>
  );
}

export default GridBlock;