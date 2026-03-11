const { Router } = require("express");
const itemController = require("../controllers/itemController");
const itemRouter = Router();

itemRouter
    .route("/add")
    .get(itemController.getFormGame)
    .post(itemController.postGame);

itemRouter.get("/:game/delete", itemController.deleteGame);
itemRouter.post("/:game/update", itemController.updateGame);
itemRouter.get("/:category", itemController.getGame);
module.exports = itemRouter;
