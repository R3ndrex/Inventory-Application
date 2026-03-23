const db = require("../db/queries");
const { body, matchedData, validationResult } = require("express-validator");

const gameValidator = [
    body("name", "Format isn't correct")
        .trim()
        .notEmpty()
        .withMessage("Name can't be empty")
        .bail()
        .custom(async (value, { req }) => {
            const id = req?.params?.gameId;
            const game = await db.findGameByName(value);
            if (
                game?.name === String(value) &&
                Number(id) !== Number(game.id)
            ) {
                throw new Error("Name must be unique");
            }
            return true;
        })
        .bail(),
    body("image", "Format isn't correct")
        .trim()
        .notEmpty()
        .withMessage("Image Path can't be empty")
        .bail(),
    body("categories", "Format isn't correct")
        .isArray({ min: 1 })
        .withMessage("There must be 1 or more categories")
        .bail(),
    body("developers", "Format isn't correct")
        .isArray({ min: 1 })
        .withMessage("There must be 1 or more developers"),
];

module.exports = {
    getGame: async (req, res) => {
        const { gameId } = req.params;
        const { name, categoriesnames, developersnames, imagesrc } =
            await db.getFullGameInfo(gameId);
        return res.render("pages/gamePage", {
            name,
            categoriesNames: categoriesnames,
            developersNames: developersnames,
            imagesrc,
            id: gameId,
        });
    },
    addGame: [
        gameValidator,
        async (req, res) => {
            const errros = validationResult(req);
            if (!errros.isEmpty()) {
                const allCategories = await db.getCategories();
                const allDevelopers = await db.getDevelopers();
                const { image, name, categories, developers } = req.body;

                return res.status(400).render("pages/addGame", {
                    errors: errros.array(),
                    allDevelopers,
                    allCategories,
                    categoriesIds: categories,
                    developersIds: developers,
                    image,
                    name,
                });
            }
            const { name, image, categories, developers } = matchedData(req);
            await db.postGame({
                name,
                image,
                developers,
                categories,
            });
            return res.redirect("/");
        },
    ],
    deleteGame: async (req, res) => {
        const { gameId } = req.params;
        await db.deleteGame(gameId);
        return res.redirect("/");
    },
    getUpdateGameForm: async (req, res) => {
        const { gameId } = req.params;
        const { name, categoriesids, developersids, imagesrc } =
            await db.getFullGameInfo(gameId);
        const allCategories = await db.getCategories();
        const allDevelopers = await db.getDevelopers();
        return res.render("pages/updateGame", {
            allCategories,
            allDevelopers,
            name,
            categoriesIds: categoriesids.map(String),
            developersIds: developersids.map(String),
            image: imagesrc,
        });
    },
    getFormGame: async (_, res) => {
        const allCategories = await db.getCategories();
        const allDevelopers = await db.getDevelopers();
        return res.render("pages/addGame", { allCategories, allDevelopers });
    },
    updateGame: [
        gameValidator,
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const allCategories = await db.getCategories();
                const allDevelopers = await db.getDevelopers();
                const { image, name, categories, developers } = req.body;
                const categoriesIds = categories?.map((id) => {
                    return String(id);
                });
                const developersIds = developers?.map((id) => {
                    return String(id);
                });
                return res.status(400).render("pages/updateGame", {
                    errors: errors.array(),
                    allDevelopers,
                    allCategories,
                    categoriesIds,
                    developersIds,
                    image,
                    name,
                });
            }
            const { name, image, categories, developers } = matchedData(req);
            const { gameId } = req.params;
            await db.updateGame(gameId, {
                name,
                image,
                developers,
                categories,
            });
            return res.redirect("/");
        },
    ],
};
