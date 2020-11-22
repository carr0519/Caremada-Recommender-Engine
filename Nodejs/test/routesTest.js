const chai = require('chai');
//const request = require('chai').request;

const chaiHttp = require('chai').chaiHttp;

chai.use(chaiHttp);
chai.should();

const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();
//const { request } = require('express');

const app = require('../controller/routes');
const server = require('supertest');

// const func1 = require('../controller/routes').

// it('Main page', function(done){
//     request('http://localhost:3000',function(error, response, body){
//         expect(response).to.equal(200);
//         done();
//     });
// });

describe('GET /', () => {
    //Test home page
    it('should show homepage', (done) => {
        chai.request(app).get('/').then((res)=>{
            expect(res).to.have.status(200);
            done();
        });
    });
});