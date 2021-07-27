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

app.get('/api/inventory/:hospital_id/:date', db.getInventoryByHospitalId);

app.get('/api/hospitals', db.getAllHospitals);

app.get('/api/suppliers', db.getAllSuppliers);

app.get('/api/suppliers/:itemID', db.getSuppliersByItemId);