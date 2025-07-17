'use strict';
var url = require('url');
var usersController = require('../controllers/userController');
var validator = require('../middlewares/validator');
var logger = require('../utils/logger');

module.exports = function (req, res) {
  var parsedUrl = url.parse(req.url);
  var path = parsedUrl.pathname;
  var method = req.method.toUpperCase();

  if (method === 'POST' || method === 'PUT') {
    var body = '';
    req.on('data', function (chunk) {
      body += chunk.toString();
    });

    req.on('end', function () {
      try {
        req.body = JSON.parse(body);
        routeRequest();
      } catch (e) {
        logger.error('Error while parsing JSON: ' + e.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    routeRequest();
  }

  function routeRequest() {

    if (path.startsWith('/users/credit') && method == 'PUT') {
      var segments = path.split('/');
      var userId = segments[3];
      userId = parseInt(userId);
      if (userId) {
        req.params = { id: userId };
        usersController.creditAmount(req, res);
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid user request for crediting amount' }));
      }
    } else if (path.startsWith('/users/debit') && method == 'PUT') {
      var segments = path.split('/');
      var userId = segments[3];
      userId = parseInt(userId);
      if (userId) {
        req.params = { id: userId };
        usersController.debitAmount(req, res);
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid user request for debiting amount' }));
      }

    } else if (path === '/users/recover' && method == 'PUT') {
      usersController.recoverUser(req, res);
    } else if (path === '/users' && method === 'GET') {
      usersController.getUsers(req, res);
    } else if (path === '/users' && method === 'POST') {
      validator.validateUser(req, res, function () {
        usersController.createUser(req, res);
      });
    } else if (path.startsWith('/users/') && method === 'GET') {
      var segments = path.split('/');
      var userId = segments[2];
      userId = parseInt(userId);
      console.log(userId)
      if (userId) {
        req.params = { id: userId };
        usersController.getUser(req, res);
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid user ID format' }));
      }
    } else if (path.startsWith('/users/') && method === 'PUT') {
      var segments = path.split('/');
      var userId = segments[2];
      userId = parseInt(userId);
      if (userId) {
        req.params = { id: userId };
        validator.validateUser(req, res, function () {
          usersController.updateUser(req, res);
        });
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid user ID format' }));
      }
    } else if (path.startsWith('/users/') && method === 'DELETE') {
      var segments = path.split('/');
      var userId = segments[2];
      userId = parseInt(userId);

      if (userId) {
        req.params = { id: userId };
        usersController.deleteUser(req, res);
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid user ID format' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  }
};