const router = require('express').Router();
const net = require('net');
const dataStore = require('../persistence/DataStoreSQL');
 
var ip = require("ip");
console.dir ( ip.address() );


router.get("/", (req, res) => {
    res.render("home");
});

router.get("/display/:datasetName", (req, res) => {
    dataStore.getDataSet()
        .then(dataset => {
            res.render("display", {
                datasetName: "caregivers",
                headers: dataset.headers,
                dataset: dataset.result
            });
            //console.log(dataset.result);
        })
});

router.get("/reload/:datasetName", (req, res) => {
    dataStore.reloadDataset()
        .then(() => res.redirect("/display/" + datasetName));
});


router.get("/recommendation/:datasetName/:key", async (req, res) => {
    const key = req.params.key;
    const datasetName = req.params.datasetName;
    const { headers, record } = await dataStore.getRecord(key);
    let recommendations = [];

    const client = new net.Socket();
    client.connect(5050, '127.0.0.1', () => {
        client.write(JSON.stringify({
            "algorithm_t": "content",
            "tableName": datasetName,
            "pkey_column_name": headers[0],
            "pkey_val": key
        }));
    });

    client.on('data', data => {
        recommendations = JSON.parse(data.toString())
        client.destroy();
    });

    client.on('close', () => {
        res.render("recommendations", {
            record: record,
            datasetName: datasetName,
            headers: headers,
            dataset: recommendations
        });
    });
});

router.get("/insert/:datasetName", (req, res) => {
    const datasetName = req.params.datasetName;
    res.render("insert" + datasetName);
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
    dataStore.getRecord(key)
        .then(result => {
            res.render("editcaregivers", {
                datasetName: "caregivers",
                headers: result.headers,
                record: result.record
        })})
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