const mongoose = require("mongoose");
const csvtojson = require("csvtojson");

// const uri = "process.env.DB_CONNECTION";
// const uri = "mongodb://localhost:27017/caremadaDB";
const uri = "mongodb+srv://admin-alex:caremada6@cluster0.5inmr.mongodb.net/caremadaDB?retryWrites=true&w=majority"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to MongoDB server."));

const Movie = require('../models/Movie.js')
const Caregiver = require('../models/Caregivers.js')


function getModel(name) {
    switch (name) {
        case 'caregivers':
            return Caregiver.model;
        case 'movies':
            return Movie.model;
    }
}

function getHeaders(name) {
    switch (name) {
        case 'caregivers':
            return Caregiver.headers;
        case 'movies':
            return Movie.headers;
    }
}

function getCsvName(name) {
    switch (name) {
        case 'caregivers':
            return "/Mock_Caremada.csv";
        case 'movies':
            return "/sample_movie_dataset.csv";
    }
}

async function getDataSet(datasetName) {
    return {
        headers: getHeaders(datasetName),
        data: await getModel(datasetName).find({}).exec()
    }
}

async function reloadDataset(datasetName) {
    model = getModel(datasetName);
    await model.deleteMany({}).exec();
    await csvtojson()
        .fromFile(__dirname + getCsvName(datasetName))
        .then(csvData => model.create(csvData));
}

async function getRecord(datasetName, id) {
    return await getModel(datasetName).findById(id).exec();
}

async function insertRecord(datasetName, record) {
    await getModel(datasetName).create(record);
}

async function editRecord(datasetName, id, record) {
    await getModel(datasetName).updateOne({ _id: id }, { $set: record }).exec();
}

async function deleteRecord(datasetName, id) {
    await getModel(datasetName).findByIdAndDelete(id).exec();
}


module.exports = {
    getDataSet,
    reloadDataset,
    getRecord,
    insertRecord,
    editRecord,
    deleteRecord
}