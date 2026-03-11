const { Client } = require("pg");
const { argv } = require("process");
const SQL = `CREATE TABLE IF NOT EXISTS categories(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    imageSrc TEXT
);
CREATE TABLE IF NOT EXISTS games(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    imageSrc TEXT,
    categoryId INTEGER,
    CONSTRAINT fk_category
        FOREIGN KEY(categoryId)
            REFERENCES categories(id) ON DELETE CASCADE
);

INSERT INTO categories (name, imageSrc) VALUES ('Racing', 'https://cdn.mos.cms.futurecdn.net/Ms8dmvGfuCbiG9yZDKCbAQ-650-80.jpg.webp'), ('Fighting','https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/05/Fighting-Game-Glossary.jpg');
INSERT INTO games (name, imageSrc, categoryId) VALUES ('Forza Horizon 6', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfxAQY2EkEdjvz5CBGbDc-rCnTtDqbeyALLw&s', 1);
`;

async function main() {
    const DATABASE_URL = argv[2];
    const client = new Client({
        connectionString: DATABASE_URL,
    });
    await client.connect();
    console.log("seeding");
    await client.query(SQL);
    await client.end();
    console.log("seeding ended");
}

main();
