const db = require("../db/queries");
const { body, matchingData } = require("express-validator");

const categoryValidator = [
    body("category", "Format isn't correct ")
        .trim()
        .notEmpty()
        .withMessage("Category can't be empty"),
];

module.exports = {
    getIndex: async (_, res) => {
        const categories = await db.getCategories();
        return res.render("pages/index", { categories });
    },
    getCategory: () => {},
    postCategory: () => {},
    deleteCategory: async (req, res) => {
        const { category } = req.params;
        console.log(category);
        await db.deleteCategory(category);
        res.redirect("/");
    },
    updateCategory: () => {},
};
