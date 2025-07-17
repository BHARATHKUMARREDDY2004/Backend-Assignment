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
  },

  recoverUser : function(req, res){
    var userEmail = req.body.email;
    if(!userEmail){
      return responses.error(res, "Invalid email Id", 400);
    }

    User.recoverUser(userEmail)
      .then(function(){
        responses.success(res, {message : "User recovered successfully"})
      })
      .catch(function(err) {
        responses.error(res, err.message, err.name === 'NotFoundError' ? 404 : 500);
      });
  },

  creditAmount : function(req, res){
    var creditingAmount = req.body.amount;
    var userId = req.params.id 

    creditingAmount = parseFloat(creditingAmount);
    userId = parseInt(userId);

    if(isNaN(creditingAmount) || isNaN(userId)){
      return responses.error(res, "Invalid or Missing amount or userId", 400);
    }

    if(creditingAmount && userId){
      User.creditAmount(creditingAmount, userId)
        .then(function(balance){
          responses.success(res, { message: "Amount credited Successfully", balance: balance });
        })
        .catch(function(err){
          if(err.message === "UserNotFound") {
            responses.error(res, "User not found", 404);
          } else {
            responses.error(res, "Error crediting amount: " + err.message, 500);
          }
        })
    }else{
      return responses.error(res, "Missing amount or userId", 400);
    }
  },

  debitAmount : function(req, res){
    var debitingAmount = req.body.amount;
    var userId = req.params.id 

    debitingAmount = parseFloat(debitingAmount);
    userId = parseInt(userId);

    if(isNaN(debitingAmount) || isNaN(userId)){
      return responses.error(res, "Invalid or Missing amount or userId", 400);
    }

    if(debitingAmount && userId){
      User.debitAmount(debitingAmount, userId)
        .then(function(balance){
          responses.success(res, { message: "Amount debited Successfully", balance: balance });
        })
        .catch(function(err){
          if(err.message === "UserNotFound") {
            responses.error(res, "User not found", 404);
          } else if(err.message === "InsufficientFunds") {
            responses.error(res, "Insufficient funds", 400);
          } else {
            responses.error(res, "Error debiting amount: " + err.message, 500);
          }
        })
    }else{
      return responses.error(res, "Missing amount or userId", 400);
    }
  }
};