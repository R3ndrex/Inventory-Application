const db = require("../db/queries");
const { body, matchingData } = require("express-validator");

const categoryValidator = [
    body("category", "Format isn't correct ")
        .trim()
        .notEmpty()
        .withMessage("Category can't be empty")
        .bail()
        .isAlpha()
        .withMessage("Must contain alphabet characters only")
        .bail()
        .isLength({ min: 2, max: 15 })
        .withMessage("Cant be longer than 15 character or shorter than 2"),
];

module.exports = {
    getCategoryList: async (_, res) => {
        const categories = await db.getCategories();
        return res.render("pages/index", { categories });
    },
    getCategory: async (req, res) => {
        const { category } = req.params;
        const games = await db.getGamesByCategory(category);
        return res.render("pages/gamesList", { games });
    },
    postCategory: (req, res) => {},
    deleteCategory: async (req, res) => {
        const { category } = req.params;
        await db.deleteCategory(category);
        return res.redirect("/");
    },
    updateCategory: (req, res) => {},
    getFormCategory: (req, res) => {},
};
