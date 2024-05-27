import React from 'react';

const ItemList = ({ level, exp, expGoal, data, resources, countDown }) => {
  //
  return (
    <div className='SideBar'>
      <h2>Niveau {level}</h2>
      <progress value={exp} max={expGoal}></progress>
      <p>exp : {exp}/{expGoal}</p>
      <p className='data'>{data} Données collectées</p>
      <p className='resources'>{resources} Ressources collectées</p>      
      <p className={countDown < 10 ? 'finalCountDown' : ''}>Prochaine attaque dans {countDown ? countDown : 0} secondes </p>
      </div>
  );
};

export default ItemList;
