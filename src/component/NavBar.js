import React, {useContext, useState} from 'react';
import { Outlet, Link } from "react-router-dom";
import '../styles/MainPages.css';
import image from '../img/logo_hello-world.png';
import { DataContext } from '../DataProvider';
import { useNavigate } from 'react-router-dom';
import ProfilWindow from '../component/ProfilWindow';


//component permettant d'afficher la barre de navigation. Simplifie le code dans les autre fichiers, et rends la barre de navigation universelle dans toute l'application

const NavBar = ({ gameLogo = true }) => {

    const { logout, isConnected, userName, name, surName, teacher,deleteUserAcc } = useContext(DataContext);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [showSupprimer, setShowSupprimer] = useState(false);

    //permet d'afficher le menu ou non pour les mobiles
    const [showMenu, setShowMenu] = useState(true);
/**
 * Gère la déconnexion de l'utilisateur en redirigeant vers la page d'accueil et en effectuant la déconnexion.
 */
    const handleLogout = () => {
        setShowMenu(true);
        navigate('/', { replace: true });
        logout();
    }
/**
 * Gère la suppression du compte utilisateur en appelant la fonction de suppression de compte et en effectuant la déconnexion.
 */
    const handleDeleteAccount = () => {
        setShowMenu(true);

        deleteUserAcc();
        logout();
    }

    const handleMenu = () => {
        setShowMenu(!showMenu);
    }
/**
 * Redirige l'utilisateur vers la page d'accueil.
 */
    const handleGoHome = () => {
        setShowMenu(true);

        navigate('/', { replace: true });
    }
/**
 * Ferme les popups affichées.
 */
    const handleClosePopup = () => {
        setShowMenu(true);

        setShowPopup(false);
        setShowSupprimer(false);
    };
/**
 * Affiche la popup.
 */
    const handleShowPopup =() => {
        setShowMenu(true);

        setShowPopup(true);
    }
/**
 * Affiche la popup de suppression après avoir caché la popup principale.
 */
    const handleSuppr = () => {
        setShowMenu(true);

        setShowPopup(false);
        setShowSupprimer(true);
    }

    return (
        <>
            <nav className={showMenu&&'showMenu'}>
                <Link to="/" className={!gameLogo ? "not-visible" : ""}><img src={image}></img></Link>
                <ul>
                    {isConnected ? (
                        <>
                        <li className='userName' >Login:ㅤ{userName}</li> 
                        <li className='avatar small-button' onClick={handleShowPopup}></li> 
                        <li className='logout'><button className='small-button' onClick={handleLogout}>Déconnexion</button></li>
                        </>
                    ) : (
                        <>
                        <li><Link to="/inscription"><button className='small-button'>S'inscrire</button></Link></li>
                        <li><Link to="/connexion"><button className='small-button'>Se connecter</button></Link></li>
                        </>
                    )}
                    <>
                        <li className='home small-button' onClick={handleGoHome}></li> 
                    </>
                    
                </ul>
                <button className='menuBtn button' onClick={handleMenu}/>
            </nav>
            <Outlet />            
            {showPopup && <ProfilWindow closePopup={handleClosePopup} title={userName} message={<>
                <p>{`Nom d'utilisateur : ${userName}`}</p>
                <p>{`Prénom : ${name}`}</p>
                <p>{`Nom : ${surName}`}</p>
                <p>{`Type de compte : ${teacher ? "professeur" : "Élève"}`}</p>
            </>} action={"button"} returnAction={handleLogout} messagebutton={"Déconnexion"} supprCompte={handleSuppr} />}
            {showSupprimer && <ProfilWindow closePopup={handleClosePopup} title={userName} message={<>
                <p>{`Voulez-vous vraiment supprimer votre compte ?`}</p>
                
            </>} action={"button"} returnAction={handleDeleteAccount} messagebutton={"Oui"} />}

        </>
    )
}
export default NavBar;
