'use strict';
var Promise = require('bluebird');
var User = require('../models/userModel');
var responses = require('../utils/response');
var logger = require('../utils/logger');

module.exports = {
  createUser: function(req, res) {
    var userData = req.body;
    
    User.createUser(userData)
      .then(function(userId) {
        return User.getUserById(userId);
      })
      .then(function(user) {
        responses.success(res, user, 201);
      })
      .catch(function(err) {
        responses.error(res, err.message, err.name === 'NotFoundError' ? 404 : 500);
      });
  },
  
  getUsers: function(req, res) {
    User.getAllUsers()
      .then(function(users) {
        responses.success(res, users);
      })
      .catch(function(err) {
        responses.error(res, 'Failed to retrieve users', 500);
      });
  },
  
  getUser: function(req, res) {
    var userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return responses.error(res, 'Invalid user ID', 400);
    }
    
    User.getUserById(userId)
      .then(function(user) {
        responses.success(res, user);
      })
      .catch(function(err) {
        responses.error(res, err.message, err.name === 'NotFoundError' ? 404 : 500);
      });
  },
  
  updateUser: function(req, res) {
    var userId = parseInt(req.params.id, 10);
    var userData = req.body;
    
    if (isNaN(userId)) {
      return responses.error(res, 'Invalid user ID', 400);
    }
    
    User.updateUser(userId, userData)
      .then(function() {
        return User.getUserById(userId);
      })
      .then(function(user) {
        responses.success(res, user);
      })
      .catch(function(err) {
        responses.error(res, err.message, err.name === 'NotFoundError' ? 404 : 500);
      });
  },
  
  deleteUser: function(req, res) {
    var userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return responses.error(res, 'Invalid user ID', 400);
    }
    
    User.deleteUser(userId)
      .then(function() {
        responses.success(res, { message: 'User deleted successfully' });
      })
      .catch(function(err) {
        responses.error(res, err.message, err.name === 'NotFoundError' ? 404 : 500);
      });
  }
};