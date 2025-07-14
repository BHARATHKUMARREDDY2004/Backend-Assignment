'use strict';
var logger = require('../utils/logger');

module.exports = {
  validateUser: function(req, res, next) {
    var user = req.body;
    
    if (!user) {
      logger.warn('Empty request body');
      return res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Empty request body' }));
    }
    
    if (!user.name || typeof user.name !== 'string') {
      logger.warn('Invalid or missing name');
      return res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid or missing name' }));
    }
    
    if (!user.email || typeof user.email !== 'string' || !user.email.includes('@')) {
      logger.warn('Invalid or missing email');
      return res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid or missing email' }));
    }
    
    next();
  }
};