'use strict';
var logger = require('../utils/logger');
var responses = require('../utils/response')

module.exports = {
  validateUser: function(req, res, next) {
    var user = req.body;
    
    if (!user) {
      logger.warn('Empty request body');
      return responses.error(res, "Empty request body", 400)

    }
    
    if (!user.name || typeof user.name !== 'string') {
      logger.warn('Invalid or missing name');
      return responses.error(res, "Invalid or missing name", 400)

    }
    
    if (!user.email || typeof user.email !== 'string' || !user.email.includes('@')) {
      logger.warn('Invalid or missing email');
      return responses.error(res, "Invalid or missing email", 400)
    }
    
    next();
  }
};