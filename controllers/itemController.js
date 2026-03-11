const db = require("../db/queries");
module.exports = {
    getGame: async (req, res) => {
        const { category } = req.params;
        const games = await db.getGames(category);
        return res.render("pages/gamesList", { games });
    },
    postGame: () => {},
    deleteGame: async (req, res) => {
        const { game } = req.params;
        await db.deleteGame(game);
        return res.redirect("/");
    },
    updateGame: () => {},
    getFormGame: async (_, res) => {
        const categories = await db.getCategories();
        return res.render("/pages/addGame", { categories });
    },
};
