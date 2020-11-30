require('dotenv').config()
const express = require("express");
const app = express();
app.use(express.static(__dirname +  '/public'));
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = require('./controller/routes.js');
app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


// =====================================================
//      Spawn Recommender Engine Web API
// =====================================================

const { spawn } = require("child_process");

const webAPI = spawn("python", ['../Python/web_API.py']);


var ip = require("ip");
console.dir ( ip.address() );

process.on('SIGINT', (options, exitCode) => {
    console.log('Exiting in Node');
    webAPI.kill('SIGINT');
});