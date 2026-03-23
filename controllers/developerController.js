const db = require("../db/queries");
const { body, matchedData, validationResult } = require("express-validator");

const developerValidator = [
    body("name", "Format isn't correct ")
        .trim()
        .notEmpty()
        .withMessage("Developer name can't be empty")
        .bail()
        .isLength({ min: 2, max: 20 })
        .withMessage("Cant be longer than 20 character or shorter than 2"),
];

module.exports = {
    getDevelopersList: async (_, res) => {
        const developers = await db.getDevelopersWithGameAmount();
        return res.render("pages/developerList", { developers });
    },
    getDeveloperGamesList: async (req, res) => {
        const { developer } = req.params;
        const games = await db.getGamesByDeveloper(developer);
        return res.render("pages/gamesList", { games });
    },
    addDeveloper: [
        developerValidator,
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const { name } = req.body;
                return res.render("pages/addDeveloper", {
                    errors: errors.array(),
                    name,
                });
            }
            const { name } = matchedData(req);
            await db.postDeveloper({ name });
            res.redirect("/");
        },
    ],
    deleteDeveloper: async (req, res) => {
        const { developer } = req.params;
        await db.deleteDeveloper(developer);
        return res.redirect("/");
    },
    getUpdateForm: async (req, res) => {
        const { developer } = req.params;
        const { name } = await db.getDeveloperById(developer);
        res.render("pages/updateDeveloper", { name });
    },
    updateDeveloper: async (req, res) => {
        res.redirect("/");
    },
    getFormDeveloper: async (_, res) => {
        return res.render("pages/addDeveloper");
    },
};
