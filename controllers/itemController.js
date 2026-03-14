const db = require("../db/queries");
const { body, matchedData, validationResult } = require("express-validator");

const gameValidator = [
    body("name", "Format isn't correct ")
        .trim()
        .notEmpty()
        .withMessage("Name can't be empty"),
];

module.exports = {
    getGame: async (req, res) => {
        const { gameId } = req.params;
        const { name, developer, categories, imagesrc } =
            await db.getFullGameInfo(gameId);
        return res.render("pages/gamePage", {
            name,
            developer,
            categories,
            imagesrc,
        });
    },
    postGame: [
        gameValidator,
        async (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                const categories = await db.getCategories();
                return res.status(400).render("pages/addGame", {
                    errors: result.array(),
                    categories,
                });
            }
            const { name } = matchedData(req);
            const { category, image } = req.body;

            await db.postGame({ category, name, image });
            return res.redirect("/");
        },
    ],
    deleteGame: async (req, res) => {
        const { game } = req.params;
        await db.deleteGame(game);
        return res.redirect("/");
    },
    updateGame: () => {},
    getFormGame: async (_, res) => {
        const categories = await db.getCategories();
        const developers = await db.getDevelopers();
        return res.render("pages/addGame", { categories, developers });
    },
};
