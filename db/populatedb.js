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
    imageSrc TEXT
);

CREATE TABLE IF NOT EXISTS games_categories(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES games(id),
    category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS developers(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    game_id INTEGER REFERENCES games(id)
);

INSERT INTO categories (name, imageSrc) 
VALUES ('Racing', 'https://cdn.mos.cms.futurecdn.net/Ms8dmvGfuCbiG9yZDKCbAQ-650-80.jpg.webp'), 
('Fighting','https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/05/Fighting-Game-Glossary.jpg'),
('Shooter','https://i.pcmag.com/imagery/roundups/04vNjp38Q8fzpxq3AdUip4I-6.fit_lim.size_1200x630.v1746122531.jpg'),
('Sandbox','https://static0.gamerantimages.com/wordpress/wp-content/uploads/wm/2024/06/7-great-survival-games-with-no-hunger-meter.jpg?q=49&fit=contain&w=750&h=422&dpr=2');

INSERT INTO games (name, imageSrc) 
VALUES ('Forza Horizon 6', 'https://digital-report.ru/wp-content/uploads/2026/01/wm.webp'),
('Fortnite','https://cdn2.unrealengine.com/fortnite-blitz-royale-1920x1080-9946411a3a9f.jpg');

INSERT INTO games_categories(game_id,category_id) 
VALUES (1,1), (2,3),(2,4);

INSERT INTO developers (name,game_id)
VALUES ('Epic Games',2),('Playground Games',1);
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
