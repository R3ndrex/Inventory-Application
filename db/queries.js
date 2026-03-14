const db = require("./pool");

async function getCategories() {
    const { rows } = await db.query(`SELECT * FROM categories`);
    return rows;
}

async function deleteCategory(id) {
    await db.query("DELETE FROM categories WHERE id = $1", [id]);
}
async function deleteGame(id) {
    await db.query("DELETE FROM games WHERE id = $1", [id]);
}
async function postCategory() {}
async function updateCategory() {}

async function getDevelopers() {
    const { rows } = await db.query(`SELECT * FROM developers`);
    return rows;
}

async function getGames(category) {
    const { rows } = await db.query(
        `SELECT games.* FROM games 
        LEFT JOIN games_categories
        ON games_categories.game_id=games.id
        LEFT JOIN categories
        ON games_categories.category_id = categories.id WHERE categories.name = $1`,
        [category],
    );
    return rows;
}
async function postGame({ category, name, image }) {
    await db.query(
        `INSERT INTO games (name, imageSrc, categoryId) VALUES ($1,$2,$3);`,
        [name, image, category],
    );
}

async function getFullGameInfo(gameId) {
    const { rows } = await db.query(
        `
        SELECT games.name AS name,games.imageSrc as imagesrc, developers.name AS developer ,array_agg(categories.name) AS categories FROM games 
        LEFT JOIN games_categories 
        ON games_categories.game_id=games.id
        LEFT JOIN categories
        ON games_categories.category_id = categories.id
        LEFT JOIN developers 
        ON developers.game_id=games.id
        WHERE games.id = $1
        GROUP BY games.name,developers.name,games.imageSrc
        `,
        [gameId],
    );
    console.log(rows);
    return rows[0];
}

async function updateGame() {}
module.exports = {
    getCategories,
    deleteCategory,
    postCategory,
    updateCategory,
    getGames,
    deleteGame,
    postGame,
    updateGame,
    getDevelopers,
    getFullGameInfo,
};
