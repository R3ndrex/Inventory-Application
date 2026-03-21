const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategoryList);
categoryRouter
    .route("/add")
    .get(categoryController.getFormCategory)
    .post(categoryController.addCategory);

categoryRouter.route("/:category").get(categoryController.getCategory);

categoryRouter.get("/:category/delete", categoryController.deleteCategory);
categoryRouter.post("/:category/edit", categoryController.updateCategory);

module.exports = categoryRouter;
