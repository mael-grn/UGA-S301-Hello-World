import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Rect, Line } from 'react-konva';
import useImage from 'use-image';
import ComputerImage from '../../img/computer.png';
import ComputerImageAttaque from '../../img/computerCorrupted.png';
import SwitchImage from '../../img/switch.png';
import ServerImage from '../../img/server.png';
import ServerImageAttaque from '../../img/serverCorrupted.png';
import RouterImage from '../../img/router.png';
import backgroundImage from '../../img/resof-bg.jpg';
import { point } from 'leaflet';

const Computer = ({ showSetItem, pos, name, attaque }) => {
  const [image] = useImage(ComputerImage);
  const [imageAttaque] = useImage(ComputerImageAttaque);
  const handleClic = () => {
    showSetItem(name);
  }
  return (
    <Image
      image={attaque ? imageAttaque : image}
      width={60}
      height={60}
      x={(pos.x-60/2)}
      y={(pos.y-60/2)}
      onClick={handleClic}
    />
  );
};

const Switch = ({ showSetItem, pos, name }) => {

  const [image] = useImage(SwitchImage);
  const handleClic = () => {
    showSetItem(name);
  }
  return (
    <Image
      image={image}
      width={60}
      height={60}
      x={(pos.x-60/2)}
      y={(pos.y-60/2)}
      onClick={handleClic}
    />
  );
};

const Router = ({ showSetItem, pos, name }) => {

  const [image] = useImage(RouterImage);
  const handleClic = () => {
    showSetItem(name);
  }
  return (
    <Image
      image={image}
      width={60}
      height={60}
      x={(pos.x-60/2)}
      y={(pos.y-60/2)}
      onClick={handleClic}
    />
  );
};

const Server = ({ showSetItem, pos, name,attaque }) => {
  const [image] = useImage(ServerImage);
  const [imageAttaque] = useImage(ServerImageAttaque);
  const handleClic = () => {
    showSetItem(name);
  }
  return (
    <Image
      image={attaque ? imageAttaque : image}
      width={60}
      height={60}
      x={(pos.x-60/2)}
      y={(pos.y-60/2)}
      onClick={handleClic}
    />
  );
};

const Background = ({size}) => {
  const [image] = useImage(backgroundImage);
  return (
    <Image
      image={image}
      width={size.x}
      height={size.y}
      x={0-(size.x/2)}
      y={0-(size.y/2)}
    />
  );
};


