//Importation de mongoose
const mongoose = require("../db/db");

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Pour ajouter le validateur comme plugin du schema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.mongoose.model("User", userSchema);
