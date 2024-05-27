const recette1 = {
  numero : 1,
  nom: 'SELECT de spaghettis bolognaise',
  etapes: [
    {
      numero: 1,
      intitule: 'Prendre les spaghettis',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'tiroir', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'spaghettis', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    {
      numero: 2,
      intitule: 'Prendre les tomates',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'frigo', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'tomate', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
  ],
  rangements: [
    {
      nom: 'tiroir',
      contenu: [
        { nom: 'spaghettis' },
      ],
    },
    {
      nom: 'frigo',
      contenu: [
        { nom: 'tomate' },
      ],
    },


  ],
};

const recette2 = {
  numero : 2,
  nom: 'Salade de requêtes',
  etapes: [
    {
      numero: 1,
      intitule: 'Prendre les clémentines',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'panier', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'clementine', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    {
      numero: 2,
      intitule: 'Prendre les ananas',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'frigo', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'ananas', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    {
      numero: 3,
      intitule: 'Prendre les raisins',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'panier', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'raisins', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
  ],
  rangements: [
    {
      nom: 'panier',
      contenu: [
        { nom: 'clementine' },
        { nom: 'raisins' },
      ],
    },
    {
      nom: 'frigo',
      contenu: [
        { nom: 'ananas' },
      ],
    },


  ],
};

const recette3 = {
  numero : 3,
  nom: 'Tranche de Pain façon requête',
  etapes: [
    {
      numero: 1,
      intitule: 'Prendre le pain',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'planche', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'pain', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    {
      numero: 2,
      intitule: 'Prendre le couteau',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'tiroir', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'couteau', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    {
      numero: 3,
      intitule: 'Couper le pain',
      reponses: [
        { nom: 'UPDATE', type: 'syntaxe' },
        { nom: 'pain', type: 'ingredient' },
        { nom: 'SET', type: 'syntaxe' },
        { nom: 'etat', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'coupé', type: 'valeur' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
  ],
  rangements: [
    {
      nom: 'planche',
      contenu: [
        { nom: 'pain' },
      ],
    },
    {
      nom: 'tiroir',
      contenu: [
        { nom: 'couteau' },
      ],
    },


  ],
};

const recette4 = {
  numero : 4,
  nom: 'Omelette de données',
  etapes: [
    {
      numero: 1,
      intitule: 'Prendre les oeufs',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'frigo', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'oeufs', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    {
      numero: 2,
      intitule: 'Battre les oeufs',
      reponses: [
        { nom: 'UPDATE', type: 'syntaxe' },
        { nom: 'oeufs', type: 'ingredient' },
        { nom: 'SET', type: 'syntaxe' },
        { nom: 'etat', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'battu', type: 'valeur' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    
  ],
  rangements: [
    {
      nom: 'frigo',
      contenu: [
        { nom: 'oeufs' },
      ],
    },

  ],
};

const recette5 = {
  numero : 5,
  nom: 'Rosbeef SQL',
  etapes: [
    {
      numero: 1,
      intitule: 'Prendre le boeuf',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
        { nom: '*', type: 'syntaxe' },
        { nom: 'FROM', type: 'syntaxe' },
        { nom: 'frigo', type: 'rangement' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'boeuf', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    {
      numero: 2,
      intitule: 'Mettre le boeuf au four',
      reponses: [
        { nom: 'INSERT INTO', type: 'syntaxe' },
        { nom: 'four', type: 'rangement' },
        { nom: 'VALUES', type: 'syntaxe' },
        { nom: 'boeuf', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
    {
      numero: 3,
      intitule: 'Cuire le boeuf',
      reponses: [
        { nom: 'UPDATE', type: 'syntaxe' },
        { nom: 'four', type: 'rangement' },
        { nom: 'SET', type: 'syntaxe' },
        { nom: 'etat', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'cuit', type: 'valeur' },
        { nom: 'WHERE', type: 'syntaxe' },
        { nom: 'nom', type: 'attribut' },
        { nom: '=', type: 'syntaxe' },
        { nom: 'boeuf', type: 'ingredient' },
        { nom: ';', type: 'syntaxe' },
      ],
    },
  ],
  rangements: [
    {
      nom: 'frigo',
      contenu: [
        { nom: 'boeuf' },
      ],
    },
    {
      nom: 'four',
      contenu: [
        
      ],
    },


  ],
};


const recette6 = {
  numero : 6,
  nom: 'speed',
  etapes: [
    {
      numero: 1,
      intitule: 'speed',
      reponses: [
        { nom: 'SELECT', type: 'syntaxe' },
      ],
    },
  ],
};





export { recette1,recette2,recette3,recette4,recette5,recette6 };