console.log("************Server Start************");

//Importation du package http pour la création du serveur
const http = require("http");

//Express pour la création du server
const express = require("express");

//Importation de dotenv qui permet d'utiliser les VR d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

//Importation d'app.js
const app = require("./app");

//Création du server (l'argument sera appelé à chaque requête)
const server = http.createServer(app);

//ecoute du serveur sur le port 3000
app.listen(process.env.PORT);
app.set("port", process.env.PORT);
