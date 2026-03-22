const { Router } = require("express");
const developerController = require("../controllers/developerController");

const developerRouter = Router();

developerRouter
    .route("/add")
    .get(developerController.getFormDeveloper)
    .post(developerController.addDeveloper);

developerRouter.get("/:developer", developerController.getDeveloperGamesList);
module.exports = developerRouter;
