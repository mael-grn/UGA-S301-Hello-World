import React from 'react';

const DeviceList = ({ computerList, switchList, routerList, serverList }) => {
    return (
    <div className='device-list' >
      <h2>Liste des appareils</h2>
      <ul>
        {computerList.map((computer, index) => (
          <li key={index}>
            nom : {computer.nom}
            <br />
            {computer.ip ? "ip : "+ computer.ip : ""}
            <br />
            {computer.masque ? "masque : "+ computer.masque : ""}
          </li>
        ))}
        {switchList.map((switchElem, index) => (
          <li key={index}>
            nom : {switchElem.nom}
            <br />
            {switchElem.ip ? "ip : "+ switchElem.ip : ""}
            <br />
            {switchElem.masque ? "masque : "+ switchElem.masque : ""}  </li>
        ))}
        {routerList.map((router, index) => (
          <li key={index}>
            nom : {router.nom}
            <br />
            {router.ip ? "ip : "+ router.ip : ""}
            <br />
            {router.masque ? "masque : "+ router.masque : ""}  </li>
        ))}
        {serverList.map((server, index) => (
          <li key={index}>
            nom : {server.nom}
            <br />
            {server.ip ? "ip : "+ server.ip : ""}
            <br />
            {server.masque ? "masque : "+ server.masque : ""} </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceList;