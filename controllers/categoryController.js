const db = require("../db/queries");
const { body, matchedData, validationResult } = require("express-validator");

const categoryValidator = [
    body("name", "Format isn't correct ")
        .trim()
        .notEmpty()
        .withMessage("Category can't be empty")
        .bail()
        .isLength({ min: 2, max: 20 })
        .withMessage("Cant be longer than 20 character or shorter than 2"),
    body("imagesrc", "Format isn't correct")
        .trim()
        .notEmpty()
        .withMessage("Image path can't be empty"),
];

module.exports = {
    getCategoryList: async (_, res) => {
        const categories = await db.getCategoriesWithGameAmount();
        return res.render("pages/index", { categories });
    },
    getCategory: async (req, res) => {
        const { category } = req.params;
        const games = await db.getGamesByCategory(category);
        return res.render("pages/gamesList", { games });
    },
    addCategory: [
        categoryValidator,
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const { name, imagescr } = req.body;
                return res.render("pages/addCategory", {
                    errors: errors.array(),
                    name,
                    imagescr,
                });
            }
            const { name, imagesrc } = matchedData(req);
            await db.postCategory({ name, imagesrc });
            res.redirect("/");
        },
    ],
    deleteCategory: async (req, res) => {
        const { category } = req.params;
        await db.deleteCategory(category);
        return res.redirect("/");
    },
    updateCategory: [
        categoryValidator,
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const { name, imagesrc } = req.body;
                return res.render("pages/updateCategory", {
                    category,
                    errors: errors.array(),
                    name,
                    imagesrc,
                });
            }
            const { category } = req.params;
            const { name, imagesrc } = matchedData(req);
            await db.updateCategory(category, { name, imagesrc });
            res.redirect("/");
        },
    ],
    getUpdateForm: async (req, res) => {
        const { category } = req.params;
        const { name, imagesrc } = await db.getCategoryById(category);
        return res.render("pages/updateCategory", { category, name, imagesrc });
    },
    getFormCategory: async (_, res) => {
        return res.render("pages/addCategory");
    },
};
