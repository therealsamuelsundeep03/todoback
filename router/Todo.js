const express = require("express");
const router = express.Router();
const controller = require("../controller/Todo");

router.post("/", controller.addTask);
router.get("/:user", controller.getTasks);
router.delete("/:user/:task", controller.deleteTask);

module.exports = router;