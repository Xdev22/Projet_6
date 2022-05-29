const express = require("express");
const sauceCtrl = require("../controllers/Sauce");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-config");

router.get("/", auth, sauceCtrl.findAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.findOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
