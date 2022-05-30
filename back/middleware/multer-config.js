//Fonction multer permet de gérer les images
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  //Destination du fichier
  destination: (req, file, callback) => {
    //images : nom du dossier de destination
    callback(null, "images");
  },
  //Gérer le nom du fichier
  filename: (req, file, callback) => {
    //Le nom du fichier/nom d'origine+supprimer les espaces et ajouter des _
    const name = file.originalname.split(" ").join("_");
    //Gerer l'extension
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
