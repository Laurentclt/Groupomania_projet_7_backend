# projet_7_backend

## Project setup

Accédez sur https://nodejs.org/en/ pour télécharger puis installer Node.js sur votre machine.

Ensuite installer NPM avec cette ligne de commande :
```
npm install
```
Créez un dossier "images" à la racine du dossier. Ce dossier servira de stockage au images que vous allez utiliser dans l'application.

Vous devez également créer un fichier ".env" à la racine du dossier.

Dans ce fichier il faudra créer une paire clé/valeur qui vous permettra de mettre en place votre base de données. 
Vous devez écrire la clé "LOG_MONGODB" et entrer vos informations de MongoDB comme présenté ci-dessous:

LOG_MONGODB = 'mongodb://username:password@host:port/database?options...' ( ⚠ en utilisant les informations de votre base de données MongoDB)

Une fois votre base de données en place vous pouvez lancer le serveur avec la ligne de commande présente dans "Start server".

## Start server
```
nodemon server
```
