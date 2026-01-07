# Morpion - Application Vue.js

> Projet réalisé dans le cadre du TD4 - Web Client Avancé  
> IUT Charlemagne - Université de Lorraine

- Réalisé par : **[HERRMANN Vivien](https://github.com/Vivienhrm)**

![Vue.js](https://img.shields.io/badge/Vue.js-3.0-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-007ACC?style=flat-square&logo=axios&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## Description du projet

Application web de jeu de Morpion (Tic-Tac-Toe) multijoueur en temps réel, développée avec **Vue.js 3** et utilisant l'API REST fournie par l'IUT. Le projet implémente une architecture SPA (Single Page Application) avec gestion du routing et communication WebSocket pour la synchronisation en temps réel entre joueurs.

## Fonctionnalités implémentées

### Cœur du Jeu (WebSockets)
- **Synchronisation Temps Réel** : Le plateau de jeu se met à jour instantanément pour les deux joueurs grâce à une connexion WebSocket native.
- **Logique de Partie** : Gestion complète des tours, arbitrage des victoires/défaites et détection des matchs nuls.
- **Gestion de la Déconnexion** : Si un adversaire quitte la partie (ex: fermeture d'onglet), le jeu le détecte et informe le joueur restant via une bannière, sans interrompre brutalement l'expérience.

### Système de Matchmaking
- **Création de Salon** : Génération d'un *Game ID* unique lors de l'initialisation d'une partie.
- **Rejoindre une Partie** : Accès direct à une session de jeu via la saisie du code partagé par l'adversaire.

### Environnement Utilisateur
- **Profil Joueur** : Interface dédiée pour personnaliser son identité (Nom et Email) persistée via l'API.
- **Dashboard** : Page d'accueil centralisant les actions principales et l'état de la connexion API.
- **Authentification** : Gestion transparente de la clé API (stockage de session) et sécurité des requêtes Axios.

## Technologies utilisées

- **Vue.js 3** : Framework principal (Options API).
- **WebSockets** : Communication bidirectionnelle pour le temps réel.
- **Vue Router 4** : Gestion de la navigation SPA.
- **Axios** : Client HTTP.
- **Vite** : Environnement de développement et bundler ultra-rapide.
- **JavaScript (ES6+)** : Logique applicative.
- **ESLint** : Linting

---

## Architecture technique

### Structure du projet

```
.
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── index.js
│   ├── errors/
│   │   └── ErrorAlert.vue
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── Game.vue
│   │   ├── Home.vue
│   │   ├── Join.vue
│   │   └── Profile.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
```

---

## Installation

1. Cloner le dépôt :
   ```bash
   git clone <https://github.com/Vivienhrm/ProjetMorpion>
   cd ProjetMorpion
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

---

## Configuration API

1. **Récupérer une clé API** : Envoyer une requête POST à `https://morpion-api.edu.netlor.fr/api/apikeys` avec votre nom et email.
2. **Utilisation** : La clé est demandée au premier lancement de l'application et stockée en `sessionStorage`.

---

## Lancement

1. Démarrer le serveur de développement :
   ```bash
   npm run dev
   ```
2. Accéder à l'application via l'URL affichée (ex: `http://localhost:5173`).
