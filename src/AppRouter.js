import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inscription from './pages/Inscription';
import HomePage from './pages/HomePage';
import MenuProf from './pages/MenuProf';
import MenuEleve from './pages/MenuEleve';
import CreerGroupe from './pages/CreerGroupe';
import SQuisine from './pages/SQuisine';
import SQuisineMulti from './pages/SQuisineMulti';
import Connexion from './pages/Connexion';
import ChoisirMode from './pages/ChoisirMode';
import JeuxMulti from './pages/JeuxMulti';
import JeuxSolo from './pages/JeuxSolo';
import SelectionNiv from './pages/SelectionNiv';
import Qcm from './pages/Qcm';
import Resofkingdom from './pages/Resofkingdom';
import Groupe from './pages/Groupe';
import EleveDetails from './pages/EleveDetails'; 
import NoPage from './pages/NoPage';
import Confidentiality from './pages/Confidentiality';
import Credits from './pages/Credits';



import ShellHunt from './pages/ShellHunt';
import TurtleGame from './pages/TurtleGame'; 


//Ce fichier sert à router les différentes page de l'application. Cela simplifie leurs ouvertures. Voir un exemple d'utilisation dans NavBar.js

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<HomePage />} />
          <Route path="Inscription" element={<Inscription />} />
          <Route path="Connexion" element={<Connexion />} />
          <Route path="MenuProf" element={< MenuProf /> } />
          <Route path="MenuEleve" element={< MenuEleve /> } />
          <Route path="CreerGroupe" element={< CreerGroupe /> } />
          <Route path="SQuisineSolo" element={< SQuisine /> } />
          <Route path="SQuisine" element={< SQuisineMulti /> } />
          <Route path="Resofkingdom" element={< Resofkingdom />} />
          <Route path="Connexion" element={< Connexion />}/>
          <Route path="ChoisirMode" element={< ChoisirMode /> } />
          <Route path="JeuxMulti" element={< JeuxMulti /> } />
          <Route path="JeuxSolo" element={< JeuxSolo /> } />
          <Route path="SelectionNiv" element={< SelectionNiv />}/>
          <Route path="Qcm" element={< Qcm />}/>
          <Route path="groupe/:group" element={<Groupe />} />
          <Route path="/eleve/:username" element={<EleveDetails />} />
          <Route path="confidentiality" element={< Confidentiality /> } />
          <Route path="credits" element={< Credits /> } />


          <Route path="ShellHunt" element={< ShellHunt />}/>
          <Route path="TurtleGame" element={< TurtleGame />}/>

          <Route path="*" element={<NoPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
