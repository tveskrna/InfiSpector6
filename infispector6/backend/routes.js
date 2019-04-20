'use strict';
var app = require('./server');
const druidApi = require('./druidApi');

function configureRoutes() {
  app.get("/getMinimumMessageTime", (req, res) => {
    druidApi.getMinimumMessageTime(req, res);
  });

  app.get("/getMaximumMessageTime", (req, res) => {
    druidApi.getMaximumMessageTime(req, res);
  });

  app.get('/getNodes', (req, res) => {
    druidApi.getNodes(req, res);
  });

  app.post("/getMessagesCount", (req, res) => {
    druidApi.getMessagesCount(req, res);
  });

  app.post("/getMsgCnt", (req, res) => {
    druidApi.getMsgCnt(req, res);
  });

  app.post("/getMessagesInfo", (req, res) => {
    druidApi.getMessagesInfo(req, res);
  });

  app.post("/customDruidQuery", (req, res) => {
    druidApi.customDruidQuery(req, res);
  });
}

module.exports = configureRoutes;
