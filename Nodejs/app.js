//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const movieRouter = require('./controller/routes.js');
app.use("/", movieRouter);
app.use("/recommendation/:movieTitle", movieRouter);



//------------------------------------------------------------------------------



app.listen(3000, () => console.log("Server running on port 3000"));
