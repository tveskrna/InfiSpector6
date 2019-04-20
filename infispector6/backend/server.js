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

/**
 * Retrun server status
 */

app.get('/status', function (request, response) {
  let status = {
    host: "http://localhost:8000",
    cors: true,
    jsonParser: true,
    urlEncoded: true
  };
  response.status(200).send(status);
});

//set up rest of routes
require('./routes')();


