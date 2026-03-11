const db = require("../db/queries");
module.exports = {
    getGame: async (req, res) => {
        const { category } = req.params;
        const games = await db.getGames(category);
        res.render("pages/gamesList", { games });
    },
    postGame: () => {},
    deleteGame: async (req, res) => {
        const { game } = req.params;
        console.log(game);
        await db.deleteGame(game);
        res.redirect("/");
    },
    updateGame: () => {},
};
