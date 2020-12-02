// const chai = require('chai');
// //const request = require('chai').request;

// const chaiHttp = require('chai').chaiHttp;

// chai.use(chaiHttp);
// chai.should();

// const assert = require('chai').assert;
// const expect = require('chai').expect;
// const should = require('chai').should();
// //const { request } = require('express');

// const app = require('../controller/routes');
// const server = require('supertest');

// const func1 = require('../controller/routes').

// it('Main page', function(done){
//     request('http://localhost:3000',function(error, response, body){
//         expect(response).to.equal(200);
//         done();
//     });
// });

var expect = require('chai').expect;
var request = require('request');
const DataStore = require('../persistence/DataStore');

let caregiverDataset;
let moviesDataset;

function loadCareDataset(){
    return DataStore.getDataSet().then(dataset => caregiverDataset = dataset.data);
}

function loadMovDataset(){
    return DataStore.getDataSet().then(dataset => moviesDataset = dataset.data);
}



//This test works
it('Main page',function(done){
    request('http://localhost:3000', function(error,response,body){
        //expect(body).to.equal('');
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Display page for caregivers', function(done){
    request('http://localhost:3000/display/caregivers',function(error,response,body){
        expect(response.statusCode).to.equal(200);
        done();
    });
});


async function loadDataset() {
    await dataStore.getDataSet().then(dataset => covidDataset = dataset);
}


describe("Inserting, Deleting and Editing Records into a MongoDB database using HTTP requests", async () => {

    
    // it("sends a valid request for recommendations for a caregiver", async () => {

    //     const id = covidDataset[0]._id;
    //     options.path = `/test/caregivers/${id}`

    //     const req = http.request(options, res => {
    //         //res.on("data", chunk => recommendations = String(chunk));
    //         res.on("data", chunk => console.log(String(chunk)));
    //     });
    //     req.end();

    //     expect(typeof recommendations).to.equal(Array);
    //     expect(typeof recommendations[0]).to.equal(Object);
    //     expect(recommendations.length).to.equal(10);

    // });

   

    it("sends an invalid request for recommendations for a caregiver", async () => {

        
        const id = 'dqwdwca12r3q';
        options.path = `/test/caregivers/${id}`

        const req = http.request(options, res => {
            //res.on("data", chunk => recommendations = String(chunk));
            res.on("data", chunk => console.log(String(chunk)));
        });
        req.end();

        //expect(typeof recommendations).to.equal(null);
    });
});


// describe('GET /', () => {
//     //Test home page
//     it('should show homepage', () => {
//         chai.request(app).get('/').then((res)=>{
//             expect(res).to.have.status(200);
//         });
//     });
// });