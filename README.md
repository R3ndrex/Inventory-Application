# Inventory Application

A simple inventory web app built with **Node.js (Express)**, **EJS templates**, and **PostgreSQL**.  
You can manage **Categories**, **Games**, and **Developers**, including relationships between them.

## Features

- Categories CRUD (add, edit, delete)
- Games CRUD (add, edit, delete) with:
    - categories (many-to-many)
    - developers (many-to-many)
- Developers management (add, edit, delete)
- Pages rendered with EJS (no front-end framework)

## Tech Stack

- Node.js + Express
- EJS
- PostgreSQL (`pg`)
- `express-validator`
- `dotenv`

## Prerequisites

- PostgreSQL installed and a database created
- Node.js installed

## Environment Variables

Create a `.env` file (or set env vars) with:

- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — server port (example: `3000`)

## Database / Schema

The database schema is created by `db/populatedb.js` and includes:

- `categories`
- `games`
- `developers`
- `games_categories` (join table)
- `games_developers` (join table)

## Install

```bash
npm install
```

## Run

1. Seed / populate the database
   This project’s populate script expects the connection string as an argument:

```bash
npm run populate -- "<YOUR_DATABASE_URL>"
```

2. Start the server

```bash
npm start
```

Open in browser:

```bash
http://localhost:<PORT>
```

Important Routes

- GET / redirects to /categories
- GET /categories — categories list
- GET /games routes are under /games/:gameId (add/edit/delete included)
- GET /developers — developers list
- GET /developers/:developer — games by developer

## Project Scripts

```bash
npm start — runs nodemon app.js
npm run populate -- "<db url>" — runs node ./db/populatedb.js
```

Note: nodemon is used in package.json scripts. If it’s not installed, install it: npm i -D nodemon

## Sources

<a target="_blank" href="https://icons8.com/icon/67884/delete">Delete</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
