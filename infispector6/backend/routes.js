'use strict';
var app = require('./server');
const druidApi = require('./druidApi');

function configureRoutes() {
  app.post('/getNodes', (req, res) => {
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

  app.post("/getMinimumMessageTime", (req, res) => {
    druidApi.getMinimumMessageTime(req, res);
  });

  app.post("/getMaximumMessageTime", (req, res) => {
    druidApi.getMaximumMessageTime(req, res);
  });
}

module.exports = configureRoutes;
