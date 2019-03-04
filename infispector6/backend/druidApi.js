const toArray = require("stream-to-array");
const druidRequesterFactory = require('plywood-druid-requester').druidRequesterFactory;

var druidRequester = druidRequesterFactory({
  host: 'localhost:8082'
});


exports.getNodes = function (request, response) {
  var druidQueryJson = createGeneralTopNDruidQuery("dest", "length");

  setAggregationsToDruidQueryBase(druidQueryJson, "count", "length", "length");
  setIntervalsToDruidQueryBase(druidQueryJson);
  druidQueryJson = finishQuery(druidQueryJson);

  toArray(druidRequester(druidQueryJson)).then((res) => {
    response.send(res);
  });
};


function createGeneralTopNDruidQuery(dimension, metric) {
  var queryJson = {};
  queryJson.queryType = "topN";
  queryJson.dataSource = "infispector-datasource";
  queryJson.granularity = "all";
  queryJson.dimension = dimension;
  queryJson.metric = metric;
  queryJson.threshold = "100000"; // TODO: check -- is this enough?

  return queryJson;
}

function setAggregationsToDruidQueryBase(queryJson, type, fieldName, name) {
  queryJson.aggregations = [];
  queryJson.aggregations.push({"type": type, "fieldName": fieldName, "name": name});
}

function setIntervalsToDruidQueryBase (queryJson, fromTime, toTime) {
  if (fromTime && toTime) {
    queryJson.intervals = [fromTime + "/" + toTime];
  } else {
    // debug("In setIntervalsToDruidQueryBase: fromTime or toTime not specified, using default 50 years (2000-2050).")
    queryJson.intervals = ["2000-10-01T00:00/2050-01-01T00"];
  }
}

function finishQuery(queryJson) {
  var druidQuery = {};
  druidQuery.query = queryJson;
  return druidQuery;
}

/*
  Query example:

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
*/
