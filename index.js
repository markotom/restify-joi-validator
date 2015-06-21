'use strict';

var joi = require('joi');

module.exports = function () {
  return function (req, res, next) {
    if (req.route.validations && req.route.validations.params) {
      joi.validate(req.params || {}, req.route.validations.params, function (err, params) {
        if (err) {
          return res.send(400, { status: err.name, errors: err.details });
        }
      });
    }

    if (req.route.validations && req.route.validations.body) {
      joi.validate(req.body || {}, req.route.validations.body, function (err, params) {
        if (err) {
          return res.send(400, { status: err.name, errors: err.details });
        }
      });
    }

    next();
  };
};
