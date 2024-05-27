
import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import NavBar from '../component/NavBar';
import '../styles/MainPages.css';
import PopupWindow from '../component/PopupWindow';
import logo from '../img/logo_hello-world.png';
import { DataContext } from "../DataProvider";
import bgImage from '../img/homeBG.svg';
import learningImage from '../img/learning-illustration.svg';
import squisineImage from '../img/squisine-illustration.svg';
import shellhuntImage from '../img/shellhunt.-illustration.svg';
import resofImage from '../img/resof-illustration.svg';
import TurtleGame from '../img/TurtleGame.svg';
import Informatico from '../component/Informatico';

import { motion } from 'framer-motion';
import Footer from '../component/Footer';


//Affiche la page d'accueil

const HomePage = () => {
  window.scrollTo(0,0);
  const { isConnected, teacher } = useContext(DataContext);

  //variable d'etat permettant de controler si la fenetre popup doit etre affichée. D'autre variable d'etat permettent de stocker le message
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [action] = useState('');
  const [actionReturn] = useState(() => {});
  const [scrollButtonClass] = useState('back-visible');
  const [showInformatico, setShowInformatico] = useState(true);

  //permet de desactiver la fenetre
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const closeInformatico = () => {
    setShowInformatico(false);
  }
    

  const handleShowPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setShowPopup(true);
  }

    return (
        <div className='HomePage'>
        <header>
          <NavBar gameLogo={false}/>
        </header>

        {/* Permet d'afficher la fenetre popup seulement si showPopup est sur true */}
        {showPopup && <PopupWindow closePopup={handleClosePopup} title={popupTitle} message={popupMessage} action={action} returnAction={actionReturn}/>}

        
        <main>
          <div className='landing'>
            <div className='main-title'>
              <img src={logo} alt="Hello World Logo" />
              <p>Bienvenue sur Hello World ! Ici, vous pourrez apprendre toutes sortes de choses utiles pour la NSI à travers plusieurs jeux ludiques et divertissants ! À utiliser en cours comme à la maison, plus rien ne vous arrêtera !</p>
              <a href='#learning'>En savoir plus</a>
            </div>
            <div className='start-playing' >
                
              {isConnected && teacher ?
                (<Link to="/MenuProf">
                  <button className='button'>
                    <span className='button-text'>Gerer groupes</span>
                  </button>
                </Link>) :
                ""
              }
              {isConnected && !teacher &&(
                <Link to="/MenuEleve">
                  <button className='button-jouer'>
                    <span className='button-text'>Jouer</span>
                  </button>
                </Link>
              )}
              {!isConnected && (
                <button
                  className='button'
                  onClick={() => handleShowPopup("Pas si vite !", "Pour commencer à jouer, veuillez d'abord créer un compte ou vous connecter.")}
                >
                  <span className='button-text'>Jouer</span>
                </button>
              )}
              
            </div>
            <img src={bgImage} alt='background' className='bgImage' ></img>
            
          </div>

          <motion.div id='learning'  className='learning' initial={{ opacity: 0, scale: 0.8}} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, bounce: 0.4, duration: 0.5}}>
            <h1>Renforcez vos connaissances en NSI</h1>
            <p>Grâce à Hello World!, vous serez aussi bien capable d'apprendre seul en autodidacte depuis chez vous, que d'apprendre en classe entourés d'autres joueurs.
              Nos mini-jeux solo et multijoueurs, accompagnés de quiz, sont parfaitement adaptés à ces deux usages. Construits à partir du programme de terminal, vous pouvez être sûr de travailler sur l'ensemble des ressources, tout en vous amusant.
              Les fonctionnalitées de groupes et de jeu en ligne permettront aux professeurs de créer des sessions de cours, et ainsi permettre à l'ensemble de la classe de jouer coopérativement.
            </p>
            <img src={learningImage} alt='learning'></img>
          </motion.div>
          
        <motion.div className='squisine' initial={{ opacity: 0, scale: 0.8}} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, bounce: 0.4, duration: 0.5}}>
            <h1>Cuisinez en SQL grâce à SQuisine Lite</h1>
            <p>
            Grâce à un jeu mêlant requêtes et cuisine, apprenez le SQL de manière simple et ludique. Multiple recettes et difficultées proposées.            </p>
            <img src={squisineImage} alt='squisine'></img>
          </motion.div>

          <motion.div className='resof' initial={{ opacity: 0, scale: 0.8}} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, bounce: 0.4, duration: 0.5}}>
            <h1>Imaginez des structures réseaux avec Rés'of Kingdom</h1>
            <p>
              Créez un véritable empire de machines en configurant différents appareils et en les protégeant des attaques extérieures.
              </p>
            <img src={resofImage} alt='resof kingdom'></img>
          </motion.div>

          <motion.div className='resof' initial={{ opacity: 0, scale: 0.8}} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, bounce: 0.4, duration: 0.5}}>
            <h1>Enquêtez avec un terminal dans ShellHunt</h1>
            <p>
            Menez l'enquête dans un invite de commande afin de trouver le meurtrier.
              Utilisez diverses commandes pour avancer dans des énigmes.
            </p>
            <img src={shellhuntImage} alt='shellhunt'></img>
          </motion.div>

          <motion.div className='resof' initial={{ opacity: 0, scale: 0.8}} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, bounce: 0.4, duration: 0.5}}>
            <h1>Dessinez avec TurtleGame</h1>
            <p>
            Utilisez vos connaissances de python turtle afin de créer des programmes qui vous permettront de créer des dessins. 
              Ces dessins n'ont qu'une seul limite votre imagination !
              
            </p>
            <img src={TurtleGame} alt='TurtleGame'></img>
          </motion.div>

          <button
            className={'back-to-top ' + scrollButtonClass}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          {(showInformatico && isConnected && !teacher) && <Informatico closeWindow={closeInformatico} page={'homePage'} context={'introduction'}></Informatico>}
          
        
        </main>
        <Footer/>
      </div>
    )
}
export default HomePage;