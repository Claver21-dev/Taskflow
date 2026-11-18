# TaskFlow — Gestionnaire de tâches

TaskFlow est une mini-application web de gestion des tâches quotidiennes. Elle permet de créer, modifier, supprimer et suivre ses tâches dans une interface responsive avec un thème clair et un thème sombre.

## Démo

Après publication, ajoutez ici l'URL GitHub Pages de votre application.

## Fonctionnalités

- Ajouter une tâche avec un titre, une description et une date d'échéance facultative.
- Modifier et supprimer une tâche.
- Marquer une tâche comme terminée ou la remettre en cours.
- Filtrer les tâches : toutes, à faire et terminées.
- Consulter les statistiques des tâches.
- Sauvegarder les tâches et le thème choisi dans le navigateur grâce à `localStorage`.
- Basculer entre le thème clair et le thème sombre.
- Interface responsive pour ordinateur, tablette et mobile.

## Technologies

- HTML5
- CSS3 (Flexbox, Grid, variables CSS et media queries)
- JavaScript natif (ES6+ et DOM)
- LocalStorage
- Git et GitHub Pages pour le versionnement et le déploiement

Aucun framework JavaScript n'est utilisé.

## Installation et utilisation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/VOTRE-PSEUDO/TaskFlow.git
   ```

2. Ouvrez le dossier :

   ```bash
   cd TaskFlow
   ```

3. Ouvrez `index.html` dans votre navigateur. Vous pouvez aussi utiliser l'extension Live Server de Visual Studio Code pour lancer un serveur local.

Aucune installation de dépendances n'est nécessaire.

## Structure du projet

```text
TaskFlow/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── favicon.svg
```

## Stockage des données

Les tâches et le thème sont enregistrés dans le `localStorage` du navigateur. Les données restent donc disponibles lors des prochaines visites sur le même navigateur et le même appareil. Elles ne sont pas synchronisées entre plusieurs appareils.

## Déploiement avec GitHub Pages

1. Créez un dépôt GitHub nommé `TaskFlow`.
2. Envoyez les fichiers du projet sur la branche `main`.
3. Dans le dépôt, ouvrez **Settings → Pages**.
4. Dans **Build and deployment**, choisissez **Deploy from a branch**.
5. Sélectionnez la branche `main` et le dossier `/ (root)`, puis cliquez sur **Save**.
6. Après la publication, votre application sera disponible à l'adresse :

   `https://VOTRE-PSEUDO.github.io/TaskFlow/`

## Spécification courte

**Nom :** TaskFlow  
**Objectif :** fournir un outil simple pour organiser les activités quotidiennes et suivre leur avancement.  
**Public cible :** étudiants, professionnels et toute personne souhaitant organiser ses tâches.  
**Fonctions principales :** gestion CRUD des tâches, filtres par statut, statistiques, thème clair/sombre et sauvegarde locale.  
**Contraintes :** application front-end sans framework, utilisable sur les navigateurs modernes et les écrans mobiles.  
**Hébergement :** GitHub Pages.

## Améliorations possibles

- Recherche de tâches.
- Catégories et niveaux de priorité.
- Notifications de rappel.
- Synchronisation des tâches avec un compte utilisateur et une base de données.

## Auteur

Réalisé dans le cadre d'un exercice pratique de développement Front-End.
