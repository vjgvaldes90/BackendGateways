'use strict'

var mongoose=require('mongoose');
var app=require('./app');
var port=3900;


mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/GatewaysDB',{UseNewUrlParser:true})
    .then(()=>{
        console.log("Good Conection ");
       //Create server to listen to http requests
        app.listen(port,()=>{
            console.log("server running perfect ");
        });
    });