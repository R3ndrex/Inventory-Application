const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getIndex);

categoryRouter
    .route("/categories/:category")
    .get(categoryController.getCategory)
    .post(categoryController.postCategory)
    .delete(categoryController.deleteCategory);

categoryRouter.post(
    "/categories/:category/update",
    categoryController.updateCategory,
);

module.exports = categoryRouter;
