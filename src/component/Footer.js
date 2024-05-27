import React from 'react';
import { Link } from "react-router-dom";


const Footer = () => {

return (
    <footer>
        <ul>
            <li><Link to="/credits">Crédits</Link></li>
            <li><Link to="/confidentiality">Politique de confidentialité</Link></li>
            <li>"Hello World!" est un jeu web éducatif créé dans le cadre d'un projet universitaire.</li>
        </ul>
    </footer>
);
};

export default Footer;
