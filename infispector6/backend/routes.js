'use strict';
var app = require('./server');
const druidApi = require('./druidApi')

function configureRoutes() {
  app.post('/getNodes', (req, res) => {
    druidApi.getNodes(req, res);
  });






  app.post('/druid/status', (req, res) => {

    var queryJson =
      '{' +
      '"query": {' +
      '"queryType": "topN",' +
      '"dataSource": "infispector-datasource",' +
      '"granularity": "all",' +
      '"dimension": "dest",' +
      '"metric": "count",' +
      '"threshold": 100000,' +
      '"aggregations": [{"type": "count", "name": "count"}],' +
      '"intervals": ["2009-10-01T00:00/2020-01-01T00"]' +
      '}' +
      '}';
    var response = res;
    toArray(druidRequester(JSON.parse(queryJson))).then((res) => {
      // console.log(res);
      response.send(res);
    });

  });
}


module.exports = configureRoutes;
