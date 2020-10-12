//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const {spawn} = require("child_process");
const mongoose = require("mongoose");
const app = express();

const movieRouter = require('./routes/movieRouter.js');
app.use("/", movieRouter);
app.use("/recommendation/:movieTitle", movieRouter);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//------------------------------------------------------------------------------



app.listen(3000, () => console.log("Server running on port 3000"));
