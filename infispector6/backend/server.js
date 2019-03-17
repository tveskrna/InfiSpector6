const cors = require('cors');

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/resources/server.properties');

const express = require('express');
var app = module.exports = express();


//enable cors headers in response
app.use(cors());
//enable parsing json body from requests
app.use(express.json());
//enable parsing request url
app.use(express.urlencoded());

let port = properties.get('server.port');

app.listen(port, () => {
  console.log('Server started on port ' + port +'\n');
});

//set up routes
require('./routes')();


