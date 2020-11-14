const {spawn} = require("child_process");
const express = require('express');
const router = express.Router();
const dataStore = require('../persistence/DataStore.js');
const { exit } = require("process");


router.get("/", (req, res) => {
    res.render("home");
});

router.get("/reload/:datasetName", async (req, res) => {
    const datasetName = req.params.datasetName;
    await dataStore.reloadDataset(datasetName);
    res.redirect("/dataset/"+datasetName);
});



router.get("/insert/:datasetName", async (req, res) => {
    const datasetName = req.params.datasetName;
    res.render("insert"+datasetName);
});

router.post("/insert/caregivers", async (req, res) => {
    await dataStore.insertRecord('caregivers', {
        'Rank': req.body.Rank,
        'Name': req.body.Name,
        'Occupation': req.body.Occupation,
        'Genre': req.body.Genre,
        'Age': req.body.Age,
        'Availability': req.body.Availability,
        'Location': req.body.Location,
        'Rating': req.body.Rating
    });

    res.redirect("/dataset/caregivers");
});

router.post("/insert/movies", async (req, res) => {
    await dataStore.insertRecord('movies', {
        'Rank': req.body.Rank,
        'Title': req.body.Title,
        'Genre': req.body.Genre,
        'Description': req.body.Description,
        'Director': req.body.Director,
        'Actors': req.body.Actors,
        'Year': req.body.Year,
        'Runtime (Minutes)': req.body['Runtime (Minutes)'],
        'Rating': req.body.Rating,
        'Votes': req.body.Votes,
        'Revenue (Millions)': req.body['Revenue (Millions)'],
        'Metascore': req.body.Metascore,
    });

    res.redirect("/dataset/movies");
});

router.get("/dataset/:datasetName", async (req, res) => {
    const datasetName = req.params.datasetName;
    const dataset = await dataStore.getDataSet(datasetName);
    res.render("dataset", {
        datasetName: datasetName,
        headers: dataset.headers,
        dataset: dataset.data
    });
});

router.get("/recommendation/:datasetName/:key", async (req, res) => {
  const key = req.params.key;
  const datasetName = req.params.datasetName;
  const dataset = await dataStore.getDataSet(datasetName);
  let recommendations = [];

  const recommenderEngine = spawn("python", ['../Python/API.py', 'content', key, '_id', datasetName]);

  recommenderEngine.stdout.on("data", (data) => {
    data = data.toString().split("\n");
    data.pop();
    data.forEach((record) => recommendations.push(JSON.parse(record)));
  })

  recommenderEngine.on("close", (code) => {
    res.render("recommendations", {
        datasetName: datasetName,
        headers: dataset.headers,
        dataset: recommendations
    });
  });
});

router.get("/edit/:datasetName/:key", async (req, res) => {
    const key = req.params.key;
    const datasetName = req.params.datasetName;
    const editRecord = await dataStore.getRecord(datasetName, key);
    res.render("edit"+datasetName, {
        datasetName: datasetName,
        record: editRecord
    });
});

router.post("/edit/caregivers", async (req, res) => {
    await dataStore.editRecord('caregivers', req.body._id, {
        'Rank': req.body.Rank,
        'Name': req.body.Name,
        'Occupation': req.body.Occupation,
        'Genre': req.body.Genre,
        'Age': req.body.Age,
        'Availability': req.body.Availability,
        'Location': req.body.Location,
        'Rating': req.body.Rating
    });

    res.redirect("/dataset/caregivers");
});

router.post("/edit/movies", async (req, res) => {
    await dataStore.editRecord('movies', req.body._id, {
        'Rank': req.body.Rank,
        'Title': req.body.Title,
        'Genre': req.body.Genre,
        'Description': req.body.Description,
        'Director': req.body.Director,
        'Actors': req.body.Actors,
        'Year': req.body.Year,
        'Runtime (Minutes)': req.body['Runtime (Minutes)'],
        'Rating': req.body.Rating,
        'Votes': req.body.Votes,
        'Revenue (Millions)': req.body['Revenue (Millions)'],
        'Metascore': req.body.Metascore,
    });

    res.redirect("/dataset/movies");
});

router.post("/delete/:datasetName/:key", async (req, res) => {
    const key = req.params.key;
    const datasetName = req.params.datasetName;
    await dataStore.deleteRecord(datasetName, key);
    res.redirect("/dataset/" + datasetName);
});


module.exports = router;
