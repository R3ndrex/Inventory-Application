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
async function postCategory({ name, imagesrc }) {
    await db.query("INSERT INTO categories (name, imageSrc) VALUES ($1,$2)", [
        name,
        imagesrc,
    ]);
}

async function getCategoryById(id) {
    const { rows } = await db.query("SELECT * FROM categories WHERE id=$1", [
        id,
    ]);
    return rows[0];
}

async function postDeveloper({ name, imagesrc }) {
    await db.query("INSERT INTO developers (name, imageSrc) VALUES ($1,$2)", [
        name,
        imagesrc,
    ]);
}

async function updateCategory() {}

async function getDevelopers() {
    const { rows } = await db.query(`SELECT * FROM developers`);
    return rows;
}

async function getGamesByCategory(category) {
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

async function getGamesByDeveloper(category) {
    const { rows } = await db.query(
        `SELECT games.* FROM games 
        LEFT JOIN games_developers
        ON games_developers.game_id=games.id
        LEFT JOIN developers
        ON games_developers.developer_id = developers.id WHERE developers.name = $1`,
        [category],
    );
    return rows;
}

async function postGame({ categories, name, image, developers }) {
    await db.query("BEGIN");
    try {
        const { rows } = await db.query(
            `INSERT INTO games (name, imageSrc) VALUES ($1,$2) RETURNING id;`,
            [name, image],
        );
        const id = rows[0].id;
        if (categories && categories.length > 0) {
            for (const category of categories) {
                await db.query(
                    `INSERT INTO games_categories (game_id,category_id) VALUES ($1,$2)`,
                    [id, category],
                );
            }
        }
        if (developers && developers.length > 0) {
            for (const developer of developers) {
                await db.query(
                    `INSERT INTO games_developers (game_id,developer_id) VALUES ($1,$2)`,
                    [id, developer],
                );
            }
        }

        await db.query("COMMIT");
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
}
async function findGameByName(name) {
    const { rows } = await db.query(`SELECT * FROM games WHERE games.name=$1`, [
        name,
    ]);
    return rows[0];
}

async function getFullGameInfo(gameId) {
    const { rows } = await db.query(
        `
        SELECT games.name AS name,
        games.imageSrc as imagesrc, 
        array_agg(DISTINCT developers.id) AS developersIds, 
        array_agg(DISTINCT developers.name) AS developersNames, 
        array_agg(DISTINCT categories.id) AS categoriesIds,
        array_agg(DISTINCT categories.name) AS categoriesNames
        FROM games 
        LEFT JOIN games_categories 
        ON games_categories.game_id=games.id
        LEFT JOIN categories
        ON games_categories.category_id = categories.id
        LEFT JOIN games_developers
        ON games_developers.game_id=games.id 
        LEFT JOIN developers 
        ON games_developers.developer_id=developers.id
        WHERE games.id = $1
        GROUP BY games.name,games.imageSrc
        `,
        [gameId],
    );
    return rows[0];
}

async function updateGame(gameId, { name, image, developers, categories }) {
    console.log(categories);
    await db.query("BEGIN");
    try {
        await db.query(
            `UPDATE games 
            SET name=$1,imagesrc=$2 
            WHERE id=$3
            `,
            [name, image, gameId],
        );
        await db.query(`DELETE FROM games_categories WHERE game_id = $1`, [
            gameId,
        ]);
        if (categories && categories.length > 0) {
            for (const category of categories) {
                await db.query(
                    `INSERT INTO games_categories (game_id, category_id) VALUES ($1, $2)`,
                    [gameId, category],
                );
            }
        }
        await db.query(`DELETE FROM games_developers WHERE game_id = $1`, [
            gameId,
        ]);
        if (developers && developers.length > 0) {
            for (const developer of developers) {
                await db.query(
                    `INSERT INTO games_developers (game_id, developer_id) VALUES ($1, $2)`,
                    [gameId, developer],
                );
            }
        }

        await db.query("COMMIT");
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
}
module.exports = {
    getCategories,
    deleteCategory,
    postCategory,
    updateCategory,
    getGamesByCategory,
    deleteGame,
    postGame,
    updateGame,
    getDevelopers,
    getFullGameInfo,
    findGameByName,
    postDeveloper,
    getGamesByDeveloper,
    getCategoryById,
};
