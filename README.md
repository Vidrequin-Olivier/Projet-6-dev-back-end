# Projet-6-dev-back-end
Développez le back-end d'un site de notation de livres.

Pour éviter les fuites de données, j'utilise cross-env (nécessaire uniquement si vous tournez sous Windows) et dotenv pour masquer les informations sensibles. Etant donné que ce projet est un exercice qui a besoin d'être partagé, voiçi les informations sensibles dont vous aurez besoin pour le faire tourner.

Pour utiliser ce code, il faudra instaler ces outils à la racine du projet avec:
  npm install --save-dev cross-env
  et
  npm install dotenv --save
Il faudra aussi créer un fichier .env à la racine du projet qui contiendra:
  MONGOOSE_CONNECT=mongodb+srv://exercice:d2YmkDSc9pF.D@cluster0.dihitit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  JWT_SECRET="token_aleatoire"

  pour gérer les variables d'environnement et que les données sensibles n'apparaissent pas sur le dépot il faudra créer un fichier .env contenant les 2 informations suivantes:
    MONGOOSE_CONNECT=mongodb+srv://exercice:d2YmkDSc9pF.D@cluster0.dihitit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    JWT_SECRET="token_aleatoire"