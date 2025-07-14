'use strict';
var Promise = require('bluebird');
var db = require('../config/database');
var logger = require('../utils/logger');

function User() {

    var createUser = function (userData) {
        return db.queryAsync(
            'INSERT INTO users SET ?',
            [userData]
        )
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
        return db.queryAsync('SELECT * FROM users')
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
        return db.queryAsync('SELECT * FROM users WHERE id = ?', [userId])
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
        return db.queryAsync('UPDATE users SET ? WHERE id = ?', [userData, userId])
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
        return db.queryAsync('DELETE FROM users WHERE id = ?', [userId])
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

    return {
        createUser: createUser,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        updateUser: updateUser,
        deleteUser: deleteUser
    };

}

module.exports = User();