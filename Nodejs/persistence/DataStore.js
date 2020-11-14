const mongoose = require("mongoose");
const csvtojson = require("csvtojson");

// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log('connected to DB'));
mongoose.connect("mongodb://localhost:27017/caremadaDB", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("Connected to MongoDB server."));

const Movie = require('../models/Movie.js').model;
const movieHeaders = require('../models/Movie.js').headers;

const Caregiver = require('../models/Caregivers.js').model;
const caregiverHeaders = require('../models/Caregivers.js').headers;

module.exports = 
{
    reloadDataset: async function(datasetName)
    {
        switch (datasetName) {
            case 'caregivers':
                await Caregiver.deleteMany({});
                await csvtojson()
                    .fromFile(__dirname + "/Mock_Caremada.csv")
                    .then(csvData => {
                        Caregiver.create(csvData);
                    });
                break;
            
            case 'movies':
                await Movie.deleteMany({});
                await csvtojson()
                    .fromFile(__dirname + "/sample_movie_dataset.csv")
                    .then(csvData => {
                        Movie.create(csvData);
                    });
                break;

            default:
                console.log(`fatal error in func reloadDataSet: unrecognized table name \'${datasetName}\'`);
        }
    },

    insertRecord: async function(datasetName, record) 
    {
        switch (datasetName) {
            case 'caregivers':
                await Caregiver.create(record);
                break;
            
            case 'movies':
                await Movie.create(record);
                break;

            default:
                console.log(`fatal error in func getDataSet: unrecognized table name \'${datasetName}\'`);
        }
    },

    deleteRecord: async function(datasetName, id)
    {
        switch (datasetName) {
            case 'caregivers':
                await Caregiver.findByIdAndDelete(id);
                break;
            
            case 'movies':
                await Movie.findByIdAndDelete(id);
                break;

            default:
                console.log(`fatal error in func getDataSet: unrecognized table name \'${datasetName}\'`);
        }
    },

    editRecord: async function(datasetName, id, record) 
    {
        switch (datasetName) {
            case 'caregivers':
                await Caregiver.updateOne(
                    { _id: id},
                    {$set: record}
                );
                break;
            
            case 'movies':
                await Movie.updateOne(
                    { _id: id},
                    {$set: record}
                );
                break;

            default:
                console.log(`fatal error in func getDataSet: unrecognized table name \'${datasetName}\'`);
        }
    },

    getRecord: async function(datasetName, id) 
    {
        let result;
        switch (datasetName) {
            case 'caregivers':
                await Caregiver.findById(id, (err, record) => {
                    if (err) { console.log(err); }
                    else { result = record; }
                });
                break;
            
            case 'movies':
                await Movie.findById(id, (err, record) => {
                    if (err) { console.log(err); }
                    else { result = record; }
                })
                break;

            default:
                console.log(`fatal error in func getDataSet: unrecognized table name \'${datasetName}\'`);
        }
        return result;
    },

    getDataSet: async function(name) 
    {
        let dataset = {};
        
        switch (name) {
            case 'caregivers':
                await Caregiver.find({}, (err, caregiverDataset) => {
                    if (err) { console.log(err); }
                    else {
                        dataset.name = name;
                        dataset.headers = caregiverHeaders;
                        dataset.data = caregiverDataset;
                    }
                });
                break;
            
            case 'movies':
                await Movie.find({}, (err, movieDataset) => {
                    if (err) { console.log(err); }
                    else {
                        dataset.name = name;
                        dataset.headers = movieHeaders;
                        dataset.data = movieDataset;
                    }
                });
                break;

            default:
                console.log(`fatal error in func getDataSet: unrecognized table name \'${name}\'`);
        }
        return dataset;
    },
};


