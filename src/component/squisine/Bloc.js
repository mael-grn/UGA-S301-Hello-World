import React from 'react';

const Bloc = ({ nom, type }) => {
  return (
    <div className={`bloc ${type}`}>
      <p >{nom}</p>
    </div>
  );
};

export default Bloc;
