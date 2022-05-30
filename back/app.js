//importation d'express
const express = require("express");
const app = express();

//importation de mongoose qui contient le code de la db
const mongoose = require("./db/db");
//donne accès au chemin du systeme de fichier
const path = require("path");

//importation de morgan (logger http )
const morgan = require("morgan");

//logger les requêtes http et les reponses

app.use(morgan("dev"));

//importations des routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/Sauce");
//Pour extraire le corps JSON des requêtes
app.use(express.json());

//Réglage de la sécurité CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
module.exports = app;
