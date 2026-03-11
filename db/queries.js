const db = require("./pool");
async function getCategories() {
    const { rows } = await db.query(`SELECT * FROM categories`);
    return rows;
}
async function deleteCategory(id) {
    await db.query("DELETE FROM categories WHERE id = $1", [id]);
}
async function postCategory() {}
async function updateCategory() {}

async function getGames() {}
async function deleteGame() {}
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
