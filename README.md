# SAE3.01 - HELLO WORD !

Ce projet consiste en un jeu éducatif pour apprendre les bases de l'informatique.
Il est la concretisation de mon troisième semestre à l'IUT2.
Apprennez en plus sur mon [Portfolio](https://mael-garnier.fr)

**Projet réalisé avec Jules Albuquerque-Parana, Maxime Conjard, Yoann Goumarre, Chloé Despesse, Titouan Frequelin**

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### PARTIE ADMINISTRATION

**Project name: Hello World!**

**Version projet: v0.1.0**

### Dépendances du système

- `npm`: v10.2.3

- `nvm`: v0.38.0

- `pm2`: v5.3.0

- `node`: v20.10.0

- `apache2`: v2.4.57

- `git`: v2.39.2

- `cron`: v0.13.0

### Mode Apache

- `mod_ssl`
- `mod_proxy`
- `mod_rewrite`

### Configuration du système

L'application web est géré par un serveur `apache`. La configuration de celui-ci se situe dans le chemin `/etc/apache2/sites-avaibles/helloworld.conf`.

**Note: l'applicaton tourne sur les ports 80 et 443**

Un certificat SSL auto signé à été généré par le module `mod_ssl` à l'emplacement `/etc/ssl/serveur_helloworld.crt`, avec sa clé `/etc/ssl/serveur_helloworld.key`.

Le fichier de configuration comporte une configuration d'un Reverse Proxy disponible avec le module `mod_ssl` utile dans l'utilisation d'une deuxième machine virtuelle où se situerait la base de donnée.
 
**Note: `mod_rewrite` permet une gestion du proxy avec le paramètre `[P]`**

### Variables d'environnement

**Configuration developpeurs**
- .env.development: Option d'environnement spécifique prioritaire sur la commande `npm start`. Celle-ci est configuré de sorte à gérer la variable `REACT_APP_DB_URL` pour que l'application utilise l'adresse ip locale de la machine, ainsi que le port 3000.

**Configuration productions**
- .env.production: option d'environnement spécifique prioritaire sur la commande `npm run build`. Celle-ci est configuré de sorte à gérer la variable `REACT_APP_DB_URL` pour que l'application utilise l'adresse distant du serveur de déploiement.

**Note: la variable est intialisée par `\api` car le serveur web distant utilise dans sa configuration le module `mod_rewrite` qui réécrit le chemin d'accès à la base de données**

### Déploiement de l'application web

--> La construction du dossier build avec `npm run build` est NECESSAIRE au deploiement du contenu STATIC sur un serveur web tel que `APACHE` ou `NGINX`.

**URL: https://hello-world.website**

--> La commande `npm start` ne doit servire qu'à faire des tests sur la machine locale.

**URL: http://localhost:3000**

### Déploiement de la base de donnée

Commande de lancement : `pm2 start server.js`

### Mise à jour automatique

Le serveur WEB et le serveur DB utilisent `cron` comme planifieur de tâches pour mettre à jour automatiquement les dossiers git `server` et `app`.
La mise à jour se réalise chaque jour à 00:00.
Il utilise un `TOKEN`, généré sur `gricad` dans le dossier de projet concerné.

**Manuel de configuration d'une mise à jour auto matique**

- Générer un token sur `gricad` dans `paramètre -> access token`.

**Paramètres types du token**
- `Token Name: auto-pull`
- `Expiration date: ****`
- `Select a role: Developer`
- `Select scopes: read_repository`
---------------------------------

Dans le dossier concerné:
- Exécuter: 
-> `git config credential.helper store`
-> `git pull`
-> Entrer le `Token Name` en tant que nom d'utilisateur
-> Entrer la `Token Key` en tan que mot de passe

**Serveur WEB**

**Note: Pour tous `git pull` réalisé il ne faut pas oublier `npm run build` pour prendre en compte la mise à jour**

**Note: en cas de problème, relancer le serveur apache `service apache2 restart` ou executer `npm install`**

**Serveur DB**

**Note: pour tous `git pull` réalisé il ne faut pas oublier de relancer le server sur pm2 `pm2 restart server.js`**

### Raspberry

Le raspeberry est connecté à une box wifi PERSONNELLE. En cas de déplacement du raspberry suivre le manuel de configuration

### Dépendances du système

- `Raspbian`: v6.1.21

### Configuration du système

Ce raspberry n'a d'utilité qu'à réaliser un tunneling ssh pour qu'un client passant par internet accède au serveur web local.

La commande utilisée: `ssh -f -L {ip-raspberry}:443:{ip-serveur-web}:443 -N {utilisateur}@{ip-iut}`

**Note: Cette commande fonctionne en l'exécutant sur le raspberry, elle doit être modifiée si elle est lancée sur le serveur web**