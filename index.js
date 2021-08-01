const { hasUncaughtExceptionCaptureCallback } = require('process');

require('dotenv').config();

// Imports dependencies and set up http server
const
  express = require('express'),
  body_parser = require('body-parser'),
  http = require('http'),
  cors = require('cors'),
  db = require('./query/queries');

//app.use(express.static('public'));
var app = express();

app.use(cors());

app.listen(process.env.PORT || 3000, process.env.IP_ADDR || "192.168.1.172", () => console.log('server is listening'));

app.get('/api/hospitals/:hospital_id', db.getHospital);

app.get('/api/hospitals', db.getAllHospitals);



app.get('/api/suppliers', db.getAllSuppliers);

app.get('/api/shipments/past/:hospital_id', db.getPastShipments);

app.get('/api/shipments/upcoming/:hospital_id', db.getUpcomingShipments);

app.get('/api/patients/non_icu/:hospital_id', db.getCurrentNonICUOccupancyNumber);

app.get('/api/patients/icu/:hospital_id', db.getCurrentICUOccupancyNumber)

app.get('/api/suppliers/by_product/:itemID', db.getSuppliersByItemIdTest);

app.get('/api/suppliers/by_category/:CategoryId', db.getSuppliersByCategoryId);

app.get('/api/suppliers/delivery/:hospital_id/:category_id', db.getSuppliersByAvgDeliveryTime);

app.get('/api/inventory/by_product/:hospital_id/:date', db.getProductInventoryByHospitalIdTest);

app.get('/api/inventory/by_category/:hospital_id/:date', db.getCategoryInventoryByHospitalIdTest);

app.get('/api/inventory/burn/:hospital_id', db.getDaysLeftByHospitalId);

app.get('/api/chart/:hospital_id/:days', db.getChartData)