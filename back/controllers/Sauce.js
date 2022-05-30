//Logique metier
const Sauce = require("../models/Sauce");

//importation de fs
const fs = require("fs");

//--------------------------CRUD-------------------------------
exports.findAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
  //La requête est en format JSON donc necéssite d'être parsé
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    //generation de l'url de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  //Enregistre dans la DB
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce Created!" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.findOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  //Si req.file existe on aura le 1er type d'objet, s'il n'existe pas on aura le 2eme
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //s'il n'existe pas :
      { ...req.body };

  //Fonction pour supprimé l'ancienne image de l'objet modifié
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      //Fs.unlink pour supprimer un fichier
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne(
          //recup l'objet
          { _id: req.params.id },
          //nouvelle Version de l'objet
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce updated !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      //Fs.unlink pour supprimer un fichier
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce deleted !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//-------------------------LIKE---------------------------
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((object) => {
      //Gerer le like=1

      // console.log(req.body.like);
      //Si l'utilisateur qui à liker n'est pas dans les usersLiked de la base de donnée et que le like de la requête est à 1 alors :
      if (!object.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        //mise à jour de DB
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: "Sauce liked !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        object.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: " Like removed !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        !object.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: " Sauce disliked !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (
        object.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(201).json({ message: " Dislike removed !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
