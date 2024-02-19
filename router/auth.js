const express = require("express");
const router = express.Router();
const controller = require("../controller/auth");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.get("/verify/:token", controller.verifyMail);

module.exports = router;
