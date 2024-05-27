import React from 'react';
import mael from '../img/mael.jpg'
import yoann from '../img/yoann.jpg'
import maxime from '../img/maxime.jpg'
import titouan from '../img/titouan.jpg'
import jules from '../img/jules.jpg'
import chloe from '../img/chloe.jpg'
import evan from '../img/evan.png'
import NavBar from '../component/NavBar';



const Credits = () => {

return (
    <div>
        <header>
            <NavBar/>
        </header>
        <main className='credits'>
        

        <h1>Crédits</h1>
        <div>
            <h2>À propos de nous</h2>
            <p>Ce projet à été réalisé par une équipe de 7 étudiants en 2ème année de BUT informatique à l'IUT2 de Grenoble. Ce jeu à été développé dans le cadre d'une SAE (Situation d'Apprentissage et d'Évaluation) visant au développement d’un « serious game » éducatif.</p>
            <ul>
                <li>Maël <img src={mael}/></li>
                <li>Maxime <img src={maxime}/></li>
                <li>Jules <img src={jules}/></li>
                <li>Yoann <img src={yoann}/></li>
                <li>Chloé <img src={chloe}/></li>
                <li>Titouan <img src={titouan}/></li>
                <li>Evan <img src={evan}/></li>
            </ul>
        </div>
        <div>
            <h2>Illustrations</h2>
            <p>Toutes nos illustrations proviennent du site <a href='https://undraw.co/'>unDraw</a>, dont la licence spécifie que l'usage des assets et vecteurs publiés est autorisé pour un usage non commercial et commercial, et gratuitement. Voir la <a href='https://undraw.co/license' >licence complète</a> pour plus de détails.</p>
        </div>
        <div>
            <h2>Icônes</h2>
            <p>Toutes nos icônes proviennent du site <a href='https://lordicon.com/'>lordicon</a>, dont l'usage est autorisé (non commercial et commercial) gratuitement pour les icônes dites 'free'. Voir les <a href='https://lordicon.com/free-pro' >conditions d'utilisation</a> pour plus de détails.</p>
        </div>
        <div>
            <h2>Sprites</h2>
            <p>Touts nos sprites proviennent du site <a href='https://itch.io/'>itch.io</a>, dont l'usage est autorisé (non commercial et commercial) gratuitement pour les sprites dits 'gratuits'. Voir les <a href='https://itch.io/docs/legal/terms' >conditions d'utilisation</a> pour plus de détails.</p>
        </div>
    </main>
    </div>
    
);
};

export default Credits;
