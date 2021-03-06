const User = require("../models/user");

//On appelle Bcrypte pour hasher les mots de passe
const bcrypt = require("bcrypt");

//On appelle jwt pour créer les tokens
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  //Hash du password
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      //l'user dans la DB aura comme password le resultat du hash
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "User created !" }))
        .catch((error) => {
          if (user) {
            return res.status(409).json({ message: "User already exists" });
          } else {
            return res.status(400).json({ error });
          }
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "User Wrong !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Password wrong !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
