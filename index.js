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

    next();
  };
};
