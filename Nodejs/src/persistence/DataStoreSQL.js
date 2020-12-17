const mysql = require("mysql");
const csvtojson = require("csvtojson");


const con = mysql.createConnection({
    host: "localhost",
    user: "alex",
    password: process.env.DB_PASSWORD,
    database: "caremada"
});

con.connect(function (err) {
    if (err) {
        console.log('Connection failed!', 'Error: ', err);
    } else {
        console.log('Connected successfully to mySQL');
    }
});


function getDataSet() {
    let headers = [];
    return new Promise(resolve => {
            con.query("SELECT * FROM caregiver", function (err, result, fields) {
            if (err) throw err;
            fields.forEach(e => headers.push(e.name));
            resolve({ headers, result });
        })
    });
}

// async function reloadDataset(datasetName) {
//     const model = getModel(datasetName);
//     await model.deleteMany().exec();
//     await csvtojson()
//         .fromFile(__dirname + getCsvName(datasetName))
//         .then(csvData => model.create(csvData));
// }

async function getRecord(id) {
    let headers = [];
    return new Promise(resolve => {
        con.query("SELECT * FROM caregiver WHERE id=" + id, function (err, record, fields) {
            if (err) throw err;
            fields.forEach(e => headers.push(e.name));
            resolve({ headers, record: record[0] });
        })
    });
}

// async function insertRecord(datasetName, record) {
//     await getModel(datasetName).create(record);
// }

// async function editRecord(datasetName, id, record) {
//     await getModel(datasetName).updateOne({ _id: id }, { $set: record }).exec();
// }

// async function deleteRecord(datasetName, id) {
//     await getModel(datasetName).findByIdAndDelete(id).exec();
// }


module.exports = {
    getDataSet,
    // reloadDataset,
    getRecord,
    // insertRecord,
    // editRecord,
    // deleteRecord
}