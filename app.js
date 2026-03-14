require("dotenv").config();
const express = require("express");
const path = require("node:path");
const categoryRoute = require("./routes/categoryRoute");
const itemRoute = require("./routes/itemRoute");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
    return res.redirect("/categories");
});
app.use("/categories", categoryRoute);
app.use("/games", itemRoute);

app.use((req, res) => {
    return res.status(404).send("404");
});

app.use((error, req, res, next) => {
    console.error(error);
});

app.listen(process.env.PORT, (error) => {
    if (error) throw error;
    console.log("started at ", process.env.PORT);
});
