import React, {useState} from 'react';

const ItemList = ({ selectedItem, setSelectedItem, resources, data}) => {

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
/**
 * Gère le clic sur un bouton d'achat d'élément.
 * @param {string} item - Le type d'élément à acheter (computer, router, switch, server).
 */
  const handleButtonClick = (item) => {
    if (item === 'computer') {
      if (data >= 50) { //verifie si l'achat est possible
        setSelectedItem('computer')
      } else {
        setShowMessage(true);
        setMessage(`Il vous manque ${50-data} données pour acheter cet ordinateur`);
        setTimeout(() => {
          setShowMessage(false);
          setMessage('');
        }, 3000);
      }
    }
    if (item === 'router') {
      if (data >= 100 && resources>=300) { //verifie si l'achat est possible
        setSelectedItem('router')
      } 
      else if (data<100 && resources<300) {
        setShowMessage(true);
        setMessage(`Il vous manque ${100-data} données et ${300-resources} ressources pour acheter ce routeur`);
        setTimeout(() => {
          setShowMessage(false);
          setMessage('');
        }, 3000);
      } else if (data<100) {
        setShowMessage(true);
        setMessage(`Il vous manque ${100-data} données pour acheter ce routeur`);
        setTimeout(() => {
          setShowMessage(false);
          setMessage('');
        }, 3000);
      } else if (resources<300) {
        setShowMessage(true);
        setMessage(`Il vous manque ${300-resources} ressources pour acheter ce routeur`);
        setTimeout(() => {
          setShowMessage(false);
          setMessage('');
        }, 3000);
      }
    }
    if (item === 'switch') { 
      if (data >= 100) { //verifie si l'achat est possible
        setSelectedItem('switch')
      } else {
        setShowMessage(true);
        setMessage(`Il vous manque ${100-data} données pour acheter ce switch`);
        setTimeout(() => {
          setShowMessage(false);
          setMessage('');
        }, 3000);
      }
    }
    if (item === 'server') {
      if (resources >= 50) { //verifie si l'achat est possible
        setSelectedItem('server')
      } else {
        setShowMessage(true);
        setMessage(`Il vous manque ${50-resources} ressources pour acheter ce serveur`);
        setTimeout(() => {
          setShowMessage(false);
          setMessage('');
        }, 3000);
      }
    }
  }

  return (
    <div className={showMessage ? 'item-list list-message' : 'item-list'}>
      {showMessage && <p>{message}</p>} 
      <ul>
        <li>
          <button
            onClick={() => handleButtonClick('computer')}
            className={`computer ${selectedItem === 'computer' ? 'selected' : ''}`}
          >
            Ordinateur <br/>
            <span>Cout : 50 données</span>
            
          </button>
        </li>
        <li>
          <button
            onClick={() => handleButtonClick('router')}
            className={`router ${selectedItem === 'router' ? 'selected' : ''}`}
          >
            Routeur
            <br/>
            <span>Cout : 300 resources + 100 données</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleButtonClick('switch')}
            className={`switch ${selectedItem === 'switch' ? 'selected' : ''}`}
          >
            Switch<br/>
            <span>Cout : 100 données</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleButtonClick('server')}
            className={`server ${selectedItem === 'server' ? 'selected' : ''}`}
          >
            Serveur<br/>
            <span>Cout : 50 ressources</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ItemList;
