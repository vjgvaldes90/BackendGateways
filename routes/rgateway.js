'use strict'

var express=require('express');
var GatewayController=require('../controllers/cgateway');
var DeviceController=require('../controllers/cdevice');

var router=express.Router();
//Gateways routers
router.post('/save',GatewayController.save);
router.get('/show_gateways',GatewayController.getGateways);
router.get('/get_gateway/:serial_number',GatewayController.getGateway);
router.put('/insertDevice/:id',GatewayController.insertDevice);
router.delete('/deleteDevice/:id',GatewayController.deleteDevice);
//Device routers
router.post('/save_device',DeviceController.save);
router.get('/show_device',DeviceController.getDevice);
router.delete('/delete_device/:id',DeviceController.deleteDevice);

module.exports=router;