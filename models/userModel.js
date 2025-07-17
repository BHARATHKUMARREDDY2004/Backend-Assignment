'use strict';
var Promise = require('bluebird');
var dbController = require('../controllers/dbController');
var logger = require('../utils/logger');

function User() {

    var createUser = function (userData) {
        return dbController.insert(userData)
            .then(function (result) {
                logger.info('New user Id : ' + result.insertId);
                return result.insertId;
            })
            .catch(function (err) {
                logger.error('Error while creating user : ' + err.message);
                throw err;
            });
    };

    var getAllUsers = function () {
        return dbController.findAll()
            .then(function (results) {
                logger.info('Number of users ' + results.length);
                return results;
            })
            .catch(function (err) {
                logger.error('Error while fetching users: ' + err.message);
                throw err;
            });
    };

    var getUserById = function (userId) {
        return dbController.findById(userId)
            .then(function (results) {
                if (results.length === 0) {
                    var notFoundError = new Error('User not found');
                    notFoundError.name = 'NotFoundError';
                    throw notFoundError;
                }
                logger.info('Found user with Id : ' + userId);
                return results[0];
            })
            .catch(function (err) {
                logger.error('Error while finding user : ' + err.message);
                throw err;
            });
    };

    var updateUser = function (userId, userData) {
        return dbController.update(userId, userData)
            .then(function (result) {
                if (result.affectedRows === 0) {
                    var notFoundError = new Error('User not found');
                    notFoundError.name = 'NotFoundError';
                    throw notFoundError;
                }
                logger.info('Updated user with ID: ' + userId);
                return result.affectedRows;
            })
            .catch(function (err) {
                logger.error('Error while updating user: ' + err.message);
                throw err;
            });
    };

    var deleteUser = function (userId) {
        return dbController.remove(userId)
            .then(function (result) {
                if (result.affectedRows === 0) {
                    var notFoundError = new Error('User not found');
                    notFoundError.name = 'NotFoundError';
                    throw notFoundError;
                }
                logger.info('Deleted user with ID: ' + userId);
                return result.affectedRows;
            })
            .catch(function (err) {
                logger.error('Error while deleting user: ' + err.message);
                throw err;
            });
    };

    var recoverUser = function (userEmail) {
        return dbController.recover(userEmail)
            .then(function (result) {
                if (result.affectedRows === 0) {
                    var notFoundError = new Error('User not found');
                    notFoundError.name = 'NotFoundError';
                    throw notFoundError;
                }
                logger.info('Recovered user with ID: ' + userEmail);
                return result.affectedRows;
            })
            .catch(function (err) {
                logger.error('Error while recovering user: ' + err.message);
                throw err;
            });
    }

    var creditAmount = function(amount, userId){
        return dbController.credit(amount, userId)
            .then(function(result){
                logger.info("Credit successful for user " + userId + ", new balance: " + result);
                return result;
            })
            .catch(function(err){
                logger.error("Error crediting money: " + err.message);
                throw err;
            });
    }

    var debitAmount = function(amount, userId){
        return dbController.debit(amount, userId)
            .then(function(result){
                logger.info("Debit successful for user " + userId + ", new balance: " + result);
                return result;
            })
            .catch(function(err){
                logger.error("Error debiting money: " + err.message);
                throw err;
            });
    }

    return {
        createUser: createUser,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        recoverUser: recoverUser,
        creditAmount: creditAmount,
        debitAmount: debitAmount
    };

}

module.exports = User();