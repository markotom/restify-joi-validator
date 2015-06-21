'use strict';

var joi = require('joi');

module.exports = function () {
  return function (req, res, next) {
    if (req.route.validations) {
      if (req.route.validations.params) {
        joi.validate(req.params || {}, req.route.validations.params, function (err, params) {
          if (err) {
            return res.send(400, { status: err.name, errors: err.details });
          }

          req.params = params;
          next();
        });

        return;
      }

      if (req.route.validations.body) {
        joi.validate(req.body || {}, req.route.validations.body, function (err, body) {
          if (err) {
            return res.send(400, { status: err.name, errors: err.details });
          }

          req.body = body;
          next();
        });

        return;
      }

      if (req.route.validations && req.route.validations.query) {
        joi.validate(req.query || {}, req.route.validations.query, function (err, query) {
          if (err) {
            return res.send(400, { status: err.name, errors: err.details });
          }

          req.query = query;
          next();
        });

        return;
      }
    }

    next();
  };
};
