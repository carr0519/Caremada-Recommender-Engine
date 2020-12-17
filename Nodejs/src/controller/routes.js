const router = require('express').Router();
const net = require('net');
const dataStore = require('../persistence/DataStore');
 
var ip = require("ip");
console.dir ( ip.address() );


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

    const client = new net.Socket();
    client.connect(5050, '127.0.0.1', () => {
        client.write(JSON.stringify({
            "algorithm_t": "content",
            "tableName": datasetName,
            "pkey_column_name": "_id",
            "pkey_val": key
        }));
    });

    client.on('data', data => {
        recommendations = JSON.parse(data.toString())
        client.destroy();
    });

    client.on('close', () => {
        console.log(recommendations[0]);
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


router.get("/test/:datasetName/:key", async (req, res) => {
    const key = req.params.key;
    const datasetName = req.params.datasetName;
    let recommendations = [];

    const client = new net.Socket();
    client.connect(5050, '127.0.0.1', () => {
        client.write(JSON.stringify({
            "algorithm_t": "content",
            "tableName": datasetName,
            "pkey_column_name": "_id",
            "pkey_val": key
        }));
    });

    client.on('data', function (data) {
        recommendations = JSON.parse(data.toString());
        client.destroy(); // kill client after server's response
    });

    client.on('close', function () {
        res.send(recommendations);
    });
});

module.exports = router;