const Map = ({showSetItem, computerList, routerList, switchList, serverList, addItem, selectedItem, setSelectedItem, ressourcesBlock, dataBlock, linesList}) => {
  const [scale, setScale] = useState(1);
  const [backgroundSize, setBackgroundSize] = useState({ x: 1920*2, y: 1080*2 });
  const backgroundLayer = React.useRef();
  const [dragOffset, setDragOffset] = useState({ x: window.innerWidth/2, y: window.innerHeight/2 });
  const [deplacement, setDeplacement] = useState(true);
  const stageRef = useRef();

  /**
   * convertis des valeurs (1, 2, 3) en des coordonées sur le cadrillage de l'image, par rapport au centre
   * @param {*} x 
   * @param {*} y 
   * @returns des coordonées reels, correspondant au cadrillage
   */
  const convertIntoTile = (pos) => {
  
    //nombre de carreaux sur la page
    const tileX = 48;
    const tileY = 28;

    //largeur en pixel des carreaux
    const tileSizeX = backgroundSize.x/tileX;
    const tileSizeY = backgroundSize.y/tileY;

    //formule pour la conversion : x/tileSize.
    //utilisation de math.round pour arrondir, et recuperer des valeurs tel que 1, 2, 3, ...
    //multiplication par scale, pour ajuster la valeur en fonction du zoom
    const x = Math.round(pos.x/(tileSizeX*scale));
    const y = 0-Math.round( pos.y/(tileSizeY*scale));

    return {x, y};
  }

  const convertIntoCoordinates = (pos) => {
  
    //nombre de carreaux sur la page
    const tileX = 48;
    const tileY = 28;

    //largeur en pixel des carreaux
    const tileSizeX = backgroundSize.x/tileX;
    const tileSizeY = backgroundSize.y/tileY;

    //formule pour la conversion : x*tileSize.
    const x = pos.x*(tileSizeX);
    const y = 0-pos.y*(tileSizeY);

    return {x, y};
  }

  const handleShowSetItem = (name) => {
    showSetItem(name);
  }

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const newScale = e.evt.deltaY > 0 ? scale * 0.95 : scale * 1.05;
    if (newScale >0.5 && newScale<2) {
      setScale(newScale);
    }

    //avec cet effet de zoom, nous avons l'impression de toujours zoomer vers le centre du stage.
    //c'est normal; pour donner l'effet de zoomer à la position actuelle, il fadrais modifier les valeurs x et y du stage, en fonction du zoom.
    //Cependant, cela implique un deplacement en entier de ce stage, modifiant ainsi les coordonnées.
    //ce n'est donc pas une solution viable.

  };

  const dropElem = (e) => {
    //
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const stagePosition = stage.absolutePosition();
    const pointer = stage.getPointerPosition();
    
    if (selectedItem === 'computer' || selectedItem === 'switch' || selectedItem === 'router' || selectedItem === 'server') {
      const pointerOnStageX = (pointer.x-dragOffset.x);
      const pointerOnStageY = (pointer.y-dragOffset.y);
      addItem(selectedItem, convertIntoTile({x:pointerOnStageX, y:pointerOnStageY}));
      setSelectedItem('');
    }
  }
  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      scaleX={scale}
      scaleY={scale}
      x={window.innerWidth / 2}
      y={window.innerHeight / 2}
      onWheel={handleWheel}
      onClick={dropElem}
      onDragMove={(e) => {
        const newPosition = e.target.position();
        setDragOffset({
          x: newPosition.x,
          y: newPosition.y,
        });
      }}
      draggable={deplacement}
    >
      
    
      <Layer ref={backgroundLayer}
      
      >
        <Background size={backgroundSize}/>

        {ressourcesBlock.map((elem, index) => (
          // Rendez chaque élément Computer directement dans le Layer
          <Rect
          key={index}
          x={convertIntoCoordinates({x:elem.x-0.5, y:elem.y+0.5}).x}
          y={convertIntoCoordinates({x:elem.x-0.5, y:elem.y+0.5}).y}
          width={backgroundSize.x/48}
          height={backgroundSize.y/28}
          fill="#5794f7" // Couleur de remplissage du rectangle
        />
        ))}

        

        {dataBlock.map((elem, index) => (
          // Rendez chaque élément Computer directement dans le Layer
          <Rect
          key={index}
          x={convertIntoCoordinates({x:elem.x-0.5, y:elem.y+0.5}).x}
          y={convertIntoCoordinates({x:elem.x-0.5, y:elem.y+0.5}).y}
          width={backgroundSize.x/48}
          height={backgroundSize.y/28}
          fill="#33d453" // Couleur de remplissage du rectangle
        />
        ))}

        {linesList.map((elem, index) => (
          // Rendez chaque élément Computer directement dans le Layer
          <Line
          key={index}
          points={[convertIntoCoordinates({x:elem.fromX, y:elem.fromY}).x, convertIntoCoordinates({x:elem.fromX, y:elem.fromY}).y , convertIntoCoordinates({x:elem.toX, y:elem.toY}).x, convertIntoCoordinates({x:elem.toX, y:elem.toY}).y]}
          stroke="red"
          strokeWidth={2}
        />
        ))}
        
        {computerList.map((elem, index) => (
          // Rendez chaque élément Computer directement dans le Layer
          <Computer
          key={index}
            pos={convertIntoCoordinates({x:elem.x, y:elem.y})}
            showSetItem={handleShowSetItem}
            name={elem.nom}
            attaque = {elem.attaque}
          />
        ))}
        {switchList.map((elem, index) => (
          // Rendez chaque élément Computer directement dans le Layer
          <Switch
          key={index}
            pos={convertIntoCoordinates({x:elem.x, y:elem.y})}
            showSetItem={handleShowSetItem}
            name={elem.nom}
          />
        ))}
        {routerList.map((elem, index) => (
          // Rendez chaque élément Computer directement dans le Layer
          <Router
          key={index}
            pos={convertIntoCoordinates({x:elem.x, y:elem.y})}
            showSetItem={handleShowSetItem}
            name={elem.nom}
          />
        ))}
        {serverList.map((elem, index) => (
          // Rendez chaque élément Computer directement dans le Layer
          <Server
          key={index}
            pos={convertIntoCoordinates({x:elem.x, y:elem.y})}
            showSetItem={handleShowSetItem}
            name={elem.nom}
            attaque = {elem.attaque}
          />
        ))}

      </Layer>
      
    </Stage>
  );
};

export default Map;
