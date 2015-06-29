'use strict';

var restify = require('restify');
var joi = require('joi');
var validator = require('../index');
var server = restify.createServer();

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser({ mapParams: false }));
server.use(validator());

server.post({
  path: '/article/:id',
  validations: {
    params: {
      id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
    },
    body: {
      param1: joi.string().required(),
      param2: joi.string().email(),
      param3: joi.string().uri()
    }
  }
}, function (req, res) {
  console.log(req.params, req.body);
  res.send(201);
});

server.get({
  path: '/article/:id',
  validations: {
    params: {
      id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
    },
    query: {
      param1: joi.string().required()
    }
  }
}, function (req, res) {
  console.log(req.params, req.query);
  res.send(200);
});

server.listen(3000);
