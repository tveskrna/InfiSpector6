const cors = require('cors');
const express = require('express');

var app = module.exports = express();

//enable cors headers in response
app.use(cors());

app.listen(8000, () => {
  console.log('Server started! \n');
});

//set up routes
require('./routes')();


