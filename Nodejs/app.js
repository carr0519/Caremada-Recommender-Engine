const express = require("express");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = require('./controller/routes.js');
app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));