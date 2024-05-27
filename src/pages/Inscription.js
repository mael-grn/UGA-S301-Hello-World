import React, { useState } from 'react';
import NavBar from '../component/NavBar';
import ProfilSelection from '../component/register/ProfilSelection';
import InscriptionForm from '../component/register/InscriptionForm';

//Cette page gère l'inscription d'un utilisateur. Elle affiche au besoins la selection du profil, puis le formulaire en fonction du profil.

const Inscription = () => {

    //ces variables d'etat permettent de verifier si l'utilisateur est un professeur ou un etudiant
    const [teacher, setTeacher] = useState(false);
    const [student, setStudent] = useState(false);

    //cette fonction est utilisé pour rendre l'utilisateur professeur
    const activateTeacher = () => {
      setTeacher(true);
      setStudent(false);
    }

    //cette fonction est utilisé pour rendre l'utilisateur étudiant
    const activateStudent = () => {
      setStudent(true);
      setTeacher(false);
    }

    const openProfileSelection = () => {
      setStudent(false);
      setTeacher(false);
    }

    return (
        <div className='Inscription'>
        <header className='App-header'>
          <NavBar/>
        </header>
        
        <main>
        {/* Affiche le formulaire d'inscription (InscriptionForm) seulement si teacher ou student est vrai */}
        {(teacher || student) && (
        <InscriptionForm
          //Passage en parametre de teacher pour le formulaire. Ainsi le formulaire s'adaptera si le profil est professeur ou etudiant
          isTeacher = {teacher}
          goBack = {openProfileSelection}
        />
        )}

        {/* Affiche la selection du profil seulement si on ne sait pas si l'utilisateur est teacher ou student (les deux sont faux) */}
        {(!teacher && !student) && (
        <ProfilSelection
          //passage en parametre des fonctions pour activer le profil étudiant ou professeur. Permet de changer l'etat de ces variable directement depuis le component ProfilSelection.
          activateStudent={activateStudent}
          activateTeacher={activateTeacher}
        />
        )}
        </main>
      </div>
    )
}
export default Inscription;