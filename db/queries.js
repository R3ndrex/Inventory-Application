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

async function getGames() {
    const { rows } = await db.query(
        `SELECT games.* FROM games 
        LEFT JOIN categories 
        ON games.categoryId = categories.id`,
    );
    return rows;
}

async function postGame() {}
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
};
