'use strict';

var joi = require('joi');

module.exports = function () {
  return function (req, res, next) {
    if (req.route.validations) {
      var validation;

      // Validate req.params
      if (req.route.validations.params) {
        validation = joi.validate(req.params || {}, req.route.validations.params);

        if (validation.error) {
          return res.send(400, { status: validation.error.name, errors: validation.error.details });
        }

        // Set defaults
        req.params = validation.value;
      }

      // Validate req.body
      if (req.route.validations.body) {
        validation = joi.validate(req.body || {}, req.route.validations.body);

        if (validation.error) {
          return res.send(400, { status: validation.error.name, errors: validation.error.details });
        }

        // Set defaults
        req.body = validation.value;
      }

      // Validate req.query
      if (req.route.validations.query) {
        validation = joi.validate(req.query || {}, req.route.validations.query);

        if (validation.error) {
          return res.send(400, { status: validation.error.name, errors: validation.error.details });
        }

        // Set defaults
        req.query = validation.value;
      }
    }

    next();
  };
};
