const { Router } = require("express");
const developerController = require("../controllers/developerController");

const developerRouter = Router();

developerRouter.get("/", developerController.getDevelopersList);
developerRouter
    .route("/add")
    .get(developerController.getFormDeveloper)
    .post(developerController.addDeveloper);

developerRouter.get("/:developer", developerController.getDeveloperGamesList);
developerRouter.get("/:developer/delete", developerController.deleteDeveloper);
developerRouter
    .route("/:developer/edit")
    .post(developerController.updateDeveloper)
    .get(developerController.getUpdateForm);

module.exports = developerRouter;
