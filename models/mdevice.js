'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var deviceSchema = schema({
    uid: { type: Number },
    vendor: { type: String },
    date_created: { type: String},
    online:false
});
module.exports=mongoose.model('Device',deviceSchema);