'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var gatewaySchema = schema({
    serial_number: { type: String },
    name: { type: String },
    address: { type: String },
    peripheral_devices:{type:Array}
});
module.exports=mongoose.model('Gateway',gatewaySchema);