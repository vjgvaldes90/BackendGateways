'use strict'

//loading node modules to create server
var express = require('express');
var bodyParser = require('body-parser');

//run express(http)
var app = express();

//load the routes
var gateway_routes=require('./routes/rgateway');

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Add prefixes to routes
app.use('/api',gateway_routes);


//Export module (Current File)
module.exports = app;