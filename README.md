# Projet-6-dev-back-end
Développez le back-end d'un site de notation de livres.

Pour éviter les fuites de données, j'utilise cross-env et dotenv pour masquer les informations sensibles.
Pour utiliser ce code, il faudra instaler ces outils à la racine du projet avec:
  npm install --save-dev cross-env
  et
  npm install dotenv --save
Il faudra aussi créer un fichier .env à la racine du projet qui contiendra:
  MONGOOSE_CONNECT=mongodb+srv://exercice:d2YmkDSc9pF.D@cluster0.dihitit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
