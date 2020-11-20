const router = require('express').Router();
const { spawn } = require("child_process");
const dataStore = require('../persistence/DataStore.js');


router.get("/", (req, res) => {
    res.render("home");
});

router.get("/display/:datasetName", (req, res) => {
    const datasetName = req.params.datasetName;
    dataStore.getDataSet(datasetName)
        .then(dataset => {
            res.render("display", {
                datasetName: datasetName,
                headers: dataset.headers,
                dataset: dataset.data
            });
        })
});

router.get("/reload/:datasetName", (req, res) => {
    const datasetName = req.params.datasetName;
    dataStore.reloadDataset(datasetName)
        .then(() => res.redirect("/display/" + datasetName));
});

router.get("/recommendation/:datasetName/:key", async (req, res) => {
    const key = req.params.key;
    const datasetName = req.params.datasetName;
    const dataset = await dataStore.getDataSet(datasetName);
    const record = await dataStore.getRecord(datasetName, key);
    let recommendations = [];

    const recommenderEngine = spawn("python", ['../Python/API.py', 'content', key, '_id', datasetName]);

    recommenderEngine.stdout.on("data", (data) => {
        data = data.toString().split("\n");
        data.pop();
        data.forEach((record) => recommendations.push(JSON.parse(record)));
    })

    recommenderEngine.on("close", (code) => {
        res.render("recommendations", {
            record: record,
            datasetName: datasetName,
            headers: dataset.headers,
            dataset: recommendations
        });
    });
});

router.get("/insert/:datasetName", (req, res) => {
    const datasetName = req.params.datasetName;
    res.render("insert" + datasetName);
});

router.post("/insert/movies", (req, res) => {
    dataStore.insertRecord('movies', {
        'Title': req.body.Title,
        'Genre': req.body.Genre,
        'Description': req.body.Description,
        'Director': req.body.Director,
        'Actors': req.body.Actors,
        'Year': req.body.Year,
        'Runtime (Minutes)': req.body.Runtime,
        'Rating': req.body.Rating,
        'Votes': req.body.Votes,
        'Revenue (Millions)': req.body.Revenue,
        'Metascore': req.body.Metascore,
    })
        .then(res.redirect("/display/movies"));
});

router.post("/insert/caregivers", (req, res) => {
    dataStore.insertRecord('caregivers', {
        'Name': req.body.Name,
        'Occupation': req.body.Occupation,
        'Services': req.body.Services,
        'Age': req.body.Age,
        'Availability': req.body.Availability,
        'Location': req.body.Location,
        'Rating': req.body.Rating
    })
        .then(res.redirect("/display/caregivers"));
});



router.get("/edit/:datasetName/:key", (req, res) => {
    const key = req.params.key;
    const datasetName = req.params.datasetName;
    dataStore.getRecord(datasetName, key)
        .then(editRecord => 
            res.render("edit" + datasetName, {
                datasetName: datasetName,
                record: editRecord
        }))
});

router.post("/edit/movies", (req, res) => {
    dataStore.editRecord('movies', req.body._id, {
        'Title': req.body.Title,
        'Genre': req.body.Genre,
        'Description': req.body.Description,
        'Director': req.body.Director,
        'Actors': req.body.Actors,
        'Year': req.body.Year,
        'Runtime (Minutes)': req.body.Runtime,
        'Rating': req.body.Rating,
        'Votes': req.body.Votes,
        'Revenue (Millions)': req.body.Revenue,
        'Metascore': req.body.Metascore,
    })
        .then(res.redirect("/display/movies"));
});

router.post("/edit/caregivers", (req, res) => {
    dataStore.editRecord('caregivers', req.body._id, {
        'Name': req.body.Name,
        'Occupation': req.body.Occupation,
        'Services': req.body.Services,
        'Age': req.body.Age,
        'Availability': req.body.Availability,
        'Location': req.body.Location,
        'Rating': req.body.Rating
    })
        .then(res.redirect("/display/caregivers")); 
});

router.post("/delete/:datasetName/:key", (req, res) => {
    const key = req.params.key;
    const datasetName = req.params.datasetName;
    dataStore.deleteRecord(datasetName, key)
        .then(res.redirect("/display/" + datasetName));
});

module.exports = router;