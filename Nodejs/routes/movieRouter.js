const bodyParser = require("body-parser");
const ejs = require("ejs");
const {spawn} = require("child_process");
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();


// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log('connected to DB'));
mongoose.connect("mongodb://localhost:27017/moviesDB", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("Connected to MongoDB server."));

//------------------------------------------------------------------------------


const Movie = require('../models/Movie.js').model;
const movieHeaders = require('../models/Movie.js').headers;


router.get("/", (req, res) => {
    Movie.find({}, (err, moviesList) => {
        if (err) { console.log(err); }
        else {
            res.render("home", {
              headers: movieHeaders,
              moviesList: moviesList
            });
        }
    });
});

router.get("/login", (req, res) => {
    Movie.find({}, (err, moviesList) => {
        if (err) { console.log(err); }
        else {
            res.render("login");
        }
    });
});


router.get("/recommendation/:movieTitle", (req, res) => {

  const movieTitle = req.params.movieTitle;
  var dataToSend;

  const python = spawn("python", ['../Python/API.py', 'content', movieTitle]);

  python.stdout.on("data", (data) => {
      console.log("Pipe data from python script...");
      dataToSend = data.toString()
  })

  python.on("close", (code) => {
      console.log(`child process closed all stdio with code ${code}`);
      let recommendations = JSON.parse(dataToSend);
      res.render("home", {
        headers: movieHeaders,
        moviesList: recommendations
      });
  });
});

module.exports = router;
