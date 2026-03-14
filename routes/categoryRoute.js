const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategoryList);

categoryRouter
    .route("/:category")
    .get(categoryController.getCategory)
    .post(categoryController.postCategory);

categoryRouter.get("/:category/delete", categoryController.deleteCategory);
categoryRouter.post("/:category/update", categoryController.updateCategory);

module.exports = categoryRouter;
