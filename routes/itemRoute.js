const { Router } = require("express");
const itemController = require("../controllers/itemController");
const itemRouter = Router();

itemRouter
    .route("/add")
    .get(itemController.getFormGame)
    .post(itemController.addGame);

itemRouter.get("/:gameId", itemController.getGame);
itemRouter.get("/:gameId/delete", itemController.deleteGame);

itemRouter
    .route("/:gameId/edit")
    .get(itemController.getUpdateGameForm)
    .post(itemController.updateGame);

module.exports = itemRouter;
