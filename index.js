require('dotenv').config();

// Imports dependencies and set up http server
const
  express = require('express'),
  body_parser = require('body-parser'),
  app = express(),
  cors = require('cors'),
  db = require('./query/queries');

//app.use(express.static('public'));
app.use(cors());

app.listen(process.env.PORT || 1500, "192.168.1.172", () => console.log('server is listening'));

app.get('/api/inventory/:hospital_id/:date', db.getInventoryByHospitalId);

app.get('/api/hospitals', db.getAllHospitals);