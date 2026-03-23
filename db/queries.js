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
async function deleteDeveloper(id) {
    await db.query("DELETE FROM developers WHERE id = $1", [id]);
}

async function getCategoriesWithGameAmount() {
    const categories = await getCategories();
    const results = await Promise.all(
        categories.map(async (category) => {
            const games = await getGamesByCategory(category.name);
            return { ...category, gamesAmount: games.length || 0 };
        }),
    );
    return results;
}

async function getDevelopersWithGameAmount() {
    const developers = await getDevelopers();
    const results = await Promise.all(
        developers.map(async (developer) => {
            const games = await getGamesByDeveloper(developer.name);
            return { ...developer, gamesAmount: games.length || 0 };
        }),
    );
    return results;
}

async function getCategoryById(id) {
    const { rows } = await db.query("SELECT * FROM categories WHERE id=$1", [
        id,
    ]);
    return rows[0];
}

async function postDeveloper({ name }) {
    await db.query("INSERT INTO developers (name) VALUES ($1)", [name]);
}

async function updateCategory(id, { name, imagesrc }) {
    await db.query(
        `UPDATE categories 
        SET name=$1,imagesrc=$2 WHERE categories.id=$3
        `,
        [name, imagesrc, id],
    );
}

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

async function getGamesByDeveloper(developer) {
    const { rows } = await db.query(
        `SELECT games.* FROM games 
        LEFT JOIN games_developers
        ON games_developers.game_id=games.id
        LEFT JOIN developers
        ON games_developers.developer_id = developers.id WHERE developers.name = $1`,
        [developer],
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
        array_remove(array_agg(DISTINCT developers.id),NULL) AS developersIds, 
        array_remove(array_agg(DISTINCT developers.name),NULL) AS developersNames, 
        array_remove(array_agg(DISTINCT categories.id),NULL) AS categoriesIds,
        array_remove(array_agg(DISTINCT categories.name),NULL) AS categoriesNames
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
async function getDeveloperById(id) {
    const { rows } = await db.query("SELECT * FROM developers WHERE id=$1", [
        id,
    ]);
    console.log(rows);
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
    deleteCategory,
    postCategory,
    updateCategory,
    getGamesByCategory,
    deleteGame,
    postGame,
    updateGame,
    getFullGameInfo,
    findGameByName,
    postDeveloper,
    getGamesByDeveloper,
    getCategoryById,
    getCategoriesWithGameAmount,
    getDevelopersWithGameAmount,
    getDeveloperById,
    getCategories,
    getDevelopers,
    deleteDeveloper,
};
