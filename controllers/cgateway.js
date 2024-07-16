'use strict'

var validator = require('validator');
var gateway = require('../models/mgateway');
var device = require('../models/mdevice');

//function to validate ipv4
function isValidIP(str) {
    let verdad = str.split('.').map(n => +n).filter(n => {
        return (n >= 0 && n < 256 && Number)
    })
    return verdad.length == 4 ? true : false
}
//function to count devices
function cantDevice(array) {
    return (array.length < 10);
}

var controller = {

    //method to insert gateway
    save: (req, res) => {
        // get the parameters per post
        var params = req.body;
       //validate the data using (validator)
        try {
            var validator_serial = !validator.isEmpty(params.serial_number);
            var validator_name = !validator.isEmpty(params.name);
            var validator_addres = !validator.isEmpty(params.address);
        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: "Missing data to send "

            });
        }
        if (validator_name && validator_serial && validator_addres) {
            gateway.find({ serial_number: params.serial_number }).exec((err, resulgateway) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "gateways not found "
                    });
                }
                if (resulgateway.length == 0) {
                    if (isValidIP(params.address)) {
                        //create the object to save
                        var gate = new gateway();
                        //assign values
                        gate.serial_number = params.serial_number;
                        gate.name = params.name;
                        gate.address = params.address;
                        gate.peripheral_devices = [];
                       //save the object
                        gate.save((err, gateStored) => {
                            if (err) {
                                return res.status(400).send({
                                    status: 'error',
                                    message: 'The gateway has not been saved !!!'
                                });
                            }
                            return res.status(200).send({
                                status: 'success',
                                Gateway: gateStored
                            });

                        });

                    } else {
                        return res.status(400).send({
                            status: 'error',
                            message: "check the ip "
                        });
                    }
                } else {

                    return res.status(500).send({
                        status: 'error',
                        message: "this gateway is already inserted "
                    });

                }

            })

        } else {
            return res.status(400).send({
                status: 'error',
                message: "there is blank data"
            });
        }

    },


    //method to display all gateways
    getGateways: (req, res) => {
        gateway.find({}).exec((err, listgateway) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "error ... "
                });
            }
            if (!listgateway) {
                return res.status(500).send({
                    status: 'error',
                    message: "there are no gateways to show "
                });
            }
            return res.status(200).send({
                status: 'success',
                listgateway
            });


        });
    },
    //method to insert device in a gateway
    insertDevice: (req, res) => {
        var idGateway = req.params.id;
        var uidDevice = req.body.uidDevice;

        device.find({ uid: uidDevice }).exec((err, resuldevice) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "error ..... "
                });
            }
            if (resuldevice.length == 0) {
                return res.status(500).send({
                    status: 'error',
                    message: "the device was not found "
                });
            }

            gateway.find({ serial_number: idGateway }).exec((err, resulgateway) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "error ......... "
                    });
                }
                if (resulgateway.length == 0) {
                    return res.status(500).send({
                        status: 'error',
                        message: "the device was not found"
                    });
                }

                if (cantDevice(resulgateway[0].peripheral_devices) && (!resulgateway[0].peripheral_devices.includes(uidDevice))) {
                    resulgateway[0].peripheral_devices.push(uidDevice);
                    gateway.findOneAndUpdate({ serial_number: idGateway }, resulgateway[0], (err, gtwupd) => {
                        if (!err)
                            return res.status(200).send({
                                status: 'success',
                            });
                        else {
                            return res.status(500).send({
                                status: 'err',
                                message: err.error
                            });
                        }
                    });

                } else {
                    return res.status(500).send({
                        status: 'error',
                        message: "there is no capacity for more devices or this device is already connected "
                    });
                }
            })

        });

    },
    //method to remove device in a gateway
    deleteDevice: (req, res) => {
        var idGateway = req.params.id;
        var uidDevice = req.body.uidDevice;

        device.find({ uid: uidDevice }).exec((err, resuldevice) => {
            if (err) {
                return res.status(505).send({
                    status: 'error',
                    message: "error ....."
                });
            }
            if (resuldevice.length == 0) {
                return res.status(505).send({
                    status: 'error',
                    message: "the device was not found"
                });
            }
            gateway.find({ serial_number: idGateway }).exec((err, resulgateway) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "error ..... "
                    });
                }
                if (resulgateway.length == 0) {
                    return res.status(505).send({
                        status: 'error',
                        message: "gateways not found "
                    });
                }
                if ((resulgateway[0].peripheral_devices.includes(uidDevice))) {
                    resulgateway[0].peripheral_devices = resulgateway[0].peripheral_devices.filter((item) => item !== uidDevice);
                    gateway.findOneAndUpdate({ serial_number: idGateway }, resulgateway[0], (err, gtwupd) => {
                        if (!err)
                            return res.status(200).send({
                                status: 'success',
                            });
                        else {
                            return res.status(500).send({
                                status: 'err',
                                message: err.error
                            });
                        }
                    });

                } else {
                    return res.status(500).send({
                        status: 'error',
                        message: "there is no capacity for more devices or this device is already connected"
                    });
                }
            })

        });

    },
    //method to display a gateway
    getGateway:(req,res)=>{
        var seriealN_gate=req.params.serial_number;
        console.log(seriealN_gate);
        if (!seriealN_gate || seriealN_gate==null) {
            return res.status(500).send({
                status: 'error',
                message:  "enter the serial_number  "
            });
        }else{
            gateway.find({ serial_number: seriealN_gate }).exec((err, resulgateway) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "...error..... "
                    });
                }
                if (resulgateway.length == 0) {
                    return res.status(500).send({
                        status: 'error',
                        message: "no se encontro el gateways "
                    });
                }else{
                    return res.status(200).send({
                        status: 'success',
                        resulgateway
                    });
                }
            })
        }

    }

}
module.exports = controller;