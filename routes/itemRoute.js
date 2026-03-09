const { Router } = require("express");
const itemController = require("../controllers/itemController");
const itemRouter = Router();

itemRouter
    .route("/:game")
    .get(itemController.getGame)
    .post(itemController.postGame)
    .delete(itemController.deleteGame);

itemRouter.post("/:game/update", itemController.updateGame);

module.exports = itemRouter;
