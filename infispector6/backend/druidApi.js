const toArray = require("stream-to-array");

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/resources/server.properties');

const druidDatasource = properties.get('druid.datasource');
const druidHost = properties.get('druid.host');
const druid_debug_enabled = properties.get('debug');

const druidRequesterFactory = require('plywood-druid-requester').druidRequesterFactory;
const druidRequester = druidRequesterFactory({
  host: druidHost
});

/*
* Druid requests
*/

exports.getNodes = function (request, response) {
  let druidQueryJson = createGeneralTopNDruidQuery("dest", "length");

  setAggregationsToDruidQueryBase(druidQueryJson, "count", "length", "length");
  setIntervalsToDruidQueryBase(druidQueryJson);
  druidQueryJson = finishQuery(druidQueryJson);

  myDruidRequester(druidQueryJson).then((result) => {
    let res = JSON.stringify(result);
    let reg = /(?:\"dest\")\s*:\s*\".*?\"/g;
    let nodeField = res.match(reg);

    for (let i = 0; i < nodeField.length; i++) {
      nodeField[i] = nodeField[i].replace('"dest":"', "").replace('\"', "");
    }
    debug("Result of getNodes function (druidApi): " + nodeField);
    response.status(200).send({error: 0, jsonResponseAsString: JSON.stringify(nodeField)});
  });

};

exports.getMessagesCount = function (request, response) {
  debug('getMessagesCount function from druidApi.js was called.');
  let srcNode = request.body.srcNode;
  srcNode = JSON.parse(srcNode);

  let destNode = request.body.destNode;
  destNode = JSON.parse(destNode);

  let searchMessageText = request.body.searchMessageText;
  let groupSrc = request.body.groupSrc;
  let groupDest = request.body.groupDest;

  if (srcNode === "null") {
    groupSrc = JSON.stringify("null");
    srcNode = JSON.parse(srcNode);
  }

  if (destNode === "null") {
    groupDest = JSON.stringify("null");
    destNode = JSON.parse(destNode);
  }

  getMessagesCountIntern(srcNode, destNode, searchMessageText, "", "", groupSrc, groupDest).then(function (result) {
    response.status(200).send({error: 0, result: JSON.stringify(result), searchMessageText: JSON.stringify(searchMessageText)});
  });
};

function getMessagesCountIntern (srcNode, destNode, searchMessageText, fromTime, toTime, group1, group2) {
  return new Promise(function (resolve, reject) {

    let druidQueryJson = createGeneralTopNDruidQuery("src", "length");
    setFilterToDruidQueryBase(druidQueryJson, "and", srcNode, destNode, searchMessageText);
    setAggregationsToDruidQueryBase(druidQueryJson, "count", "length", "length");
    setIntervalsToDruidQueryBase(druidQueryJson, fromTime, toTime);
    druidQueryJson = finishQuery(druidQueryJson);

    myDruidRequester(druidQueryJson).then(function (result) {
      let res = JSON.stringify(result);
      let reg = /(?:"length":)[0-9]+/g;
      srcNode = JSON.parse(group1);
      destNode = JSON.parse(group2);
      let messagesCount = res.match(reg);
      if (messagesCount === null) {
        // resolve with 0 messages count for now
        // TODO -- look here at proper handling
        resolve([srcNode, destNode, 0]);
      } else {
        messagesCount = messagesCount[0].replace('"length":', "");
        if (searchMessageText === "CacheTopologyControlCommand") {
          console.log("in getMessagesCountIntern extracted messagesCount from: "
            + res + " = " + messagesCount);
        }
        resolve([srcNode, destNode, messagesCount]);
      }
    }).done();
  });
}

exports.getMsgCnt = function(request, response) {
  debug('getMsgCnt function from druidApi.js was called.');

  let druidQueryJson = createTimeseriesDruidQuery("src");
  setAggregationsToDruidQueryBase(druidQueryJson, "count", "timestamp", "messagesCount");
  setIntervalsToDruidQueryBase(druidQueryJson, request.body.fromTime, request.body.toTime);
  druidQueryJson = finishQuery(druidQueryJson);

  myDruidRequester(druidQueryJson).then(function (result) {
    let messagesCount = result[0].result.messagesCount;
    debug(messagesCount);
    response.status(200).send({error: 0, jsonResponseAsString: JSON.stringify(messagesCount)});
  }).done();
};

exports.getMessagesInfo = function (request, response) {

  debug('getMessagesInfo function from druidApi.js was called.' + request.body.nodeName);

  let srcNode = request.body.srcNode;
  let destNode = request.body.destNode;
  let searchMessageText = request.body.filter;

  let druidQueryJson = createGeneralTopNDruidQuery("message", "length");
  setFilterToDruidQueryBase(druidQueryJson, "and", srcNode, destNode, searchMessageText);
  setAggregationsToDruidQueryBase(druidQueryJson, "count", "length", "length");
  setIntervalsToDruidQueryBase(druidQueryJson);
  druidQueryJson = finishQuery(druidQueryJson);

  myDruidRequester(druidQueryJson).then(function (result) {
    debug("Message info: " + JSON.stringify(result));
    response.status(200).send({error: 0, jsonResponseAsString: JSON.stringify(result)});
  }).done();
};

exports.getMinimumMessageTime = function (request, response) {

  debug('getMinimumMessageTime function in druidApi.js was called. ');

  let druidQueryJson = createTimeseriesDruidQuery(null, true);
  setAggregationsToDruidQueryBase(druidQueryJson, "doubleMin", "timestamp", "__time");
  setIntervalsToDruidQueryBase(druidQueryJson); //"2009-10-01T00:00/2020-01-01T00"
  druidQueryJson = finishQuery(druidQueryJson);

  myDruidRequester(druidQueryJson).then(function (result) {
    debug("Result: Minimum " + JSON.stringify(result));
    response.status(200).send({error: 0, jsonResponseAsString: JSON.stringify(result)});
  }).done();
};

exports.getMaximumMessageTime = function (request, response) {

  debug('getMaximumMessageTime function in druidApi.js was called. ');

  let druidQueryJson = createTimeseriesDruidQuery(null, true);
  setAggregationsToDruidQueryBase(druidQueryJson, "doubleMax", "timestamp", "__time");
  setIntervalsToDruidQueryBase(druidQueryJson); //"2009-10-01T00:00/2020-01-01T00"
  druidQueryJson = finishQuery(druidQueryJson);

  myDruidRequester(druidQueryJson).then(function (result) {
    debug("Result: Maximum " + JSON.stringify(result));
    response.status(200).send({error: 0, jsonResponseAsString: JSON.stringify(result)});
  }).done();
};

/*
* Auxiliary functions
*/

function debug (msg) {
  if (druid_debug_enabled) {
    console.log(msg);
  }
}

function myDruidRequester(druidQueryJson) {
  return toArray(druidRequester(druidQueryJson));
}

function createGeneralTopNDruidQuery(dimension, metric) {
  let queryJson = {};
  queryJson.queryType = "topN";
  queryJson.dataSource = druidDatasource;
  queryJson.granularity = "all";
  queryJson.dimension = dimension;
  queryJson.metric = metric;
  queryJson.threshold = "100000"; // TODO: check -- is this enough?

  return queryJson;
}

function createTimeseriesDruidQuery(dimension, descending) {
  let queryJson = {};
  queryJson.queryType = "timeseries";
  queryJson.dataSource = druidDatasource;
  queryJson.granularity = "all";

  if (dimension) {
    queryJson.dimension = dimension;
  }

  if (descending) {
    queryJson.descending = descending;
  }

  return queryJson;
}

function setFilterToDruidQueryBase (queryJson, filterOperand, srcNode, destNode, searchMessageText) {

  let filter = {};
  filter.type = filterOperand;
  filter.fields = [];

  if (srcNode) {
    filter.fields.push({
      "type": "selector",
      "dimension": "src",
      "value": srcNode
    });
  }

  if (destNode) {
    filter.fields.push({
      "type": "selector",
      "dimension": "dest",
      "value": destNode});
  }

  if (searchMessageText) {
    filter.fields.push({
      "type": "search",
      "dimension": "message",
      "query": {
        "type": "insensitive_contains",
        "value": searchMessageText
      }});
  }

  queryJson.filter = filter;
}

function setAggregationsToDruidQueryBase(queryJson, type, fieldName, name) {
  queryJson.aggregations = [];
  queryJson.aggregations.push({"type": type, "fieldName": fieldName, "name": name});
}

function setIntervalsToDruidQueryBase (queryJson, fromTime, toTime) {
  if (fromTime && toTime) {
    queryJson.intervals = [fromTime + "/" + toTime];
  } else {
    debug("In setIntervalsToDruidQueryBase: fromTime or toTime not specified, using default 50 years (2000-2050).");
    queryJson.intervals = ["2000-10-01T00:00/2050-01-01T00"];
  }
}

function finishQuery(queryJson) {
  let druidQuery = {};
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
    '}'
*/
