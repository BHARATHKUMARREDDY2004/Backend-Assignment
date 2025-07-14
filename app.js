'use strict';
var http = require('http');
var logger = require('./utils/logger');
var usersRoutes = require('./routes/usersRoutes');
var errorHandler = require('./middlewares/errorHandler');

var server = http.createServer(function(req, res) {
  logger.info(req.method + ' ' + req.url);

  res.on('error', function(err) {
    errorHandler(err, req, res, function() {});
  });
  
  if (req.url.startsWith('/users')) {
    usersRoutes(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

var port = 3000;
server.listen(port, function() {
  logger.info('Server listening on port ' + port);
});
