const { Router } = require("express");
const itemController = require("../controllers/itemController");
const itemRouter = Router();

itemRouter.route("/:category").get(itemController.getGame);

itemRouter.route("/:game").post(itemController.postGame);

itemRouter.get("/:game/delete", itemController.deleteGame);
itemRouter.post("/:game/update", itemController.updateGame);

module.exports = itemRouter;
