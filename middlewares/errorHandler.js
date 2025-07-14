'use strict';
var logger = require('../utils/logger');
var responses = require('../utils/response');

module.exports = function(err, req, res, next) {
  logger.error('Error: ' + err.message);
  
  if (err.name === 'ValidationError') {
    return responses.error(res, err.message, 400);
  }
  
  if (err.name === 'NotFoundError') {
    return responses.error(res, err.message, 404);
  }

  responses.error(res, 'Internal server error', 500);
};