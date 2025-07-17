'use strict';
var db = require('../config/database');
var logger = require('../utils/logger');

function DbController() {

    var quries = {
        select: "SELECT * FROM users WHERE ?? = ?",
        update: "UPDATE users SET ? WHERE ?? = ? AND ?? = ?",
        insert: "INSERT INTO users SET ?"
    }

    var queryAsync = function (query, params) {
        return db.queryAsync(query, params)
            .catch(function (err) {
                logger.error('Database query error: ' + err.message);
                throw err;
            });
    };

    var insert = function (data) {
        return queryAsync(quries.insert, [data]);
    };

    var findAll = function () {
        return queryAsync(quries.select, ["is_active", 1]);
    };

    var findById = function (id) {
        return queryAsync(quries.select + " AND ?? = ?", ["id", id, "is_active", 1]);
    };

    var update = function (id, data) {
        return queryAsync(quries.update, [data, "id", id, "is_active", 1]);
    };

    var remove = function (id) {
        return queryAsync(quries.update, [{ "is_active": 0 }, "id", id, "is_active", 1]);
    };

    var recover = function (email) {
        return queryAsync(quries.update, [{ "is_active": 1 }, "email", email, "is_active", 0]);
    }


    var credit = function (amount, id) {
        return db.getConnectionAsync()
            .then(function (connection) {
                return connection.beginTransactionAsync()
                    .then(function(){
                        return connection.queryAsync(quries.select + " AND ?? = ?", ["id", id, "is_active", 1])
                            .then(function (result) {
                                if (result.length === 0) {
                                    throw new Error("UserNotFound");
                                }

                                return connection.queryAsync(quries.update,
                                    [{"wallet" : result[0]["wallet"] + amount}, "id", id, "is_active", 1]);
                            })
                            .then(function (result) {
                                if (result.affectedRows === 0) {
                                    throw new Error("AmountNotCredited");
                                }

                                return connection.queryAsync("SELECT wallet FROM users WHERE ?? = ?", ["id", id]);
                            })
                            .then(function (result) {
                                if (result.length === 0) {
                                    throw new Error("UserNotFound");
                                }

                                return connection.commitAsync()
                                    .then(function () {
                                        connection.release();
                                        return result[0]["wallet"];
                                    });
                            })
                            .catch(function (err) {
                                return connection.rollbackAsync()
                                    .then(function() {
                                        connection.release();
                                        throw err;
                                    })
                                    .catch(function(rollbackErr){
                                        connection.release();
                                        throw new Error("RollbackFailed: " + rollbackErr.message);
                                    });
                            });
                    });
            })
            .catch(function (err) {
                console.error("Credit Error:", err.message);
                throw err;
            });
    };


    var debit = function (amount, id) {
        return db.getConnectionAsync()
            .then(function (connection) {
                return connection.beginTransactionAsync()
                    .then(function(){
                        return connection.queryAsync("SELECT * FROM users WHERE ?? = ? AND ?? = ?", ["id", id, "is_active", 1])
                            .then(function (result) {
                                if (result.length === 0) {
                                    throw new Error("UserNotFound");
                                }

                                var existingAmount = result[0]["wallet"];
                                if (existingAmount < amount) {
                                    throw new Error("InsufficientFunds");
                                }

                                return connection.queryAsync("UPDATE users SET wallet = ? WHERE ?? = ? AND ?? = ?",
                                    [existingAmount - amount, "id", id, "is_active", 1]);
                            })
                            .then(function (result) {
                                if (result.affectedRows === 0) {
                                    throw new Error("DebitFailed");
                                }

                                return connection.queryAsync("SELECT wallet FROM users WHERE ?? = ?", ["id", id]);
                            })
                            .then(function (result) {
                                if (result.length === 0) {
                                    throw new Error("UserNotFound");
                                }

                                return connection.commitAsync()
                                    .then(function () {
                                        connection.release();
                                        return result[0]["wallet"];
                                    });
                            })
                            .catch(function (err) {
                                return connection.rollbackAsync()
                                    .then(function() {
                                        connection.release();
                                        throw err;
                                    })
                                    .catch(function(rollbackErr) {
                                        connection.release();
                                        throw new Error("RollbackFailed: " + rollbackErr.message);
                                    });
                            });
                    });
            })
            .catch(function (err) {
                console.error("Debit Error:", err.message);
                throw err;
            });
    };


    return {
        queryAsync: queryAsync,
        insert: insert,
        findAll: findAll,
        findById: findById,
        update: update,
        remove: remove,
        recover: recover,
        credit: credit,
        debit: debit
    };
}

module.exports = DbController();
