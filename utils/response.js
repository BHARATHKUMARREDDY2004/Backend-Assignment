'use strict';


module.exports = {
  success: function(res, data, statusCode) {
    statusCode = statusCode || 200;
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: data
    }));
  },
  
  error: function(res, message, statusCode) {
    statusCode = statusCode || 500;
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: message
    }));
  }
};