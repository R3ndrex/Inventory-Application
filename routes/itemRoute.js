const { Router } = require("express");
const itemController = require("../controllers/itemController");
const itemRouter = Router();

itemRouter
    .route("/add")
    .get(itemController.getFormGame)
    .post(itemController.addGame);

itemRouter.get("/:gameId", itemController.getGame);
itemRouter.get("/:gameId/delete", itemController.deleteGame);
itemRouter.get("/:gameId/edit", itemController.getUpdateGameForm);
itemRouter.post("/:gameId/edit", itemController.updateGame);

module.exports = itemRouter;
