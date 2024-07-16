'use strict'

var validator = require('validator');
var device = require('../models/mdevice');

var controller = {

    //Method to insert device
    save: (req, res) => {
        // collect the parameters by post
        var params = req.body;
        //validate the data using (validator)
        try {
            var validator_uid = !validator.isEmpty(params.uid);
            var validator_vendor = !validator.isEmpty(params.vendor);
            var validator_date = !validator.isEmpty(params.date_created);
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: "Missing data to send "

            });
        }
        if (validator_date && validator_uid && validator_vendor) {
            device.find({ uid: params.uid }).exec((err, resuldevice) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "....error..... "
                    });
                }
                if (resuldevice.length == 0) {
                   //create the object to save
                    var dev = new device();
                    //assign values
                    dev.uid = params.uid;
                    dev.vendor = params.vendor;
                    dev.date_created = params.date_created;
                    dev.online = false;
                    //save the object
                    dev.save((err, devStored) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'The device has not been saved !!!'
                            });
                        }
                        return res.status(200).send({
                            status: 'success',
                            Device: devStored
                        });
                    });
                }else{
                    return res.status(500).send({
                        status: 'error',
                        message: 'The device is already saved !!!'
                    });
                }

            })

        } else {
            return res.status(400).send({
                status: 'error',
                message: "there is blank data "
            });
        }

    },
    //Method to display all devices
    getDevice: (req, res) => {
        device.find({}).exec((err, listdevice) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "error ...... "
                });
            }
            if (!listdevice) {
                return res.status(500).send({
                    status: 'error',
                    message: "there are no devices to show "
                });
            }
            return res.status(200).send({
                status: 'success',
                listdevice
            });


        });
    },
    //Method to remove device
    deleteDevice: (req, res) => {
        var idDevice = req.params.id;
        device.findOneAndDelete({ uid: idDevice }, (err, deviceDelete) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "the device is not found"
                });
            }
            return res.status(200).send({
                status: 'success',
                deviceDelete
            });

        })
    }
};
module.exports = controller;